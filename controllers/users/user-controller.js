import u from './users.js'
let users = u

export const userController = (app) => {
    
    // create a new user 
    app.post('/api/create-user', createUser)

    // get a user with the provided id
    app.get('/api/get-user/:uid', getUser)
    
    // gets all users from database
    app.get('/api/get-all-users', getAllUsers)

    // updates a user with a specific user id
    app.put('/api/update-user/:uid', updateUser)
    
    // deletes a user with a specific user id
    app.delete('/api/delete-user/:uid', deleteUser)

}

/* 
    Creates a new user in the database.
    The following fields are assumed to be included in the body of the post request: 
        Username
        Email
        Password
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
const getUser = (req, res) => {
    const userID = req.params.uid
    const user = users.find((user) => user._id === userID)
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
const updateUser = (req, res) => {
    const userID = req.params.uid
    const updates = req.body
    users = users.map((user) => user._id === userID ? {...user, ...updates} : user)
    res.sendStatus(200);
}

// Deletes a user in the database with the provided postID as a parameter
const deleteUser = (req, res) => {
    const userID = req.params.uid
    users = users.filter((user) => user._id !== userID)
    res.sendStatus(200);
}
