import React, { useState, useEffect } from 'react';
import { useUser } from '../../../context/UserContext';
import { useAuth } from '../../../context/AuthContext';
import './ProfileSettings.css';

const ProfileSettings = () => {
  const { user } = useAuth();
  const { updateUserProfile, getUserProfile, loading } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [userProfile, setUserProfile] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    educationLevel: '',
    personalityType: '',
    phoneNumber: '',
    city: '',
    state: '',
    interests: '',
    careerGoals: ''
  });

  // ✅ Load user profile when component mounts
  useEffect(() => {
    const loadProfile = async () => {
      const result = await getUserProfile();
      if (result.success) {
        const profile = result.user;
        setUserProfile(profile);

        setFormData({
          name: profile.name || '',
          email: profile.email || '',
          age: profile.age || '',
          gender: profile.gender || '',
          educationLevel: profile.educationLevel || '',
          personalityType: profile.personalityType || '',
          phoneNumber: profile.phoneNumber || '',
          city: profile.city || '',
          state: profile.state || '',
          interests: profile.interests || '',
          careerGoals: profile.careerGoals || ''
        });
      }
    };

    loadProfile();
  }, [getUserProfile]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await updateUserProfile(formData);
    
    if (result.success) {
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setUserProfile(result.user);
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Error updating profile. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setMessage('');
  };

  if (!userProfile) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-settings">
      <div className="profile-settings-header">
        <h2>Profile Settings</h2>
        <button 
          className={`edit-toggle-btn ${isEditing ? 'cancel' : 'edit'}`}
          onClick={toggleEdit}
          disabled={loading}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        {/* Personal Information Section */}
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
                  placeholder="Enter your Full Name"
                  required
                />
              ) : (
                <div className="display-value">{userProfile.name}</div>
              )}
            </div>
            
            <div className="form-group">
              <label>Email Address</label>
              <div className="display-value">{userProfile.email}</div>
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
                  placeholder="Enter your Email"
                  min="1"
                />
              ) : (
                <div className="display-value">{userProfile.profile?.age || 'Not specified'}</div>
              )}
            </div>
            
            <div className="form-group">
              <label>Gender</label>
              {isEditing ? (
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  placeholder="Select Gender"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              ) : (
                <div className="display-value">{userProfile.profile?.gender || 'Not specified'}</div>
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
                  placeholder="Enter your Phone Number"
                />
              ) : (
                <div className="display-value">{userProfile.profile?.phoneNumber || 'Not specified'}</div>
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
                  placeholder="Enter your City"
                />
              ) : (
                <div className="display-value">{userProfile.profile?.city || 'Not specified'}</div>
              )}
            </div>
          </div>
        </div>

        {/* Education & Personality Section */}
        <div className="form-section">
          <h3>Education & Personality</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Education Level</label>
              {isEditing ? (
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  placeholder="Select Education Level"
                >
                  <option value="high-school">High School (10th)</option>
                  <option value="intermediate-11th">11th</option>
                  <option value="intermediate-12th">12th</option>
                  <option value="diploma">Diploma</option>
                  <option value="bachelors">Undergraduate</option>
                  <option value="masters">Master's</option>
                  <option value="phd">PhD</option>
                </select>
              ) : (
                <div className="display-value">{userProfile.profile?.educationLevel || 'Not specified'}</div>
              )}
            </div>
            
            <div className="form-group">
              <label>Personality Type</label>
              {isEditing ? (
                <select
                  name="personalityType"
                  value={formData.personalityType}
                  onChange={handleChange}
                  placeholder="Select Personality Type"
                >
                  <option value="extrovert">Extrovert</option>
                  <option value="introvert">Introvert</option>
                  <option value="ambivert">Ambivert</option>
                </select>
              ) : (
                <div className="display-value">{userProfile.profile?.personalityType || 'Not specified'}</div>
              )}
            </div>
          </div>
        </div>

        {/* Interests & Goals Section */}
        <div className="form-section">
          <h3>Interests & Goals</h3>
          
          <div className="form-group">
            <label>Interests & Hobbies</label>
            {isEditing ? (
              <textarea
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                rows="3"
                placeholder="Tell us about your interests and hobbies..."
              />
            ) : (
              <div className="display-value">{userProfile.profile?.interests || 'Not specified'}</div>
            )}
          </div>
          
          <div className="form-group">
            <label>Career Goals</label>
            {isEditing ? (
              <textarea
                name="careerGoals"
                value={formData.careerGoals}
                onChange={handleChange}
                rows="3"
                placeholder="What are your career aspirations?"
              />
            ) : (
              <div className="display-value">{userProfile.profile?.careerGoals || 'Not specified'}</div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="form-actions">
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileSettings;