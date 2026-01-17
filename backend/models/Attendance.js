const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    employee: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
      index: true
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    checkIn: Date,
    checkOut: Date,
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'half-day', 'Not Checked In'],
      default: 'Not Checked In'
    },
    totalHours: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// ✅ CRITICAL UNIQUE INDEX
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

// ✅ PROPER EXPORT
module.exports = mongoose.model('Attendance', attendanceSchema);
