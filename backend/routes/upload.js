const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Add this
const { protect } = require('../utils/authMiddleware');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/profiles/';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log('📁 Created directory:', uploadPath);
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Error: Images only!'));
    }
  }
});

// Upload profile picture
router.post('/profile', protect, upload.single('profilePicture'), (req, res) => {
  console.log('📤 UPLOAD ROUTE HIT - /api/upload/profile');
  console.log('File received:', req.file ? 'Yes' : 'No');
  
  try {
    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }
    
    console.log('File details:', {
      originalname: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path
    });
    
    // Check if file was actually saved
    if (!fs.existsSync(req.file.path)) {
      console.log('❌ File not saved at path:', req.file.path);
      return res.status(500).json({
        success: false,
        error: 'File was not saved on server'
      });
    }
    
    // Return file path
    const filePath = `/uploads/profiles/${req.file.filename}`;
    
    console.log('✅ File uploaded successfully:', filePath);
    
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      filePath: filePath,
      fileName: req.file.filename
    });
    
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'File upload failed: ' + error.message 
    });
  }
});

module.exports = router;