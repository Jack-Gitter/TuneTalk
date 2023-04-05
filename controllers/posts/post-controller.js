import p from './posts.js'
let posts = p

export const postController = (app) => {
    
    // creates a new user
    app.post('/api/create-post', createPost)

    // gets a post with a specific post id
    app.get('/api/get-post/:pid', getPost)
    
    // gets all of the posts
    app.get('/api/get-all-posts', getAllPosts)
    
    // updates a post with a specific post id
    app.put('/api/update-post/:pid', updatePost)
    
    // deletes a post with a specific post id
    app.delete('/api/delete-post/:pid', deletePost)

}

/* 
    Creates a new post and inserts into the database
    Returns the newly inserted post in JSON form
    The following fields are assumed to be included in the body of the post request: 
        songTitle
        Username
        Artists
        Genre
        Album Art
        SpotifyURI
        SpotifyID
        Review 
*/

const createPost = (req, res) => {
    const newPost = req.body;
    newPost._id = (new Date()).getTime()+''
    newPost.likes = 0;
    posts.push(newPost);
    res.json(newPost);
}

// Gets a post from the datbase with the provided postID as a parameter 
const getPost = (req, res) => {
    const postID = req.params.pid
    const post = posts.find((post) => post._id === postID)
    res.json(post)
}

// retrieves all posts in the database
const getAllPosts = (req, res) => {
    res.json(posts);
}

/* 
    Updates a post in the database with the provided postID as a parameter
    The changes are sent in the body of the HTTP request 
*/
const updatePost = (req, res) => {
    const postID = req.params.pid
    const changes = req.body;
    posts = posts.map((post) => post._id === postID ? {...post, ...changes} : post)
    res.sendStatus(200);
}

// Deletes a post in the database with the provided postID as a parameter
const deletePost = (req, res) => {
    const postID = req.params.pid
    posts = posts.filter((post) => post._id !== postID);
    res.sendStatus(200);
}
