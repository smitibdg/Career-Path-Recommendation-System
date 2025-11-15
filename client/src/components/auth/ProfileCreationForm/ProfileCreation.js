import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfileForm from './ProfileCreationForm';
import './ProfileCreation.css';

const ProfileCreation = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  // Handle profile creation completion
  const handleProfileComplete = async (profileData) => {
    setIsSubmitting(true);
    
    try {
      // TODO: Replace with actual API call to save profile
      console.log('Creating profile:', profileData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user context if function exists
      if (updateUserProfile) {
        updateUserProfile({ ...user, ...profileData, profileCompleted: true });
      }
      
      // Show success state
      setSuccess(true);
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      
    } catch (error) {
      console.error('Profile creation error:', error);
      setIsSubmitting(false);
    }
  };

  // Skip profile creation (optional)
  const handleSkip = () => {
    if (window.confirm('Are you sure you want to skip profile creation? You can complete it later from your dashboard.')) {
      navigate('/dashboard');
    }
  };

  if (success) {
    return (
      <div className="profile-creation-container">
        <div className="success-container">
          <div className="success-icon">✅</div>
          <h2>Profile Created Successfully!</h2>
          <p>Your profile has been created and you'll be redirected to your dashboard shortly.</p>
          <div className="success-animation">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="continue-btn"
          >
            Go to Dashboard Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-creation-container">
      {/* Header */}
      <div className="profile-creation-header">
        <h1>Complete Your Profile</h1>
        <p>Help us understand you better to provide personalized career recommendations</p>
        
        {/* Skip Option */}
        <div className="skip-option">
          <button onClick={handleSkip} className="skip-btn">
            Skip for now
          </button>
          <span className="skip-note">You can complete this later</span>
        </div>
      </div>

      {/* Profile Form */}
      <div className="profile-creation-content">
        {isSubmitting ? (
          <div className="submitting-container">
            <div className="spinner-large"></div>
            <h3>Creating Your Profile...</h3>
            <p>Please wait while we set up your personalized experience.</p>
          </div>
        ) : (
          <ProfileForm 
            onComplete={handleProfileComplete}
            isEditMode={false}
          />
        )}
      </div>

      {/* Benefits Section */}
      <div className="benefits-section">
        <h3>Why Complete Your Profile?</h3>
        <div className="benefits-grid">
          <div className="benefit-item">
            <div className="benefit-icon">🎯</div>
            <h4>Personalized Recommendations</h4>
            <p>Get career suggestions tailored to your skills and interests</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">📊</div>
            <h4>Better Assessment Results</h4>
            <p>More accurate evaluations based on your background</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">🚀</div>
            <h4>Career Path Guidance</h4>
            <p>Step-by-step guidance towards your career goals</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">💼</div>
            <h4>Job Match Insights</h4>
            <p>Find roles that match your profile and preferences</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCreation;