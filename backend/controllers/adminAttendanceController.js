const Attendance = require('../models/Attendance');

const getAllAttendance = async (req, res) => {
  try {
    const { page = 1, limit = 50, employeeId, dateFrom, dateTo } = req.query;
    
    const query = {};
    if (employeeId) query.employee = employeeId;  // ✅ FIXED: employee
    if (dateFrom) query.date = { $gte: new Date(dateFrom) };
    if (dateTo) {
      query.date = query.date || {};
      query.date.$lte = new Date(dateTo);
    }

    const attendance = await Attendance.find(query)
      .populate('employee', 'name email department')  // ✅ FIXED: employee
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ date: -1 });

    const total = await Attendance.countDocuments(query);
    
    res.json({
      success: true,
      data: attendance,
      pagination: { 
        page: parseInt(page), 
        limit: parseInt(limit), 
        total, 
        pages: Math.ceil(total / parseInt(limit)) 
      }
    });
  } catch (error) {
    console.error('❌ Admin attendance error:', error);
    res.status(500).json({ error: error.message });
  }
};

const createAttendance = async (req, res) => {
  try {
    const attendance = new Attendance(req.body);
    await attendance.save();
    await attendance.populate('employee');
    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    ).populate('employee');
    
    if (!attendance) {
      return res.status(404).json({ error: 'Attendance not found' });
    }
    res.json({ success: true, data: attendance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) {
      return res.status(404).json({ error: 'Attendance not found' });
    }
    res.json({ success: true, message: 'Attendance deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { 
  getAllAttendance, 
  createAttendance, 
  updateAttendance, 
  deleteAttendance 
};
