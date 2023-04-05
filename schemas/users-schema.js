import mongoose from 'mongoose'

const usersSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, required: true},
    email: {type: String, required: true, unique: true}
}, {collection: 'users'})

export default usersSchema