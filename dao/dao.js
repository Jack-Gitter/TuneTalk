import postsModel from "../models/posts-model.js";
import usersModel from "../models/users-model.js";

export const getAllPosts = async () => {
    postsModel.find()
}

export const getPost = async (postID) => {
    postsModel.find({_id: postID})
}

export const createPost = async (post) => {
    postsModel.create(post)
}

export const editPost = async (pid, post) => {
    postsModel.updateOne({_id: pid}, {$set: post})
}

export const deletePost = async (pid) => {
    postsModel.deleteOne({_id: pid})
}


// USERS METHODS START


export const getAllUsers = async() => {
   usersModel.find() 
}

export const getUser = async(userID) => {
    usersModel.find({_id: userID})
}

export const getUserByUsername = async(username) => {
    usersModel.find({username: username})
}

export const createUser = async (user) => {
    usersModel.create(user)
}

export const editUserById = async (uid, user) => {
    usersModel.updateOne({_id: uid}, {$set: user})
}

export const editUserByUsername = async (username, user) => {
    usersModel.updateOne({username: username}, {$set: user})
}

export const deleteUserById = async (uid) => {
    usersModel.deleteOne({_id: uid})
}

export const deleteUserByUsername = async (username) => {
    usersModel.deleteOne({username: username})
}