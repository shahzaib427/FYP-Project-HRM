import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return setError('Email and password required');

    try {
      setLoading(true);
      console.log('📤 Sending login request to:', 'http://localhost:5000/api/auth/login');
      console.log('📤 Login data:', { email: formData.email, password: '***' });
      
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      console.log('📥 Login API response:', res.data);
      
      // Check the response structure
      const token = res.data.token || res.data.data?.token;
      const user = res.data.user || res.data.data?.user;
      
      console.log('🔑 Extracted token:', token ? token.substring(0, 30) + '...' : 'No token found');
      console.log('👤 Extracted user:', user);
      
      if (!token || !user) {
        setError('Invalid response from server');
        console.error('❌ Missing token or user in response:', res.data);
        return;
      }

      // Call the login function from AuthContext
      console.log('🔐 Calling login function with:', { user, token });
      login(user, token);
      
      // Check localStorage immediately after login
      console.log('💾 Checking localStorage after login:');
      console.log('- token:', localStorage.getItem('token'));
      console.log('- authToken:', localStorage.getItem('authToken'));
      console.log('- user:', localStorage.getItem('user'));
      
      // Navigate based on role
      console.log('🧭 Navigating user with role:', user.role);
      if (user.role === 'admin' || user.role === 'hr') {
        navigate('/admin/attendance', { replace: true });
      } else {
        navigate('/employee/dashboard', { replace: true });
      }
      
    } catch (err) {
      console.error('❌ Login error:', err);
      console.error('❌ Error response:', err.response?.data);
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to HRM System
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-600">
            <p>Debug: Open browser console (F12) to see login details</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;