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
    const status = await dao.createUser(newUser)
    res.json(status);
}


// Gets a user with the given user id
const getUserByID = async (req, res) => {
    const userID = req.params.uid
    const user = await dao.getUserByID(userID)
    res.json(user)
}

const getUserByUsername = async (req, res) => {
    const username = req.params.username
    const user = await dao.getUserByUsername(username)
    res.json(user)
}

// Gets all users 
const getAllUsers = async (req, res) => {
    const users = await dao.getAllUsers()
    res.json(users)

}

/* 
    Updates a user in the database with the provided userID as a parameter
    The changes are sent in the body of the HTTP request 
*/
const updateUserById = async (req, res) => {
    const userID = req.params.uid
    const updates = req.body
    const statusObj = await dao.updateUserById(userID, updates)
    res.json(statusObj);
}

const updateUserByUsername = async (req, res) => {
    const username = req.params.username
    const updates = req.body
    const statusObj = await dao.updateUserByUsername(username, updates)
    res.json(statusObj);
}

// Deletes a user in the database with the provided postID as a parameter
const deleteUserById = async (req, res) => {
    const userID = req.params.uid
    const statusObj = await dao.deleteUserById(userID)
    res.json(statusObj);
}
//
// Deletes a user in the database with the provided postID as a parameter
const deleteUserByUsername = async (req, res) => {
    const username = req.params.username
    const statusObj = await dao.deleteUserByUsername(username)
    res.json(statusObj);
}
