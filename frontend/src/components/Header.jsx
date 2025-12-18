import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Mock user data - replace with actual authentication context
  const user = JSON.parse(localStorage.getItem('user')) || null;

  const publicNavLinks = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/about', label: 'About', icon: 'info' },
    { path: '/services', label: 'Services', icon: 'services' },
    { path: '/contact', label: 'Contact', icon: 'contact' },
  ];

  // In Header.jsx, modify the getRoleBasedLinks function:
const getRoleBasedLinks = () => {
  if (!user) return publicNavLinks;

  const links = {
    admin: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
      { path: '/admin/users', label: 'Users', icon: 'users' },
      { path: '/admin/employees', label: 'Employees', icon: 'employees' },
      { path: '/admin/analytics', label: 'Analytics', icon: 'analytics' },
      { path: '/admin/settings', label: 'Settings', icon: 'settings' },
    ],
    hr: [
      { path: '/hr/dashboard', label: 'Dashboard', icon: 'dashboard' },
      { path: '/hr/employees', label: 'Employees', icon: 'employees' },
      { path: '/hr/leave', label: 'Leave', icon: 'leave' },
      { path: '/hr/payroll', label: 'Payroll', icon: 'payroll' },
      { path: '/hr/recruitment', label: 'Recruitment', icon: 'recruitment' },
    ],
    employee: [
      { path: '/employee/dashboard', label: 'Dashboard', icon: 'dashboard' },
      { path: '/employee/profile', label: 'Profile', icon: 'profile' },
      { path: '/employee/leave', label: 'My Leave', icon: 'leave' },
      { path: '/employee/payroll', label: 'Payroll', icon: 'payroll' },
      { path: '/employee/attendance', label: 'Attendance', icon: 'attendance' },
    ],
  };

  return links[user.role] || publicNavLinks;
};


  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsProfileOpen(false);
    navigate('/');
    window.location.reload();
  };

  const getRoleBadge = () => {
    switch (user?.role) {
      case 'admin': return { text: 'Administrator', class: 'bg-red-100 text-red-700 border-red-200' };
      case 'hr': return { text: 'HR Manager', class: 'bg-blue-100 text-blue-700 border-blue-200' };
      case 'employee': return { text: 'Employee', class: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
      default: return { text: 'Guest', class: 'bg-gray-100 text-gray-700 border-gray-200' };
    }
  };

  // Icon mapping for professional icons
  const getIcon = (iconName) => {
    const iconClass = "w-5 h-5";
    
    const icons = {
      home: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      info: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      services: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      contact: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      dashboard: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      users: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      employees: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      analytics: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      settings: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      leave: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      payroll: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      recruitment: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
        </svg>
      ),
      profile: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      attendance: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    };

    return icons[iconName] || icons.info;
  };

  const navLinks = getRoleBasedLinks();
  const roleBadge = getRoleBadge();

  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 shadow-xl border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to={user ? `/${user.role}/dashboard` : '/'} 
              className="flex items-center space-x-3 group"
            >
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-2 rounded-xl shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">HRM Pro</h1>
                <p className="text-xs text-slate-300">
                  {user?.company || 'Enterprise Solutions'}
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'bg-blue-500/20 text-blue-300 border-l-2 border-blue-400 shadow-lg shadow-blue-500/10'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:shadow-lg'
                }`}
              >
                {getIcon(link.icon)}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            
            {/* Notifications */}
            {user && (
              <div className="relative">
                <button className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all duration-200 hover:shadow-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-4.66-7.5 1 1 0 00-1.17-1.17 5.97 5.97 0 01-7.5 4.66 1 1 0 00-1.17 1.17 5.97 5.97 0 014.66 7.5 1 1 0 001.17 1.17 5.97 5.97 0 017.5-4.66 1 1 0 001.17-1.17z" />
                  </svg>
                </button>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-slate-900">
                  3
                </span>
              </div>
            )}

            {/* Auth Buttons / User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl px-3 py-2 transition-all duration-200 hover:shadow-lg border border-slate-700"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-1 rounded-full shadow-lg">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12a5 5 0 110-10 5 5 0 010 10zm0 2c-4.42 0-8 3.58-8 8h16c0-4.42-3.58-8-8-8z"/>
                      </svg>
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-sm font-medium text-white">
                        {user.name || 'User Name'}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full border ${roleBadge.class}`}>
                        {roleBadge.text}
                      </span>
                    </div>
                  </div>
                  <svg 
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isProfileOpen ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 py-2 z-50 backdrop-blur-lg">
                    <div className="px-4 py-3 border-b border-slate-700">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-sm text-slate-300">{user.email}</p>
                      <span className={`inline-block mt-1 text-xs px-2 py-1 rounded-full border ${roleBadge.class}`}>
                        {roleBadge.text}
                      </span>
                    </div>
                    
                    <Link
                      to={`/${user.role}/profile`}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      {getIcon('profile')}
                      <span>My Profile</span>
                    </Link>
                    
                    <Link
                      to={`/${user.role}/settings`}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      {getIcon('settings')}
                      <span>Settings</span>
                    </Link>
                    
                    <div className="border-t border-slate-700 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 hover:scale-105"
                >
                  Login
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-700 py-4 bg-slate-800/95 backdrop-blur-lg rounded-b-xl">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'bg-blue-500/20 text-blue-300 border-l-4 border-blue-400 shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  {getIcon(link.icon)}
                  <span>{link.label}</span>
                </Link>
              ))}
              
              {!user && (
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-3 rounded-xl font-medium text-center hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 mt-4 shadow-lg hover:shadow-blue-500/25"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;