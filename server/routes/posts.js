import express from "express";
import { createPost, getFeedPosts, getUserPosts, likePost, addComment } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();


/* CREATE */
router.post("/post", verifyToken, createPost);

/* READ */
router.get("/", /* verifyToken, */ getFeedPosts);
router.get("/:userId", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

// COMMENT
router.patch('/:id/comment', addComment);

export default router;