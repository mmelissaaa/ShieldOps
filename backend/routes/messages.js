// server/routes/messages.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const messageController = require('../controllers/messageController');

// @route   POST api/messages
// @desc    Send a new message
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('content', 'Message content is required').not().isEmpty(),
      check('isGlobal', 'isGlobal flag is required').isBoolean()
    ]
  ],
  messageController.sendMessage
);

// @route   GET api/messages
// @desc    Get messages for current user
// @access  Private
router.get('/', auth, messageController.getUserMessages);

// @route   GET api/messages/global
// @desc    Get global messages
// @access  Private
router.get('/global', auth, messageController.getGlobalMessages);

// @route   GET api/messages/conversation/:userId
// @desc    Get conversation with specific user
// @access  Private
router.get('/conversation/:userId', auth, messageController.getConversation);

// @route   PUT api/messages/read/:id
// @desc    Mark message as read
// @access  Private
router.put('/read/:id', auth, messageController.markAsRead);

module.exports = router;