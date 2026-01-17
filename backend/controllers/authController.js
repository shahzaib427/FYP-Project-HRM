const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// ===== REGISTER =====
// ===== REGISTER =====
exports.register = async (req, res) => {
  try {
    // Accept fullName from frontend and map to name
    let { fullName, username, email, password, role } = req.body;
    const name = fullName; // map fullName to name

    // Validation
    if (!name || !username || !email || !password) {
      return res.status(400).json({ success: false, error: 'Full name, username, email, and password are required' });
    }

    role = role || 'employee';
    if (!['admin', 'hr', 'employee'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role' });
    }

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email or username already exists' });
    }

    // CREATE USER — no manual hashing, schema pre('save') will hash password
    const user = await User.create({
      employeeId: uuidv4(),
      name,
      username,
      email,
      password, // raw password, will be hashed in schema
      role
    });

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    // Send response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { id: user._id, employeeId: user.employeeId, name, username, email, role },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error during registration' });
  }
};

// ===== LOGIN =====
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, error: 'Email and password are required' });

    email = email.toLowerCase().trim();
    const user = await User.findOne({ email }).select('+password');

    if (!user) return res.status(401).json({ success: false, error: 'Invalid email or password' });
    if (!user.isActive) return res.status(403).json({ success: false, error: 'Account is deactivated' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, error: 'Invalid email or password' });

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error during login' });
  }
};
