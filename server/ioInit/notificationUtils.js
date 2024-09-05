import Notification from '../models/Notification.js';
import { Server } from 'socket.io';

let io;

export const initializeIo = (ioInstance) => {
  io = ioInstance;
};

export const createNotification = async (notificationData) => {
  try {
    const notification = await Notification.create(notificationData);
    io.to(notificationData.userId).emit('newNotification', notification);
  } catch (err) {
    console.error('Error creating notification:', err);
  }
};
