import mongoose from 'mongoose'

const postsSchema = mongoose.Schema({
    songTitle: {type: String, required: true},
    review: {type: String, required: true},
    posterID: {type: String, required: true},
    artists: Array,
    genre: String,
    albumArt: String,
    spotifyURI: String,
    spotifyID: String,
}, {collection: 'posts'})

export default postsSchema