// CAREER PATH RECOMMENDATION SYSTEM - EDIT PROFILE COMPONENT
// Purpose: Allows users to edit their existing profile information
// Features: Pre-populated form, Profile updates, Validation

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import ProfileForm from '../ProfileCreationForm/ProfileCreationForm'; // FIXED IMPORT
import './EditProfile.css';

const EditProfile = ({ onClose, onUpdate }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  // Load user profile data
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      // TODO: Replace with actual API call to fetch user profile
      // For now, using mock data
      const mockProfile = {
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ')[1] || '',
        email: user?.email || '',
        dateOfBirth: '1995-06-15',
        phone: '+1-234-567-8900',
        currentEducation: "Bachelor's Degree",
        institution: 'Your University',
        fieldOfStudy: 'Computer Science',
        graduationYear: '2024',
        careerInterests: ['Technology', 'Engineering'],
        preferredIndustries: ['Technology', 'Finance'],
        workEnvironmentPreference: 'Hybrid',
        technicalSkills: ['Programming', 'Data Analysis'],
        softSkills: ['Leadership', 'Communication'],
        experience: 'Internship at tech company, personal projects',
        careerGoals: 'Become a software engineer at a leading tech company',
        timeframe: '1-year'
      };
      
      setUserProfile(mockProfile);
    } catch (err) {
      setError('Failed to load profile data');
      console.error('Profile loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle profile update completion
  const handleProfileUpdate = async (updatedData) => {
    try {
      // TODO: Replace with actual API call to update profile
      console.log('Updating profile:', updatedData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setUserProfile(updatedData);
      
      // Notify parent component
      if (onUpdate) {
        onUpdate(updatedData);
      }
      
      // Close the edit modal
      if (onClose) {
        onClose();
      }
      
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="edit-profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="edit-profile-container">
        <div className="error-container">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={loadUserProfile} className="retry-btn">
            Try Again
          </button>
          {onClose && (
            <button onClick={onClose} className="close-btn">
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-header">
        <h2>Edit Your Profile</h2>
        <p>Update your information to get better career recommendations</p>
        {onClose && (
          <button onClick={onClose} className="close-button" aria-label="Close">
            ×
          </button>
        )}
      </div>
      
      <div className="edit-profile-content">
        <ProfileForm
          initialData={userProfile}
          onComplete={handleProfileUpdate}
          isEditMode={true}
        />
      </div>
    </div>
  );
};

export default EditProfile;