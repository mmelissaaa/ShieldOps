
// server/controllers/leaveController.js
const Leave = require('../models/Leave');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
// Create a leave request
// exports.createLeave = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { fromDate, toDate, reason } = req.body;

//   try {
//     const newLeave = new Leave({
//       user: req.user.id,
//       fromDate,
//       toDate,
//       reason
//     });

//     const leave = await newLeave.save();
    
//     // Populate user data
//     const populatedLeave = await Leave.findById(leave._id)
//       .populate('user', ['name', 'email', 'profilePicture']);

//     res.json(populatedLeave);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };
exports.createLeave = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { fromDate, toDate, reason } = req.body;
  
    try {
      // Create the leave request
      const newLeave = new Leave({
        user: req.user.id,
        fromDate,
        toDate,
        reason
      });
  
      const leave = await newLeave.save();
  
      // Populate user data
      const populatedLeave = await Leave.findById(leave._id)
        .populate('user', ['name', 'email', 'profilePicture']);
  
      // Generate PDF
      const pdfBytes = await generateLeavePDF(populatedLeave);
  
      // Save PDF to uploads folder
      const uploadsDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
  
      const pdfFileName = `leave_request_${leave._id}.pdf`;
      const pdfFilePath = path.join(uploadsDir, pdfFileName);
      fs.writeFileSync(pdfFilePath, pdfBytes);
  
      // Update leave request with PDF file path
      leave.pdfPath = `/uploads/${pdfFileName}`;
      await leave.save();
  
      res.json(populatedLeave);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  
  // Function to generate a PDF
  const generateLeavePDF = async (leave) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 24;
  
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
    page.drawText(`Leave Request`, {
      x: 50,
      y: height - 50,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  
    page.drawText(`Name: ${leave.user.name}`, {
      x: 50,
      y: height - 100,
      size: 18,
      font,
      color: rgb(0, 0, 0),
    });
  
    page.drawText(`From: ${new Date(leave.fromDate).toLocaleDateString()}`, {
      x: 50,
      y: height - 150,
      size: 18,
      font,
      color: rgb(0, 0, 0),
    });
  
    page.drawText(`To: ${new Date(leave.toDate).toLocaleDateString()}`, {
      x: 50,
      y: height - 200,
      size: 18,
      font,
      color: rgb(0, 0, 0),
    });
  
    page.drawText(`Reason: ${leave.reason}`, {
      x: 50,
      y: height - 250,
      size: 18,
      font,
      color: rgb(0, 0, 0),
    });
  
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  };

// Get all leave requests for a user
exports.getUserLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('reviewedBy', ['name']);
    
    res.json(leaves);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all leave requests (for manager)
exports.getAllLeaves = async (req, res) => {
  try {
    // Check if user is manager
    if (req.user.role !== 'manager') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const leaves = await Leave.find()
      .sort({ createdAt: -1 })
      .populate('user', ['name', 'email', 'profilePicture'])
      .populate('reviewedBy', ['name']);
    
    res.json(leaves);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update leave status (approve/reject)
exports.updateLeaveStatus = async (req, res) => {
  try {
    // Check if user is manager
    if (req.user.role !== 'manager') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const { leaveId, status } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const leave = await Leave.findById(leaveId);
    
    if (!leave) {
      return res.status(404).json({ msg: 'Leave request not found' });
    }

    // Update leave status
    leave.status = status;
    leave.reviewedBy = req.user.id;
    leave.reviewDate = Date.now();

    await leave.save();

    // Return updated leave with populated fields
    const updatedLeave = await Leave.findById(leaveId)
      .populate('user', ['name', 'email', 'profilePicture'])
      .populate('reviewedBy', ['name']);

    res.json(updatedLeave);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};