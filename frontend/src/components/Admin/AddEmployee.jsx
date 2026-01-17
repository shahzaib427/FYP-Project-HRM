import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AddEmployee = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
    department: 'General',
    position: 'Employee',
    phone: '',
    isActive: true
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  
  // Departments list
  const departments = [
    'General',
    'IT',
    'Human Resources',
    'Finance',
    'Marketing',
    'Sales',
    'Operations',
    'Customer Service',
    'Research & Development',
    'Administration',
    'Engineering',
    'Product',
    'Quality Assurance',
    'Legal',
    'Procurement'
  ];

  // Common positions based on department
  const getPositionsByDepartment = (dept) => {
    const positions = {
      'General': ['Employee', 'Assistant', 'Coordinator', 'Trainee'],
      'IT': ['Software Developer', 'System Administrator', 'Network Engineer', 'Database Administrator', 'IT Support', 'DevOps Engineer', 'QA Engineer'],
      'Human Resources': ['HR Manager', 'Recruiter', 'HR Generalist', 'Compensation Analyst', 'Training Coordinator'],
      'Finance': ['Accountant', 'Financial Analyst', 'Controller', 'Accounts Payable Specialist', 'Accounts Receivable Specialist'],
      'Marketing': ['Marketing Manager', 'Content Writer', 'SEO Specialist', 'Social Media Manager', 'Brand Manager'],
      'Sales': ['Sales Manager', 'Sales Representative', 'Account Executive', 'Business Development Manager'],
      'Engineering': ['Mechanical Engineer', 'Electrical Engineer', 'Civil Engineer', 'Project Engineer'],
      'Administration': ['Administrative Assistant', 'Office Manager', 'Executive Assistant'],
      'default': ['Manager', 'Supervisor', 'Team Lead', 'Specialist', 'Analyst', 'Coordinator']
    };
    
    return positions[dept] || positions.default;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Phone validation (optional but validate if provided)
    if (formData.phone) {
      // Remove all non-digit characters to check length
      const digitsOnly = formData.phone.replace(/\D/g, '');
      
      if (digitsOnly.length < 10) {
        newErrors.phone = 'Phone number must be at least 10 digits';
      } else if (digitsOnly.length > 15) {
        newErrors.phone = 'Phone number too long';
      }
      // Allow any format as long as it has enough digits
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate form
  const validationErrors = validateForm();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  
  setLoading(true);
  setServerError('');
  
  try {
    const token = localStorage.getItem('authToken');
    
    // Prepare data for API (exclude confirmPassword)
    const { confirmPassword, ...employeeData } = formData;
    
    console.log('📤 Sending employee data:', employeeData);
    
    // ✅ FIXED: Use full backend URL with port 5000
    const response = await axios.post('http://localhost:5000/api/employees', employeeData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Response:', response.data);
    
    if (response.data.success) {
      alert('✅ Employee added successfully!');
      navigate('/admin/employees');
    }
  } catch (error) {
    console.error('❌ Add employee error:', error);
    
    if (error.response) {
      // Server responded with error
      const errorMessage = error.response.data?.error || error.response.data?.message || 'Failed to add employee';
      setServerError(errorMessage);
      console.log('❌ Server error details:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      setServerError('Network error. Please check your connection.');
    } else {
      // Other errors
      setServerError('An error occurred. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      navigate('/admin/employees');
    }
  };

  // Get positions for selected department
  const availablePositions = formData.department 
    ? getPositionsByDepartment(formData.department) 
    : ['Employee'];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Employee</h1>
              <p className="mt-2 text-gray-600">Fill in the employee details below</p>
            </div>
            <button
              onClick={() => navigate('/admin/employees')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Employees
            </button>
          </div>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-600">❌</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{serverError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-2">1</span>
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john.doe@company.com"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="03134750548 or +923134750548"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone ? (
                    <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">
                      Optional - Enter with or without country code
                    </p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="employee">Employee</option>
                    <option value="hr">HR Manager</option>
                    <option value="admin">Administrator</option>
                  </select>
                  <p className="mt-2 text-sm text-gray-500">
                    {formData.role === 'admin' && 'Full system access'}
                    {formData.role === 'hr' && 'HR and employee management access'}
                    {formData.role === 'employee' && 'Basic employee access'}
                  </p>
                </div>
              </div>
            </div>

            {/* Employment Details */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-2">2</span>
                Employment Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-sm text-gray-500">
                    Select the department for this employee
                  </p>
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position *
                  </label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Position</option>
                    {availablePositions.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                  {!formData.position && (
                    <p className="mt-2 text-sm text-yellow-600">Please select a position</p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-2">3</span>
                Account Security
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    Minimum 6 characters
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-2">4</span>
                Account Status
              </h2>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3">
                  <label className="text-sm font-medium text-gray-900">
                    Active Account
                  </label>
                  <p className="text-sm text-gray-500">
                    {formData.isActive 
                      ? 'Employee will have immediate access to the system.'
                      : 'Employee account will be created but marked as inactive.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-6 border-t">
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Adding Employee...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">➕</span>
                      Add Employee
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Form Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">💡 Tips for Adding Employees</h3>
          <ul className="text-blue-800 space-y-2">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Employee ID will be automatically generated (EMP001, EMP002, etc.)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Username will be generated from email (john.doe@company.com → john.doe)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Inactive accounts cannot login until activated</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Phone number is optional but recommended</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;