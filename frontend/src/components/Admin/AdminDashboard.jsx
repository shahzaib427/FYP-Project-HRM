import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeDepartments: 0,
    systemHealth: 0,
    pendingTasks: 0,
    revenue: 0,
    performance: 0,
    employeeSatisfaction: 0
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('monthly');
  const [notifications, setNotifications] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setStats({
        totalEmployees: 247,
        activeDepartments: 14,
        systemHealth: 99.9,
        pendingTasks: 8,
        revenue: 125000,
        performance: 87,
        employeeSatisfaction: 94
      });
      
      setRecentActivity([
        { id: 1, type: 'user', message: 'Sarah Johnson joined the team as Senior Developer', time: '2 min ago', icon: '👤', status: 'success' },
        { id: 2, type: 'payroll', message: 'Payroll processed for March - All employees paid', time: '1 hour ago', icon: '💰', status: 'completed' },
        { id: 3, type: 'system', message: 'System backup completed successfully', time: '3 hours ago', icon: '💾', status: 'success' },
        { id: 4, type: 'update', message: 'New security update available for installation', time: '5 hours ago', icon: '🛡️', status: 'warning' },
        { id: 5, type: 'award', message: 'Mike Rodriguez selected as Employee of the Month', time: '6 hours ago', icon: '🏆', status: 'info' },
        { id: 6, type: 'project', message: 'Project "Phoenix" completed ahead of schedule', time: '1 day ago', icon: '🚀', status: 'success' },
        { id: 7, type: 'training', message: 'New training module "Leadership Skills" added', time: '1 day ago', icon: '📚', status: 'info' },
        { id: 8, type: 'meeting', message: 'Quarterly review meeting scheduled for next week', time: '2 days ago', icon: '📅', status: 'info' }
      ]);

      setNotifications([
        { id: 1, message: 'Team meeting in Conference Room A in 15 minutes', type: 'meeting', read: false },
        { id: 2, message: '3 new employee applications received', type: 'recruitment', read: false },
        { id: 3, message: 'System maintenance scheduled for tonight at 10 PM', type: 'system', read: true },
        { id: 4, message: 'Performance reviews due by end of week', type: 'reminder', read: false }
      ]);

      setTeamMembers([
        { id: 1, name: 'Alex Johnson', role: 'Team Lead', avatar: 'AJ', status: 'online', productivity: 95 },
        { id: 2, name: 'Sarah Chen', role: 'Senior Developer', avatar: 'SC', status: 'online', productivity: 88 },
        { id: 3, name: 'Mike Rodriguez', role: 'UI/UX Designer', avatar: 'MR', status: 'offline', productivity: 92 },
        { id: 4, name: 'Emily Davis', role: 'Data Analyst', avatar: 'ED', status: 'online', productivity: 85 }
      ]);

      setPerformanceData([
        { label: 'System Uptime', value: 99.9, color: 'from-green-500 to-emerald-500' },
        { label: 'Response Time', value: 128, color: 'from-blue-500 to-cyan-500' },
        { label: 'User Satisfaction', value: 94, color: 'from-purple-500 to-pink-500' },
        { label: 'Task Completion', value: 87, color: 'from-amber-500 to-orange-500' }
      ]);
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Animated Counter Component
  const AnimatedCounter = ({ value, duration = 2000, prefix = '', suffix = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isLoading) {
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
      }
    }, [value, duration, isLoading]);

    return (
      <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {prefix}{isLoading ? '--' : count}{suffix}
      </span>
    );
  };

  const StatCard = ({ title, value, change, icon, color, delay, suffix = '', prefix = '' }) => (
    <div 
      className={`rounded-2xl shadow-2xl border p-6 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 group animate-fade-in-up ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
          : 'bg-white border-gray-100'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <div className="flex items-baseline space-x-1">
            <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
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

  const QuickAction = ({ title, description, icon, color, onClick }) => (
    <button 
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 transform hover:scale-102 group shadow-lg hover:shadow-xl ${
        darkMode 
          ? 'border-gray-700 hover:border-cyan-500 hover:bg-cyan-900/20' 
          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-lg ${color} transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-md`}>
          <span className="text-xl">{icon}</span>
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold transition-colors duration-300 ${
            darkMode ? 'text-gray-200 group-hover:text-cyan-400' : 'text-gray-900 group-hover:text-blue-600'
          }`}>{title}</h4>
          <p className={`text-sm mt-1 ${
            darkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-700'
          }`}>{description}</p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <span className={darkMode ? 'text-cyan-400 text-lg' : 'text-blue-500 text-lg'}>→</span>
        </div>
      </div>
    </button>
  );

  const ActivityItem = ({ activity, index }) => (
    <div 
      className={`flex items-start space-x-4 p-4 rounded-xl border transition-all duration-300 transform hover:scale-102 group animate-slide-in ${
        darkMode 
          ? 'border-gray-700 hover:border-blue-500 hover:bg-blue-900/20' 
          : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mt-1 shadow-md ${
        darkMode ? 'bg-blue-900/50' : 'bg-blue-100'
      }`}>
        <span className="text-lg">{activity.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium transition-colors duration-300 leading-tight ${
          darkMode ? 'text-gray-200 group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'
        }`}>
          {activity.message}
        </p>
        <div className="flex items-center justify-between mt-2">
          <p className={`text-xs ${darkMode ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-500 group-hover:text-gray-600'}`}>
            {activity.time}
          </p>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            activity.status === 'success' ? (darkMode ? 'bg-green-900/30 text-green-400 border border-green-700' : 'bg-green-100 text-green-800') :
            activity.status === 'warning' ? (darkMode ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700' : 'bg-yellow-100 text-yellow-800') :
            (darkMode ? 'bg-blue-900/30 text-blue-400 border border-blue-700' : 'bg-blue-100 text-blue-800')
          }`}>
            {activity.status}
          </span>
        </div>
      </div>
    </div>
  );

  const NotificationItem = ({ notification }) => (
    <div className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300 transform hover:scale-102 ${
      notification.read 
        ? (darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200') 
        : (darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200')
    }`}>
      <div className={`w-2 h-2 rounded-full ${
        notification.read ? (darkMode ? 'bg-gray-600' : 'bg-gray-400') : (darkMode ? 'bg-blue-500 animate-pulse' : 'bg-blue-500 animate-pulse')
      }`}></div>
      <div className="flex-1">
        <p className={`text-sm leading-tight ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
          {notification.message}
        </p>
        <p className={`text-xs capitalize mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          {notification.type}
        </p>
      </div>
    </div>
  );

  const ProgressBar = ({ percentage, color, label }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{label}</span>
        <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{percentage}%</span>
      </div>
      <div className={`w-full rounded-full h-2 overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <div 
          className={`h-full ${color} rounded-full transition-all duration-1000`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );

  const TeamMember = ({ member, index }) => (
    <div 
      className={`flex items-center space-x-3 p-3 rounded-xl border transition-all duration-300 transform hover:scale-102 animate-slide-in ${
        darkMode 
          ? 'border-gray-700 hover:border-cyan-500 hover:bg-cyan-900/20' 
          : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
          {member.avatar}
        </div>
        <div className={`w-2 h-2 rounded-full border-2 ${
          darkMode ? 'border-gray-900' : 'border-white'
        } absolute -top-0.5 -right-0.5 ${
          member.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
        }`}></div>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} truncate`}>
          {member.name}
        </p>
        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>
          {member.role}
        </p>
      </div>
      <div className="text-right">
        <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {member.productivity}%
        </p>
        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          Progress
        </p>
      </div>
    </div>
  );

  const PerformanceMetric = ({ metric, index }) => (
    <div 
      className={`p-4 rounded-2xl border transform transition-all duration-300 hover:scale-105 animate-fade-in-up ${
        darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-white border-gray-100'
      }`}
      style={{ animationDelay: `${index * 200}ms` }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {metric.label}
        </span>
        <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {metric.value}{metric.label === 'Response Time' ? 'ms' : '%'}
        </span>
      </div>
      <div className={`w-full rounded-full h-3 overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <div 
          className={`h-full bg-gradient-to-r ${metric.color} rounded-full transition-all duration-1500`}
          style={{ width: `${metric.value}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen py-8 transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50/30'
    }`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse ${
          darkMode ? 'bg-cyan-500/10' : 'bg-blue-200/20'
        }`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 ${
          darkMode ? 'bg-blue-500/10' : 'bg-indigo-200/20'
        }`}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-4xl font-bold transition-colors duration-500 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Admin Dashboard
              </h1>
              <p className={`mt-2 text-lg transition-colors duration-500 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Welcome back! Here's what's happening today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Time Range Selector */}
              <div className={`flex rounded-lg p-1 border shadow-sm transition-colors duration-500 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                {['daily', 'weekly', 'monthly'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-md text-sm font-medium capitalize transition-all duration-200 ${
                      timeRange === range 
                        ? 'bg-blue-500 text-white shadow-sm' 
                        : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>

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

              {/* Profile */}
              <div className="relative group">
                <div className="w-3 h-3 bg-green-500 rounded-full absolute -top-1 -right-1 animate-ping"></div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-lg transform transition-transform duration-300 group-hover:scale-110 ${
                  darkMode 
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white' 
                    : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                }`}>
                  A
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            change="+12% from last month"
            icon="👥"
            color="bg-gradient-to-br from-blue-500 to-cyan-500"
            delay={0}
          />
          <StatCard
            title="Active Departments"
            value={stats.activeDepartments}
            change="+2 new departments"
            icon="🏢"
            color="bg-gradient-to-br from-green-500 to-emerald-500"
            delay={100}
          />
          <StatCard
            title="System Health"
            value={stats.systemHealth}
            icon="💚"
            color="bg-gradient-to-br from-purple-500 to-pink-500"
            delay={200}
            suffix="%"
          />
          <StatCard
            title="Employee Satisfaction"
            value={stats.employeeSatisfaction}
            change="+5% this quarter"
            icon="⭐"
            color="bg-gradient-to-br from-amber-500 to-orange-500"
            delay={300}
            suffix="%"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className={`rounded-2xl shadow-2xl border p-6 transform transition-all duration-300 hover:shadow-3xl animate-fade-in-up ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  Quick Actions
                </h2>
                <span className={`font-medium text-sm cursor-pointer transition-colors duration-200 ${
                  darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-500 hover:text-blue-600'
                }`}>
                  View all →
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <QuickAction
                  title="Manage Users"
                  description="Add or remove system users"
                  icon="👤"
                  color={darkMode ? "bg-cyan-900/50 text-cyan-400" : "bg-blue-100 text-blue-600"}
                />
                <QuickAction
                  title="System Settings"
                  description="Configure preferences"
                  icon="⚙️"
                  color={darkMode ? "bg-green-900/50 text-green-400" : "bg-green-100 text-green-600"}
                />
                <QuickAction
                  title="View Reports"
                  description="Generate analytics"
                  icon="📊"
                  color={darkMode ? "bg-purple-900/50 text-purple-400" : "bg-purple-100 text-purple-600"}
                />
                <QuickAction
                  title="Employee Onboarding"
                  description="Manage new hires"
                  icon="🎯"
                  color={darkMode ? "bg-amber-900/50 text-amber-400" : "bg-amber-100 text-amber-600"}
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`rounded-2xl shadow-2xl border p-6 transform transition-all duration-300 hover:shadow-3xl animate-fade-in-up ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  Recent Activity
                </h2>
                <span className={`font-medium text-sm cursor-pointer transition-colors duration-200 ${
                  darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-500 hover:text-blue-600'
                }`}>
                  See all →
                </span>
              </div>
              <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                {recentActivity.map((activity, index) => (
                  <ActivityItem key={activity.id} activity={activity} index={index} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className={`rounded-2xl shadow-2xl border p-6 transform transition-all duration-300 hover:shadow-3xl animate-fade-in-up ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  Notifications
                </h3>
                <span className={`text-sm font-medium ${
                  darkMode ? 'text-cyan-400' : 'text-blue-500'
                }`}>
                  3 new
                </span>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                {notifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className={`rounded-2xl shadow-2xl border p-6 transform transition-all duration-300 hover:shadow-3xl animate-fade-in-up ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                System Performance
              </h3>
              <div className="space-y-4">
                {performanceData.map((metric, index) => (
                  <PerformanceMetric key={index} metric={metric} index={index} />
                ))}
              </div>
            </div>

            {/* Team Overview */}
            <div className={`rounded-2xl shadow-2xl border p-6 transform transition-all duration-300 hover:shadow-3xl animate-fade-in-up ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Team Overview
              </h3>
              <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                {teamMembers.map((member, index) => (
                  <TeamMember key={member.id} member={member} index={index} />
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className={`rounded-2xl shadow-2xl border p-6 transform transition-all duration-300 hover:shadow-3xl animate-fade-in-up ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Upcoming Events
              </h3>
              <div className="space-y-3">
                <div className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300 ${
                  darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                    15
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Team Meeting</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>10:00 AM • Conference Room A</p>
                  </div>
                </div>
                <div className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300 ${
                  darkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'
                }`}>
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                    16
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Project Review</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>2:00 PM • Virtual Meeting</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-slide-in {
          animation: slideIn 0.6s ease-out forwards;
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }

        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${darkMode ? '#374151' : '#f1f5f9'};
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${darkMode ? '#4b5563' : '#cbd5e1'};
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? '#6b7280' : '#94a3b8'};
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;