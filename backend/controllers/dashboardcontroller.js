const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');
const Payroll = require('../models/Payroll');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const currentDate = new Date();
    const startOfDay = new Date(currentDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(currentDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all stats in parallel
    const [
      totalEmployees,
      activeEmployees,
      todayAttendance,
      pendingLeaves,
      currentMonthPayroll,
      departmentStats
    ] = await Promise.all([
      Employee.countDocuments(),
      Employee.countDocuments({ status: 'active' }),
      Attendance.aggregate([
        {
          $match: {
            date: { $gte: startOfDay, $lte: endOfDay }
          }
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      Leave.countDocuments({ status: 'pending' }),
      Payroll.aggregate([
        {
          $match: {
            month: currentDate.getMonth() + 1,
            year: currentDate.getFullYear()
          }
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$netSalary' },
            count: { $sum: 1 }
          }
        }
      ]),
      Employee.aggregate([
        {
          $group: {
            _id: '$department',
            count: { $sum: 1 },
            avgSalary: { $avg: '$salary' }
          }
        },
        { $sort: { count: -1 } }
      ])
    ]);

    // Calculate attendance stats
    const present = todayAttendance.find(a => a._id === 'present')?.count || 0;
    const late = todayAttendance.find(a => a._id === 'late')?.count || 0;
    const onLeave = todayAttendance.find(a => a._id === 'on-leave')?.count || 0;
    const absent = activeEmployees - (present + late + onLeave);

    // Calculate payroll stats
    const totalPayroll = currentMonthPayroll[0]?.totalAmount || 0;
    const processedPayrolls = currentMonthPayroll[0]?.count || 0;

    res.json({
      success: true,
      data: {
        totalEmployees,
        activeEmployees,
        onLeave,
        departments: departmentStats.length,
        systemHealth: 99.9, // Mock value
        pendingTasks: pendingLeaves,
        revenue: totalPayroll,
        performance: Math.round((present / activeEmployees) * 100) || 0,
        employeeSatisfaction: 94, // Mock value
        todayAttendance: {
          present,
          late,
          onLeave,
          absent,
          total: activeEmployees
        },
        payroll: {
          totalAmount: totalPayroll,
          processed: processedPayrolls,
          averageSalary: Math.round(totalPayroll / (processedPayrolls || 1))
        },
        departments: departmentStats
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get recent activities
exports.getRecentActivities = async (req, res) => {
  try {
    const activities = [];

    // Get recent leaves
    const recentLeaves = await Leave.find()
      .populate('employee', 'firstName lastName')
      .sort({ appliedAt: -1 })
      .limit(5);

    recentLeaves.forEach(leave => {
      activities.push({
        id: leave._id,
        type: 'leave',
        message: `${leave.employee.firstName} ${leave.employee.lastName} applied for ${leave.leaveType} leave`,
        time: leave.appliedAt,
        status: leave.status,
        icon: '🌴'
      });
    });

    // Get recent attendance
    const recentAttendance = await Attendance.find()
      .populate('employee', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    recentAttendance.forEach(att => {
      activities.push({
        id: att._id,
        type: 'attendance',
        message: `${att.employee.firstName} ${att.employee.lastName} marked as ${att.status}`,
        time: att.createdAt,
        status: 'info',
        icon: '✅'
      });
    });

    // Get recent payrolls
    const recentPayrolls = await Payroll.find()
      .populate('employee', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    recentPayrolls.forEach(payroll => {
      activities.push({
        id: payroll._id,
        type: 'payroll',
        message: `Payroll processed for ${payroll.employee.firstName} ${payroll.employee.lastName}`,
        time: payroll.createdAt,
        status: 'success',
        icon: '💰'
      });
    });

    // Sort by time
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.json({
      success: true,
      data: activities.slice(0, 10) // Return top 10
    });

  } catch (error) {
    console.error('Get recent activities error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get department statistics
exports.getDepartmentStats = async (req, res) => {
  try {
    const stats = await Employee.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          avgSalary: { $avg: '$salary' },
          avgPerformance: { $avg: '$performanceScore' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get attendance rate by department
    const currentDate = new Date();
    const startOfDay = new Date(currentDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(currentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const attendanceStats = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: startOfDay, $lte: endOfDay },
          status: 'present'
        }
      },
      {
        $group: {
          _id: '$department',
          present: { $sum: 1 }
        }
      }
    ]);

    // Combine stats
    const departmentStats = stats.map(dept => {
      const attendance = attendanceStats.find(a => a._id === dept._id);
      const attendanceRate = attendance ? 
        Math.round((attendance.present / dept.count) * 100) : 0;
      
      return {
        ...dept,
        attendanceRate,
        icon: getDepartmentIcon(dept._id)
      };
    });

    res.json({
      success: true,
      data: departmentStats
    });

  } catch (error) {
    console.error('Get department stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Helper function for department icons
function getDepartmentIcon(department) {
  const icons = {
    'Engineering': '💻',
    'Marketing': '📢',
    'Sales': '💰',
    'HR': '👥',
    'Finance': '🏦',
    'Operations': '⚙️',
    'IT': '🔧',
    'Management': '👔'
  };
  return icons[department] || '🏢';
}

// Get attendance overview
exports.getAttendanceOverview = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const attendance = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          statuses: {
            $push: {
              status: '$_id.status',
              count: '$count'
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get total employees per day for rate calculation
    const totalEmployees = await Employee.countDocuments({ status: 'active' });

    const formattedData = attendance.map(day => {
      const present = day.statuses.find(s => s.status === 'present')?.count || 0;
      const attendanceRate = Math.round((present / totalEmployees) * 100);
      
      return {
        date: day._id,
        present,
        late: day.statuses.find(s => s.status === 'late')?.count || 0,
        absent: totalEmployees - present,
        attendanceRate
      };
    });

    res.json({
      success: true,
      data: formattedData
    });

  } catch (error) {
    console.error('Get attendance overview error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};