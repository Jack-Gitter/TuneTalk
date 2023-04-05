import mongoose from 'mongoose'

const postsSchema = mongoose.Schema({
    songTitle: {type: String, required: true},
    review: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    artists: Array,
    genre: String,
    albumArt: String,
    spotifyURI: String,
    spotifyID: String,
}, {collection: 'posts'})

export default postsSchema