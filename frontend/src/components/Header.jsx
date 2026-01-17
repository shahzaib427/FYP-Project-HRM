// import React, { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import {
//   FaBrain, FaBook, FaHeartbeat, FaChartLine, FaUserTie, FaUsers, 
//   FaCalendarAlt, FaMoneyBill, FaChartBar, FaCog, FaSignOutAlt, 
//   FaBriefcase, FaFileContract, FaUserPlus
// } from 'react-icons/fa';

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   // ✅ TOKEN-BASED USER (NO useAuth CRASH)
//   const getUserFromToken = () => {
//     try {
//       const token = localStorage.getItem('authToken');
//       const userStr = localStorage.getItem('user');
//       if (token && userStr) {
//         return JSON.parse(userStr);
//       }
//       return null;
//     } catch {
//       return null;
//     }
//   };

//   const user = getUserFromToken();

//   /* ---------- FIXED ROLE LINKS - HR NOW HAS EMPLOYEES + ALL PAGES ---------- */
//   const roleLinks = {
//     admin: [
//       { path: '/admin/dashboard', label: 'Dashboard', icon: <FaChartBar className="text-sm" /> },
//       { path: '/admin/employees', label: 'Employees', icon: <FaUsers className="text-sm" /> },
//       { path: '/admin/attendance', label: 'Attendance', icon: <FaCalendarAlt className="text-sm" /> },
//       { path: '/admin/payroll', label: 'Payroll', icon: <FaMoneyBill className="text-sm" /> },
//     ],
//     hr: [
//       { path: '/hr/dashboard', label: 'Dashboard', icon: <FaChartBar className="text-sm" /> },
//       { path: '/hr/employees', label: 'Employees', icon: <FaUsers className="text-sm" /> },        // ✅ FIXED
//       { path: '/hr/attendance', label: 'Attendance', icon: <FaCalendarAlt className="text-sm" /> },
//       { path: '/hr/payroll', label: 'Payroll', icon: <FaMoneyBill className="text-sm" /> },
//       { path: '/hr/recruitment', label: 'Recruitment', icon: <FaBriefcase className="text-sm" /> },
//     ],
//     employee: [
//       { path: '/employee/dashboard', label: 'Dashboard', icon: <FaChartBar className="text-sm" /> },
//       { path: '/employee/attendance', label: 'Attendance', icon: <FaCalendarAlt className="text-sm" /> },
//       { path: '/employee/payroll', label: 'Payroll', icon: <FaMoneyBill className="text-sm" /> },
//       { path: '/employee/leave', label: 'Leave', icon: <FaCalendarAlt className="text-sm" /> },
//     ],
//   };

//   /* ---------- DROPDOWN LINKS (Profile, AI, Settings) ---------- */
//   const hrProfileLinks = user?.role === 'hr' ? [
//     { path: '/hr/employees', label: 'Employees', icon: <FaUsers className="text-sm" /> },
//     { path: '/hr/leave', label: 'Leave Management', icon: <FaCalendarAlt className="text-sm" /> },
//     { path: '/hr/reports', label: 'Reports', icon: <FaChartBar className="text-sm" /> },
//     { path: '/hr/contracts', label: 'Contracts', icon: <FaFileContract className="text-sm" /> },
//     { path: '/hr/onboarding', label: 'Onboarding', icon: <FaUserPlus className="text-sm" /> },
//   ] : [];

//   const adminProfileLinks = user?.role === 'admin' ? [
//     { path: '/admin/profile', label: 'Profile', icon: <FaUserTie className="text-sm" /> },
//     { path: '/admin/settings', label: 'Settings', icon: <FaCog className="text-sm" /> },
//   ] : [];

//   const employeeProfileLinks = user?.role === 'employee' ? [
//     { path: '/employee/profile', label: 'Profile', icon: <FaUserTie className="text-sm" /> },
//     { path: '/employee/settings', label: 'Settings', icon: <FaCog className="text-sm" /> },
//   ] : [];

//   const aiLinks = user?.role === 'employee' ? [
//     { path: '/employee/career-coach', label: 'Career Coach', icon: <FaBrain className="text-sm" /> },
//     { path: '/employee/learning-hub', label: 'Learning Hub', icon: <FaBook className="text-sm" /> },
//     { path: '/employee/wellness', label: 'Wellness', icon: <FaHeartbeat className="text-sm" /> },
//     { path: '/employee/productivity', label: 'Productivity', icon: <FaChartLine className="text-sm" /> },
//   ] : [];

