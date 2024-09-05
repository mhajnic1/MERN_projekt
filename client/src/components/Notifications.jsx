/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080');

function Notifications({ userId, token }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleNewNotification = (notification) => {
      setNotifications(prev => [...prev, notification]);
    };

    socket.on('connect', () => {
      console.log('Connected to WebSocket');
      socket.emit('joinRoom', userId);
    });

    socket.on('newNotification', handleNewNotification);

    return () => {
      socket.off('connect');
      socket.off('newNotification', handleNewNotification);
    };
  }, [userId]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`http://localhost:8080/notifications/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (data.success) {
          setNotifications(data.notifications);
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    fetchNotifications();
  }, [userId, token]);

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`http://localhost:8080/notifications/${userId}/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      setNotifications(prev => prev.filter(notification => notification._id !== notificationId));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  return (
    <div>
      {notifications.map(notification => (
        <div key={notification._id} onClick={() => markAsRead(notification._id)}>
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
}

export default Notifications;
