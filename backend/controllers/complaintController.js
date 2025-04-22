const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Create a new complaint
exports.createComplaint = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description } = req.body;

    const newComplaint = new Complaint({
      title,
      description,
      submittedBy: req.user.id
    });

    const complaint = await newComplaint.save();

    // Populate user data
    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('submittedBy', ['name', 'email', 'profilePicture'])
      .populate('comments.user', ['name', 'email', 'profilePicture', 'role']);

    res.json(populatedComplaint);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get complaints submitted by current user
exports.getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ submittedBy: req.user.id })
      .sort({ createdAt: -1 })
      .populate('submittedBy', ['name', 'email', 'profilePicture'])
      .populate('comments.user', ['name', 'email', 'profilePicture', 'role']);
    
    res.json(complaints);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all complaints (manager only)
exports.getAllComplaints = async (req, res) => {
  try {
    // Check if user is manager
    if (req.user.role !== 'manager') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const complaints = await Complaint.find()
      .sort({ updatedAt: -1 })
      .populate('submittedBy', ['name', 'email', 'profilePicture'])
      .populate('comments.user', ['name', 'email', 'profilePicture', 'role']);
    
    res.json(complaints);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Add comment to complaint
exports.addComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { text } = req.body;

    const complaint = await Complaint.findById(id);
    
    if (!complaint) {
      return res.status(404).json({ msg: 'Complaint not found' });
    }

    // Check if user is authorized (either the submitter or a manager)
    if (complaint.submittedBy.toString() !== req.user.id && req.user.role !== 'manager') {
      return res.status(403).json({ msg: 'Not authorized to comment on this complaint' });
    }

    // Add new comment
    complaint.comments.push({
      user: req.user.id,
      text
    });

    // Update the updatedAt timestamp
    complaint.updatedAt = new Date();

    await complaint.save();

    // Return updated complaint with populated fields
    const updatedComplaint = await Complaint.findById(id)
      .populate('submittedBy', ['name', 'email', 'profilePicture'])
      .populate('comments.user', ['name', 'email', 'profilePicture', 'role']);

    res.json(updatedComplaint);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update complaint status (manager only)
exports.updateComplaintStatus = async (req, res) => {
  try {
    // Check if user is manager
    if (req.user.role !== 'manager') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const complaint = await Complaint.findById(id);
    
    if (!complaint) {
      return res.status(404).json({ msg: 'Complaint not found' });
    }

    // Update complaint status
    complaint.status = status;
    complaint.updatedAt = new Date();

    await complaint.save();

    // Return updated complaint with populated fields
    const updatedComplaint = await Complaint.findById(id)
      .populate('submittedBy', ['name', 'email', 'profilePicture'])
      .populate('comments.user', ['name', 'email', 'profilePicture', 'role']);

    res.json(updatedComplaint);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};