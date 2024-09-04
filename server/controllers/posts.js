import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

import Post from "../models/Post.js";
import User from "../models/User.js";
import { createNotification } from '../ioInit/notificationUtils.js';

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

    // Find the user's friends
    const friends = user.friends;

    // Create notifications for each friend
    const notifications = friends.map(friendId => ({
      userId: friendId,
      message: `${user.username} has posted something new.`,
      postId: newPost._id,
    }));

    // Insert notifications into the database and emit them in real time
    for (const notificationData of notifications) {
      await createNotification(notificationData);
    }

    const posts = await Post.find();
    res.status(201).json({data: posts});
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
    const posts = await Post.find({ userId });
    res.status(200).json({ data: posts });
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

    // Convert the Map to a plain object for JSON serialization
    const likes = Object.fromEntries(post.likes.entries());

    //const isLiked = likes[userId];
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      delete likes[userId];
    } else {
      likes[userId] = true;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, username, text } = req.body;

    if (!userId || !username || !text) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      userId,
      username,
      text,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    res.status(200).json({ success: true, data: post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/* DELETE */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    //const { userId } = req.body;
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params; 
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);
    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    post.comments.splice(commentIndex, 1);
    await post.save();

    res.status(200).json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


