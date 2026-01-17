const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  employeeId: { 
    type: String, 
    unique: true,
    default: function() {
      // Generate a simple ID like EMP001
      return `EMP${Math.floor(100 + Math.random() * 900)}`;
    }
  },
  name: { 
    type: String, 
    required: [true, 'Name is required'], 
    trim: true 
  },
  username: { 
    type: String, 
    unique: true,
    sparse: true, // Makes it optional while still unique
    trim: true, 
    lowercase: true 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    trim: true, 
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false 
  },
  role: { 
    type: String, 
    enum: ['admin', 'hr', 'employee'], 
    default: 'employee' 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastLogin: Date,
  department: { 
    type: String, 
    default: 'General' 
  },
  position: { 
    type: String, 
    default: 'Employee' 
  },
  salary: { 
    type: Number, 
    default: 0,
    min: [0, 'Salary cannot be negative']
  },
  phone: { 
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        const digits = v.replace(/\D/g, '');
        return digits.length >= 10 && digits.length <= 15;
      },
      message: 'Phone number must be 10-15 digits'
    }
  },
  joiningDate: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true 
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    // If username is not provided, generate from email
    if (!this.username) {
      this.username = this.email.split('@')[0];
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;