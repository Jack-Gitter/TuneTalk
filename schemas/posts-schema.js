import mongoose from 'mongoose'

const postsSchema = mongoose.Schema({
    songTitle: {type: String, required: true},
    review: {type: String, required: true},
    username: {type: String, required: true},
    artists: Array,
    genre: String,
    albumArt: String,
    spotifyURI: String,
    spotifyID: String,
    likes: Number,
}, {collection: 'posts'})

export default postsSchema