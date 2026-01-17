// 
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';

// Employee Pages
import EmployeeDashboard from './components/employee/EmployeeDashboard';
import EmployeeAttendance from './components/employee/EmployeeAttendance';
import EmployeePayroll from './components/employee/EmployeePayroll';
import EmployeeLeave from './components/employee/EmployeeLeave';
import EmployeeProfile from './components/employee/EmployeeProfile';
import EmployeeSettings from './components/employee/EmployeeSettings';
import CareerCoach from './components/employee/CareerCoach';
import LearningHub from './components/employee/LearningHub';
import Wellness from './components/employee/wellness';
import Productivity from './components/employee/productivity';

// Admin Pages
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminEmployee from './components/Admin/AdminEmployee';
import AdminAttendance from './components/Admin/AdminAttendance';
import AdminPayroll from './components/Admin/AdminPayroll';
import AdminLeave from './components/Admin/AdminLeave';
import AdminReports from './components/Admin/AdminReports';
import AdminProfile from './components/Admin/AdminProfile';
import AdminSettings from './components/Admin/AdminSettings';

// HR Pages
import HRDashboard from './components/HR/HRDashboard';
import HRRecruitment from './components/HR/HRRecruitment';
import HRLeave from './components/HR/HRLeave';

// CRUD Components for Employees
import AddEmployee from './components/Admin/AddEmployee';
import EditEmployee from './components/Admin/EditEmployee';
import EmployeeDetails from './components/Admin/EmployeeDetails';

// Placeholder components for HR pages not yet created
const HRContracts = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">HR Contracts Management</h1>
        <p className="text-gray-600">Contract management portal - Under development</p>
      </div>
    </div>
  </div>
);

const HROnboarding = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Employee Onboarding</h1>
        <p className="text-gray-600">Onboarding portal - Under development</p>
      </div>
    </div>
  </div>
);

// Placeholder for HR Employee Management (not accessible to HR)
const HREmployeePlaceholder = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Employee Management</h1>
        <p className="text-gray-600">Employee management is handled by administrators. Please contact your system administrator for employee-related queries.</p>
      </div>
    </div>
  </div>
);

// Placeholder for HR Payroll (not accessible to HR)
const HRPayrollPlaceholder = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Payroll Management</h1>
        <p className="text-gray-600">Payroll management is handled by administrators. Please contact your system administrator for payroll-related queries.</p>
      </div>
    </div>
  </div>
);

// Placeholder for HR Attendance (not accessible to HR)
const HRAttendancePlaceholder = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Attendance Management</h1>
        <p className="text-gray-600">Attendance management is handled by administrators. Please contact your system administrator for attendance-related queries.</p>
      </div>
    </div>
  </div>
);

