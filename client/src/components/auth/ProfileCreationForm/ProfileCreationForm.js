import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useUser } from '../../../context/UserContext';
import './ProfileCreationForm.css';

const ProfileForm = () => {
  const { user } = useAuth();
  const { setProfile, updateUserProfile } = useUser(); // Use setProfile instead of saveUserProfile
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: '',
    gender: '',
    educationLevel: '',
    personalityType: '',
    phoneNumber: '',
    city: '',
    state: '',
    interests: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Save profile data using UserContext
      setProfile(formData); // This will trigger setEducationLevel automatically
      updateUserProfile(formData); // Update profile with new data
      
      console.log('✅ Profile saved successfully:', formData);
      setShowDialog(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    navigate('/dashboard');
    window.scrollTo(0, 0);
  };

  return (
    <div className="profile-page">
      <div className="profile-form-container">
        <div className="profile-form-content">
          <div className="profile-form-header">
            <h1>Complete Your Profile</h1>
            <p>Help us understand you better to provide personalized career recommendations</p>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            {/* Name and Email Row */}
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
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
                <label>Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Your age"
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Education and Personality Row - FIXED OPTIONS */}
            <div className="form-row">
              <div className="form-group">
                <label>Education Level *</label>
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Education Level</option>
                  <option value="intermediate-10th">10th Pass</option>
                  <option value="intermediate-11th">11th Standard</option>
                  <option value="intermediate-12th">12th Pass</option>
                  <option value="diploma">Diploma</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="phd">PhD</option>
                </select>
              </div>
              <div className="form-group">
                <label>Personality Type *</label>
                <select
                  name="personalityType"
                  value={formData.personalityType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Personality Type</option>
                  <option value="Extrovert">Extrovert</option>
                  <option value="Introvert">Introvert</option>
                  <option value="Ambivert">Ambivert</option>
                </select>
              </div>
            </div>

            {/* Phone and City Row */}
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
              <label>Interests & Hobbies *</label>
              <textarea
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                rows="3"
                placeholder="Tell us about your interests, hobbies, and what you enjoy doing..."
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Create Profile'}
            </button>
          </form>
        </div>
      </div>

      {/* Success Dialog - ENHANCED */}
      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-icon">✅</div>
            <h3>Profile Created Successfully!</h3>
            <p>Your profile has been saved. You can now take personalized assessments and get career recommendations.</p>
            <div className="dialog-details">
              <p><strong>Assessment Level:</strong> {
                formData.educationLevel === 'intermediate-10th' || 
                formData.educationLevel === 'intermediate-11th' || 
                formData.educationLevel === 'intermediate-12th' ? 'Foundation' :
                formData.educationLevel === 'diploma' || 
                formData.educationLevel === 'bachelors' ? 'Intermediate' : 'Advanced'
              }</p>
            </div>
            <button onClick={handleDialogClose} className="dialog-btn">
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileForm;