const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  console.log('🔐 CHECKING TOKEN:', req.headers.authorization?.substring(0, 50) + '...');

  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, error: 'No token' });
    }

    // ✅ FIXED: Your login uses decoded.id - this matches!
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔓 DECODED:', { id: decoded.id, role: decoded.role });

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    req.user = user;
    console.log('✅ AUTH OK:', user.role);
    next();
  } catch (err) {
    console.error('❌ AUTH ERROR:', err.name, err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Token expired - LOGIN AGAIN' });
    }
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, error: 'Access denied' });
  }
  next();
};

module.exports = { protect, authorize };
