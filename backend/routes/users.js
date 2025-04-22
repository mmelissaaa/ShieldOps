// server/routes/users.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

// @route   GET api/users
// @desc    Get all users
// @access  Private
router.get('/', auth, userController.getAllUsers);

// @route   PUT api/users/active
// @desc    Update user's last active timestamp
// @access  Private
router.put('/active', auth, userController.updateLastActive);
router.get('/manager', auth, async (req, res) => {
    try {
      // Check if user is manager
      if (req.user.role !== 'manager') {
        return res.status(403).json({ msg: 'Not authorized' });
      }
  
      const users = await User.find().select('-password'); // Exclude passwords
      res.json(users);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
module.exports = router;