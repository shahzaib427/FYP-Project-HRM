const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
  employee: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['annual', 'casual', 'sick', 'earned', 'maternity', 'paternity'],
    required: true 
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  days: { 
    type: Number, 
    required: true,
    min: 0.5
  },
  reason: { 
    type: String, 
    required: true,
    trim: true 
  },
  contactNumber: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  approvedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  rejectionReason: { 
    type: String 
  },
  approvedAt: { 
    type: Date 
  },
  appliedAt: { 
    type: Date, 
    default: Date.now 
  },
  attachments: [{ 
    url: String,
    fileName: String
  }]
}, { timestamps: true });

// Index for efficient queries
LeaveSchema.index({ employee: 1, startDate: -1 });
LeaveSchema.index({ status: 1, startDate: -1 });

module.exports = mongoose.model('Leave', LeaveSchema);