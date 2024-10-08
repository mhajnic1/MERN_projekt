import express from "express";
import { createPost, getFeedPosts, getUserPosts, likePost, addComment, deletePost, deleteComment } from "../controllers/posts.js";
import { getNotifications, markNotificationAsRead } from "../controllers/notifications.js";
import Notification from "../models/Notification.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();


/* CREATE */
router.post("/post", verifyToken, createPost);

/* READ */
router.get("/", /* verifyToken, */ getFeedPosts);
router.get("/:userId", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch('/:id/comment', verifyToken, addComment);

/* DELETE */
router.delete('/:id/delete', verifyToken, deletePost);
router.delete('/:id/:commentId/deletecomment', verifyToken, deleteComment);

export default router;