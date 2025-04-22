// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
app.use(express.json({ extended: false }));

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leaves', require('./routes/leaves'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/users', require('./routes/users'));

// Auto logout middleware - to be used on frontend
app.use('/api/check-session', (req, res) => {
  const lastActive = req.header('last-active');
  const currentTime = new Date().getTime();
  const inactiveTime = currentTime - lastActive;
  
  // Check if inactive for more than 30 minutes (1800000 ms)
  if (inactiveTime > 1800000) {
    return res.status(401).json({ msg: 'Session expired due to inactivity' });
  }
  
  res.json({ valid: true });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));