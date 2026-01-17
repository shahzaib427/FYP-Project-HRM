import React, { useState, useEffect } from 'react';

const AdminLeave = () => {
  // Sample leave data
  const initialLeaves = [
    {
      id: 1,
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      employeeAvatar: 'https://ui-avatars.com/api/?name=John+Doe&background=3498db&color=fff',
      leaveType: 'Annual Leave',
      startDate: '2024-03-15',
      endDate: '2024-03-18',
      days: 4,
      reason: 'Family vacation',
      status: 'Pending',
      appliedDate: '2024-03-10',
      department: 'Engineering'
    },
    {
      id: 2,
      employeeId: 'EMP002',
      employeeName: 'Jane Smith',
      employeeAvatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=2ecc71&color=fff',
      leaveType: 'Sick Leave',
      startDate: '2024-03-12',
      endDate: '2024-03-12',
      days: 1,
      reason: 'Medical appointment',
      status: 'Approved',
      appliedDate: '2024-03-09',
      department: 'Marketing'
    },
    {
      id: 3,
      employeeId: 'EMP003',
      employeeName: 'Robert Johnson',
      employeeAvatar: 'https://ui-avatars.com/api/?name=Robert+Johnson&background=e74c3c&color=fff',
      leaveType: 'Casual Leave',
      startDate: '2024-03-20',
      endDate: '2024-03-21',
      days: 2,
      reason: 'Personal work',
      status: 'Pending',
      appliedDate: '2024-03-11',
      department: 'Sales'
    },
    {
      id: 4,
      employeeId: 'EMP004',
      employeeName: 'Maria Garcia',
      employeeAvatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=9b59b6&color=fff',
      leaveType: 'Maternity Leave',
      startDate: '2024-04-01',
      endDate: '2024-07-01',
      days: 90,
      reason: 'Maternity',
      status: 'Approved',
      appliedDate: '2024-03-01',
      department: 'HR'
    },
    {
      id: 5,
      employeeId: 'EMP005',
      employeeName: 'David Chen',
      employeeAvatar: 'https://ui-avatars.com/api/?name=David+Chen&background=f39c12&color=fff',
      leaveType: 'Annual Leave',
      startDate: '2024-03-25',
      endDate: '2024-03-29',
      days: 5,
      reason: 'Travel',
      status: 'Rejected',
      appliedDate: '2024-03-05',
      department: 'Engineering'
    }
  ];

  // State management
  const [leaves, setLeaves] = useState(initialLeaves);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('All');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
    thisMonth: 0
  });

  // Filter options
  const leaveTypes = ['All', 'Annual Leave', 'Sick Leave', 'Casual Leave', 'Maternity Leave', 'Paternity Leave', 'Unpaid Leave'];
  const statusOptions = ['All', 'Pending', 'Approved', 'Rejected'];

  useEffect(() => {
    // Calculate stats
    const pending = leaves.filter(l => l.status === 'Pending').length;
    const approved = leaves.filter(l => l.status === 'Approved').length;
    const rejected = leaves.filter(l => l.status === 'Rejected').length;
    const thisMonth = leaves.filter(l => new Date(l.startDate).getMonth() === new Date().getMonth()).length;
    
    setStats({
      pending,
      approved,
      rejected,
      total: leaves.length,
      thisMonth
    });
  }, [leaves]);

  // Filter leaves
  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = 
      leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || leave.status === statusFilter;
    const matchesType = leaveTypeFilter === 'All' || leave.leaveType === leaveTypeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Handle actions
  const handleApprove = (id) => {
    if (window.confirm('Are you sure you want to approve this leave request?')) {
      setLeaves(leaves.map(leave => 
        leave.id === id ? { ...leave, status: 'Approved' } : leave
      ));
    }
  };

  const handleReject = (id) => {
    if (window.confirm('Are you sure you want to reject this leave request?')) {
      setLeaves(leaves.map(leave => 
        leave.id === id ? { ...leave, status: 'Rejected' } : leave
      ));
    }
  };

  const handleViewDetails = (leave) => {
    setSelectedLeave(leave);
    setShowDetails(true);
  };

  const AnimatedCounter = ({ value, duration = 2000, suffix = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const increment = value / (duration / 20);
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 20);
      
      return () => clearInterval(timer);
    }, [value, duration]);

    return (
      <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {count}{suffix}
      </span>
    );
  };

  const StatCard = ({ title, value, change, icon, color, suffix = '' }) => (
    <div className={`rounded-2xl shadow-2xl border p-6 transition-all duration-300 hover:shadow-3xl transform hover:-translate-y-1 group ${
      darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <div className="flex items-baseline space-x-1">
            <AnimatedCounter value={value} suffix={suffix} />
          </div>
          {change && (
            <p className={`text-sm mt-2 flex items-center ${change.startsWith('+') ? 'text-green-500' : 'text-rose-500'}`}>
              <span className={`mr-1 ${change.startsWith('+') ? 'animate-bounce' : ''}`}>
                {change.startsWith('+') ? '↗' : '↘'}
              </span>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color} text-white transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return darkMode ? 'bg-green-900/30 text-green-400 border border-green-700' : 'bg-green-100 text-green-800';
      case 'Pending': return darkMode ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700' : 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return darkMode ? 'bg-red-900/30 text-red-400 border border-red-700' : 'bg-red-100 text-red-800';
      default: return darkMode ? 'bg-gray-900/30 text-gray-400 border border-gray-700' : 'bg-gray-100 text-gray-800';
    }
  };

  const getLeaveTypeColor = (type) => {
    const colors = {
      'Annual Leave': darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800',
      'Sick Leave': darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800',
      'Casual Leave': darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-800',
      'Maternity Leave': darkMode ? 'bg-pink-900/30 text-pink-400' : 'bg-pink-100 text-pink-800',
      'Paternity Leave': darkMode ? 'bg-teal-900/30 text-teal-400' : 'bg-teal-100 text-teal-800',
      'Unpaid Leave': darkMode ? 'bg-gray-900/30 text-gray-400' : 'bg-gray-100 text-gray-800'
    };
    return colors[type] || (darkMode ? 'bg-gray-900/30 text-gray-400' : 'bg-gray-100 text-gray-800');
  };

  const getDepartmentColor = (dept) => {
    const colors = {
      Engineering: darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800',
      Marketing: darkMode ? 'bg-pink-900/30 text-pink-400' : 'bg-pink-100 text-pink-800',
      Sales: darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-800',
      HR: darkMode ? 'bg-teal-900/30 text-teal-400' : 'bg-teal-100 text-teal-800',
      Finance: darkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-800',
      Operations: darkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-800'
    };
    return colors[dept] || (darkMode ? 'bg-gray-900/30 text-gray-400' : 'bg-gray-100 text-gray-800');
  };

  return (
    <div className={`min-h-screen py-8 transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50/30'
    }`}>
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse ${
          darkMode ? 'bg-amber-500/10' : 'bg-amber-200/20'
        }`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 ${
          darkMode ? 'bg-yellow-500/10' : 'bg-yellow-200/20'
        }`}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Leave Management
              </h1>
              <p className={`mt-2 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Approve and manage employee leave requests
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Export Button */}
              <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-lg">
                <span className="text-lg">📥</span> Export Report
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-12 ${
                  darkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600 shadow-lg' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 shadow-lg border border-gray-200'
                }`}
              >
                <span className="text-xl">{darkMode ? '🌙' : '☀️'}</span>
              </button>

              <button className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 shadow-lg">
                <span className="text-lg">⚙️</span> Settings
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Total Leaves"
            value={stats.total}
            icon="📅"
            color="bg-gradient-to-br from-blue-500 to-cyan-500"
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            change="+2 this week"
            icon="⏳"
            color="bg-gradient-to-br from-yellow-500 to-amber-500"
          />
          <StatCard
            title="Approved"
            value={stats.approved}
            icon="✅"
            color="bg-gradient-to-br from-green-500 to-emerald-500"
          />
          <StatCard
            title="Rejected"
            value={stats.rejected}
            icon="❌"
            color="bg-gradient-to-br from-red-500 to-rose-500"
          />
          <StatCard
            title="This Month"
            value={stats.thisMonth}
            change="+3 from last month"
            icon="📊"
            color="bg-gradient-to-br from-purple-500 to-pink-500"
          />
        </div>

        {/* Filters */}
        <div className={`rounded-2xl shadow-2xl border p-6 mb-6 ${
          darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search by employee name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div className="flex gap-3">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 min-w-[150px] ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <select 
                value={leaveTypeFilter}
                onChange={(e) => setLeaveTypeFilter(e.target.value)}
                className={`rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 min-w-[180px] ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {leaveTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Leave Requests Table */}
        <div className={`rounded-2xl shadow-2xl border overflow-hidden mb-6 ${
          darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <div className="px-6 py-4 border-b">
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Leave Requests
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Review and manage leave applications
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y">
              <thead className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Leave Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredLeaves.map((leave) => (
                  <tr key={leave.id} className={`hover:${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'} transition-colors`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={leave.employeeAvatar} 
                          alt={leave.employeeName}
                          className="h-10 w-10 rounded-full mr-3 shadow-md"
                        />
                        <div>
                          <div className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                            {leave.employeeName}
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {leave.employeeId}
                          </div>
                          <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {leave.department}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLeaveTypeColor(leave.leaveType)}`}>
                        {leave.leaveType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        {leave.days} day(s)
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                        Applied: {leave.appliedDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        {leave.startDate} to {leave.endDate}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                        {Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24) + 1)} days
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewDetails(leave)}
                          className={`p-2 rounded transition-colors ${
                            darkMode ? 'text-blue-400 hover:bg-blue-900/30' : 'text-blue-600 hover:bg-blue-50'
                          }`}
                          title="View Details"
                        >
                          👁️
                        </button>
                        {leave.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => handleApprove(leave.id)}
                              className={`p-2 rounded transition-colors ${
                                darkMode ? 'text-green-400 hover:bg-green-900/30' : 'text-green-600 hover:bg-green-50'
                              }`}
                              title="Approve"
                            >
                              ✅
                            </button>
                            <button 
                              onClick={() => handleReject(leave.id)}
                              className={`p-2 rounded transition-colors ${
                                darkMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-50'
                              }`}
                              title="Reject"
                            >
                              ❌
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Leave Calendar */}
        <div className={`rounded-2xl shadow-2xl border p-6 mb-6 ${
          darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Leave Calendar
            </h2>
            <div className="flex gap-2">
              <button className={`px-3 py-1 rounded text-sm ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}>
                Today
              </button>
              <button className={`px-3 py-1 rounded text-sm ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}>
                Month
              </button>
              <button className="px-3 py-1 bg-amber-600 text-white rounded text-sm hover:bg-amber-700">
                Week
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className={`text-center font-medium py-2 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {day}
              </div>
            ))}
          </div>
          <div className={`h-64 flex items-center justify-center rounded-lg border-2 border-dashed ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="text-center">
              <span className="text-4xl mb-3">📅</span>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Leave Calendar View Coming Soon
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`rounded-2xl shadow-2xl border p-6 ${
            darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Leave Types Distribution
            </h4>
            <div className="space-y-3">
              {['Annual Leave', 'Sick Leave', 'Casual Leave', 'Maternity Leave'].map(type => {
                const count = leaves.filter(l => l.leaveType === type).length;
                const percentage = (count / leaves.length) * 100;
                return (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{type}</span>
                      <span className={darkMode ? 'text-gray-200' : 'text-gray-900'}>{count} leaves</span>
                    </div>
                    <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div 
                        className={`h-full rounded-full ${
                          type === 'Annual Leave' ? 'bg-blue-500' :
                          type === 'Sick Leave' ? 'bg-green-500' :
                          type === 'Casual Leave' ? 'bg-purple-500' :
                          'bg-pink-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`rounded-2xl shadow-2xl border p-6 ${
            darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Department-wise Leaves
            </h4>
            <div className="space-y-3">
              {['Engineering', 'Marketing', 'Sales', 'HR'].map(dept => {
                const count = leaves.filter(l => l.department === dept).length;
                return (
                  <div key={dept} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{dept}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        {count} leaves
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${getDepartmentColor(dept)}`}>
                        {dept === 'Engineering' ? '💻' :
                         dept === 'Marketing' ? '📢' :
                         dept === 'Sales' ? '💰' : '👥'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`rounded-2xl shadow-2xl border p-6 ${
            darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Quick Actions
            </h4>
            <div className="space-y-3">
              <button className={`w-full p-3 rounded-lg text-left flex items-center space-x-3 transition-colors ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}>
                <span className="text-lg">📋</span>
                <span>Leave Policy Settings</span>
              </button>
              <button className={`w-full p-3 rounded-lg text-left flex items-center space-x-3 transition-colors ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}>
                <span className="text-lg">📧</span>
                <span>Send Reminders</span>
              </button>
              <button className={`w-full p-3 rounded-lg text-left flex items-center space-x-3 transition-colors ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}>
                <span className="text-lg">📊</span>
                <span>Generate Leave Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Details Modal */}
      {showDetails && selectedLeave && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className={`rounded-2xl shadow-3xl max-w-2xl w-full ${
            darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-white'
          }`}>
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Leave Request Details
                </h3>
                <button 
                  onClick={() => setShowDetails(false)}
                  className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Employee Info */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <img 
                  src={selectedLeave.employeeAvatar} 
                  alt={selectedLeave.employeeName}
                  className="h-16 w-16 rounded-full shadow-lg"
                />
                <div>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedLeave.employeeName}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedLeave.employeeId} • {selectedLeave.department}
                  </p>
                  <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedLeave.status)}`}>
                    {selectedLeave.status}
                  </span>
                </div>
              </div>

              {/* Leave Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Leave Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Leave Type:</span>
                      <span className={darkMode ? 'text-gray-200' : 'text-gray-900'}>{selectedLeave.leaveType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Duration:</span>
                      <span className={darkMode ? 'text-gray-200' : 'text-gray-900'}>{selectedLeave.days} day(s)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Start Date:</span>
                      <span className={darkMode ? 'text-gray-200' : 'text-gray-900'}>{selectedLeave.startDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>End Date:</span>
                      <span className={darkMode ? 'text-gray-200' : 'text-gray-900'}>{selectedLeave.endDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Applied On:</span>
                      <span className={darkMode ? 'text-gray-200' : 'text-gray-900'}>{selectedLeave.appliedDate}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className={`font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Reason
                  </h4>
                  <div className={`p-4 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {selectedLeave.reason}
                    </p>
                  </div>
                  
                  {selectedLeave.status === 'Pending' && (
                    <div className="mt-6 flex space-x-3">
                      <button 
                        onClick={() => {
                          handleApprove(selectedLeave.id);
                          setShowDetails(false);
                        }}
                        className="flex-1 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                      >
                        <span>✅</span> Approve
                      </button>
                      <button 
                        onClick={() => {
                          handleReject(selectedLeave.id);
                          setShowDetails(false);
                        }}
                        className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                      >
                        <span>❌</span> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .shadow-3xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
      `}</style>
    </div>
  );
};

export default AdminLeave;