import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserProfileFromBackend();
    } else {
      setUserProfile(null);
      setError(null);
    }
  }, [isAuthenticated, user]);

  const loadUserProfileFromBackend = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.warn('No auth token found');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserProfile(data.user);
          localStorage.setItem(`userProfile_${data.user.id}`, JSON.stringify(data.user));
        } else {
          throw new Error(data.message || 'Failed to load profile');
        }
      } else if (response.status === 401) {
        console.warn('Authentication token expired');
        localStorage.removeItem('authToken');
        setError('Session expired. Please login again.');
      } else {
        throw new Error(`HTTP ${response.status}: Failed to load profile`);
      }
    } catch (error) {
      console.error('Error loading profile from backend:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setUserProfile(data.user);
        return { success: true, user: data.user };
      } else {
        throw new Error(data.message || 'Failed to get profile');
      }
    } catch (error) {
      console.error('Error getting profile:', error);
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATED: Save profile for ProfileCreationForm
  const saveUserProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        throw new Error('User not authenticated');
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('🔄 Sending profile data:', profileData);

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();
      console.log('📝 Backend response:', data);
      
      if (data.success) {
        setUserProfile(data.user);
        localStorage.setItem(`userProfile_${data.user.id}`, JSON.stringify(data.user));
        console.log('✅ Profile saved successfully to backend');
        return { success: true, user: data.user, message: data.message };
      } else {
        throw new Error(data.message || 'Failed to save profile to backend');
      }

    } catch (error) {
      console.error('Error saving profile:', error);
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATED: Update profile for Dashboard
  const updateUserProfile = async (updatedData) => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        throw new Error('User not authenticated');
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      const data = await response.json();
      
      if (data.success) {
        setUserProfile(data.user);
        localStorage.setItem(`userProfile_${data.user.id}`, JSON.stringify(data.user));
        console.log('✅ Profile updated successfully in backend');
        return { success: true, user: data.user, message: data.message };
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const refreshProfile = async () => {
    return await loadUserProfileFromBackend();
  };

  const value = {
    userProfile,
    loading,
    error,
    saveUserProfile,
    updateUserProfile,
    getUserProfile,
    refreshProfile,
    clearError,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;