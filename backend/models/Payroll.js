const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  // ✅ CHANGE FROM 'Employee' TO 'User' (since you use User model for employees)
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  month: { type: String, required: true },
  year: { type: Number, required: true },
  
  // Earnings
  basicSalary: Number,
  hra: Number,
  da: Number,
  conveyance: Number,
  medicalAllowance: Number,
  specialAllowance: Number,
  overtimeHours: Number,
  totalHoursWorked: Number,
  grossSalary: Number,
  
  // Deductions
  tds: Number,
  pf: Number,
  professionalTax: Number,
  totalDeductions: Number,
  
  // Net Pay
  netSalary: Number,
  
  // Attendance
  attendanceDays: Number,
  workingDays: Number,
  
  // Status
  status: { type: String, enum: ['Draft', 'Generated', 'Approved', 'Processed', 'Cancelled'], default: 'Draft' },
  paymentStatus: { type: String, enum: ['Pending', 'Partially Paid', 'Paid'], default: 'Pending' },
  transactionId: String,
  paidAt: Date,
  
  // Metadata
  notes: String,
  
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Payroll', payrollSchema);