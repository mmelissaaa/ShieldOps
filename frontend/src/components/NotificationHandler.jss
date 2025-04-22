// client/src/components/NotificationHandler.js
import React, { useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import socket from '../utils/api';

const NotificationHandler = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Join the user's room
    socket.emit('joinRoom', user._id);

    // Listen for task assigned notifications
    socket.on('taskAssigned', (data) => {
      if (Notification.permission === 'granted') {
        new Notification('New Task Assigned', {
          body: data.message,
        });
      } else {
        alert(data.message); // Fallback for browsers that don't support notifications
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return null; // This component doesn't render anything
};

export default NotificationHandler;