import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'employee',
    department: '',
    position: '',
    phone: '',
    isActive: true
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  
  // Same departments list as AddEmployee
  const departments = [
    'IT', 'Human Resources', 'Finance', 'Marketing', 'Sales', 'Operations',
    'Customer Service', 'Research & Development', 'Administration', 'Engineering',
    'Product', 'Quality Assurance', 'Legal', 'Procurement'
  ];

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const response = await axios.get(`/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const employee = response.data.data;
        setFormData({
          name: employee.name || '',
          email: employee.email || '',
          role: employee.role || 'employee',
          department: employee.department || '',
          position: employee.position || '',
          phone: employee.phone || '',
          isActive: employee.isActive !== false
        });
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
      setServerError('Failed to load employee data');
    } finally {
      setLoading(false);
    }
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
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.position) newErrors.position = 'Position is required';
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setSaving(true);
    setServerError('');
    
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await axios.put(`/api/employees/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        alert('✅ Employee updated successfully!');
        navigate('/admin/employees');
      }
    } catch (error) {
      console.error('Update error:', error);
      setServerError(error.response?.data?.error || 'Failed to update employee');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading employee data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Employee</h1>
          <p className="text-gray-600 mt-2">Update employee information</p>
        </div>
        
        {/* Edit form similar to AddEmployee form */}
        {/* ... */}
      </div>
    </div>
  );
};

export default EditEmployee;