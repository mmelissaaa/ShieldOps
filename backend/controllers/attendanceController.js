// server/controllers/attendanceController.js
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const moment = require('moment');

// Check in for the day
exports.checkIn = async (req, res) => {
  try {
    // Check if already checked in today
    const today = moment().startOf('day');
    const existingAttendance = await Attendance.findOne({
      user: req.user.id,
      date: {
        $gte: today.toDate(),
        $lt: moment(today).endOf('day').toDate()
      }
    });

    if (existingAttendance) {
      return res.status(400).json({ msg: 'Already checked in today' });
    }

    // Create new attendance record
    const newAttendance = new Attendance({
      user: req.user.id,
      date: new Date(),
      checkIn: new Date()
    });

    await newAttendance.save();

    // Update user's streak and last active
    const user = await User.findById(req.user.id);
    
    // Check if the last active day was yesterday (to maintain streak)
    const yesterday = moment().subtract(1, 'days').startOf('day');
    const lastActive = moment(user.lastActive).startOf('day');
    
    // Check if it's a weekday (Monday-Friday)
    const isWeekday = moment().day() >= 1 && moment().day() <= 5;
    
    if (isWeekday) {
      if (lastActive.isSame(yesterday) && isWeekday) {
        // Continuing streak
        user.currentStreak += 1;
        
        // Update longest streak if current is greater
        if (user.currentStreak > user.longestStreak) {
          user.longestStreak = user.currentStreak;
        }
        
        // Add bonus points for streak milestones
        if (user.currentStreak % 5 === 0) {
          user.bonusPoints += 10; // 10 points every 5 days
        }
      } else if (!lastActive.isSame(moment().startOf('day'))) {
        // Reset streak if not consecutive day and not already checked in today
        user.currentStreak = 1;
      }
    }
    
    user.lastActive = new Date();
    await user.save();

    res.json(newAttendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Check out for the day
exports.checkOut = async (req, res) => {
  try {
    // Find today's attendance record
    const today = moment().startOf('day');
    const attendance = await Attendance.findOne({
      user: req.user.id,
      date: {
        $gte: today.toDate(),
        $lt: moment(today).endOf('day').toDate()
      }
    });

    if (!attendance) {
      return res.status(400).json({ msg: 'No check-in record found for today' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ msg: 'Already checked out today' });
    }

    // Update check-out time
    attendance.checkOut = new Date();
    await attendance.save();

    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get user attendance records
exports.getUserAttendance = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find({ user: req.user.id })
      .sort({ date: -1 });

    res.json(attendanceRecords);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all attendance records (for manager)
exports.getAllAttendance = async (req, res) => {
  try {
    // Check if user is manager
    if (req.user.role !== 'manager') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const { date } = req.query;
    let query = {};

    if (date) {
      const selectedDate = moment(date).startOf('day');
      query = {
        date: {
          $gte: selectedDate.toDate(),
          $lt: moment(selectedDate).endOf('day').toDate()
        }
      };
    }

    const attendanceRecords = await Attendance.find(query)
      .sort({ date: -1 })
      .populate('user', ['name', 'email', 'profilePicture']);

    res.json(attendanceRecords);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get attendance statistics
exports.getAttendanceStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    // Calculate weekly attendance
    const startOfWeek = moment().startOf('week');
    const endOfWeek = moment().endOf('week');
    
    const weeklyAttendance = await Attendance.countDocuments({
      user: userId,
      date: {
        $gte: startOfWeek.toDate(),
        $lte: endOfWeek.toDate()
      }
    });
    
    // Calculate monthly attendance
    const startOfMonth = moment().startOf('month');
    const endOfMonth = moment().endOf('month');
    
    const monthlyAttendance = await Attendance.countDocuments({
      user: userId,
      date: {
        $gte: startOfMonth.toDate(),
        $lte: endOfMonth.toDate()
      }
    });
    
    res.json({
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      bonusPoints: user.bonusPoints,
      weeklyAttendance,
      monthlyAttendance,
      lastActive: user.lastActive
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
