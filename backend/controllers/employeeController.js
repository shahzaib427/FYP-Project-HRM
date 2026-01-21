const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

console.log('✅✅✅ employeeController.js LOADED ✅✅✅');

// Email Configuration
const getEmailTransporter = () => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️ Email credentials not configured in .env file');
      return null;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  } catch (error) {
    console.error('❌ Email transporter creation failed:', error.message);
    return null;
  }
};

// Helper to generate random password
// HYBRID Password Generator: Memorable base + random characters
const generateHybridPassword = (email) => {
  const username = email.split('@')[0].toLowerCase();
  
  // 1. Create a memorable base (first 4-6 chars of username)
  const baseLength = 4 + crypto.randomInt(3); // Randomly choose 4, 5, or 6 characters
  let memorableBase = username.slice(0, Math.min(baseLength, username.length));
  
  // 2. Add some random uppercase for strength
  const withUppercase = memorableBase.split('').map((char, i) => {
    // First letter always uppercase, others randomly
    if (i === 0 || crypto.randomInt(3) === 0) {
      return char.toUpperCase();
    }
    return char;
  }).join('');
  
  // 3. Add random numbers (3 digits)
  const randomNumbers = crypto.randomInt(1000).toString().padStart(3, '0');
  
  // 4. Add random symbol
  const symbols = '!@#$%^&*';
  const randomSymbol = symbols[crypto.randomInt(symbols.length)];
  
  // 5. Combine: Base + Numbers + Symbol
  return `${withUppercase}${randomNumbers}${randomSymbol}`;
};

// Keep the old function name for compatibility (or change line 116)
const generateRandomPassword = (email) => {
  return generateHybridPassword(email);
};

