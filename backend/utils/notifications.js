// server/utils/notifications.js
const { io } = require('../server'); // Assuming you have set up Socket.IO in your server

const emitTaskAssignedNotification = (userId, task) => {
  io.to(userId).emit('taskAssigned', {
    message: `You have a new task: ${task.title}`,
    taskId: task._id,
    taskTitle: task.title,
    dueDate: task.dueDate,
    priority: task.priority
  });
};

module.exports = { emitTaskAssignedNotification };