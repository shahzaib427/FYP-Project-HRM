import React, { useState, useEffect } from 'react';

const EmployeeDashboard = () => {
  const [stats, setStats] = useState({
    leaveBalance: 0,
    workingDays: 0,
    activeProjects: 0,
    tasksCompleted: 0,
    productivity: 0,
    satisfaction: 0
  });
  
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('monthly');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStats({
        leaveBalance: 18,
        workingDays: 21,
        activeProjects: 4,
        tasksCompleted: 12,
        productivity: 87,
        satisfaction: 92
      });
      
      setUpcomingEvents([
        { id: 1, title: 'Team Meeting', time: 'Tomorrow, 10:00 AM', location: 'Conference Room A', type: 'meeting', color: 'blue', priority: 'high' },
        { id: 2, title: 'Performance Review', time: 'Next Monday, 2:00 PM', location: "Manager's Office", type: 'review', color: 'green', priority: 'medium' },
        { id: 3, title: 'Training Session', time: 'Next Wednesday, 9:00 AM', location: 'Training Room', type: 'training', color: 'yellow', priority: 'medium' },
        { id: 4, title: 'Project Deadline', time: 'This Friday, 5:00 PM', location: 'Remote', type: 'deadline', color: 'purple', priority: 'high' },
        { id: 5, title: 'Team Lunch', time: 'Next Friday, 12:30 PM', location: 'Cafeteria', type: 'social', color: 'pink', priority: 'low' }
      ]);

      setRecentActivity([
        { id: 1, type: 'task', message: 'Completed project documentation for Alpha phase', time: '2 hours ago', icon: '✅', status: 'completed', points: 5 },
        { id: 2, type: 'approval', message: 'Leave request approved for next week', time: '1 day ago', icon: '👍', status: 'approved', points: 2 },
        { id: 3, type: 'update', message: 'Profile information updated successfully', time: '2 days ago', icon: '📝', status: 'updated', points: 1 },
        { id: 4, type: 'message', message: 'New message from team lead regarding project', time: '3 days ago', icon: '💬', status: 'new', points: 1 },
        { id: 5, type: 'achievement', message: 'Completed 50 tasks this month!', time: '1 week ago', icon: '🏆', status: 'achievement', points: 10 }
      ]);

      setTeamMembers([
        { id: 1, name: 'Alex Johnson', role: 'Team Lead', avatar: 'AJ', status: 'online', productivity: 95, projects: 3 },
        { id: 2, name: 'Sarah Chen', role: 'Senior Developer', avatar: 'SC', status: 'online', productivity: 88, projects: 4 },
        { id: 3, name: 'Mike Rodriguez', role: 'UI/UX Designer', avatar: 'MR', status: 'offline', productivity: 92, projects: 2 },
        { id: 4, name: 'Emily Davis', role: 'Data Analyst', avatar: 'ED', status: 'online', productivity: 85, projects: 3 }
      ]);

      setPerformanceData([
        { label: 'Task Completion', value: 92, color: 'from-green-500 to-emerald-500' },
        { label: 'Team Collaboration', value: 88, color: 'from-blue-500 to-cyan-500' },
        { label: 'Meeting Attendance', value: 95, color: 'from-purple-500 to-pink-500' },
        { label: 'Training Progress', value: 78, color: 'from-amber-500 to-orange-500' }
      ]);
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Animated Counter Component
  const AnimatedCounter = ({ value, duration = 2000, suffix = '', prefix = '' }) => {
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

  const StatCard = ({ title, value, description, icon, color, delay, suffix = '' }) => (
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
            <AnimatedCounter value={value} suffix={suffix} />
          </div>
          <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>{description}</p>
        </div>
        <div className={`p-3 rounded-xl ${color} text-white transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 shadow-lg`}>
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

  const EventItem = ({ event, index }) => (
    <div 
      className={`flex items-center space-x-4 p-4 rounded-xl border transition-all duration-300 transform hover:scale-102 group animate-slide-in ${
        darkMode 
          ? 'border-gray-700 hover:border-cyan-500 hover:bg-cyan-900/20' 
          : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={`flex-shrink-0 w-3 h-3 rounded-full bg-${event.color}-500 group-hover:scale-150 transition-transform duration-300`}></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <p className={`text-sm font-medium transition-colors duration-300 ${
            darkMode ? 'text-gray-200 group-hover:text-cyan-400' : 'text-gray-900 group-hover:text-blue-600'
          }`}>{event.title}</p>
          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
            event.priority === 'high' ? 'bg-red-500/20 text-red-400' :
            event.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-green-500/20 text-green-400'
          }`}>
            {event.priority}
          </span>
        </div>
        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{event.time}</p>
        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{event.location}</p>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
        event.type === 'meeting' ? (darkMode ? 'bg-blue-900/30 text-blue-400 border border-blue-700' : 'bg-blue-100 text-blue-800') :
        event.type === 'review' ? (darkMode ? 'bg-green-900/30 text-green-400 border border-green-700' : 'bg-green-100 text-green-800') :
        event.type === 'training' ? (darkMode ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700' : 'bg-yellow-100 text-yellow-800') :
        (darkMode ? 'bg-purple-900/30 text-purple-400 border border-purple-700' : 'bg-purple-100 text-purple-800')
      }`}>
        {event.type}
      </span>
    </div>
  );

  const ActivityItem = ({ activity, index }) => (
    <div 
      className={`flex items-start space-x-4 p-4 rounded-xl border transition-all duration-300 transform hover:scale-102 group animate-slide-in ${
        darkMode 
          ? 'border-gray-700 hover:border-green-500 hover:bg-green-900/20' 
          : 'border-gray-200 hover:border-green-200 hover:bg-green-50'
      }`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mt-1 shadow-md ${
        darkMode ? 'bg-green-900/50' : 'bg-green-100'
      }`}>
        <span className="text-lg">{activity.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium transition-colors duration-300 leading-tight ${
          darkMode ? 'text-gray-200 group-hover:text-green-400' : 'text-gray-900 group-hover:text-green-600'
        }`}>
          {activity.message}
        </p>
        <div className="flex items-center justify-between mt-2">
          <p className={`text-xs ${darkMode ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-500 group-hover:text-gray-600'}`}>
            {activity.time}
          </p>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              activity.status === 'completed' ? (darkMode ? 'bg-green-900/30 text-green-400 border border-green-700' : 'bg-green-100 text-green-800') :
              activity.status === 'approved' ? (darkMode ? 'bg-blue-900/30 text-blue-400 border border-blue-700' : 'bg-blue-100 text-blue-800') :
              activity.status === 'updated' ? (darkMode ? 'bg-purple-900/30 text-purple-400 border border-purple-700' : 'bg-purple-100 text-purple-800') :
              (darkMode ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700' : 'bg-yellow-100 text-yellow-800')
            }`}>
              {activity.status}
            </span>
            <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${
              darkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-800'
            }`}>
              +{activity.points}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const ProgressCard = ({ title, current, total, color, icon }) => (
    <div className={`rounded-2xl shadow-2xl border p-5 transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 ${
      darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{title}</h4>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Progress</span>
          <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{current}/{total}</span>
        </div>
        <div className={`w-full rounded-full h-2 overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div 
            className={`h-full ${color} rounded-full transition-all duration-1000`}
            style={{ width: `${(current / total) * 100}%` }}
          ></div>
        </div>
        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          {Math.round((current / total) * 100)}% completed
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
          {metric.value}%
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
          {member.projects} projects
        </p>
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
                Employee Dashboard
              </h1>
              <p className={`mt-2 text-lg transition-colors duration-500 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Welcome back! Here's your overview for today.
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
                className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 hover:rotate-12 ${
                  darkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 shadow-lg border border-gray-200'
                }`}
              >
                <span className="text-xl">{darkMode ? '🌙' : '☀️'}</span>
              </button>

              {/* Profile */}
              <div className="relative group">
                <div className="w-3 h-3 bg-green-500 rounded-full absolute -top-1 -right-1 animate-ping"></div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg transform transition-transform duration-300 group-hover:scale-110 ${
                  darkMode 
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white' 
                    : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                }`}>
                  JD
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Leave Balance"
            value={stats.leaveBalance}
            description="Days remaining"
            icon="🏖️"
            color="bg-gradient-to-br from-blue-500 to-cyan-500"
            delay={0}
          />
          <StatCard
            title="Working Days"
            value={stats.workingDays}
            description="This month"
            icon="📅"
            color="bg-gradient-to-br from-green-500 to-emerald-500"
            delay={100}
          />
          <StatCard
            title="Active Projects"
            value={stats.activeProjects}
            description="Current assignments"
            icon="🚀"
            color="bg-gradient-to-br from-purple-500 to-pink-500"
            delay={200}
          />
          <StatCard
            title="Productivity"
            value={stats.productivity}
            description="This week"
            icon="📊"
            color="bg-gradient-to-br from-amber-500 to-orange-500"
            delay={300}
            suffix="%"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions & Progress */}
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
                  title="Apply Leave"
                  description="Submit a new leave request"
                  icon="📝"
                  color={darkMode ? "bg-cyan-900/50 text-cyan-400" : "bg-blue-100 text-blue-600"}
                />
                <QuickAction
                  title="View Payslip"
                  description="Access your salary details"
                  icon="💰"
                  color={darkMode ? "bg-green-900/50 text-green-400" : "bg-green-100 text-green-600"}
                />
                <QuickAction
                  title="Update Profile"
                  description="Edit your personal information"
                  icon="👤"
                  color={darkMode ? "bg-purple-900/50 text-purple-400" : "bg-purple-100 text-purple-600"}
                />
                <QuickAction
                  title="Submit Timesheet"
                  description="Log your working hours"
                  icon="⏰"
                  color={darkMode ? "bg-amber-900/50 text-amber-400" : "bg-amber-100 text-amber-600"}
                />
              </div>
            </div>

            {/* Progress Overview */}
            <div className={`rounded-2xl shadow-2xl border p-6 transform transition-all duration-300 hover:shadow-3xl animate-fade-in-up ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  Progress Overview
                </h2>
                <span className={`font-medium text-sm cursor-pointer transition-colors duration-200 ${
                  darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-500 hover:text-blue-600'
                }`}>
                  Details →
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProgressCard 
                  title="Project Alpha" 
                  current={8} 
                  total={12} 
                  color="bg-blue-500" 
                  icon="🎯"
                />
                <ProgressCard 
                  title="Training Modules" 
                  current={5} 
                  total={8} 
                  color="bg-green-500" 
                  icon="📚"
                />
                <ProgressCard 
                  title="Team Tasks" 
                  current={15} 
                  total={20} 
                  color="bg-purple-500" 
                  icon="👥"
                />
                <ProgressCard 
                  title="Goals Q1" 
                  current={3} 
                  total={5} 
                  color="bg-amber-500" 
                  icon="🏆"
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div className={`rounded-2xl shadow-2xl border p-6 transform transition-all duration-300 hover:shadow-3xl animate-fade-in-up ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  Upcoming Events
                </h2>
                <span className={`font-medium text-sm cursor-pointer transition-colors duration-200 ${
                  darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-500 hover:text-blue-600'
                }`}>
                  Calendar →
                </span>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                {upcomingEvents.map((event, index) => (
                  <EventItem key={event.id} event={event} index={index} />
                ))}
              </div>
            </div>

            {/* Team Members */}
            <div className={`rounded-2xl shadow-2xl border p-6 transform transition-all duration-300 hover:shadow-3xl animate-fade-in-up ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  Team Members
                </h2>
                <span className={`font-medium text-sm cursor-pointer transition-colors duration-200 ${
                  darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-500 hover:text-blue-600'
                }`}>
                  View all →
                </span>
              </div>
              <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                {teamMembers.map((member, index) => (
                  <TeamMember key={member.id} member={member} index={index} />
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className={`rounded-2xl shadow-2xl border p-6 transform transition-all duration-300 hover:shadow-3xl animate-fade-in-up ${
              darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Performance Metrics
              </h3>
              <div className="space-y-4">
                {performanceData.map((metric, index) => (
                  <PerformanceMetric key={index} metric={metric} index={index} />
                ))}
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

export default EmployeeDashboard;