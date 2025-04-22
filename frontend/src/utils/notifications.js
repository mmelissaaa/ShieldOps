// src/utils/notifications.js
export const showNotification = (title, options) => {
    if (Notification.permission === 'granted') {
      new Notification(title, options);
    } else {
      console.warn('Notification permission not granted.');
    }
  };