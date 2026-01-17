import React, { useState, useEffect } from 'react';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, 
  FiBriefcase, FiDollarSign, FiLock, FiUpload, FiSave,
  FiEdit, FiShield, FiGlobe, FiBell, FiCreditCard,
  FiSettings, FiDatabase, FiActivity, FiBarChart2,
  FiUsers, FiCheckCircle, FiAlertCircle, FiTrendingUp
} from 'react-icons/fi';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const AdminProfile = () => {
  // ========== STATE ==========
  const [adminData, setAdminData] = useState({
    personalInfo: {
      fullName: 'Admin User',
      email: 'admin@company.com',
      phone: '+1 (555) 123-4567',
      dob: '1985-08-20',
      adminId: 'ADM2024001',
      role: 'System Administrator',
      department: 'IT & Administration'
    },
    security: {
      lastLogin: '2024-01-15 14:30:00',
      loginIP: '192.168.1.100',
      twoFactorEnabled: true,
      passwordLastChanged: '2023-12-01',
      failedAttempts: 0
    },
    systemInfo: {
      totalUsers: 245,
      activeSessions: 12,
      systemUptime: '99.8%',
      databaseSize: '2.4 GB',
      lastBackup: '2024-01-14 23:00:00'
    },
    permissions: {
      userManagement: 'Full',
      dataAccess: 'All',
      systemSettings: 'Full',
      reports: 'Full',
      backup: 'Full'
    },
    preferences: {
      theme: 'dark',
      language: 'en',
      timezone: 'UTC-05:00',
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    }
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [systemStats, setSystemStats] = useState({
    cpuUsage: 65,
    memoryUsage: 78,
    diskUsage: 42,
    networkTraffic: 125
  });

  // ========== SAMPLE DATA FOR CHARTS ==========
  const userActivityData = [
    { name: 'Mon', active: 210, new: 5, inactive: 30 },
    { name: 'Tue', active: 220, new: 8, inactive: 25 },
    { name: 'Wed', active: 215, new: 3, inactive: 27 },
    { name: 'Thu', active: 230, new: 12, inactive: 15 },
    { name: 'Fri', active: 200, new: 7, inactive: 38 },
    { name: 'Sat', active: 150, new: 2, inactive: 93 },
    { name: 'Sun', active: 120, new: 1, inactive: 124 }
  ];

  const departmentDistribution = [
    { name: 'Engineering', value: 65, color: '#3B82F6' },
    { name: 'Sales', value: 40, color: '#10B981' },
    { name: 'Marketing', value: 35, color: '#8B5CF6' },
    { name: 'HR', value: 25, color: '#F59E0B' },
    { name: 'Finance', value: 20, color: '#EF4444' },
    { name: 'Operations', value: 35, color: '#EC4899' }
  ];

  const recentActivities = [
    { id: 1, action: 'Added new employee', user: 'John Doe', time: '2 hours ago', type: 'add' },
    { id: 2, action: 'Updated payroll', user: 'System', time: '4 hours ago', type: 'update' },
    { id: 3, action: 'Security audit', user: 'Admin', time: '6 hours ago', type: 'security' },
    { id: 4, action: 'Database backup', user: 'System', time: '1 day ago', type: 'backup' },
    { id: 5, action: 'User permission changed', user: 'Admin', time: '2 days ago', type: 'permission' }
  ];

  const pendingTasks = [
    { id: 1, task: 'Review security logs', priority: 'high', due: 'Today' },
    { id: 2, task: 'Update system software', priority: 'medium', due: 'Tomorrow' },
    { id: 3, task: 'Backup verification', priority: 'low', due: 'In 2 days' },
    { id: 4, task: 'User access review', priority: 'high', due: 'Today' }
  ];

  // ========== HANDLERS ==========
  const handleInputChange = (section, field, value) => {
    setAdminData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleToggle2FA = () => {
    setAdminData(prev => ({
      ...prev,
      security: {
        ...prev.security,
        twoFactorEnabled: !prev.security.twoFactorEnabled
      }
    }));
  };

  const handleNotificationChange = (type, value) => {
    setAdminData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        notifications: {
          ...prev.preferences.notifications,
          [type]: value
        }
      }
    }));
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    // In real app, save to backend
    alert('Admin profile updated successfully!');
  };

  const handleRunBackup = () => {
    alert('Starting system backup...');
    // Simulate backup process
    setTimeout(() => alert('Backup completed successfully!'), 2000);
  };

  // ========== COMPONENTS ==========
  const StatCard = ({ title, value, icon, color, change }) => (
    <div className={`rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
        : 'bg-white border border-gray-200 shadow-sm'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${color} text-white`}>
          {icon}
        </div>
        {change && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            change.startsWith('+') 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {change}
          </span>
        )}
      </div>
      <div>
        <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {title}
        </p>
        <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </p>
      </div>
    </div>
  );

  const InfoField = ({ label, value, isEditing = false, onChange, type = 'text', disabled = false }) => (
    <div className="space-y-1">
      <label className={`block text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
        {label}
      </label>
      {isEditing && !disabled ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3 py-2 text-sm rounded-lg transition-all duration-300 ${
            darkMode
              ? 'bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              : 'bg-white border border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
          }`}
        />
      ) : (
        <div className={`px-3 py-2 text-sm rounded-lg ${
          darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-50 text-gray-900'
        }`}>
          {value}
        </div>
      )}
    </div>
  );

  const PermissionBadge = ({ level }) => {
    const getColor = (level) => {
      switch(level) {
        case 'Full': return darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800';
        case 'Limited': return darkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800';
        case 'None': return darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800';
        default: return darkMode ? 'bg-gray-900/30 text-gray-400' : 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${getColor(level)}`}>
        {level}
      </span>
    );
  };

  const TabButton = ({ tab, label, icon }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium ${
        activeTab === tab
          ? darkMode 
            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
            : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
          : darkMode
            ? 'text-gray-400 hover:text-white hover:bg-gray-800'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  // ========== TAB CONTENT ==========
  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Users"
                value={adminData.systemInfo.totalUsers}
                icon={<FiUsers />}
                color="bg-gradient-to-br from-blue-500 to-cyan-500"
                change="+12%"
              />
              <StatCard
                title="Active Sessions"
                value={adminData.systemInfo.activeSessions}
                icon={<FiActivity />}
                color="bg-gradient-to-br from-green-500 to-emerald-500"
                change="-3"
              />
              <StatCard
                title="System Uptime"
                value={adminData.systemInfo.systemUptime}
                icon={<FiCheckCircle />}
                color="bg-gradient-to-br from-purple-500 to-pink-500"
                change="+0.2%"
              />
              <StatCard
                title="Database Size"
                value={adminData.systemInfo.databaseSize}
                icon={<FiDatabase />}
                color="bg-gradient-to-br from-amber-500 to-orange-500"
                change="+0.1 GB"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Activity Chart */}
              <div className={`rounded-xl p-4 ${
                darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-white shadow-sm'
              }`}>
                <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  User Activity (Last 7 Days)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userActivityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                      <XAxis 
                        dataKey="name" 
                        stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                        fontSize={12}
                      />
                      <YAxis 
                        stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: darkMode ? '#1F2937' : 'white',
                          border: darkMode ? '1px solid #374151' : '1px solid #E5E7EB',
                          borderRadius: '0.5rem',
                          fontSize: '12px'
                        }}
                      />
                      <Bar 
                        dataKey="active" 
                        name="Active Users" 
                        fill="#3B82F6" 
                        radius={[2, 2, 0, 0]}
                      />
                      <Bar 
                        dataKey="new" 
                        name="New Users" 
                        fill="#10B981" 
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Department Distribution */}
              <div className={`rounded-xl p-4 ${
                darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-white shadow-sm'
              }`}>
                <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Department Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {departmentDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: darkMode ? '#1F2937' : 'white',
                          border: darkMode ? '1px solid #374151' : '1px solid #E5E7EB',
                          borderRadius: '0.5rem',
                          fontSize: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Activities & Pending Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <div className={`rounded-xl p-4 ${
                darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-white shadow-sm'
              }`}>
                <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Recent Activities
                </h3>
                <div className="space-y-3">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className={`p-3 rounded-lg ${
                      darkMode ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                    } transition-colors`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {activity.action}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            By {activity.user} • {activity.time}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          activity.type === 'security' ? 'bg-red-500/20 text-red-400' :
                          activity.type === 'add' ? 'bg-green-500/20 text-green-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {activity.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Tasks */}
              <div className={`rounded-xl p-4 ${
                darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-white shadow-sm'
              }`}>
                <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Pending Tasks
                </h3>
                <div className="space-y-3">
                  {pendingTasks.map(task => (
                    <div key={task.id} className={`p-3 rounded-lg ${
                      darkMode ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                    } transition-colors`}>
                      <div className="flex items-center justify-between mb-2">
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {task.task}
                        </p>
                        <span className={`px-2 py-1 rounded text-xs ${
                          task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Due: {task.due}
                        </p>
                        <button className={`text-xs px-2 py-1 rounded ${
                          darkMode 
                            ? 'text-blue-400 hover:bg-blue-900/30' 
                            : 'text-blue-600 hover:bg-blue-50'
                        }`}>
                          Mark Complete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'personal':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <FiUser className="inline mr-2" />
                  Personal Information
                </h3>
                <InfoField
                  label="Full Name"
                  value={adminData.personalInfo.fullName}
                  isEditing={isEditing}
                  onChange={(value) => handleInputChange('personalInfo', 'fullName', value)}
                />
                <InfoField
                  label="Email"
                  value={adminData.personalInfo.email}
                  isEditing={isEditing}
                  onChange={(value) => handleInputChange('personalInfo', 'email', value)}
                  type="email"
                />
                <InfoField
                  label="Phone"
                  value={adminData.personalInfo.phone}
                  isEditing={isEditing}
                  onChange={(value) => handleInputChange('personalInfo', 'phone', value)}
                  type="tel"
                />
                <InfoField
                  label="Date of Birth"
                  value={adminData.personalInfo.dob}
                  isEditing={isEditing}
                  onChange={(value) => handleInputChange('personalInfo', 'dob', value)}
                  type="date"
                />
              </div>

              <div className="space-y-4">
                <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <FiBriefcase className="inline mr-2" />
                  Administrative Information
                </h3>
                <InfoField
                  label="Admin ID"
                  value={adminData.personalInfo.adminId}
                  disabled
                />
                <InfoField
                  label="Role"
                  value={adminData.personalInfo.role}
                  disabled
                />
                <InfoField
                  label="Department"
                  value={adminData.personalInfo.department}
                  isEditing={isEditing}
                  onChange={(value) => handleInputChange('personalInfo', 'department', value)}
                />
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            {/* Security Status */}
            <div className={`rounded-xl p-4 ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-white shadow-sm'
            }`}>
              <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <FiShield className="inline mr-2" />
                Security Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Last Login
                  </p>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {adminData.security.lastLogin}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Login IP
                  </p>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {adminData.security.loginIP}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Password Last Changed
                  </p>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {adminData.security.passwordLastChanged}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Failed Login Attempts
                  </p>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {adminData.security.failedAttempts}
                  </p>
                </div>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className={`rounded-xl p-4 ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-white shadow-sm'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Two-Factor Authentication
                  </h4>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Add an extra layer of security to your account
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adminData.security.twoFactorEnabled}
                    onChange={handleToggle2FA}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 rounded-full peer ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} peer-checked:bg-green-500 peer-focus:ring-2 peer-focus:ring-green-500/20 transition-colors`}>
                    <div className={`absolute top-0.5 left-0.5 bg-white rounded-full h-5 w-5 transition-transform ${adminData.security.twoFactorEnabled ? 'translate-x-full' : ''}`}></div>
                  </div>
                </label>
              </div>
              <div className={`text-xs p-3 rounded-lg mt-3 ${
                adminData.security.twoFactorEnabled
                  ? darkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-800'
                  : darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-800'
              }`}>
                {adminData.security.twoFactorEnabled
                  ? '✅ Two-factor authentication is enabled for your account.'
                  : '⚠️ Two-factor authentication is not enabled. Enable it for enhanced security.'}
              </div>
            </div>

            {/* Change Password */}
            <div className={`rounded-xl p-4 ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-white shadow-sm'
            }`}>
              <h4 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Change Password
              </h4>
              <div className="space-y-3">
                <InfoField
                  label="Current Password"
                  type="password"
                  value="••••••••"
                  disabled
                />
                <InfoField
                  label="New Password"
                  type="password"
                  value=""
                  isEditing={isEditing}
                />
                <InfoField
                  label="Confirm New Password"
                  type="password"
                  value=""
                  isEditing={isEditing}
                />
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg transition-all duration-300 text-sm">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        );

      case 'permissions':
        return (
          <div className="space-y-6">
            <div className={`rounded-xl p-4 ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-white shadow-sm'
            }`}>
              <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Access Permissions
              </h3>
              <div className="space-y-3">
                {Object.entries(adminData.permissions).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {key.split(/(?=[A-Z])/).join(' ')}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Level of access for {key.split(/(?=[A-Z])/).join(' ').toLowerCase()}
                      </p>
                    </div>
                    <PermissionBadge level={value} />
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-xl p-4 ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-white shadow-sm'
            }`}>
              <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                System Administration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={handleRunBackup}
                  className="p-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white transition-all duration-300 text-sm"
                >
                  Run System Backup
                </button>
                <button className="p-3 rounded-lg bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white transition-all duration-300 text-sm">
                  Clear System Cache
                </button>
                <button className="p-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white transition-all duration-300 text-sm">
                  Update System Logs
                </button>
                <button className="p-3 rounded-lg bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white transition-all duration-300 text-sm">
                  Emergency Shutdown
                </button>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Theme Settings */}
              <div className={`rounded-xl p-4 ${
                darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-white shadow-sm'
              }`}>
                <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <FiGlobe className="inline mr-2" />
                  Theme Settings
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setDarkMode(false)}
                    className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 ${
                      !darkMode
                        ? 'border-blue-500 bg-blue-50'
                        : darkMode 
                          ? 'border-gray-700 hover:border-gray-600 bg-gray-800/50' 
                          : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-white"></div>
                    <span className={`text-xs font-medium ${!darkMode ? 'text-blue-600' : 'text-gray-400'}`}>
                      Light
                    </span>
                  </button>
                  <button
                    onClick={() => setDarkMode(true)}
                    className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 ${
                      darkMode
                        ? 'border-blue-500 bg-gray-800'
                        : darkMode 
                          ? 'border-gray-700 hover:border-gray-600' 
                          : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-black"></div>
                    <span className={`text-xs font-medium ${darkMode ? 'text-blue-400' : 'text-gray-600'}`}>
                      Dark
                    </span>
                  </button>
                </div>
              </div>

              {/* Language & Timezone */}
              <div className={`rounded-xl p-4 ${
                darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-white shadow-sm'
              }`}>
                <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <FiSettings className="inline mr-2" />
                  System Settings
                </h3>
                <div className="space-y-3">
                  <InfoField
                    label="Language"
                    value={adminData.preferences.language}
                    isEditing={isEditing}
                    onChange={(value) => handleInputChange('preferences', 'language', value)}
                  />
                  <InfoField
                    label="Timezone"
                    value={adminData.preferences.timezone}
                    isEditing={isEditing}
                    onChange={(value) => handleInputChange('preferences', 'timezone', value)}
                  />
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className={`rounded-xl p-4 ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-white shadow-sm'
            }`}>
              <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <FiBell className="inline mr-2" />
                Notification Preferences
              </h3>
              <div className="space-y-2">
                {Object.entries(adminData.preferences.notifications).map(([type, enabled]) => (
                  <div key={type} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {type.charAt(0).toUpperCase() + type.slice(1)} Notifications
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Receive {type} notifications for system updates
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => handleNotificationChange(type, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className={`w-10 h-5 rounded-full peer ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} peer-checked:bg-green-500 peer-focus:ring-2 peer-focus:ring-green-500/20 transition-colors`}>
                        <div className={`absolute top-0.5 left-0.5 bg-white rounded-full h-4 w-4 transition-transform ${enabled ? 'translate-x-full' : ''}`}></div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-blue-50/30'
    }`}>
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse ${
          darkMode ? 'bg-blue-500/10' : 'bg-blue-200/20'
        }`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 ${
          darkMode ? 'bg-cyan-500/10' : 'bg-cyan-200/20'
        }`}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Admin Profile
              </h1>
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                System administrator dashboard and profile management
              </p>
            </div>
            <div className="flex items-center gap-4">
              {isEditing ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                      darkMode 
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white rounded-lg transition-all duration-300 text-sm flex items-center gap-2"
                  >
                    <FiSave />
                    Save Changes
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg transition-all duration-300 text-sm flex items-center gap-2"
                >
                  <FiEdit />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <div className={`rounded-xl overflow-hidden ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-white shadow-lg'
            }`}>
              {/* Profile Header */}
              <div className="relative">
                <div className="h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
                <div className="absolute -bottom-8 left-4">
                  <div className="w-16 h-16 rounded-full border-4 border-white bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                    AU
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="pt-10 px-4 pb-4">
                <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {adminData.personalInfo.fullName}
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {adminData.personalInfo.role}
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <FiMail className={darkMode ? 'text-gray-400' : 'text-gray-600'} size={14} />
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {adminData.personalInfo.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone className={darkMode ? 'text-gray-400' : 'text-gray-600'} size={14} />
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {adminData.personalInfo.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className={`border-t px-4 py-3 ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminData.systemInfo.totalUsers}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Users
                    </p>
                  </div>
                  <div className="text-center">
                    <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminData.systemInfo.activeSessions}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className={`rounded-xl p-4 mt-6 ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-white shadow-lg'
            }`}>
              <div className="space-y-1">
                <TabButton 
                  tab="overview" 
                  label="Overview" 
                  icon={<FiBarChart2 />} 
                />
                <TabButton 
                  tab="personal" 
                  label="Personal Info" 
                  icon={<FiUser />} 
                />
                <TabButton 
                  tab="security" 
                  label="Security" 
                  icon={<FiShield />} 
                />
                <TabButton 
                  tab="permissions" 
                  label="Permissions" 
                  icon={<FiLock />} 
                />
                <TabButton 
                  tab="preferences" 
                  label="Preferences" 
                  icon={<FiSettings />} 
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className={`rounded-xl p-6 ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-white shadow-lg'
            }`}>
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;