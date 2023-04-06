import mongoose from 'mongoose'

const usersSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, required: true},
    email: {type: String, required: true, unique: true},
    followers: {type: Array, required: true},
    following: {type: Array, required: true},
    likedPosts: {type: Array, required: true},
    posts: {type: Array, required: true}
}, {collection: 'users'})

export default usersSchema