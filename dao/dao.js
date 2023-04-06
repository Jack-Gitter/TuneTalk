import postsModel from "../models/posts-model.js";
import usersModel from "../models/users-model.js";

export const getAllPosts = async () => await postsModel.find()
export const getPost = async (postID) => await postsModel.findById(postID)
export const createPost = async (post) => await postsModel.create(post)
export const updatePost = async (pid, post) => await postsModel.updateOne({_id: pid}, {$set: post})
export const deletePost = async (pid) => await postsModel.deleteOne({_id: pid})

// USERS METHODS START

export const getAllUsers = async() => await usersModel.find()
export const getUserByID = async(userID) => await usersModel.findById(userID)
export const getUserByUsername = async(username) => await usersModel.findOne({username: username})
export const createUser = async (user) => await usersModel.create(user)
export const updateUserById = async (uid, user) => await usersModel.updateOne({_id: uid}, {$set: user})
export const updateUserByUsername = async (username, user) => await usersModel.updateOne({username: username}, {$set: user})
export const deleteUserById = async (uid) => await usersModel.deleteOne({_id: uid})
export const deleteUserByUsername = async (username) => await usersModel.deleteOne({username: username})
