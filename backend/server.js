// server.js - FIXED ROUTES
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ===== Middleware =====
app.use(cors({ 
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'], 
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hrm_system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ===== Routes =====
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employee')); // This should match your filename
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/leave', require('./routes/leave'));
app.use('/api/admin/payroll', require('./routes/adminPayroll'));
app.use('/api/employee/payroll', require('./routes/employeePayroll'));

// ===== Health Check =====
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HRM System API is running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    routes: [
      '/api/auth/*',
      '/api/employees/*', // ✅ This route should work
      '/api/attendance/*',
      '/api/leave/*',
      '/api/admin/payroll/*',
      '/api/employee/payroll/*'
    ]
  });
});

// ===== Test Route =====
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// ===== 404 Handler =====
app.use('*', (req, res) => {
  console.log(`❌ 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    success: false, 
    error: `Route not found: ${req.originalUrl}`,
    availableRoutes: [
      '/api/health',
      '/api/test',
      '/api/auth/*',
      '/api/employees/*', // ✅ Should be working
      '/api/attendance/*',
      '/api/leave/*',
      '/api/admin/payroll/*',
      '/api/employee/payroll/*'
    ]
  });
});

// ===== Error Handler =====
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(err.status || 500).json({ 
    success: false, 
    error: err.message || 'Internal server error'
  });
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Available Routes:`);
  console.log(`   🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`   🔗 Test Route: http://localhost:${PORT}/api/test`);
  console.log(`   👤 Employee Payroll: http://localhost:${PORT}/api/employee/payroll/dashboard`);
  console.log(`   👑 Admin Payroll: http://localhost:${PORT}/api/admin/payroll`);
  console.log(`   👥 Employee Management: http://localhost:${PORT}/api/employees`); // ✅ Added
});