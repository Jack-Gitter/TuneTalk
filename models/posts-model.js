import mongoose from 'mongoose'
import postsSchema from "../schemas/posts-schema.js";

const postsModel = mongoose.model('PostModel', postsSchema) 

export default postsModel