//   const publicLinks = [
//     { path: '/', label: 'Home' },
//     { path: '/about', label: 'About' },
//     { path: '/services', label: 'Services' },
//     { path: '/contact', label: 'Contact' },
//   ];

//   const getLinks = () => (!user ? publicLinks : roleLinks[user.role] || []);

//   /* ---------- TOKEN LOGOUT ---------- */
//   const handleLogout = () => {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('user');
//     navigate('/login', { replace: true });
//     setIsMenuOpen(false);
//     setIsProfileOpen(false);
//   };

//   const NavItem = ({ path, label, icon }) => (
//     <Link
//       to={path}
//       className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
//         location.pathname === path
//           ? 'bg-blue-600 text-white shadow-md'
//           : 'text-slate-300 hover:bg-slate-700 hover:text-white'
//       }`}
//       onClick={() => setIsMenuOpen(false)}
//     >
//       {icon && <span className="flex-shrink-0">{icon}</span>}
//       <span className="whitespace-nowrap">{label}</span>
//     </Link>
//   );

//   const DropdownLink = ({ to, children, onClick }) => (
//     <Link
//       to={to}
//       className="flex items-center px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
//       onClick={onClick}
//     >
//       {children}
//     </Link>
//   );

//   return (
//     <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white sticky top-0 z-50 shadow-lg">
//       <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
//         {/* LOGO */}
//         <Link
//           to={!user ? '/' : `/${user.role}/dashboard`}
//           className="flex items-center space-x-3 hover:opacity-90 transition-opacity flex-shrink-0"
//         >
//           <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
//             <FaUserTie className="text-lg" />
//           </div>
//           <div className="hidden sm:block">
//             <div className="font-bold text-lg leading-tight">HRM System</div>
//             <div className="text-xs text-slate-300 leading-tight">Human Resource Management</div>
//           </div>
//         </Link>

//         {/* DESKTOP NAV */}
//         <nav className="hidden md:flex items-center space-x-1 ml-4">
//           {getLinks().map(link => (
//             <NavItem key={link.path} {...link} />
//           ))}

//           {!user && (
//             <NavItem 
//               path="/login" 
//               label="Login" 
//               icon={<span className="text-sm">🔐</span>} 
//             />
//           )}

//           {user && (
//             <div className="relative ml-2">
//               <button
//                 onClick={() => setIsProfileOpen(!isProfileOpen)}
//                 className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
//               >
//                 <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
//                   <span className="font-medium">
//                     {user.name?.charAt(0).toUpperCase() || 'U'}
//                   </span>
//                 </div>
//                 <div className="text-left">
//                   <div className="text-sm font-medium leading-tight">{user.name || 'User'}</div>
//                   <div className="text-xs opacity-80 capitalize">{user.role}</div>
//                 </div>
//               </button>

//               {/* PROFILE DROPDOWN */}
//               {isProfileOpen && (
//                 <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
//                   {/* User Info */}
//                   <div className="px-4 py-3 border-b border-slate-700">
//                     <div className="font-semibold text-white truncate">{user.name}</div>
//                     <div className="text-xs text-slate-400 capitalize mt-1">{user.role}</div>
//                     <div className="text-xs text-slate-500 truncate mt-1">{user.email}</div>
//                   </div>

//                   {/* HR Profile Links */}
//                   {user.role === 'hr' && (
//                     <div className="py-1">
//                       <div className="px-4 py-2 text-xs uppercase tracking-wider text-slate-400 font-medium">
//                         HR Management
//                       </div>
//                       {hrProfileLinks.map(link => (
//                         <DropdownLink 
//                           key={link.path} 
//                           to={link.path} 
//                           onClick={() => setIsProfileOpen(false)}
//                         >
//                           <span className="mr-3 text-slate-400">{link.icon}</span>
//                           <span>{link.label}</span>
//                         </DropdownLink>
//                       ))}
//                     </div>
//                   )}

//                   {/* Admin Profile Links */}
//                   {user.role === 'admin' && (
//                     <div className="py-1">
//                       <div className="px-4 py-2 text-xs uppercase tracking-wider text-slate-400 font-medium">
//                         Administration
//                       </div>
//                       {adminProfileLinks.map(link => (
//                         <DropdownLink 
//                           key={link.path} 
//                           to={link.path} 
//                           onClick={() => setIsProfileOpen(false)}
//                         >
//                           <span className="mr-3 text-slate-400">{link.icon}</span>
//                           <span>{link.label}</span>
//                         </DropdownLink>
//                       ))}
//                     </div>
//                   )}

