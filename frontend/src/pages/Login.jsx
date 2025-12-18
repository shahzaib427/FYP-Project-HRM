import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password')
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock authentication - in real app, this would be an API call
      const user = authenticateUser(formData.email, formData.password)
      
      if (user) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', 'mock-jwt-token')
        
        console.log('Login successful, redirecting to:', `/${user.role}/dashboard`)
        
        // Redirect to the appropriate dashboard
        navigate(`/${user.role}/dashboard`)
      } else {
        setError('Invalid email or password')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Mock authentication function
  const authenticateUser = (email, password) => {
    const users = {
      'admin@hrmpro.com': {
        id: 1,
        name: 'Admin User',
        email: 'admin@hrmpro.com',
        role: 'admin',
        company: 'HRM Pro Inc.',
        department: 'Administration'
      },
      'hr@hrmpro.com': {
        id: 2,
        name: 'HR Manager',
        email: 'hr@hrmpro.com',
        role: 'hr', 
        company: 'HRM Pro Inc.',
        department: 'Human Resources'
      },
      'employee@hrmpro.com': {
        id: 3,
        name: 'John Employee',
        email: 'employee@hrmpro.com',
        role: 'employee',
        company: 'HRM Pro Inc.',
        department: 'Engineering'
      }
    }

    // Check if user exists and password matches (in real app, password would be hashed)
    const user = users[email]
    if (user && password === 'password123') { // Simple password for demo
      return user
    }
    return null
  }

  // Demo credentials filler
  const fillDemoCredentials = (role) => {
    const credentials = {
      admin: { email: 'admin@hrmpro.com', password: 'password123' },
      hr: { email: 'hr@hrmpro.com', password: 'password123' },
      employee: { email: 'employee@hrmpro.com', password: 'password123' }
    }
    setFormData(credentials[role])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <Link 
        to="/" 
        className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 transition-colors flex items-center group z-10"
      >
        <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </Link>

      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              🔐 SECURE LOGIN
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome to
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                HRM Pro
              </span>
            </h1>
            <p className="text-gray-600 text-lg">
              Sign in to your account
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 px-6 rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Demo Credentials Section */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Credentials</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('employee')}
                className="text-xs bg-emerald-50 text-emerald-700 py-2 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200"
              >
                Employee
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('hr')}
                className="text-xs bg-blue-50 text-blue-700 py-2 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
              >
                HR Manager
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="text-xs bg-purple-50 text-purple-700 py-2 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200"
              >
                Admin
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Password for all demo accounts: <strong>password123</strong>
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link to="/contact" className="text-blue-600 hover:text-blue-500 font-medium transition-colors">
                  Contact administrator
                </Link>
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-500 text-sm flex items-center justify-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Enterprise-grade security & compliance
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login