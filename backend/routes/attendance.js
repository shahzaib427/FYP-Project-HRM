const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../utils/authMiddleware');

// Employee Controllers
const {
  checkIn,
  checkOut,
  getMyAttendance
} = require('../controllers/attendanceController');

// 🔐 EMPLOYEE ROUTES (JWT REQUIRED)
router.post('/checkin', protect, checkIn);
router.post('/checkout', protect, checkOut);
router.get('/my-attendance', protect, getMyAttendance);

// Admin Controllers
const {
  getAllAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance
} = require('../controllers/adminAttendanceController');

// 🔐 ADMIN ROUTES
router.get('/', protect, authorize('admin', 'hr'), getAllAttendance);
router.post('/', protect, authorize('admin', 'hr'), createAttendance);
router.put('/:id', protect, authorize('admin', 'hr'), updateAttendance);
router.delete('/:id', protect, authorize('admin', 'hr'), deleteAttendance);

module.exports = router;
