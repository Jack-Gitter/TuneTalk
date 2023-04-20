import mongoose from 'mongoose'

const usersSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, required: true},
    email: {type: String, required: true},
    followers: [String], // username
    following: [String], // username
    likedPosts: [String], // postID  This field will not update the like counts on posts if changed, must be done client side
    rating: {type: Number, min: 0, max: 5, required: true},
    posts: [String] // This field will not delete or re-assign posts if changed, must be done client side
}, {collection: 'users'})

export default usersSchema
