import mongoose from 'mongoose'

const postsSchema = mongoose.Schema({
    songTitle: {type: String, required: true},
    review: {type: String, required: true},
    username: {type: String, required: true, unique: true}, // change this to be forced to link to a username in the user schema
    artists: Array,
    genre: String,
    albumArt: String,
    spotifyURI: String,
    spotifyID: String,
}, {collection: 'posts'})

export default postsSchema