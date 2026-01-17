const mongoose = require('mongoose');
const Attendance = require('../models/Attendance');

console.log('✅ Attendance model:', Attendance ? 'LOADED' : 'FAILED');

// In your attendanceController.js - checkIn function

exports.checkIn = async (req, res) => {
  try {
    const employeeId = req.user._id;
    console.log('🔍 checkIn employeeId:', employeeId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ STEP 1: Remove ANY conflicting null records FIRST
    await Attendance.deleteMany({ 
      $or: [
        { employee: null, date: today },
        { user: null, date: today }
      ]
    });

    // ✅ STEP 2: Check if already checked in
    const existing = await Attendance.findOne({ 
      employee: employeeId, 
      date: today 
    });

    if (existing && existing.checkIn) {
      return res.status(400).json({ 
        success: false, 
        message: 'Already checked in today' 
      });
    }

    // ✅ STEP 3: Safe upsert - NEVER fails
    const attendance = await Attendance.findOneAndUpdate(
      { employee: employeeId, date: today },
      {
        $setOnInsert: { 
          employee: employeeId, 
          date: today 
        },
        $set: { 
          checkIn: new Date(), 
          status: 'present' 
        }
      },
      { 
        new: true, 
        upsert: true,
        runValidators: true 
      }
    );

    console.log('✅ Check-in SUCCESS:', attendance._id);
    res.json({ 
      success: true, 
      message: 'Check-in successful', 
      data: attendance 
    });

  } catch (err) {
    console.error('❌ CHECKIN ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.checkOut = async (req, res) => {
  console.log('🚀 CHECKOUT ROUTE HIT!');  // ← FIRST LOG
  
  try {
    const employeeId = req.user._id;
    console.log('🔍 checkOut employeeId:', employeeId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log('📅 Today date:', today);

    const attendance = await Attendance.findOne({
      employee: employeeId,
      date: today
    });
    console.log('🔍 Found attendance:', !!attendance);

    if (!attendance || !attendance.checkIn) {
      console.log('❌ No check-in found');
      return res.status(400).json({ 
        success: false, 
        message: 'Check-in required first' 
      });
    }

    if (attendance.checkOut) {
      console.log('❌ Already checked out');
      return res.status(400).json({ 
        success: false, 
        message: 'Already checked out today' 
      });
    }

    const checkOutTime = new Date();
    const totalHours = (checkOutTime - new Date(attendance.checkIn)) / (1000 * 60 * 60);
    
    attendance.checkOut = checkOutTime;
    attendance.totalHours = Math.round(totalHours * 100) / 100;
    attendance.status = totalHours >= 8 ? 'present' : 'half-day';

    await attendance.save();
    
    console.log('✅ Check-out SUCCESS:', attendance._id);
    res.json({ 
      success: true, 
      message: 'Check-out successful', 
      data: attendance 
    });

  } catch (error) {
    console.error('❌ CHECKOUT ERROR:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.getMyAttendance = async (req, res) => {
  try {
    const employeeId = req.user._id;
    console.log('🔍 getMyAttendance employeeId:', employeeId);

    // ✅ FIXED: Only populate 'employee' (matches your schema)
    const attendance = await Attendance.find({ 
      $or: [
        { employee: employeeId },
        { user: employeeId }  // Legacy field support
      ]
    })
    .sort({ date: -1 })
    .limit(30)
    // ✅ ONLY populate 'employee' field that exists in schema
    .populate('employee', 'name email');  // Remove .populate('user')

    console.log('✅ Found records:', attendance.length);
    res.json({ success: true, data: attendance });
  } catch (error) {
    console.error('❌ getMyAttendance ERROR:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};