//                   {/* Employee Profile Links + AI Tools */}
//                   {user.role === 'employee' && (
//                     <>
//                       <div className="py-1">
//                         <div className="px-4 py-2 text-xs uppercase tracking-wider text-slate-400 font-medium">
//                           My Account
//                         </div>
//                         {employeeProfileLinks.map(link => (
//                           <DropdownLink 
//                             key={link.path} 
//                             to={link.path} 
//                             onClick={() => setIsProfileOpen(false)}
//                           >
//                             <span className="mr-3 text-slate-400">{link.icon}</span>
//                             <span>{link.label}</span>
//                           </DropdownLink>
//                         ))}
//                       </div>

//                       {/* AI Tools */}
//                       <div className="border-t border-slate-700 py-1">
//                         <div className="px-4 py-2 text-xs uppercase tracking-wider text-slate-400 font-medium">
//                           AI Tools
//                         </div>
//                         {aiLinks.map(a => (
//                           <DropdownLink 
//                             key={a.path} 
//                             to={a.path} 
//                             onClick={() => setIsProfileOpen(false)}
//                           >
//                             <span className="mr-3 text-slate-400">{a.icon}</span>
//                             <span>{a.label}</span>
//                           </DropdownLink>
//                         ))}
//                       </div>
//                     </>
//                   )}

//                   {/* Logout */}
//                   <div className="border-t border-slate-700">
//                     <button
//                       onClick={handleLogout}
//                       className="w-full flex items-center px-4 py-3 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors"
//                     >
//                       <FaSignOutAlt className="mr-3" />
//                       Logout
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </nav>

//         {/* MOBILE MENU BUTTON */}
//         <button
//           className="md:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//           aria-label="Toggle menu"
//         >
//           {isMenuOpen ? (
//             <span className="text-xl">✕</span>
//           ) : (
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           )}
//         </button>
//       </div>

//       {/* MOBILE MENU */}
//       {isMenuOpen && (
//         <div className="md:hidden bg-slate-900 border-t border-slate-700 p-4 space-y-1">
//           {getLinks().map(link => (
//             <NavItem key={link.path} {...link} />
//           ))}

//           {!user && (
//             <NavItem 
//               path="/login" 
//               label="Login" 
//               icon={<span className="text-sm">🔐</span>} 
//             />
//           )}

//           {user && (
//             <>
//               <div className="pt-3 border-t border-slate-700">
//                 <div className="px-3 py-2 text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">
//                   Account
//                 </div>
                
//                 {user.role === 'hr' && hrProfileLinks.map(link => (
//                   <NavItem key={link.path} {...link} />
//                 ))}
                
//                 {user.role === 'admin' && adminProfileLinks.map(link => (
//                   <NavItem key={link.path} {...link} />
//                 ))}
                
//                 {user.role === 'employee' && (
//                   <>
//                     {employeeProfileLinks.map(link => (
//                       <NavItem key={link.path} {...link} />
//                     ))}
//                     <div className="mt-3 pt-3 border-t border-slate-700">
//                       <div className="px-3 py-2 text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">
//                         AI Tools
//                       </div>
//                       {aiLinks.map(a => (
//                         <NavItem key={a.path} {...a} />
//                       ))}
//                     </div>
//                   </>
//                 )}
//               </div>

//               <button
//                 onClick={handleLogout}
//                 className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-400 hover:bg-slate-700 rounded transition-colors mt-2"
//               >
//                 <FaSignOutAlt />
//                 <span>Logout</span>
//               </button>
//             </>
//           )}
//         </div>
//       )}

//       {/* Backdrop for dropdown */}
//       {isProfileOpen && (
//         <div 
//           className="fixed inset-0 z-40"
//           onClick={() => setIsProfileOpen(false)}
//         />
//       )}
//     </header>
//   );
// };

