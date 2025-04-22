// server/routes/leaves.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const leaveController = require('../controllers/leaveController');
const auth = require('../middleware/auth');

// @route   POST api/leaves
// @desc    Create a leave request
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('fromDate', 'From date is required').not().isEmpty(),
      check('toDate', 'To date is required').not().isEmpty(),
      check('reason', 'Reason is required').not().isEmpty()
    ]
  ],
  leaveController.createLeave
);

// @route   GET api/leaves/me
// @desc    Get all leave requests for current user
// @access  Private
router.get('/me', auth, leaveController.getUserLeaves);

// @route   GET api/leaves
// @desc    Get all leave requests (for manager)
// @access  Private
router.get('/', auth, leaveController.getAllLeaves);

// @route   PUT api/leaves/status
// @desc    Update leave status (approve/reject)
// @access  Private (Manager only)
router.put(
  '/status',
  [
    auth,
    [
      check('leaveId', 'Leave ID is required').not().isEmpty(),
      check('status', 'Status is required').isIn(['approved', 'rejected'])
    ]
  ],
  leaveController.updateLeaveStatus
);

module.exports = router;