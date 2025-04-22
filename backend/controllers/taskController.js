// server/controllers/taskController.js
const Task = require('../models/Tasks');
const User = require('../models/User');
const { validationResult } = require('express-validator');


// Create a new task (manager only)
exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if user is manager
    if (req.user.role !== 'manager') {
      return res.status(403).json({ msg: 'Not authorized. Only managers can assign tasks' });
    }

    const { title, description, assignedTo, dueDate, priority } = req.body;

    // Check if assigned user exists
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(404).json({ msg: 'Assigned user not found' });
    }

    const newTask = new Task({
      title,
      description,
      assignedBy: req.user.id,
      assignedTo,
      dueDate,
      priority: priority || 'medium'
    });

    const task = await newTask.save();

    // Populate user data
    const populatedTask = await Task.findById(task._id)
      .populate('assignedBy', ['name', 'email', 'profilePicture'])
      .populate('assignedTo', ['name', 'email', 'profilePicture']);

    res.json(populatedTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get tasks assigned to current user
exports.getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .sort({ createdAt: -1 })
      .populate('assignedBy', ['name', 'email', 'profilePicture']);
    
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get tasks assigned by current user (manager)
exports.getAssignedTasks = async (req, res) => {
  try {
    // Check if user is manager
    if (req.user.role !== 'manager') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const tasks = await Task.find({ assignedBy: req.user.id })
      .sort({ createdAt: -1 })
      .populate('assignedTo', ['name', 'email', 'profilePicture']);
    
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Check if user is authorized (either the assignee or the manager who assigned)
    if (task.assignedTo.toString() !== req.user.id && task.assignedBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to update this task' });
    }

    // Update task status
    task.status = status;
    
    // If task is marked as completed, set completedAt timestamp
    if (status === 'completed' && !task.completedAt) {
      task.completedAt = new Date();
    } else if (status !== 'completed') {
      task.completedAt = null;
    }

    await task.save();

    // Return updated task with populated fields
    const updatedTask = await Task.findById(id)
      .populate('assignedBy', ['name', 'email', 'profilePicture'])
      .populate('assignedTo', ['name', 'email', 'profilePicture']);

    res.json(updatedTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all tasks (manager only)
exports.getAllTasks = async (req, res) => {
  try {
    // Check if user is manager
    if (req.user.role !== 'manager') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const tasks = await Task.find()
      .sort({ createdAt: -1 })
      .populate('assignedBy', ['name', 'email', 'profilePicture'])
      .populate('assignedTo', ['name', 'email', 'profilePicture']);
    
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};