// Generic 404 / Placeholder
const Placeholder404 = ({ title = "Page not found" }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50/30">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-gray-600 text-lg mb-8">This page is under construction or does not exist</p>
      <button
        onClick={() => window.history.back()}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
      >
        Go Back
      </button>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* ================= PUBLIC ROUTES ================= */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />

              {/* ================= EMPLOYEE ROUTES ================= */}
              <Route path="/employee/dashboard" element={
                <ProtectedRoute allowedRoles={['employee']}><EmployeeDashboard /></ProtectedRoute>
              } />
              <Route path="/employee/attendance" element={
                <ProtectedRoute allowedRoles={['employee']}><EmployeeAttendance /></ProtectedRoute>
              } />
              <Route path="/employee/payroll" element={
                <ProtectedRoute allowedRoles={['employee']}><EmployeePayroll /></ProtectedRoute>
              } />
              <Route path="/employee/leave" element={
                <ProtectedRoute allowedRoles={['employee']}><EmployeeLeave /></ProtectedRoute>
              } />
              <Route path="/employee/profile" element={
                <ProtectedRoute allowedRoles={['employee']}><EmployeeProfile /></ProtectedRoute>
              } />
              <Route path="/employee/settings" element={
                <ProtectedRoute allowedRoles={['employee']}><EmployeeSettings /></ProtectedRoute>
              } />
              <Route path="/employee/career-coach" element={
                <ProtectedRoute allowedRoles={['employee']}><CareerCoach /></ProtectedRoute>
              } />
              <Route path="/employee/learning-hub" element={
                <ProtectedRoute allowedRoles={['employee']}><LearningHub /></ProtectedRoute>
              } />
              <Route path="/employee/wellness" element={
                <ProtectedRoute allowedRoles={['employee']}><Wellness /></ProtectedRoute>
              } />
              <Route path="/employee/productivity" element={
                <ProtectedRoute allowedRoles={['employee']}><Productivity /></ProtectedRoute>
              } />
              {/* Catch-all for unfinished Employee pages */}
              <Route path="/employee/*" element={
                <ProtectedRoute allowedRoles={['employee']}><Placeholder404 title="Employee Page Not Found" /></ProtectedRoute>
              } />
              {/* Redirect employee root */}
              <Route path="/employee" element={<Navigate to="/employee/dashboard" replace />} />

              {/* ================= ADMIN ROUTES ================= */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
              } />
              
              {/* Employee Management CRUD Routes */}
              <Route path="/admin/employees" element={
                <ProtectedRoute allowedRoles={['admin']}><AdminEmployee /></ProtectedRoute>
              } />
              <Route path="/admin/employees/new" element={
                <ProtectedRoute allowedRoles={['admin']}><AddEmployee /></ProtectedRoute>
              } />
              <Route path="/admin/employees/edit/:id" element={
                <ProtectedRoute allowedRoles={['admin']}><EditEmployee /></ProtectedRoute>
              } />
              <Route path="/admin/employees/:id" element={
                <ProtectedRoute allowedRoles={['admin']}><EmployeeDetails /></ProtectedRoute>
              } />
              
              <Route path="/admin/attendance" element={
                <ProtectedRoute allowedRoles={['admin']}><AdminAttendance /></ProtectedRoute>
              } />
              <Route path="/admin/payroll" element={
                <ProtectedRoute allowedRoles={['admin']}><AdminPayroll /></ProtectedRoute>
              } />
              <Route path="/admin/leave" element={
                <ProtectedRoute allowedRoles={['admin']}><AdminLeave /></ProtectedRoute>
              } />
              <Route path="/admin/reports" element={
                <ProtectedRoute allowedRoles={['admin']}><AdminReports /></ProtectedRoute>
              } />
              <Route path="/admin/profile" element={
                <ProtectedRoute allowedRoles={['admin']}><AdminProfile /></ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>
              } />
              
              {/* Catch-all for unfinished Admin pages */}
              <Route path="/admin/*" element={
                <ProtectedRoute allowedRoles={['admin']}><Placeholder404 title="Admin Page Not Found" /></ProtectedRoute>
              } />
              {/* Redirect admin root */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

              {/* ================= HR ROUTES ================= */}
              <Route path="/hr/dashboard" element={
                <ProtectedRoute allowedRoles={['hr']}><HRDashboard /></ProtectedRoute>
              } />
              
              {/* HR does NOT have employee management access - Show placeholder */}
              <Route path="/hr/employees" element={
                <ProtectedRoute allowedRoles={['hr']}><HREmployeePlaceholder /></ProtectedRoute>
              } />
              <Route path="/hr/employees/new" element={
                <ProtectedRoute allowedRoles={['hr']}><HREmployeePlaceholder /></ProtectedRoute>
              } />
              <Route path="/hr/employees/edit/:id" element={
                <ProtectedRoute allowedRoles={['hr']}><HREmployeePlaceholder /></ProtectedRoute>
              } />
              <Route path="/hr/employees/:id" element={
                <ProtectedRoute allowedRoles={['hr']}><HREmployeePlaceholder /></ProtectedRoute>
              } />
              
              {/* HR does NOT have attendance access - Show placeholder */}
              <Route path="/hr/attendance" element={
                <ProtectedRoute allowedRoles={['hr']}><HRAttendancePlaceholder /></ProtectedRoute>
              } />
              
              {/* HR does NOT have payroll access - Show placeholder */}
              <Route path="/hr/payroll" element={
                <ProtectedRoute allowedRoles={['hr']}><HRPayrollPlaceholder /></ProtectedRoute>
              } />
              
              {/* HR-specific pages */}
              <Route path="/hr/recruitment" element={
                <ProtectedRoute allowedRoles={['hr']}><HRRecruitment /></ProtectedRoute>
              } />
              <Route path="/hr/leave" element={
                <ProtectedRoute allowedRoles={['hr']}><HRLeave /></ProtectedRoute>
              } />
              
              {/* HR reports (using admin component) */}
              <Route path="/hr/reports" element={
                <ProtectedRoute allowedRoles={['hr']}><AdminReports /></ProtectedRoute>
              } />
              
              <Route path="/hr/contracts" element={
                <ProtectedRoute allowedRoles={['hr']}><HRContracts /></ProtectedRoute>
              } />
              <Route path="/hr/onboarding" element={
                <ProtectedRoute allowedRoles={['hr']}><HROnboarding /></ProtectedRoute>
              } />
              <Route path="/hr/profile" element={
                <ProtectedRoute allowedRoles={['hr']}><AdminProfile /></ProtectedRoute>
              } />
              <Route path="/hr/settings" element={
                <ProtectedRoute allowedRoles={['hr']}><AdminSettings /></ProtectedRoute>
              } />
              
              {/* Catch-all for unfinished HR pages */}
              <Route path="/hr/*" element={
                <ProtectedRoute allowedRoles={['hr']}><Placeholder404 title="HR Page Not Found" /></ProtectedRoute>
              } />
              {/* Redirect hr root */}
              <Route path="/hr" element={<Navigate to="/hr/dashboard" replace />} />

              {/* ================= GLOBAL 404 ================= */}
              <Route path="*" element={<Placeholder404 />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;