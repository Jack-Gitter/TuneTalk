import * as dao from '../../dao/dao.js'

export const postController = (app) => {
    
    // creates a new post
    app.post('/api/create-post', createPost)

    // gets a post with a specific post id
    app.get('/api/get-post/:pid', getPost)
    
    // gets all of the posts
    app.get('/api/get-all-posts', getAllPosts)
    
    // updates a post with a specific post id
    app.put('/api/update-post/:pid', updatePost)
    
    // deletes a post with a specific post id
    app.delete('/api/delete-post/:pid', deletePost)
    
    // adds a like to the post, and updates the current users 
    app.put('/api/like-post/:pid', likePost)
    
    // unlikes the post with the post id
    app.put('/api/unlike-post/:pid', unlikePost)
    
    app.get('/api/get-post-by-track-id/:trackID', getPostByTrackID)

}


const getPostByTrackID = async (req, res) => {
   const trackID = req.params.trackID 
   const tracks = await dao.getPostByTrackID(trackID) 
    return res.json(tracks)

}
const unlikePost = async (req, res) => {
    const postID = req.params.pid
    const currentPost = await dao.getPost(postID)
    currentPost.likes -=1
    await dao.updatePost(postID, currentPost)

    // update the current user likes with the postID
    if (req.session.user !== undefined) {
        const current_username = req.session.user.username
        const current_user = await dao.getUserByUsername(current_username)

        let idx = current_user.likedPosts.indexOf(postID)
        if (idx !== -1) {
            current_user.likedPosts.splice(idx, 1)
            await dao.updateUserByUsername(current_username, current_user)
            req.session.user.likedPosts.splice(idx, 1)
        }
    }

    res.sendStatus(200)
}

const likePost = async (req, res) => {

    const postID = req.params.pid
    const currentPost = await dao.getPost(postID)
    currentPost.likes += 1
    await dao.updatePost(postID, currentPost)

    // update the current user likes with the postID
    if (req.session.user !== undefined) {
        const current_username = req.session.user.username
        const current_user = await dao.getUserByUsername(current_username)
        let idx = current_user.likedPosts.indexOf(postID)
        if (idx === -1) {
            current_user.likedPosts.push(postID)
            await dao.updateUserByUsername(current_username, current_user)
            req.session.user.likedPosts.push(postID)
        }
        
    }

    res.sendStatus(200)

}
/* 
    Creates a new post and inserts into the database
    Returns the newly inserted post in JSON form
    The following fields are assumed to be included in the body of the post request: 
        songTitle (required)
        review  (required)
        username (if no username is provided, its assumed to be the current user)
        artists
        genre
        albumArt
        spotifyURI
        spotifyID
*/

const createPost = async (req, res) => {
    const newPost = req.body;
    newPost.likes = 0;
    if (req.session.user === undefined) {
        res.sendStatus(400)
        return
    }
    newPost.username = req.session.user.username

    let post = {}
    try {
        post = await dao.createPost(newPost)
        await dao.assignPostToUser(newPost.username, post._id)
    } catch (e) {
        res.status(400).json(e)
        return
    }
    // update the current user and make sure that they get a new post 
    if (req.session.user !== undefined && req.session.user.username === newPost.username) {
        req.session.user.posts.push(post._id)
    }

    res.json(post);
}

// Gets a post from the datbase with the provided postID as a parameter 
const getPost = async (req, res) => {
    const postID = req.params.pid
    let post = {}
    try {
        post = await dao.getPost(postID)
    } catch (e) {
        res.status(400).json(e)
        return
    }
    res.json(post)
}

// retrieves all posts in the database
const getAllPosts = async (req, res) => {
    let posts = {}
    try {
        posts = await dao.getAllPosts()
    } catch (e) {
        res.status(400).json(e)
        return
    }
    res.json(posts)
}

/* 
    Updates a post in the database with the provided postID as a parameter
    The changes are sent in the body of the HTTP request 
*/
const updatePost = async (req, res) => {
    const postID = req.params.pid
    
    const oldPost = await dao.getPost(postID)

    const changes = req.body;
    let statusObj = {}
    try {
        statusObj = await dao.updatePost(postID, changes)
        
        if (changes.username !== undefined) {
            await dao.changeUserWhoPosted(postID, changes.username)

            if (req.session.user !== undefined && changes.username == req.session.user.username) {
                if (req.session.user.posts.indexOf(oldPost._id.toString()) === -1) {
                    req.session.user.posts.push(oldPost._id)
                }
            }

            if (req.session.user !== undefined && oldPost.username === req.session.user.username) {
                let idx = req.session.user.posts.indexOf(oldPost._id.toString())
                if (idx !== -1) {
                    req.session.user.posts.splice(idx, 1)
                }
            }
        }
    } catch (e){
        res.status(400).json(e)
        return
    }
    if (statusObj.acknowledged === false) {
        res.sendStatus(400)
        return
    }
    
    let newPost = await dao.getPost(postID)
    res.json(newPost);
}

// Deletes a post in the database with the provided postID as a parameter
const deletePost = async (req, res) => {
    const postID = req.params.pid
    const post = await dao.getPost(postID)
    let statusObj = {}
    try {
        statusObj = await dao.deletePost(postID)
        await dao.deletePostFromUser(postID)
        await dao.deletePostFromUserLikedPosts(postID)
        
        if (req.session.user !== undefined && post.username === req.session.user.username) {
           let idx = req.session.user.posts.indexOf(postID) 
            if (idx !== -1) {
                req.session.user.posts.splice(idx, 1)
            }
            let idx2 = req.session.user.likedPosts.indexOf(postID)
            console.log(idx2)
            if (idx2 !== -1) {
                req.session.user.likedPosts.splice(idx2, 1)
            }
        }

    } catch (e) {
        res.status(400).json(e)
        return
    }
    if (statusObj.deletedCount === 0) {
        res.sendStatus(400)
        return
    }
    res.json(statusObj);
}