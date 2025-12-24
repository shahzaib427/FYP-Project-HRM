import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import DashboardWrapper from './pages/DashboardWrapper';

// Import components - create placeholders for missing ones
import AdminDashboard from './components/Admin/AdminDashboard';
import HRDashboard from './components/HR/HRDashboard';
import EmployeeDashboard from './components/employee/EmployeeDashboard';

// Placeholder component for pages not yet created
const Placeholder = ({ title }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-gray-600">This page is under construction</p>
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
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<DashboardWrapper />} />

              {/* Employee Routes */}
              <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
              <Route path="/employee/profile" element={<Placeholder title="Employee Profile" />} />
              <Route path="/employee/leave" element={<Placeholder title="Employee Leave" />} />
              <Route path="/employee/payroll" element={<Placeholder title="Employee Payroll" />} />
              <Route path="/employee/attendance" element={<Placeholder title="Employee Attendance" />} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<Placeholder title="Admin Users" />} />
              <Route path="/admin/employees" element={<Placeholder title="Admin Employees" />} />
              <Route path="/admin/analytics" element={<Placeholder title="Admin Analytics" />} />
              <Route path="/admin/settings" element={<Placeholder title="Admin Settings" />} />

              {/* HR Routes */}
              <Route path="/hr/dashboard" element={<HRDashboard />} />
              <Route path="/hr/employees" element={<Placeholder title="HR Employees" />} />
              <Route path="/hr/leave" element={<Placeholder title="HR Leave" />} />
              <Route path="/hr/payroll" element={<Placeholder title="HR Payroll" />} />
              <Route path="/hr/recruitment" element={<Placeholder title="HR Recruitment" />} />

              {/* Fallback 404 */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600">Page not found</p>
                  </div>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;