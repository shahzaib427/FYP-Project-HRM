const express = require('express');
const router = express.Router();
const adminPayrollController = require('../controllers/adminPayrollController');
const { protect, authorize } = require('../utils/authMiddleware');

router.use(protect);
router.use(authorize('admin', 'hr'));

// ✅ FIXED: Remove /payroll prefix - matches frontend calls
router.get('/', adminPayrollController.getAllPayroll);                    // /api/admin/payroll
router.get('/stats', adminPayrollController.getPayrollStats);             // /api/admin/payroll/stats
router.get('/months-years', adminPayrollController.getPayrollMonthsYears);// /api/admin/payroll/months-years
router.get('/employees', adminPayrollController.getEmployeesForPayroll);  // /api/admin/payroll/employees
router.post('/generate', adminPayrollController.generatePayroll);         // /api/admin/payroll/generate
router.post('/bulk-generate', adminPayrollController.bulkGeneratePayroll);
router.put('/:id', adminPayrollController.updatePayroll);                 // ADD THIS
router.patch('/:id/status', adminPayrollController.updatePayrollStatus);
router.delete('/:id', adminPayrollController.deletePayroll);
router.get('/payslip/:id', adminPayrollController.generatePayslip);
router.post('/manual-create', adminPayrollController.createManualPayroll);

module.exports = router;
