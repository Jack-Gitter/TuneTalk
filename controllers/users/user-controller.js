import * as dao from '../../dao/dao.js'
export const userController = (app) => {
    
    // create a new user 
    app.post('/api/create-user', createUser)

    // get a user with the provided id
    app.get('/api/get-user-by-id/:uid', getUserByID)
    
    // get a user with the provided username
    app.get('/api/get-user-by-username/:username', getUserByUsername)

    // gets all users from database
    app.get('/api/get-all-users', getAllUsers)

    // updates a user with a specific user id
    app.put('/api/update-user-by-id/:uid', updateUserById)
    //
    // updates a user with a specific user id
    app.put('/api/update-user-by-username/:username', updateUserByUsername)
    
    // deletes a user with a specific user id
    app.delete('/api/delete-user-by-id/:uid', deleteUserById)
    
    // deletes a user with a specific user id
    app.delete('/api/delete-user-by-username/:username', deleteUserByUsername)
    
    // logs a user in and returns the user back 
    app.post('/api/login', login)
    
    // reigsters a user and returns the user back
    app.post('/api/register', register)
    
    // get the current user logged in 
    app.get('/api/get-current-user', getCurrentUser)

    // logout the current user (remove cookies from server store)
    app.post('/api/logout', logout)
    
}

const logout = (req, res) => {
    console.log(req.session)
    if (req.session.user) {
        req.session.destroy();
        res.sendStatus(200)
        return
    }
    res.sendStatus(400)
}
const getCurrentUser = (req, res) => {
    console.log(req.session)
    if (req.session.user === null) {
        res.sendStatus(400)
        return
    } else {
        res.json(req.session.user)
    }
}

// endpoint to log in. Body is expected to have username, password, and email fields
const login = async (req, res) => {
    console.log(req.session)
    const user = await dao.getUserByParams(req.body)
    if (user === null) {
        res.sendStatus(400)
        return
    }
    req.session['user'] = user
    res.json(user)
}

const register = async (req, res) => {
    console.log(req.session)
    const user = await dao.getUserByUsername(req.body.username)
    if (user !== null) {
        res.sendStatus(400)
        return
    }
    const newUser = await dao.createUser(req.body).catch((e) => {res.status(400).json(e); return})
    req.session['user'] = newUser
    res.json(newUser)
}

/* 
    Creates a new user in the database.
    The following fields are assumed to be included in the body of the post request: 
        username
        email
        password
        isAdmin
*/

const createUser = async (req, res) => {
    const newUser = req.body;
    newUser.followers = []
    newUser.following = []
    newUser.likedPosts = []
    newUser.posts = []
    const user = await dao.createUser(newUser).catch((e) => {res.status(400).json(e); return})
    res.json(user);
}


// Gets a user with the given user id
const getUserByID = async (req, res) => {
    const userID = req.params.uid
    const user = await dao.getUserByID(userID).catch((e) => {res.status(400).json(e); return})
    res.json(user)
}

const getUserByUsername = async (req, res) => {
    const username = req.params.username
    const user = await dao.getUserByUsername(username).catch((e) => {res.status(400).json(e); return})
    if (user === null) {
        res.sendStatus(400)
        return
    }
    res.json(user)
}

// Gets all users 
const getAllUsers = async (req, res) => {
    const users = await dao.getAllUsers().catch((e) => {res.status(400).json(e); return})
    res.json(users)

}

/* 
    Updates a user in the database with the provided userID as a parameter
    The changes are sent in the body of the HTTP request 
*/
const updateUserById = async (req, res) => {
    const userID = req.params.uid
    const updates = req.body
    const statusObj = await dao.updateUserById(userID, updates).catch((e) => {res.status(400).json(e); return})
    res.json(statusObj);
}

const updateUserByUsername = async (req, res) => {
    const username = req.params.username
    const updates = req.body
    const statusObj = await dao.updateUserByUsername(username, updates).catch((e) => {res.status(400).json(e); return})
    res.json(statusObj);
}

// Deletes a user in the database with the provided postID as a parameter
const deleteUserById = async (req, res) => {
    const userID = req.params.uid
    const statusObj = await dao.deleteUserById(userID).catch((e) => {res.status(400).json(e); return})
    res.json(statusObj);
}
//
// Deletes a user in the database with the provided postID as a parameter
const deleteUserByUsername = async (req, res) => {
    const username = req.params.username
    const statusObj = await dao.deleteUserByUsername(username).catch((e) => {res.status(400).json(e); return})
    res.json(statusObj);
}