// Helper to send welcome email
const sendWelcomeEmail = async (employeeEmail, employeeName, generatedPassword, employeeId) => {
  try {
    const transporter = getEmailTransporter();
    
    if (!transporter) {
      console.error('❌ Email transporter not available');
      return false;
    }

    // Verify connection first
    await transporter.verify();
    console.log('✅ Email server connection verified');

    const mailOptions = {
      from: `"HR System" <${process.env.EMAIL_USER}>`,
      to: employeeEmail,
      subject: 'Your Employee Account Credentials',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .credentials { background: white; border: 2px solid #dbeafe; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .password { font-family: monospace; background: #f3f4f6; padding: 10px; border-radius: 4px; font-size: 16px; letter-spacing: 1px; }
            .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to the Team!</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${employeeName}</strong>,</p>
              
              <p>Your employee account has been successfully created. Here are your login credentials:</p>
              
              <div class="credentials">
                <p><strong>Employee ID:</strong> ${employeeId}</p>
                <p><strong>Email:</strong> ${employeeEmail}</p>
                <p><strong>Temporary Password:</strong></p>
                <div class="password">${generatedPassword}</div>
              </div>
              
              <div class="warning">
                <p><strong>⚠️ Security Important:</strong></p>
                <ul>
                  <li>This is a temporary password</li>
                  <li>Change your password immediately after first login</li>
                  <li>Never share your password with anyone</li>
                  <li>This email contains sensitive information</li>
                </ul>
              </div>
              
              <p><strong>Login URL:</strong> ${process.env.FRONTEND_URL || 'http://localhost:3000'}</p>
              
              <p>If you have any issues logging in, please contact the HR department.</p>
              
              <p>Best regards,<br>
              <strong>HR Department</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${employeeEmail}, Message ID: ${info.messageId}`);
    return true;
    
  } catch (error) {
    console.error('❌ Email sending error:', error.message);
    if (error.code === 'EAUTH') {
      console.error('📌 Authentication error. Check email credentials in .env');
    }
    return false;
  }
};

// Helper for employee ID generation
const generateEmployeeId = async () => {
  try {
    const lastEmployee = await User.findOne({ 
      role: { $in: ['admin', 'hr', 'employee'] }
    }).sort({ createdAt: -1 });
    
    let lastNumber = 0;
    if (lastEmployee && lastEmployee.employeeId) {
      const match = lastEmployee.employeeId.match(/EMP(\d+)/);
      if (match) {
        lastNumber = parseInt(match[1]);
      }
    }
    
    return `EMP${(lastNumber + 1).toString().padStart(3, '0')}`;
  } catch (error) {
    return `EMP${Date.now().toString().slice(-6)}`;
  }
};

// ===== CREATE EMPLOYEE =====
exports.createEmployee = async (req, res) => {
  console.log('🚀 CREATE EMPLOYEE ENDPOINT CALLED');
  
  try {
    const { 
      name, 
      email, 
      role = 'employee', 
      department = 'General', 
      position = 'Employee', 
      phone = '', 
      isActive = true 
    } = req.body;
    
    // Validation
    if (!name || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name and email are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please enter a valid email address' 
      });
    }

    // Validate role
    if (!['admin', 'hr', 'employee'].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid role. Must be admin, hr, or employee' 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already exists' 
      });
    }

    // Generate IDs
    const employeeId = await generateEmployeeId();
    const username = email.split('@')[0];
    const generatedPassword = generateRandomPassword(email);

    // Create user
    const userData = {
      employeeId,
      name,
      username,
      email: email.toLowerCase(),
      password: generatedPassword,
      role,
      department: department || 'General',
      position: position || 'Employee',
      phone: phone || '',
      isActive: isActive !== false,
      passwordChanged: false
    };

    const user = await User.create(userData);
    console.log('✅ User created:', user._id);

    // Send email (but don't fail the whole process if email fails)
    let emailSent = false;
    let emailError = null;
    
    try {
      emailSent = await sendWelcomeEmail(
        email.toLowerCase(),
        name,
        generatedPassword,
        employeeId
      );
    } catch (emailErr) {
      console.error('⚠️ Email sending attempt failed:', emailErr.message);
      emailError = emailErr.message;
    }

    // Prepare response
    const response = {
      success: true,
      message: 'Employee created successfully',
      data: {
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        position: user.position,
        isActive: user.isActive
      }
    };

    // Add email info to response
    if (emailSent) {
      response.emailSent = true;
      response.emailMessage = 'Credentials sent to employee email';
    } else {
      response.emailSent = false;
      response.emailMessage = 'Employee created but email sending failed';
      if (emailError) {
        response.emailError = emailError;
      }
    }

    res.status(201).json(response);
    
  } catch (err) {
    console.error('❌ CREATE EMPLOYEE ERROR:', err);
    
    let errorMessage = 'Server error creating employee';
    let statusCode = 500;
    
    if (err.code === 11000) {
      errorMessage = 'Email already exists';
      statusCode = 400;
    } else if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      errorMessage = errors.join(', ');
      statusCode = 400;
    }
    
    res.status(statusCode).json({ 
      success: false, 
      error: errorMessage
    });
  }
};

// ===== GET ALL EMPLOYEES =====
exports.getAllEmployees = async (req, res) => {
  console.log('📋 GET ALL EMPLOYEES ENDPOINT CALLED');
  
  try {
    // Get query parameters
    const { department, search, status, role } = req.query;
    
    // Build filter
    let filter = { role: { $in: ['admin', 'hr', 'employee'] } };
    
    // Filter by role
    if (role && ['admin', 'hr', 'employee'].includes(role)) {
      filter.role = role;
    }
    
    // Filter by department
    if (department && department !== 'all') {
      filter.department = department;
    }
    
    // Filter by status
    if (status === 'active') {
      filter.isActive = true;
    } else if (status === 'inactive') {
      filter.isActive = false;
    }
    
    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Execute query
    const employees = await User.find(filter)
      .select('-password') // Exclude password
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${employees.length} employees`);
    
    res.status(200).json({ 
      success: true, 
      count: employees.length,
      data: employees 
    });
  } catch (err) {
    console.error('❌ Get employees error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Server error fetching employees' 
    });
  }
};

