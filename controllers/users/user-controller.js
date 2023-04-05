import u from './users.js'
let users = u

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
    app.delete('/api/delete-user-by-username/:uid', deleteUserByUsername)

}

/* 
    Creates a new user in the database.
    The following fields are assumed to be included in the body of the post request: 
        username
        email
        password
        isAdmin
*/

const createUser = (req, res) => {
    const newUser = req.body;
    newUser._id = (new Date()).getTime()+''
    newUser.followers = []
    newUser.following = []
    newUser.likedPosts = []
    newUser.posts = []
    users.push(newUser)
    res.json(newUser);
}


// Gets a user with the given user id
const getUserByID = (req, res) => {
    const userID = req.params.uid
    const user = users.find((user) => user._id === userID)
    res.json(user)
}

const getUserByUsername = (req, res) => {
    const username = req.params.username
    const user = users.find((user) => user.username === username)
    res.json(user)
}

// Gets all users 
const getAllUsers = (req, res) => {
    res.json(users)
}

/* 
    Updates a user in the database with the provided userID as a parameter
    The changes are sent in the body of the HTTP request 
*/
const updateUserById = (req, res) => {
    const userID = req.params.uid
    const updates = req.body
    users = users.map((user) => user._id === userID ? {...user, ...updates} : user)
    res.sendStatus(200);
}

const updateUserByUsername = (req, res) => {
    const username = req.params.username
    const updates = req.body
    users = users.map((user) => user.username === username ? {...user, ...updates} : user)
    res.sendStatus(200);
}

// Deletes a user in the database with the provided postID as a parameter
const deleteUserById = (req, res) => {
    const userID = req.params.uid
    users = users.filter((user) => user._id !== userID)
    res.sendStatus(200);
}
//
// Deletes a user in the database with the provided postID as a parameter
const deleteUserByUsername = (req, res) => {
    const username = req.params.username
    users = users.filter((user) => user.username !== username)
    res.sendStatus(200);
}
