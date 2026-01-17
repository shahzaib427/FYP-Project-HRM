// backend/controllers/leaveController.js
const Leave = require('../models/Leave');
const User = require('../models/User');

// Helper: Calculate working days
const calculateWorkingDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let days = 0;
  
  while (start <= end) {
    const day = start.getDay();
    if (day !== 0 && day !== 6) {
      days++;
    }
    start.setDate(start.getDate() + 1);
  }
  
  return days;
};

// Get leave balance
exports.getLeaveBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('leaveBalance');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user.leaveBalance,
      message: 'Leave balance retrieved successfully'
    });
  } catch (err) {
    console.error('Get leave balance error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Apply for leave
exports.applyLeave = async (req, res) => {
  try {
    const { type, startDate, endDate, reason, contactNumber } = req.body;
    const userId = req.user._id;
    
    // Validate required fields
    if (!type || !startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields'
      });
    }
    
    // Calculate working days
    const days = calculateWorkingDays(startDate, endDate);
    
    // Check user's leave balance
    const user = await User.findById(userId).select('leaveBalance');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if user has sufficient balance
    if (user.leaveBalance[type] < days) {
      return res.status(400).json({
        success: false,
        message: `Insufficient ${type} leave balance. Available: ${user.leaveBalance[type]} days, Requested: ${days} days`
      });
    }
    
    // Create leave request
    const leave = new Leave({
      employee: userId,
      type,
      startDate,
      endDate,
      days,
      reason,
      contactNumber: contactNumber || null,
      status: 'pending'
    });
    
    await leave.save();
    
    res.status(201).json({
      success: true,
      data: leave,
      message: 'Leave application submitted successfully'
    });
  } catch (err) {
    console.error('Apply leave error:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Server error'
    });
  }
};

// Get user's leave requests
exports.getMyLeaves = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, type, year } = req.query;
    
    // Build query
    const query = { employee: userId };
    
    if (status) {
      query.status = status;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      query.startDate = { $gte: startDate, $lte: endDate };
    }
    
    const leaves = await Leave.find(query)
      .populate('employee', 'name email department position')
      .populate('approvedBy', 'name email')
      .sort({ startDate: -1 });
    
    res.json({
      success: true,
      data: leaves,
      message: 'Leave requests retrieved successfully'
    });
  } catch (err) {
    console.error('Get my leaves error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Dummy functions for now (implement as needed)
exports.getLeaveStatistics = (req, res) => {
  res.json({ success: true, data: {}, message: 'Statistics placeholder' });
};

exports.getUpcomingLeaves = (req, res) => {
  res.json({ success: true, data: [], message: 'Upcoming leaves placeholder' });
};

exports.getLeaveById = (req, res) => {
  res.json({ success: true, data: {}, message: 'Leave details placeholder' });
};

exports.updateLeave = (req, res) => {
  res.json({ success: true, message: 'Leave updated placeholder' });
};

exports.cancelLeave = (req, res) => {
  res.json({ success: true, message: 'Leave cancelled placeholder' });
};

exports.getTeamLeaves = (req, res) => {
  res.json({ success: true, data: [], message: 'Team leaves placeholder' });
};

exports.reviewLeave = (req, res) => {
  res.json({ success: true, message: 'Leave reviewed placeholder' });
};