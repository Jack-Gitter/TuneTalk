import postsModel from "../models/posts-model.js";
import usersModel from "../models/users-model.js";

export const getAllPosts = async () => await postsModel.find()
export const getPost = async (postID) => await postsModel.findById(postID)
export const createPost = async (post) => await postsModel.create(post)
export const updatePost = async (pid, post) => await postsModel.updateOne({_id: pid}, post)
export const deletePost = async (pid) => await postsModel.deleteOne({_id: pid})

export const updatePostsUsername = async (old_username, new_username) => 
        await postsModel.updateMany({username: old_username}, {username: new_username})

// USERS METHODS START

export const getAllUsers = async() => await usersModel.find()
export const getUserByUsername = async(username) => await usersModel.findOne({username: username})
export const getUserByParams = async(user) => await usersModel.findOne({
    username: user.username, password: user.password
})
export const createUser = async (user) => await usersModel.create(user)
export const updateUserByUsername = async (username, user) => await usersModel.updateOne({username: username}, user)
export const deleteUserByUsername = async (username) => await usersModel.deleteOne({username: username})

export const updateOtherUsersFollow = async (old_username, new_username) =>  {
    await usersModel.updateMany({followers: old_username}, {$set: {"followers.$": new_username}})
    await usersModel.updateMany({following: old_username}, {$set: {"following.$": new_username}})

}