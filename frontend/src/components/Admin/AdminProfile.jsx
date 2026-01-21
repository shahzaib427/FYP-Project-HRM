import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUser, FiMail, FiPhone, FiCalendar, FiBriefcase,
  FiDollarSign, FiLock, FiSave, FiEdit, FiShield,
  FiGlobe, FiBell, FiSettings, FiDatabase, FiActivity,
  FiBarChart2, FiUsers, FiCheckCircle, FiAlertCircle,
  FiTrendingUp, FiKey, FiRefreshCw, FiShieldOff
} from 'react-icons/fi';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import axiosInstance from '../../utils/axiosInstance';

const AdminProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [systemStats, setSystemStats] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: true,
    push: true,
    sms: false
  });

  // Fetch admin profile data
  useEffect(() => {
    fetchAdminProfile();
    fetchSystemStats();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/profile');
      if (response.data.success) {
        const data = response.data.data;
        setProfileData(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          department: data.department || '',
          position: data.position || ''
        });
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      // If API fails, use fallback data for demo
      setProfileData({
        name: 'Admin User',
        email: 'admin@company.com',
        phone: '+1 (555) 123-4567',
        department: 'IT & Administration',
        position: 'System Administrator',
        employeeId: 'ADM2024001',
        twoFactorEnabled: true
      });
      setFormData({
        name: 'Admin User',
        email: 'admin@company.com',
        phone: '+1 (555) 123-4567',
        department: 'IT & Administration',
        position: 'System Administrator'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemStats = async () => {
    try {
      const response = await axiosInstance.get('/admin/system-stats');
      if (response.data.success) {
        setSystemStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching system stats:', error);
      // Fallback data
      setSystemStats({
        totalUsers: 245,
        activeSessions: 12,
        uptime: '99.8%',
        dbSize: '2.4 GB',
        userChange: '+12%',
        sessionChange: '-3',
        departments: [
          { name: 'Engineering', value: 65, color: '#3B82F6' },
          { name: 'Sales', value: 40, color: '#10B981' },
          { name: 'Marketing', value: 35, color: '#8B5CF6' },
          { name: 'HR', value: 25, color: '#F59E0B' }
        ]
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axiosInstance.put('/admin/profile', formData);
      if (response.data.success) {
        setProfileData(prev => ({ ...prev, ...formData }));
        setEditMode(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    try {
      const response = await axiosInstance.put('/admin/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      if (response.data.success) {
        alert('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to change password');
    }
  };

  const handleToggle2FA = async () => {
    try {
      const response = await axiosInstance.post('/admin/toggle-2fa');
      if (response.data.success) {
        setProfileData(prev => ({
          ...prev,
          twoFactorEnabled: response.data.twoFactorEnabled
        }));
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update 2FA settings');
    }
  };

  const handleUpdateNotifications = async () => {
    try {
      const response = await axiosInstance.put('/admin/notifications', {
        preferences: notificationPreferences
      });
      if (response.data.success) {
        alert('Notification preferences updated!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update notifications');
    }
  };

  const handleRunBackup = async () => {
    if (!confirm('Are you sure you want to run a system backup?')) return;

    try {
      const response = await axiosInstance.post('/admin/backup');
      if (response.data.success) {
        alert('Backup started successfully!');
        // You might want to poll for backup status here
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Backup failed');
    }
  };

  // Sample chart data
  const userActivityData = [
    { name: 'Mon', active: 210, new: 5 },
    { name: 'Tue', active: 220, new: 8 },
    { name: 'Wed', active: 215, new: 3 },
    { name: 'Thu', active: 230, new: 12 },
    { name: 'Fri', active: 200, new: 7 },
    { name: 'Sat', active: 150, new: 2 },
    { name: 'Sun', active: 120, new: 1 }
  ];

  const departmentDistribution = systemStats?.departments || [
    { name: 'Engineering', value: 65, color: '#3B82F6' },
    { name: 'Sales', value: 40, color: '#10B981' },
    { name: 'Marketing', value: 35, color: '#8B5CF6' },
    { name: 'HR', value: 25, color: '#F59E0B' }
  ];

  const StatCard = ({ title, value, icon, color, change, loading }) => (
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
        {loading ? (
          <div className="h-6 w-20 bg-gray-700 rounded animate-pulse"></div>
        ) : (
          <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
        )}
      </div>
    </div>
  );

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

  const renderTabContent = () => {
    if (loading && !profileData) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch(activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Users"
                value={systemStats?.totalUsers || 0}
                icon={<FiUsers />}
                color="bg-gradient-to-br from-blue-500 to-cyan-500"
                change={systemStats?.userChange || "+0%"}
                loading={!systemStats}
              />
              <StatCard
                title="Active Sessions"
                value={systemStats?.activeSessions || 0}
                icon={<FiActivity />}
                color="bg-gradient-to-br from-green-500 to-emerald-500"
                change={systemStats?.sessionChange || "-0"}
                loading={!systemStats}
              />
              <StatCard
                title="System Uptime"
                value={systemStats?.uptime || '0%'}
                icon={<FiCheckCircle />}
                color="bg-gradient-to-br from-purple-500 to-pink-500"
                loading={!systemStats}
              />
              <StatCard
                title="Database Size"
                value={systemStats?.dbSize || '0 MB'}
                icon={<FiDatabase />}
                color="bg-gradient-to-br from-amber-500 to-orange-500"
                loading={!systemStats}
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
                          borderRadius: '0.5rem'
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
                          <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: darkMode ? '#1F2937' : 'white',
                          border: darkMode ? '1px solid #374151' : '1px solid #E5E7EB',
                          borderRadius: '0.5rem'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
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
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-500">Full Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 text-sm rounded-lg bg-gray-700/50 text-gray-300">
                      {profileData?.name}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-500">Email</label>
                  {editMode ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 text-sm rounded-lg bg-gray-700/50 text-gray-300">
                      {profileData?.email}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-500">Phone</label>
                  {editMode ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 text-sm rounded-lg bg-gray-700/50 text-gray-300">
                      {profileData?.phone || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <FiBriefcase className="inline mr-2" />
                  Administrative Information
                </h3>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-500">Employee ID</label>
                  <div className="px-3 py-2 text-sm rounded-lg bg-gray-700/50 text-gray-300">
                    {profileData?.employeeId || 'ADM2024001'}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-500">Role</label>
                  <div className="px-3 py-2 text-sm rounded-lg bg-gray-700/50 text-gray-300">
                    Administrator
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-500">Department</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 text-sm rounded-lg bg-gray-700/50 text-gray-300">
                      {profileData?.department}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
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
                <button
                  onClick={handleToggle2FA}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    profileData?.twoFactorEnabled
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {profileData?.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                </button>
              </div>
              <div className={`text-xs p-3 rounded-lg mt-3 ${
                profileData?.twoFactorEnabled
                  ? darkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-800'
                  : darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-800'
              }`}>
                {profileData?.twoFactorEnabled
                  ? '✅ Two-factor authentication is enabled for your account.'
                  : '⚠️ Two-factor authentication is not enabled. Enable it for enhanced security.'}
              </div>
            </div>

            <div className={`rounded-xl p-4 ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-white shadow-sm'
            }`}>
              <h4 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Change Password
              </h4>
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-500">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-500">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-500">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleChangePassword}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg transition-all duration-300 text-sm"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
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
                      : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
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

            {/* Notifications */}
            <div className={`rounded-xl p-4 ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-white shadow-sm'
            }`}>
              <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <FiBell className="inline mr-2" />
                Notification Preferences
              </h3>
              <div className="space-y-2">
                {Object.entries(notificationPreferences).map(([type, enabled]) => (
                  <div key={type} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {type.charAt(0).toUpperCase() + type.slice(1)} Notifications
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setNotificationPreferences(prev => ({
                          ...prev,
                          [type]: e.target.checked
                        }))}
                        className="sr-only peer"
                      />
                      <div className={`w-10 h-5 rounded-full peer bg-gray-700 peer-checked:bg-green-500 peer-focus:ring-2 peer-focus:ring-green-500/20 transition-colors`}>
                        <div className={`absolute top-0.5 left-0.5 bg-white rounded-full h-4 w-4 transition-transform ${enabled ? 'translate-x-full' : ''}`}></div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              <button
                onClick={handleUpdateNotifications}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white rounded-lg transition-all duration-300 text-sm"
              >
                Save Notification Preferences
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading && !profileData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
              {editMode ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setFormData({
                        name: profileData?.name || '',
                        email: profileData?.email || '',
                        phone: profileData?.phone || '',
                        department: profileData?.department || '',
                        position: profileData?.position || ''
                      });
                    }}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                      darkMode 
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white rounded-lg transition-all duration-300 text-sm flex items-center gap-2"
                  >
                    <FiSave />
                    Save Changes
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
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
                    {profileData?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="pt-10 px-4 pb-4">
                <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {profileData?.name}
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Administrator
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <FiMail className={darkMode ? 'text-gray-400' : 'text-gray-600'} size={14} />
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {profileData?.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone className={darkMode ? 'text-gray-400' : 'text-gray-600'} size={14} />
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {profileData?.phone || 'Not provided'}
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
                      {systemStats?.totalUsers || 0}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Users
                    </p>
                  </div>
                  <div className="text-center">
                    <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {systemStats?.activeSessions || 0}
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