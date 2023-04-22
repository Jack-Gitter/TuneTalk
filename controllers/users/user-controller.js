import * as dao from '../../dao/dao.js'
export const userController = (app) => {
    
    // create a new user 
    app.post('/api/create-user', createUser)

    // get a user with the provided username
    app.get('/api/get-user/:username', getUserByUsername)

    // gets all users from database
    app.get('/api/get-all-users', getAllUsers)

    // updates a user with a specific user id
    app.put('/api/update-user/:username', updateUserByUsername)
    
    // deletes a user with a specific user id
    app.delete('/api/delete-user/:username', deleteUserByUsername)
    
    // logs a user in 
    app.post('/api/login', login)
    
    // registers a user
    app.post('/api/register', register)
    
    // gets the current user that is logged in
    app.get('/api/get-current-user', getCurrentUser)

    // logs the current user out
    app.post('/api/logout', logout)
    
    // gets the posts of a user given their username
    app.get('/api/get-user-posts/:username', userPostsByUsername)

    // gets the followers of a user given their username
    app.get('/api/get-user-followers/:username', userFollowersByUsername)
    
    // gets the following of a user by their username
    app.get('/api/get-user-following/:username', userFollowingByUsername)

    // gets the liked posts of a user by their username
    app.get('/api/get-user-liked/:username', userLikedByUsername)
    
    // follows a user with the given username for the currently logged in user
    app.put('/api/follow-user/:username', followUser)
    
    // unfollows a user with the given username for the curerntly logged in user
    app.put('/api/unfollow-user/:username', unfollowUser)
    
    app.get('/api/get-posts-from-following/:username', getPostsfromFollowing)
    
}


const getPostsfromFollowing = async (req, res) => {

    const username = req.params.username
    
    if (username === null || username === undefined) {
        res.sendStatus(400)
        return
    }

    const user = await dao.getUserByUsername(username);
    
    if (user === null || user === undefined) {
        res.sendStatus(400)
        return
    }
    const following = user.following
    let postIDs = []
    let posts = []
    
    for (let i = 0; i < following.length; i++) {
        let user_followed = await dao.getUserByUsername(following[i])
        postIDs = postIDs.concat(user_followed.posts);
    }
    
    for (let i = 0; i < postIDs.length; i++) {
        let post = await dao.getPost(postIDs[i]);
        posts.push(post)
    }

    res.json(posts);
}


const followUser = async (req, res) => {

    if (req.session.user === undefined) {
        res.sendStatus(400)
        return
    }
    const old_current_user = req.session.user;
    try {
        const userToFollow = req.params.username 

        const temp = await dao.getUserByUsername(userToFollow)
        if (temp === null) {
            res.sendStatus(400);
            return
        }

        const currentUser = req.session.user
        currentUser.following.push(userToFollow)
        await dao.updateUserByUsername(currentUser.username, currentUser)
        await updateOtherUsersFollowers(currentUser.username, currentUser)
        req.session.user = currentUser;
    } catch (e) {
        req.session.user = old_current_user;
        res.sendStatus(400)
        return
    }
    res.sendStatus(200)
}

const unfollowUser = async (req, res) => {
    if (req.session.user === undefined) {
        res.sendStatus(400)
        return
    }
    const old_current_user = req.session.user;
    try {
        const userToFollow = req.params.username 
        const temp = await dao.getUserByUsername(userToFollow)
        if (temp === null) {
            res.sendStatus(400);
            return
        }
        const currentUser = req.session.user
        const idx = currentUser.following.indexOf(userToFollow)
        if (idx !== -1) {
            currentUser.following.splice(idx, 1)
            console.log(currentUser.following)
            await dao.updateUserByUsername(currentUser.username, currentUser)
            await updateOtherUsersFollowers(currentUser.username, currentUser)
        }
        req.session.user = currentUser
    } catch (e) {
        req.session.user = old_current_user;
        res.sendStatus(400)
        return
    }
    res.sendStatus(200)
}


// gets a users liked posts given their username
const userLikedByUsername = async (req, res) => {
    let user = {}
    try {
        user = await dao.getUserByUsername(req.params.username)
    } catch (e) {
        res.status(400).json(e)
        return
    }
    if (user === null) {
        res.sendStatus(400)
        return
    }
    const liked = await Promise.all(user.likedPosts.map(async (postID) => await dao.getPost(postID)))
    res.json(liked)

}

// gets a following given their username
const userFollowingByUsername = async (req, res) => {
    let user = {}
    try {
        user = await dao.getUserByUsername(req.params.username)
    } catch (e){
        res.status(400).json(e)
        return
    }
    if (user === null) {
        res.sendStatus(400)
        return
    }
    const following = await Promise.all(user.following.map(async (fUsername) => await dao.getUserByUsername(fUsername)))
    res.json(following)
}

// gets a users followers given their username
const userFollowersByUsername = async (req, res) => {
    let user = {}
    try {
        user = await dao.getUserByUsername(req.params.username)
    } catch (e) {
        res.status(400).json(e)
        return
    }
    if (user === null) {
        res.sendStatus(400)
        return
    }
    const followers = await Promise.all(user.followers.map(async (fUsername) => await dao.getUserByUsername(fUsername)))
    res.json(followers)
}

