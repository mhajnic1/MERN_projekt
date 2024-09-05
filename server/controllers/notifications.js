import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId, read: false }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};
  
  export const markNotificationAsRead = async (req, res) => {
    try {
      const { notificationId } = req.params;
      await Notification.findByIdAndUpdate(notificationId, { read: true });
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ message: 'Error marking notification as read' });
    }
  };
  