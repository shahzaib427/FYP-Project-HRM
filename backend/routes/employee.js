// routes/employee.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { protect, authorize } = require('../utils/authMiddleware');

console.log('✅✅✅ EMPLOYEE ROUTES LOADED ✅✅✅');

// Apply authentication to all routes
router.use(protect);

// ===== ADMIN/HR ROUTES =====
router.get('/', authorize('admin', 'hr'), employeeController.getAllEmployees);
router.get('/:id', authorize('admin', 'hr'), employeeController.getEmployeeById);
router.post('/', authorize('admin'), employeeController.createEmployee);
router.put('/:id', authorize('admin'), employeeController.updateEmployee);
router.delete('/:id', authorize('admin'), employeeController.deleteEmployee);

// ===== EMPLOYEE SELF-SERVICE ROUTES =====
// Remove these routes for now since we don't have the controller functions
// router.get('/profile/me', employeeController.getMyProfile);
// router.put('/profile/me', employeeController.updateMyProfile);

// Instead, add a simple profile route if needed
router.get('/profile/me', (req, res) => {
  res.json({
    success: true,
    message: 'Profile route - implement getMyProfile in controller',
    user: req.user
  });
});

router.put('/profile/me', (req, res) => {
  res.json({
    success: true,
    message: 'Profile update route - implement updateMyProfile in controller'
  });
});

module.exports = router;