// gets a users posts given their username
const userPostsByUsername = async (req, res) => {
    let user = {}
    try {
        user = await dao.getUserByUsername(req.params.username)
    } catch (e) {
        res.status(400).json(e)
        return
    }
    if (user === null) {
        res.sendStatus(400)
        return
    }
    const posts = await Promise.all(user.posts.map(async (postID) => await dao.getPost(postID)))
    res.json(posts)
}


//Logs the current user out
const logout = (req, res) => {
    if (req.session.user) {
        req.session.destroy();
        res.sendStatus(200)
        return
    }
    res.sendStatus(400)
}

// gets the current user logged in 
const getCurrentUser = (req, res) => {
    console.log('in get-current-user, current session is: ')
    console.log(req.session)
    if (req.session['user'] === undefined) {
        res.sendStatus(400)
        return
    } else {
        res.json(req.session.user)
    }
}

/*

    Logs a user in.
    Required fields in the body are:
    username
    password
    
*/
const login = async (req, res) => {
    const user = await dao.getUserByParams(req.body)
    if (user === null) {
        res.sendStatus(400)
        return
    }
    req.session['user'] = user
    console.log("in the login method:")
    console.log("current session is: ")
    console.log(req.session)
    res.json(user)
}

const register = async (req, res) => {
    const user = await dao.getUserByUsername(req.body.username)
    if (user !== null) {
        res.sendStatus(400)
        return
    }
    let newUser = {}
    try {
        newUser = await dao.createUser(req.body)
    } catch (e) {
        res.status(400).json(e)
        return
    }
    req.session['user'] = newUser
    res.json(newUser)
}

/* 
    Creates a new user in the database.
    The following fields are assumed to be included in the body of the post request: 
    username: (required)
    password: (required)
    isAdmin: (required)
    email: (required)
    followers:
    following: 
    likedPosts: 
    posts: 
*/

const createUser = async (req, res) => {
    const newUser = req.body;
    newUser.followers = []
    newUser.following = []
    newUser.likedPosts = []
    newUser.posts = []
    let user = {}
    try {
        user = await dao.createUser(newUser)
    } catch (e) {
        res.status(400).json(e)
        return
    }
    res.json(user);
}


const getUserByUsername = async (req, res) => {
    const username = req.params.username
    let user = {}
    try {
        user = await dao.getUserByUsername(username)
    } catch (e) {
        res.status(400).json(e)
        return
    }
    if (user === null) {
        res.sendStatus(400)
        return
    }
    res.json(user)
}

// Gets all users 
const getAllUsers = async (req, res) => {
    let users = {} 
    try {
        users = await dao.getAllUsers()
    } catch (e) {
        res.status(400).json(e)
        return
    }
    res.json(users)

}

/* 
    Updates a user in the database with the provided userID as a parameter
    The changes are sent in the body of the HTTP request 
*/

    
const updatePostsUsername = async (old_username, updates) => {
    const new_username = updates.username
    await dao.updatePostsUsername(old_username, new_username)
}

const updateOtherUsersFollow = async (old_username, updates) => {
    const new_username = updates.username
    await dao.updateOtherUsersFollow(old_username, new_username)
}

const updateWhoOtherUsersFollow = async (username, updates) => {
    const followers = updates.followers
    await dao.updateWhoOtherUsersFollowDAO(username, followers)
}

const updateOtherUsersFollowers = async (username, updates) => {
    const following = updates.following 
    await dao.updateOtherUsersFollowersDAO(username, following)
}


const updateUserByUsername = async (req, res) => {
    const username = req.params.username
    const updates = req.body
    let statusObj = {}
    try {
        statusObj = await dao.updateUserByUsername(username, updates)
        
        // if the user changed their username, update associated records in users and posts collections
        if (updates.username !== undefined) {
            await updateOtherUsersFollow(username, updates)
            await updatePostsUsername(username, updates)
        }
       
        // if a user changes who is following them, make sure this is reflected in the other users as well
        if (updates.followers !== undefined) {
            await updateWhoOtherUsersFollow(username, updates)
        }
        
        if (updates.following !== undefined) {
            await updateOtherUsersFollowers(username, updates)
        }
        
    } catch (e) {
        res.status(400).json(e)
        return
    }
    if (statusObj.acknowledged === false) {
        res.sendStatus(400)
        return
    }
    if (req.session.user !== undefined && req.session.user.username === req.params.username) {
        req.session.user = {...req.session.user, ...updates}
    }
    let search_username = req.body.username === undefined ? username : req.body.username
    let user = await dao.getUserByUsername(search_username)
    res.json(user);
}

// Deletes a user in the database with the provided username as a parameter
const deleteUserByUsername = async (req, res) => {
    const username = req.params.username
    let statusObj = {}
    try {
        statusObj = await dao.deleteUserByUsername(username)
        await dao.deleteUsersPosts(username)
    } catch (e) {
        res.status(400).json(e)
        return
    }
    if (statusObj.deletedCount === 0) {
        res.sendStatus(400)
        return
    }
    
    // if we delete the currently signed in user, we want to end the session and delete their posts
    //console.log(req.session.user.username)
    if (req.session.user !== undefined && req.session.user.username === req.params.username) {
        req.session.destroy()
    }
    res.json(statusObj);
}