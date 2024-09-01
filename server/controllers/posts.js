import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

import Post from "../models/Post.js";
import User from "../models/User.js";

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, username, prompt, photo } = req.body;
    const photoUrl = await cloudinary.uploader.upload(photo);

    const user = await User.findById(userId);

    const newPost = new Post({
      userId,
      username,
      prompt,
      photo: photoUrl.url,
      likes: {},
      comments: [],
    });
    await newPost.save();

    //const post = await Post.find();
    //res.status(201).json(post);
    res.status(201).json({ success: true, data: newPost });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    //res.status(200).json(posts);
    res.status(200).json({ success: true, data: posts});
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};