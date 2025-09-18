import React, { useState } from 'react';
import { useUser } from '../../../context/UserContext';
import './User.css';

const User = () => {
  const { userProfile, updateUserProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    age: userProfile?.age || '',
    gender: userProfile?.gender || '',
    educationLevel: userProfile?.educationLevel || '',
    personalityType: userProfile?.personalityType || '',
    phoneNumber: userProfile?.phoneNumber || '',
    city: userProfile?.city || '',
    state: userProfile?.state || '',
    interests: userProfile?.interests || '',
    careerGoals: userProfile?.careerGoals || ''
  });

  // Update formData when userProfile changes
  React.useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        age: userProfile.age || '',
        gender: userProfile.gender || '',
        educationLevel: userProfile.educationLevel || '',
        personalityType: userProfile.personalityType || '',
        phoneNumber: userProfile.phoneNumber || '',
        city: userProfile.city || '',
        state: userProfile.state || '',
        interests: userProfile.interests || '',
        careerGoals: userProfile.careerGoals || ''
      });
    }
  }, [userProfile]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await updateUserProfile(formData);
      if (result.success) {
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert('Error updating profile');
      }
    } catch (error) {
      alert('Error updating profile');
    }
  };

  const handleCancel = () => {
    // Reset form data to original profile data
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        age: userProfile.age || '',
        gender: userProfile.gender || '',
        educationLevel: userProfile.educationLevel || '',
        personalityType: userProfile.personalityType || '',
        phoneNumber: userProfile.phoneNumber || '',
        city: userProfile.city || '',
        state: userProfile.state || '',
        interests: userProfile.interests || '',
        careerGoals: userProfile.careerGoals || ''
      });
    }
    setIsEditing(false);
  };

  // Helper function to format display values
  const formatDisplayValue = (value) => {
    if (!value) return 'Not set';
    
    // Convert snake_case or kebab-case to Title Case
    return value
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="user-profile">
      {/* Page header with Edit Profile button */}
      <div className="page-header">
        <div className="page-title">
          <h2>Profile Settings</h2>
          <p>Manage your account information and preferences</p>
        </div>
        {!isEditing && (
          <button 
            className="edit-profile-btn"
            onClick={() => setIsEditing(true)}
          >
            ✏️ Edit Profile
          </button>
        )}
      </div>

      <div className="profile-content">
        {isEditing ? (
          <div className="editing-mode">
            <div className="editing-header">
              <h3>Edit Your Profile</h3>
              <p>Update your personal information below</p>
            </div>
            
            <form onSubmit={handleSubmit} className="profile-form">
              {/* Name and Email Row */}
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    readOnly
                  />
                </div>
              </div>

              {/* Age and Gender Row */}
              <div className="form-row">
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="15"
                    max="35"
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Education and Personality Row */}
              <div className="form-row">
                <div className="form-group">
                  <label>Education Level</label>
                  <select
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleChange}
                  >
                    <option value="">Select Education Level</option>
                    <option value="high-school">High School (10th)</option>
                    <option value="intermediate-11th">11th</option>
                    <option value="intermediate-12th">12th</option>
                    <option value="diploma">Diploma</option>
                    <option value="bachelors">Undergraduate</option>
                    <option value="masters">Master's</option>
                    <option value="phd">PhD</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Personality Type</label>
                  <select
                    name="personalityType"
                    value={formData.personalityType}
                    onChange={handleChange}
                  >
                    <option value="">Select Personality Type</option>
                    <option value="extrovert">Extrovert</option>
                    <option value="introvert">Introvert</option>
                    <option value="ambivert">Ambivert</option>
                  </select>
                </div>
              </div>

              {/* Phone and Location Row */}
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                  />
                </div>
              </div>

              {/* State */}
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter your state"
                />
              </div>

              {/* Interests */}
              <div className="form-group">
                <label>Interests & Hobbies</label>
                <textarea
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Tell us about your interests and hobbies..."
                />
              </div>

              {/* Career Goals */}
              <div className="form-group">
                <label>Career Goals</label>
                <textarea
                  name="careerGoals"
                  value={formData.careerGoals}
                  onChange={handleChange}
                  rows="3"
                  placeholder="What are your career aspirations?"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="profile-display">
            {/* Personal Information Section */}
            <div className="info-section">
              <h3>Personal Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Name</span>
                  <span className="info-value">{userProfile?.name || 'Not set'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{userProfile?.email || 'Not set'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Age</span>
                  <span className="info-value">{userProfile?.age || 'Not set'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Gender</span>
                  <span className="info-value">{formatDisplayValue(userProfile?.gender)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{userProfile?.phoneNumber || 'Not set'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Location</span>
                  <span className="info-value">
                    {userProfile?.city && userProfile?.state 
                      ? `${userProfile.city}, ${userProfile.state}`
                      : userProfile?.city || userProfile?.state || 'Not set'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Educational Background */}
            <div className="info-section">
              <h3>Educational Background</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Education Level</span>
                  <span className="info-value">{formatDisplayValue(userProfile?.educationLevel)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Personality Type</span>
                  <span className="info-value">{formatDisplayValue(userProfile?.personalityType)}</span>
                </div>
              </div>
            </div>

            {/* Interests & Goals */}
            <div className="info-section">
              <h3>Interests & Career Goals</h3>
              <div className="text-content">
                <div className="text-item">
                  <span className="text-label">Interests & Hobbies</span>
                  <p className="text-value">
                    {userProfile?.interests || 'No interests added yet. Click "Edit Profile" to add your interests.'}
                  </p>
                </div>
                <div className="text-item">
                  <span className="text-label">Career Goals</span>
                  <p className="text-value">
                    {userProfile?.careerGoals || 'No career goals added yet. Click "Edit Profile" to add your goals.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;