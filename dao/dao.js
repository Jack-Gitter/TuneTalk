import postsModel from "../models/posts-model";
import usersModel from "../models/users-model";

const getAllPosts = async () => {
    postsModel.find()
}

const getPost = async (postID) => {
    postsModel.find({_id: postID})
}

const createPost = async (post) => {
    postsModel.create(post)
}

const editPost = async (pid, post) => {
    postsModel.updateOne({_id: pid}, {$set: post})
}

const deletePost = async (pid) => {
    postsModel.deleteOne({_id: pid})
}


// USERS METHODS START


const getAllUsers = async() => {
   usersModel.find() 
}

const getUser = async(userID) => {
    usersModel.find({_id: userID})
}

const getUserByUsername = async(username) => {
    usersModel.find({username: username})
}

const createUser = async (user) => {
    usersModel.create(user)
}

const editUserById = async (uid, user) => {
    usersModel.updateOne({_id: uid}, {$set: user})
}

const editUserByUsername = async (username, user) => {
    usersModel.updateOne({username: username}, {$set: user})
}

const deleteUserById = async (uid) => {
    usersModel.deleteOne({_id: uid})
}

const deleteUserByUsername = async (username) => {
    usersModel.deleteOne({username: username})
}