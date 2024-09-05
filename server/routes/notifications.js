import express from "express";
import { getNotifications, markNotificationAsRead } from "../controllers/notifications.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get('/:userId', verifyToken, getNotifications);

/* UPDATE */
router.patch('/:userId/:notificationId', verifyToken, markNotificationAsRead);


export default router;