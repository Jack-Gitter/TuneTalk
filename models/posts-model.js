import mongoose from 'mongoose'
import postsSchema from "../schemas/posts-schema";

const postsModel = mongoose.model('PostModel', postsSchema) 

export default postsModel