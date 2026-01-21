const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

// Import routes
const recruitmentRoutes = require('./routes/recruitmentRoutes');
const publicRoutes = require('./routes/publicRoutes');
const uploadRoutes = require('./routes/upload'); // File is upload.js

const app = express();

// ===== Middleware =====
app.use(cors({ 
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'], 
  credentials: true 
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ===== Routes =====
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employee'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/leave', require('./routes/leave'));
app.use('/api/admin/payroll', require('./routes/adminPayroll'));
app.use('/api/employee/payroll', require('./routes/employeePayroll'));
app.use('/api/recruitment', recruitmentRoutes); // Recruitment routes
app.use('/api/public', publicRoutes);
app.use('/api/upload', uploadRoutes); // Use uploadRoutes (not upload)

// ===== Health Check =====
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HRM System API is running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    routes: [
      '/api/auth/*',
      '/api/employees/*',
      '/api/attendance/*',
      '/api/leave/*',
      '/api/admin/payroll/*',
      '/api/employee/payroll/*',
      '/api/recruitment/*',
      '/api/upload/*' // 👈 ADD THIS TO HEALTH CHECK
    ]
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
      '/api/auth/*',
      '/api/employees/*',
      '/api/attendance/*',
      '/api/leave/*',
      '/api/admin/payroll/*',
      '/api/employee/payroll/*',
      '/api/recruitment/*',
      '/api/upload/*' // 👈 ADD THIS
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
  console.log(`   👤 Employee Payroll: http://localhost:${PORT}/api/employee/payroll/dashboard`);
  console.log(`   👑 Admin Payroll: http://localhost:${PORT}/api/admin/payroll`);
  console.log(`   👥 Employee Management: http://localhost:${PORT}/api/employees`);
  console.log(`   📋 Recruitment: http://localhost:${PORT}/api/recruitment/*`);
  console.log(`   📁 File Upload: http://localhost:${PORT}/api/upload/*`); // 👈 ADD THIS
});