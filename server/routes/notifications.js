import express from "express";
import { createPost, getFeedPosts, getUserPosts, likePost, addComment, deletePost, deleteComment } from "../controllers/posts.js";
import { getNotifications, markNotificationAsRead } from "../controllers/notifications.js";
import Notification from "../models/Notification.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();


/* CREATE */

// NOTIFIKACIJE
router.get('/:userId', verifyToken, getNotifications);
router.patch('/:userId/:notificationId', verifyToken, markNotificationAsRead);


export default router;