// export default Header;
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaBrain, FaBook, FaHeartbeat, FaChartLine, FaUserTie, FaUsers, 
  FaCalendarAlt, FaMoneyBill, FaChartBar, FaCog, FaSignOutAlt, 
  FaBriefcase, FaFileContract, FaUserPlus
} from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ TOKEN-BASED USER (NO useAuth CRASH)
  const getUserFromToken = () => {
    try {
      const token = localStorage.getItem('authToken');
      const userStr = localStorage.getItem('user');
      if (token && userStr) {
        return JSON.parse(userStr);
      }
      return null;
    } catch {
      return null;
    }
  };

  const user = getUserFromToken();

  /* ---------- FIXED ROLE LINKS - HR WITHOUT EMPLOYEES & PAYROLL ---------- */
  const roleLinks = {
    admin: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: <FaChartBar className="text-sm" /> },
      { path: '/admin/employees', label: 'Employees', icon: <FaUsers className="text-sm" /> },
      { path: '/admin/attendance', label: 'Attendance', icon: <FaCalendarAlt className="text-sm" /> },
      { path: '/admin/payroll', label: 'Payroll', icon: <FaMoneyBill className="text-sm" /> },
    ],
    hr: [
      { path: '/hr/dashboard', label: 'Dashboard', icon: <FaChartBar className="text-sm" /> },
      { path: '/hr/recruitment', label: 'Recruitment', icon: <FaBriefcase className="text-sm" /> },
      { path: '/hr/leave', label: 'Leave', icon: <FaCalendarAlt className="text-sm" /> },
      { path: '/hr/contracts', label: 'Contracts', icon: <FaFileContract className="text-sm" /> },
      { path: '/hr/onboarding', label: 'Onboarding', icon: <FaUserPlus className="text-sm" /> },
    ],
    employee: [
      { path: '/employee/dashboard', label: 'Dashboard', icon: <FaChartBar className="text-sm" /> },
      { path: '/employee/attendance', label: 'Attendance', icon: <FaCalendarAlt className="text-sm" /> },
      { path: '/employee/payroll', label: 'Payroll', icon: <FaMoneyBill className="text-sm" /> },
      { path: '/employee/leave', label: 'Leave', icon: <FaCalendarAlt className="text-sm" /> },
    ],
  };

  /* ---------- DROPDOWN LINKS (Profile, AI, Settings) ---------- */
  const hrProfileLinks = user?.role === 'hr' ? [
    { path: '/hr/reports', label: 'Reports', icon: <FaChartBar className="text-sm" /> },
    { path: '/hr/profile', label: 'Profile', icon: <FaUserTie className="text-sm" /> },
    { path: '/hr/settings', label: 'Settings', icon: <FaCog className="text-sm" /> },
  ] : [];

  const adminProfileLinks = user?.role === 'admin' ? [
    { path: '/admin/leave', label: 'Leave', icon: <FaCalendarAlt className="text-sm" /> },
    { path: '/admin/reports', label: 'Reports', icon: <FaChartBar className="text-sm" /> },
    { path: '/admin/profile', label: 'Profile', icon: <FaUserTie className="text-sm" /> },
    { path: '/admin/settings', label: 'Settings', icon: <FaCog className="text-sm" /> },
  ] : [];

  const employeeProfileLinks = user?.role === 'employee' ? [
    { path: '/employee/profile', label: 'Profile', icon: <FaUserTie className="text-sm" /> },
    { path: '/employee/settings', label: 'Settings', icon: <FaCog className="text-sm" /> },
  ] : [];

  const aiLinks = user?.role === 'employee' ? [
    { path: '/employee/career-coach', label: 'Career Coach', icon: <FaBrain className="text-sm" /> },
    { path: '/employee/learning-hub', label: 'Learning Hub', icon: <FaBook className="text-sm" /> },
    { path: '/employee/wellness', label: 'Wellness', icon: <FaHeartbeat className="text-sm" /> },
    { path: '/employee/productivity', label: 'Productivity', icon: <FaChartLine className="text-sm" /> },
  ] : [];

  const publicLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/contact', label: 'Contact' },
  ];

  const getLinks = () => (!user ? publicLinks : roleLinks[user.role] || []);

  /* ---------- TOKEN LOGOUT ---------- */
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const NavItem = ({ path, label, icon }) => (
    <Link
      to={path}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
        location.pathname === path
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
      }`}
      onClick={() => setIsMenuOpen(false)}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="whitespace-nowrap">{label}</span>
    </Link>
  );

  const DropdownLink = ({ to, children, onClick }) => (
    <Link
      to={to}
      className="flex items-center px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
      onClick={onClick}
    >
      {children}
    </Link>
  );

  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to={!user ? '/' : `/${user.role}/dashboard`}
          className="flex items-center space-x-3 hover:opacity-90 transition-opacity flex-shrink-0"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
            <FaUserTie className="text-lg" />
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-lg leading-tight">HRM System</div>
            <div className="text-xs text-slate-300 leading-tight">Human Resource Management</div>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center space-x-1 ml-4">
          {getLinks().map(link => (
            <NavItem key={link.path} {...link} />
          ))}

          {!user && (
            <NavItem 
              path="/login" 
              label="Login" 
              icon={<span className="text-sm">🔐</span>} 
            />
          )}

          {user && (
            <div className="relative ml-2">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="font-medium">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium leading-tight">{user.name || 'User'}</div>
                  <div className="text-xs opacity-80 capitalize">{user.role}</div>
                </div>
              </button>

              {/* PROFILE DROPDOWN */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-slate-700">
                    <div className="font-semibold text-white truncate">{user.name}</div>
                    <div className="text-xs text-slate-400 capitalize mt-1">{user.role}</div>
                    <div className="text-xs text-slate-500 truncate mt-1">{user.email}</div>
                  </div>

                  {/* HR Profile Links */}
                  {user.role === 'hr' && (
                    <div className="py-1">
                      <div className="px-4 py-2 text-xs uppercase tracking-wider text-slate-400 font-medium">
                        HR Management
                      </div>
                      {hrProfileLinks.map(link => (
                        <DropdownLink 
                          key={link.path} 
                          to={link.path} 
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <span className="mr-3 text-slate-400">{link.icon}</span>
                          <span>{link.label}</span>
                        </DropdownLink>
                      ))}
                    </div>
                  )}

                  {/* Admin Profile Links */}
                  {user.role === 'admin' && (
                    <div className="py-1">
                      <div className="px-4 py-2 text-xs uppercase tracking-wider text-slate-400 font-medium">
                        Administration
                      </div>
                      {adminProfileLinks.map(link => (
                        <DropdownLink 
                          key={link.path} 
                          to={link.path} 
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <span className="mr-3 text-slate-400">{link.icon}</span>
                          <span>{link.label}</span>
                        </DropdownLink>
                      ))}
                    </div>
                  )}

                  {/* Employee Profile Links + AI Tools */}
                  {user.role === 'employee' && (
                    <>
                      <div className="py-1">
                        <div className="px-4 py-2 text-xs uppercase tracking-wider text-slate-400 font-medium">
                          My Account
                        </div>
                        {employeeProfileLinks.map(link => (
                          <DropdownLink 
                            key={link.path} 
                            to={link.path} 
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <span className="mr-3 text-slate-400">{link.icon}</span>
                            <span>{link.label}</span>
                          </DropdownLink>
                        ))}
                      </div>

                      {/* AI Tools */}
                      <div className="border-t border-slate-700 py-1">
                        <div className="px-4 py-2 text-xs uppercase tracking-wider text-slate-400 font-medium">
                          AI Tools
                        </div>
                        {aiLinks.map(a => (
                          <DropdownLink 
                            key={a.path} 
                            to={a.path} 
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <span className="mr-3 text-slate-400">{a.icon}</span>
                            <span>{a.label}</span>
                          </DropdownLink>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Logout */}
                  <div className="border-t border-slate-700">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors"
                    >
                      <FaSignOutAlt className="mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <span className="text-xl">✕</span>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-700 p-4 space-y-1">
          {getLinks().map(link => (
            <NavItem key={link.path} {...link} />
          ))}

          {!user && (
            <NavItem 
              path="/login" 
              label="Login" 
              icon={<span className="text-sm">🔐</span>} 
            />
          )}

          {user && (
            <>
              <div className="pt-3 border-t border-slate-700">
                <div className="px-3 py-2 text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">
                  Account
                </div>
                
                {user.role === 'hr' && hrProfileLinks.map(link => (
                  <NavItem key={link.path} {...link} />
                ))}
                
                {user.role === 'admin' && adminProfileLinks.map(link => (
                  <NavItem key={link.path} {...link} />
                ))}
                
                {user.role === 'employee' && (
                  <>
                    {employeeProfileLinks.map(link => (
                      <NavItem key={link.path} {...link} />
                    ))}
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <div className="px-3 py-2 text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">
                        AI Tools
                      </div>
                      {aiLinks.map(a => (
                        <NavItem key={a.path} {...a} />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-400 hover:bg-slate-700 rounded transition-colors mt-2"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Backdrop for dropdown */}
      {isProfileOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;