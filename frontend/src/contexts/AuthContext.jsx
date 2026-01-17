// contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 AuthProvider: Checking localStorage on mount...');
    
    // Check for token in localStorage
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    
    console.log('📦 Found in localStorage:');
    console.log('- token:', token ? 'Yes' : 'No');
    console.log('- user:', userStr);
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('✅ AuthProvider: Setting currentUser from localStorage:', user);
        setCurrentUser(user);
      } catch (error) {
        console.error('❌ AuthProvider: Error parsing user from localStorage:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
      }
    } else {
      console.log('❌ AuthProvider: No valid auth data found in localStorage');
    }
    
    setLoading(false);
  }, []);

  const login = (user, token) => {
    console.log('🔐 AuthContext.login called with:', { user, token });
    
    if (!user || !token) {
      console.error('❌ AuthContext.login: Missing user or token');
      return;
    }
    
    // Save to localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('authToken', token); // Save both for compatibility
    localStorage.setItem('user', JSON.stringify(user));
    
    // Update state
    setCurrentUser(user);
    
    console.log('💾 AuthContext.login: Data saved to localStorage');
    console.log('- token saved:', token.substring(0, 30) + '...');
    console.log('- user saved:', user);
  };

  const logout = () => {
    console.log('🚪 AuthContext.logout: Clearing auth data');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const getToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('authToken');
  };

  const value = {
    currentUser,
    login,
    logout,
    loading,
    getToken
  };

  console.log('🔄 AuthProvider rendering, currentUser:', currentUser, 'loading:', loading);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};