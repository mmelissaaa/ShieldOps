// server/routes/attendance.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const attendanceController = require('../controllers/attendanceController');

// @route   POST api/attendance/check-in
// @desc    Check in for the day
// @access  Private
router.post('/check-in', auth, attendanceController.checkIn);

// @route   POST api/attendance/check-out
// @desc    Check out for the day
// @access  Private
router.post('/check-out', auth, attendanceController.checkOut);

// @route   GET api/attendance/me
// @desc    Get current user's attendance records
// @access  Private
router.get('/me', auth, attendanceController.getUserAttendance);

// @route   GET api/attendance
// @desc    Get all attendance records (for manager)
// @access  Private
router.get('/', auth, attendanceController.getAllAttendance);

// @route   GET api/attendance/stats
// @desc    Get attendance statistics
// @access  Private
router.get('/stats', auth, attendanceController.getAttendanceStats);

module.exports = router;