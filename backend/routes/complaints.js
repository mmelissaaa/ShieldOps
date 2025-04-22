// server/routes/complaints.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const complaintController = require('../controllers/complaintController');

// @route   POST api/complaints
// @desc    Create a new complaint
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty()
    ]
  ],
  complaintController.createComplaint
);

// @route   GET api/complaints/me
// @desc    Get complaints submitted by current user
// @access  Private
router.get('/me', auth, complaintController.getUserComplaints);

// @route   GET api/complaints
// @desc    Get all complaints (manager only)
// @access  Private
router.get('/', auth, complaintController.getAllComplaints);

// @route   POST api/complaints/:id/comment
// @desc    Add comment to complaint
// @access  Private
router.post(
  '/:id/comment',
  [
    auth,
    [
      check('text', 'Comment text is required').not().isEmpty()
    ]
  ],
  complaintController.addComment
);

// @route   PUT api/complaints/:id/status
// @desc    Update complaint status (manager only)
// @access  Private
router.put(
  '/:id/status',
  [
    auth,
    [
      check('status', 'Status is required').isIn(['open', 'in-review', 'resolved', 'closed'])
    ]
  ],
  complaintController.updateComplaintStatus
);

module.exports = router;