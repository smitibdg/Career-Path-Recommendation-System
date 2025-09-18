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
  const { user, token } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load profile from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedProfile = localStorage.getItem(`userProfile_${user.id}`);
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
    }
  }, [user]);

  const saveUserProfile = async (profileData) => {
    try {
      setLoading(true);

      // Save to localStorage immediately
      const profileWithUser = {
        ...profileData,
        userId: user.id,
        email: user.email,
        name: profileData.name || user.name,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem(`userProfile_${user.id}`, JSON.stringify(profileWithUser));
      setUserProfile(profileWithUser);

      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/profile`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(profileWithUser),
      // });

      return { success: true };
    } catch (error) {
      console.error('Error saving profile:', error);
      return { success: false, message: 'Failed to save profile' };
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

      // TODO: Replace with actual API call
      // const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/profile`, {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(updatedProfile),
      // });

      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, message: 'Failed to update profile' };
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