import React, { useState, useEffect } from 'react';
import { useUser } from '../../../context/UserContext';
import { useAuth } from '../../../context/AuthContext';
import './ProfileSettings.css';

const ProfileSettings = () => {
  const { user } = useAuth();
  const { profile, loading, getUserProfile, updateUserProfile, getQuestionLevel, getEducationLevel } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', age: '', gender: '', educationLevel: '',
    personalityType: '', phoneNumber: '', city: '', state: '', interests: '',
  });

  // Update form data whenever profile changes
  useEffect(() => {
    console.log('Profile changed in ProfileSettings:', profile);
    if (profile) {
      setHasProfile(true);
      setFormData({
        name: profile.name || '',
        email: profile.email || profile.user?.email || user?.email || '',
        age: profile.age || '',
        gender: profile.gender || '',
        educationLevel: profile.educationLevel || '',
        personalityType: profile.personalityType || '',
        phoneNumber: profile.phoneNumber || '',
        city: profile.city || '',
        state: profile.state || '',
        interests: profile.interests || '',
      });
      setMessage('');
      console.log('Current assessment level:', profile.assessmentLevel || getQuestionLevel());
    } else {
      setHasProfile(false);
    }
  }, [profile, user, getQuestionLevel]);

  // Load profile on component mount
  useEffect(() => {
    if (!user) {
      console.log('No user found, cannot load profile');
      setInitialLoad(false);
      setMessage('Please log in to view your profile.');
      return;
    }

    const loadProfile = async () => {
      console.log('🔄 Loading profile for user:', user.id || user._id);
      
      try {
        const result = await getUserProfile(true);
        console.log('Profile load result:', result);
        
        if (result.success && result.profile) {
          console.log('Profile loaded successfully');
          setHasProfile(true);
          setMessage('');
        } else {
          console.log('Profile not found:', result.error);
          setHasProfile(false);
          setMessage('Profile not found. Please complete your profile first.');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setHasProfile(false);
        setMessage('Error loading profile. Please try again.');
      } finally {
        setInitialLoad(false);
      }
    };

    loadProfile();
  }, [user, getUserProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Show preview of assessment level change
    if (name === 'educationLevel' && value) {
      const levelMap = {
        'intermediate-10th': 'Foundation',
        'intermediate-11th': 'Foundation',
        'intermediate-12th': 'Foundation',
        'diploma': 'Intermediate',
        'bachelors': 'Intermediate',
        'masters': 'Advanced',
        'phd': 'Advanced'
      };
      console.log(`📚 Education level changing: ${value} → Assessment level: ${levelMap[value]}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔄 Updating profile with new education level:', formData.educationLevel);
    
    const result = await updateUserProfile(formData);
    
    if (result.success) {
      console.log('Profile updated successfully');
      console.log('New assessment level:', result.profile.assessmentLevel);
      setMessage('Profile updated successfully! Assessment level has been updated.');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 4000);
    } else {
      console.log('Profile update failed:', result.error);
      setMessage(`Error updating profile: ${result.error}`);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
    setMessage('');
  };

  const handleRefresh = async () => {
    console.log('🔄 Manual profile refresh requested');
    setInitialLoad(true);
    const result = await getUserProfile(true);
    setInitialLoad(false);
    
    if (result.success) {
      setMessage('Profile refreshed!');
      setTimeout(() => setMessage(''), 2000);
    } else {
      setMessage('Failed to refresh profile');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Get preview of question level based on form data
  const getPreviewQuestionLevel = () => {
    if (!formData.educationLevel) return '';
    const levelMap = {
      'intermediate-10th': 'Foundation',
      'intermediate-11th': 'Foundation',
      'intermediate-12th': 'Foundation',
      'diploma': 'Intermediate',
      'bachelors': 'Intermediate',
      'masters': 'Advanced',
      'phd': 'Advanced'
    };
    return levelMap[formData.educationLevel];
  };

  if (initialLoad || loading) {
    return (
      <div className="profile-settings">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-settings">
        <div className="no-profile">
          <div className="no-profile-icon">🔐</div>
          <h3>Authentication Required</h3>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (!hasProfile || !profile) {
    return (
      <div className="profile-settings">
        <div className="profile-settings-header">
          <h2>Profile Settings</h2>
          <button onClick={handleRefresh} className="refresh-btn">
            🔄 Refresh
          </button>
        </div>
        
        <div className="no-profile">
          <div className="no-profile-icon">👤</div>
          <h3>No Profile Found</h3>
          <p>You haven't created your profile yet.</p>
          <p>Please go to <strong>Profile Creation</strong> to get started and set your assessment level.</p>
          
          {message && (
            <div className="error-message">{message}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="profile-settings">
      <div className="profile-settings-header">
        <h2>Profile Settings</h2>
        <div className="header-buttons">
          <button onClick={handleRefresh} className="refresh-btn">
            🔄 Refresh
          </button>
          <button 
            className={`edit-toggle-btn ${isEditing ? 'cancel' : 'edit'}`}
            onClick={handleEdit}
            disabled={loading}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Assessment Level Display */}
      <div className="assessment-level-card">
        <div className="level-header">
          <h3>🎓 Assessment Level</h3>
          <span className={`level-badge ${getQuestionLevel().toLowerCase()}`}>
            {getQuestionLevel()}
          </span>
        </div>
        <p className="level-description">
          Based on your education level: <strong>{getEducationLevel()}</strong>
        </p>
        <div className="level-details">
          <span className="level-info">
            You receive {getQuestionLevel().toLowerCase()}-level assessment questions
            {isEditing && formData.educationLevel !== profile.educationLevel && (
              <span className="level-change-preview">
                → Will change to: <strong>{getPreviewQuestionLevel()}</strong>
              </span>
            )}
          </span>
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('❌') || message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        {/* Personal Information */}
        <div className="form-section">
          <h3>Personal Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              ) : (
                <div className="display-value">{profile.name || 'Not specified'}</div>
              )}
            </div>
            
            <div className="form-group">
              <label>Email Address</label>
              <div className="display-value">
                {profile.email || profile.user?.email || user?.email || 'Not specified'}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              {isEditing ? (
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="1"
                  max="120"
                />
              ) : (
                <div className="display-value">{profile.age || 'Not specified'}</div>
              )}
            </div>
            
            <div className="form-group">
              <label>Gender</label>
              {isEditing ? (
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <div className="display-value">{profile.gender || 'Not specified'}</div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              ) : (
                <div className="display-value">{profile.phoneNumber || 'Not specified'}</div>
              )}
            </div>
            
            <div className="form-group">
              <label>City</label>
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              ) : (
                <div className="display-value">{profile.city || 'Not specified'}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>State</label>
            {isEditing ? (
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            ) : (
              <div className="display-value">{profile.state || 'Not specified'}</div>
            )}
          </div>
        </div>

        {/* Education & Personality */}
        <div className="form-section">
          <h3>Education & Personality</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>
                Education Level 
                {isEditing && <span className="warning-note">(⚠️ Changing this will update your assessment level)</span>}
              </label>
              {isEditing ? (
                <select 
                  name="educationLevel" 
                  value={formData.educationLevel} 
                  onChange={handleChange}
                  className="education-select"
                  required
                >
                  <option value="">Select Education Level</option>
                  <optgroup label="Foundation Level Questions">
                    <option value="intermediate-10th">10th Pass</option>
                    <option value="intermediate-11th">11th Standard</option>
                    <option value="intermediate-12th">12th Pass</option>
                  </optgroup>
                  <optgroup label="Intermediate Level Questions">
                    <option value="diploma">Diploma</option>
                    <option value="bachelors">Bachelor's Degree</option>
                  </optgroup>
                  <optgroup label="Advanced Level Questions">
                    <option value="masters">Master's Degree</option>
                    <option value="phd">PhD</option>
                  </optgroup>
                </select>
              ) : (
                <div className="display-value">{profile.educationLevel || 'Not specified'}</div>
              )}
              {isEditing && formData.educationLevel && (
                <div className="level-preview">
                  New assessment level: <strong>{getPreviewQuestionLevel()}</strong>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label>Personality Type</label>
              {isEditing ? (
                <select name="personalityType" value={formData.personalityType} onChange={handleChange}>
                  <option value="">Select Personality Type</option>
                  <option value="Extrovert">Extrovert</option>
                  <option value="Introvert">Introvert</option>
                  <option value="Ambivert">Ambivert</option>
                </select>
              ) : (
                <div className="display-value">{profile.personalityType || 'Not specified'}</div>
              )}
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="form-section">
          <h3>Interests & Goals</h3>
          
          <div className="form-group">
            <label>Interests & Hobbies</label>
            {isEditing ? (
              <textarea
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                rows="4"
                placeholder="Tell us about your interests and hobbies..."
              />
            ) : (
              <div className="display-value">{profile.interests || 'Not specified'}</div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="form-actions">
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes & Update Assessment Level'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileSettings;