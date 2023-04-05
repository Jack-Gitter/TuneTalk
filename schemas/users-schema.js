import mongoose from 'mongoose'

const usersSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isAdmin: {type: String, required: true},
    email: {type: String, unique: true}
}, {collection: 'users'})

export default usersSchema