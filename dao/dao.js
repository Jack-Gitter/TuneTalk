import postsModel from "../models/posts-model.js";
import usersModel from "../models/users-model.js";

export const getAllPosts = async () => await postsModel.find()
export const getPost = async (postID) => await postsModel.findById(postID)
export const createPost = async (post) => await postsModel.create(post)
export const updatePost = async (pid, post) => await postsModel.updateOne({_id: pid}, post)
export const deletePost = async (pid) => await postsModel.deleteOne({_id: pid})

// USERS METHODS START

export const getAllUsers = async() => await usersModel.find()
export const getUserByUsername = async(username) => await usersModel.findOne({username: username})
export const getUserByParams = async(user) => await usersModel.findOne({
    username: user.username, password: user.password, email: user.email 
})
export const createUser = async (user) => await usersModel.create(user)
export const updateUserByUsername = async (username, user) => await usersModel.updateOne({username: username}, user)
export const deleteUserByUsername = async (username) => await usersModel.deleteOne({username: username})
