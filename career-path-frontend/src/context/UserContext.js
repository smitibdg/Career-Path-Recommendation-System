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
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ ADD: API Base URL
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

  // Load profile from backend when user logs in
  useEffect(() => {
    if (user) {
      loadUserProfileFromBackend();
    }
  }, [user]);

  // ✅ ADD: Load profile from backend
  const loadUserProfileFromBackend = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.profile);
      }
    } catch (error) {
      console.error('Error loading profile from backend:', error);
      // Fallback to localStorage
      const savedProfile = localStorage.getItem(`userProfile_${user.id}`);
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
    }
  };

  const saveUserProfile = async (profileData) => {
    try {
      setLoading(true);

      // Save to localStorage immediately (for offline functionality)
      const profileWithUser = {
        ...profileData,
        userId: user.id,
        email: user.email,
        name: profileData.name || user.name,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem(`userProfile_${user.id}`, JSON.stringify(profileWithUser));
      setUserProfile(profileWithUser);

      // ✅ REPLACE TODO: Save to backend API
      const token = localStorage.getItem('authToken');
      
      if (token) {
        const response = await fetch(`${API_BASE_URL}/profile`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(profileData)
        });

        const data = await response.json();

        if (data.success) {
          // Update with backend response
          setUserProfile(data.profile);
          return { success: true, message: 'Profile saved successfully!' };
        } else {
          throw new Error(data.message || 'Failed to save profile to backend');
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error saving profile:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to save profile' 
      };
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updatedData) => {
    try {
      setLoading(true);

      const updatedProfile = {
        ...userProfile,
        ...updatedData,
        updatedAt: new Date().toISOString()
      };

      // Save to localStorage
      localStorage.setItem(`userProfile_${user.id}`, JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);

      // ✅ REPLACE TODO: Update backend API
      const token = localStorage.getItem('authToken');
      
      if (token) {
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
          setUserProfile(data.profile);
          return { success: true, message: 'Profile updated successfully!' };
        } else {
          throw new Error(data.message || 'Failed to update profile');
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to update profile' 
      };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    userProfile,
    loading,
    saveUserProfile,
    updateUserProfile,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};