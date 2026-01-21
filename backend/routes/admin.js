// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const auth = require('../utils/authMiddleware');
const adminAuth = require('../utils/adminAuth');

// Get admin profile
router.get('/profile', auth, adminAuth, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id)
      .select('-password')
      .lean();
    
    res.json({
      success: true,
      data: admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update admin profile
router.put('/profile', auth, adminAuth, async (req, res) => {
  try {
    const { name, email, phone, department } = req.body;
    
    const admin = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { name, email, phone, department } },
      { new: true }
    ).select('-password');
    
    res.json({
      success: true,
      data: admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Change password
router.put('/change-password', auth, adminAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const admin = await User.findById(req.user.id);
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    await admin.save();
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

// Toggle 2FA
router.post('/toggle-2fa', auth, adminAuth, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    admin.twoFactorEnabled = !admin.twoFactorEnabled;
    await admin.save();
    
    res.json({
      success: true,
      twoFactorEnabled: admin.twoFactorEnabled,
      message: admin.twoFactorEnabled 
        ? 'Two-factor authentication enabled' 
        : 'Two-factor authentication disabled'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update 2FA settings'
    });
  }
});

// Get system statistics
router.get('/system-stats', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    
    // You might want to track active sessions differently
    const activeSessions = 12; // Replace with actual session tracking
    
    res.json({
      success: true,
      data: {
        totalUsers,
        totalEmployees,
        activeSessions,
        uptime: '99.8%',
        dbSize: '2.4 GB',
        userChange: '+12%',
        sessionChange: '-3'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system stats'
    });
  }
});

// Update notification preferences
router.put('/notifications', auth, adminAuth, async (req, res) => {
  try {
    const { preferences } = req.body;
    
    const admin = await User.findByIdAndUpdate(
      req.user.id,
      { 
        $set: { 
          'preferences.notifications': preferences 
        } 
      },
      { new: true }
    );
    
    res.json({
      success: true,
      message: 'Notification preferences updated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update notifications'
    });
  }
});

// Run system backup
router.post('/backup', auth, adminAuth, async (req, res) => {
  try {
    // Implement your backup logic here
    // This is just a placeholder
    
    // Simulate backup process
    setTimeout(() => {
      res.json({
        success: true,
        message: 'Backup completed successfully',
        backupId: 'backup_' + Date.now()
      });
    }, 2000);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Backup failed'
    });
  }
});

module.exports = router;