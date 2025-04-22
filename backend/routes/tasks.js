// server/routes/tasks.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');
const taskController = require('../controllers/taskController');

// @route   POST api/tasks
// @desc    Create a new task (manager only)
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('assignedTo', 'Assigned user ID is required').not().isEmpty(),
      check('dueDate', 'Due date is required').not().isEmpty()
    ]
  ],
  taskController.createTask
);

// @route   GET api/tasks/me
// @desc    Get tasks assigned to current user
// @access  Private
router.get('/me', auth, taskController.getUserTasks);

// @route   GET api/tasks/assigned
// @desc    Get tasks assigned by current user (manager)
// @access  Private
router.get('/assigned', auth, taskController.getAssignedTasks);

// @route   PUT api/tasks/:id
// @desc    Update task status
// @access  Private
router.put(
  '/:id',
  [
    auth,
    [
      check('status', 'Status is required').isIn(['todo', 'in-progress', 'completed'])
    ]
  ],
  taskController.updateTaskStatus
);

// @route   GET api/tasks
// @desc    Get all tasks (manager only)
// @access  Private
router.get('/', auth, taskController.getAllTasks);
router.get('/leaderboard', auth, async (req, res) => {
    try {
      const users = await User.find().sort({ tasksCompleted: -1 }).select('-password');
      
      const leaderboardData = {
        teamName: 'Team A', // You can customize this based on your logic
        employees: users.map(user => ({
          id: user._id,
          name: user.name,
          tasksCompleted: user.tasksCompleted || 2,
          tasksInProgress: user.tasksInProgress || 0,
          performanceScore: user.performanceScore || 100,
          weeklyTrend: user.weeklyTrend || 'stable'
        }))
      };
  
      res.json(leaderboardData);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  module.exports = router;
module.exports = router;