// server/controllers/messageController.js
const Message = require('../models/Message');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Send a new message
exports.sendMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { content, receiver, isGlobal } = req.body;

    // Validate receiver if not global message
    if (!isGlobal && !receiver) {
      return res.status(400).json({ msg: 'Receiver ID is required for non-global messages' });
    }

    if (!isGlobal) {
      // Check if receiver exists
      const receiverUser = await User.findById(receiver);
      if (!receiverUser) {
        return res.status(404).json({ msg: 'Receiver not found' });
      }
    }

    const newMessage = new Message({
      sender: req.user.id,
      receiver: isGlobal ? null : receiver,
      content,
      isGlobal
    });

    const message = await newMessage.save();

    // Populate sender data
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', ['name', 'email', 'profilePicture', 'role']);
    
    if (!isGlobal) {
      populatedMessage.populate('receiver', ['name', 'email', 'profilePicture', 'role']);
    }

    res.json(populatedMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get messages for current user
exports.getUserMessages = async (req, res) => {
  try {
    // Get messages where user is either sender or receiver
    const messages = await Message.find({
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ],
      isGlobal: false
    })
    .sort({ createdAt: -1 })
    .populate('sender', ['name', 'email', 'profilePicture', 'role'])
    .populate('receiver', ['name', 'email', 'profilePicture', 'role']);
    
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get global messages
exports.getGlobalMessages = async (req, res) => {
  try {
    const messages = await Message.find({ isGlobal: true })
      .sort({ createdAt: -1 })
      .populate('sender', ['name', 'email', 'profilePicture', 'role']);
    
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get conversation with specific user
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const otherUser = await User.findById(userId);
    if (!otherUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Get messages between current user and specified user
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id }
      ],
      isGlobal: false
    })
    .sort({ createdAt: -1 })
    .populate('sender', ['name', 'email', 'profilePicture', 'role'])
    .populate('receiver', ['name', 'email', 'profilePicture', 'role']);
    
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Mark message as read
// server/controllers/messageController.js (continuing)
// Mark message as read
exports.markAsRead = async (req, res) => {
    try {
      const { id } = req.params;
  
      const message = await Message.findById(id);
      
      if (!message) {
        return res.status(404).json({ msg: 'Message not found' });
      }
  
      // Check if user is the receiver
      if (message.receiver && message.receiver.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Not authorized to mark this message as read' });
      }
  
      message.isRead = true;
      await message.save();
  
      res.json({ success: true });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };