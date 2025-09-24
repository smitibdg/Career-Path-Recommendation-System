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

  // ✅ FIXED: Load user from localStorage on app start with validation
  useEffect(() => {
    const loadUserFromStorage = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      
      console.log('🔄 [AuthContext] Loading user from storage...');
      console.log('🔑 Token exists:', !!token);
      console.log('👤 UserData exists:', !!userData);
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          
          // ✅ Validate token format
          if (validateTokenFormat(token)) {
            setUser(parsedUser);
            setIsAuthenticated(true);
            console.log('✅ [AuthContext] User restored from localStorage:', parsedUser);
          } else {
            console.log('❌ [AuthContext] Invalid token format, clearing storage');
            clearAllStorage();
          }
        } catch (error) {
          console.error('❌ [AuthContext] Error parsing stored user data:', error);
          clearAllStorage();
        }
      } else {
        console.log('⚠️ [AuthContext] No stored user data found');
      }
    };

    loadUserFromStorage();
  }, []);

  // ✅ Token validation helper
  const validateTokenFormat = (token) => {
    if (!token) return false;
    
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  // ✅ Clear all storage helper
  const clearAllStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('assessmentData');
    setUser(null);
    setIsAuthenticated(false);
  };

  // ✅ FIXED LOGIN FUNCTION with better error handling
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError('');

      // Clear any existing data first
      clearAllStorage();

      console.log('🔄 [AuthContext] Attempting login with:', { email });

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 [AuthContext] Login response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Server error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📥 [AuthContext] Login response data:', data);

      if (data.success && data.token && data.user) {
        // ✅ Store with consistent keys
        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        setUser(data.user);
        setIsAuthenticated(true);
        
        console.log('✅ [AuthContext] Login successful, navigating to dashboard');
        
        // Navigate to dashboard
        navigate('/dashboard');
        
        return { success: true, message: data.message };
      } else {
        throw new Error(data.message || 'Login failed - invalid response');
      }
    } catch (error) {
      console.error('💥 [AuthContext] Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Cannot connect to server. Please check if the backend is running on port 5000.';
      } else if (error.message.includes('HTTP error')) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      clearAllStorage();
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

      clearAllStorage();

      console.log('🔄 [AuthContext] Attempting signup with:', { name, email });

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      console.log('📡 [AuthContext] Signup response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Server error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📥 [AuthContext] Signup response data:', data);

      if (data.success && data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        setUser(data.user);
        setIsAuthenticated(true);
        
        console.log('✅ [AuthContext] Signup successful, navigating to profile creation');
        
        navigate('/profile-creation');
        
        return { success: true, message: data.message };
      } else {
        throw new Error(data.message || 'Signup failed - invalid response');
      }
    } catch (error) {
      console.error('💥 [AuthContext] Signup error:', error);
      
      let errorMessage = 'Signup failed. Please try again.';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Cannot connect to server. Please check if the backend is running on port 5000.';
      } else if (error.message.includes('HTTP error')) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      clearAllStorage();
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('🔄 [AuthContext] Logging out user');
    clearAllStorage();
    setError('');
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
    validateTokenFormat,
    clearAllStorage
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};