// ===== GET SINGLE EMPLOYEE =====
exports.getEmployeeById = async (req, res) => {
  console.log('📋 GET EMPLOYEE BY ID ENDPOINT CALLED:', req.params.id);
  
  try {
    const employee = await User.findById(req.params.id).select('-password');
    
    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        error: 'Employee not found' 
      });
    }
    
    console.log('✅ Employee found:', employee.employeeId);
    
    res.status(200).json({ 
      success: true, 
      data: employee 
    });
  } catch (err) {
    console.error('❌ Get employee error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Server error fetching employee' 
    });
  }
};

// ===== UPDATE EMPLOYEE =====
exports.updateEmployee = async (req, res) => {
  console.log('✏️ UPDATE EMPLOYEE ENDPOINT CALLED:', req.params.id);
  console.log('📥 Update data:', req.body);
  
  try {
    const updates = req.body;
    const employeeId = req.params.id;
    
    // Validate role if provided
    if (updates.role && !['admin', 'hr', 'employee'].includes(updates.role)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid role. Must be admin, hr, or employee' 
      });
    }
    
    // Check if email already exists (if email is being updated)
    if (updates.email) {
      const existingUser = await User.findOne({ 
        email: updates.email.toLowerCase(),
        _id: { $ne: employeeId } // Exclude current employee
      });
      
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          error: 'Email already exists' 
        });
      }
      updates.email = updates.email.toLowerCase();
    }
    
    // Update employee
    const employee = await User.findByIdAndUpdate(
      employeeId, 
      updates, 
      { 
        new: true, // Return updated document
        runValidators: true 
      }
    ).select('-password'); // Exclude password from response
    
    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        error: 'Employee not found' 
      });
    }
    
    console.log('✅ Employee updated:', employee.employeeId);
    
    res.status(200).json({ 
      success: true, 
      message: 'Employee updated successfully',
      data: employee 
    });
  } catch (err) {
    console.error('❌ Update employee error:', err);
    
    // Check for duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ 
        success: false, 
        error: `${field} already exists` 
      });
    }
    
    // Check for validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false, 
        error: errors.join(', ') 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Server error updating employee' 
    });
  }
};

// ===== DELETE EMPLOYEE =====
exports.deleteEmployee = async (req, res) => {
  console.log('🗑️ DELETE EMPLOYEE ENDPOINT CALLED:', req.params.id);
  
  try {
    const employee = await User.findByIdAndDelete(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        error: 'Employee not found' 
      });
    }
    
    console.log('✅ Employee deleted:', employee.employeeId);
    
    res.status(200).json({ 
      success: true, 
      message: 'Employee deleted successfully',
      data: {
        employeeId: employee.employeeId,
        name: employee.name
      }
    });
  } catch (err) {
    console.error('❌ Delete employee error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Server error deleting employee' 
    });
  }
};

// ===== GET MY PROFILE =====
exports.getMyProfile = async (req, res) => {
  console.log('👤 GET MY PROFILE ENDPOINT CALLED');
  
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: user 
    });
  } catch (err) {
    console.error('❌ Get profile error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Server error fetching profile' 
    });
  }
};

// ===== UPDATE MY PROFILE =====
exports.updateMyProfile = async (req, res) => {
  console.log('✏️ UPDATE MY PROFILE ENDPOINT CALLED');
  
  try {
    const updates = req.body;
    const userId = req.user.id;
    
    // Don't allow role changes via profile update
    delete updates.role;
    delete updates.isActive;
    delete updates.employeeId;
    
    // If password is being updated, handle it separately
    if (updates.password) {
      // You might want to add current password verification here
      updates.passwordChanged = true;
      updates.lastPasswordChange = new Date();
    }
    
    // Update user
    const user = await User.findByIdAndUpdate(
      userId, 
      updates, 
      { 
        new: true, // Return updated document
        runValidators: true 
      }
    ).select('-password'); // Exclude password from response
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Profile updated successfully',
      data: user 
    });
  } catch (err) {
    console.error('❌ Update profile error:', err);
    
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ 
        success: false, 
        error: `${field} already exists` 
      });
    }
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false, 
        error: errors.join(', ') 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Server error updating profile' 
    });
  }
};