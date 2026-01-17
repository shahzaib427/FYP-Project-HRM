const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getRecentActivities,
  getDepartmentStats,
  getAttendanceOverview
} = require('../controllers/dashboardController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

// Dashboard routes
router.get('/stats', getDashboardStats);
router.get('/activities', getRecentActivities);
router.get('/departments', getDepartmentStats);
router.get('/attendance-overview', getAttendanceOverview);

module.exports = router;