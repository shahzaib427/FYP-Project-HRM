const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  employeeId: { 
    type: String, 
    unique: true,
    default: function() {
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
    sparse: true,
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
  
  // Password Management
  passwordChanged: { 
    type: Boolean, 
    default: false 
  },
  lastPasswordChange: { 
    type: Date, 
    default: null 
  },
  passwordExpiryDate: {
    type: Date,
    default: function() {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 90);
      return expiry;
    }
  },
  passwordHistory: [{
    password: { type: String, required: true },
    changedAt: { type: Date, default: Date.now }
  }],
  temporaryPassword: {
    type: Boolean,
    default: true
  },
  
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  },
  
  department: { 
    type: String, 
    default: 'General' 
  },
  position: { 
    type: String, 
    default: 'Employee' 
  },
  
  // ✅ UPDATED SALARY FIELDS
  salary: { 
    type: Number, 
    default: 0,
    min: [0, 'Salary cannot be negative']
  },
  currency: {
    type: String,
    default: 'PKR',
    enum: ['PKR', 'USD', 'EUR', 'GBP', 'INR'],
    trim: true
  },
  salaryFrequency: {
    type: String,
    default: 'monthly',
    enum: ['hourly', 'daily', 'weekly', 'monthly', 'annually'],
    trim: true
  },
  
  phone: { 
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true;
        const digits = v.replace(/\D/g, '');
        return digits.length >= 10 && digits.length <= 15;
      },
      message: 'Phone number must be 10-15 digits'
    }
  },
  joiningDate: { 
    type: Date, 
    default: Date.now 
  },
  idCardNumber: {
  type: String,
  default: '',
  trim: true
},
  // Email notification tracking
  welcomeEmailSent: {
    type: Boolean,
    default: false
  },
  welcomeEmailSentAt: {
    type: Date,
    default: null
  },
  emailNotificationPreferences: {
    type: Map,
    of: Boolean,
    default: {
      passwordReset: true,
      accountUpdates: true,
      securityAlerts: true
    }
  },
  
  // Profile information
  profilePicture: {
    type: String,
    default: ''
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  
  // Emergency contact
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field for full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Virtual field for account age
userSchema.virtual('accountAgeDays').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = Math.abs(now - created);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual field to check if password is expired
userSchema.virtual('isPasswordExpired').get(function() {
  if (!this.passwordExpiryDate) return false;
  return new Date() > this.passwordExpiryDate;
});

// Virtual field to check if account is locked
userSchema.virtual('isLocked').get(function() {
  return this.lockUntil && this.lockUntil > new Date();
});

// ✅ ADD SIMPLE SALARY VIRTUAL FIELD
userSchema.virtual('formattedSalary').get(function() {
  if (!this.salary || this.salary <= 0) return 'Not Set';
  
  const currencySymbols = {
    'PKR': '₨',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'INR': '₹'
  };
  
  const symbol = currencySymbols[this.currency] || this.currency;
  const formattedAmount = this.salary.toLocaleString();
  
  return `${symbol}${formattedAmount} per ${this.salaryFrequency}`;
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.username) {
    this.username = this.email.split('@')[0];
  }
  
  if (!this.isModified('password')) return next();
  
  try {
    if (this.isNew || this.isModified('password')) {
      if (this.passwordHistory.length >= 5) {
        this.passwordHistory.shift();
      }
      
      this.passwordHistory.push({
        password: this.password,
        changedAt: new Date()
      });
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    this.passwordChanged = true;
    this.lastPasswordChange = new Date();
    this.temporaryPassword = false;
    
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 90);
    this.passwordExpiryDate = expiry;
    
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  if (this.isLocked) {
    return false;
  }
  
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  
  if (!isMatch) {
    this.loginAttempts += 1;
    
    if (this.loginAttempts >= 5) {
      this.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
    }
    
    await this.save();
  } else {
    this.loginAttempts = 0;
    this.lockUntil = null;
    this.lastLogin = new Date();
    await this.save();
  }
  
  return isMatch;
};

// Method to check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.lastPasswordChange) {
    const changedTimestamp = parseInt(
      this.lastPasswordChange.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Method to generate random password
userSchema.statics.generateRandomPassword = function(length = 12) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
  password += '0123456789'[Math.floor(Math.random() * 10)];
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)];
  
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Method to mark welcome email as sent
userSchema.methods.markWelcomeEmailSent = async function() {
  this.welcomeEmailSent = true;
  this.welcomeEmailSentAt = new Date();
  return await this.save();
};

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ employeeId: 1 });
userSchema.index({ role: 1 });
userSchema.index({ department: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ salary: 1 });
userSchema.index({ 'emailNotificationPreferences.passwordReset': 1 });

const User = mongoose.model('User', userSchema);
module.exports = User;