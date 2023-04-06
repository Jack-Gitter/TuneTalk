import postsModel from "../models/posts-model.js";
import usersModel from "../models/users-model.js";

export const getAllPosts = async () => {
    return postsModel.find()
}

export const getPost = async (postID) => {
    return postsModel.find({_id: postID})
}

export const createPost = async (post) => {
    return postsModel.create(post)
}

export const updatePost = async (pid, post) => {
    return postsModel.updateOne({_id: pid}, {$set: post})
}


export const deletePost = async (pid) => {
    return postsModel.deleteOne({_id: pid})
}


// USERS METHODS START


export const getAllUsers = async() => {
   return usersModel.find() 
}

export const getUserByID = async(userID) => {
    return usersModel.find({_id: userID})
}

export const getUserByUsername = async(username) => {
    return usersModel.find({username: username})
}

export const createUser = async (user) => {
    return usersModel.create(user)
}

export const updateUserById = async (uid, user) => {
    return usersModel.updateOne({_id: uid}, {$set: user})
}

export const updateUserByUsername = async (username, user) => {
    return usersModel.updateOne({username: username}, {$set: user})
}

export const deleteUserById = async (uid) => {
    return usersModel.deleteOne({_id: uid})
}

export const deleteUserByUsername = async (username) => {
    return usersModel.deleteOne({username: username})
}