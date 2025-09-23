import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // ✅ API Configuration
  const API_BASE_URL = 'http://localhost:5000/api';

  // ✅ Load user from localStorage on app start
  useEffect(() => {
    const token = localStorage.getItem('token'); // FIXED: Look for 'token' not 'authToken'
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        console.log('✅ User restored from localStorage:', parsedUser);
      } catch (error) {
        console.error('❌ Error parsing stored user data:', error);
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      }
    }
  }, []);

  // ✅ Token validation helper
  const validateAndClearToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.log('🔴 Invalid token format, clearing...');
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        localStorage.removeItem('userProfile');
        return false;
      }
      return true;
    } catch (error) {
      console.log('🔴 Token validation failed, clearing...');
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      localStorage.removeItem('userProfile');
      return false;
    }
  };

  // ✅ FIXED LOGIN FUNCTION
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError('');

      // Clear any existing invalid tokens first
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      localStorage.removeItem('userProfile');

      console.log('Attempting login with:', { email });

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Login response data:', data);

      if (data.success && data.token) {
        // ✅ FIXED: Store both token and user data with consistent keys
        localStorage.setItem('token', data.token); // Changed from 'authToken' to 'token'
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        setUser(data.user);
        setIsAuthenticated(true);
        
        console.log('✅ Login successful, stored token and user data');
        
        // Navigate to dashboard
        navigate('/dashboard');
        
        return { success: true, message: data.message };
      } else {
        throw new Error(data.message || 'Login failed - no token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Cannot connect to server. Please check if the backend is running on port 5000.';
      } else if (error.message.includes('HTTP error')) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ FIXED SIGNUP FUNCTION
  const signup = async (name, email, password) => {
    try {
      setIsLoading(true);
      setError('');

      // Clear any existing tokens first
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      localStorage.removeItem('userProfile');

      console.log('Attempting signup with:', { name, email });

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      console.log('Signup response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Signup response data:', data);

      if (data.success && data.token) {
        // ✅ FIXED: Store both token and user data with consistent keys
        localStorage.setItem('token', data.token); // Changed from 'authToken' to 'token'
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        setUser(data.user);
        setIsAuthenticated(true);
        
        console.log('✅ Signup successful, stored token and user data');
        
        // Navigate to profile creation
        navigate('/profile-creation');
        
        return { success: true, message: data.message };
      } else {
        throw new Error(data.message || 'Signup failed - no token received');
      }
    } catch (error) {
      console.error('Signup error:', error);
      
      let errorMessage = 'Signup failed. Please try again.';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Cannot connect to server. Please check if the backend is running on port 5000.';
      } else if (error.message.includes('HTTP error')) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // ✅ FIXED: Clear all stored data with consistent keys
    localStorage.removeItem('token'); // Changed from 'authToken' to 'token'
    localStorage.removeItem('userData');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('assessmentData');
    
    setUser(null);
    setIsAuthenticated(false);
    setError('');
    
    console.log('✅ User logged out, all data cleared');
    navigate('/');
  };

  const clearError = () => {
    setError('');
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    clearError,
    validateAndClearToken, // ✅ NEW: Expose validation function
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};