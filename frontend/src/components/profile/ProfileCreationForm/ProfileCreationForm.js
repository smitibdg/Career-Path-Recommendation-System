import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useUser } from '../../../context/UserContext';
import './ProfileCreationForm.css';

const ProfileForm = () => {
  const { user } = useAuth();
  const { saveUserProfile } = useUser();
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
    careerGoals: ''
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
      const result = await saveUserProfile(formData);
      
      if (result.success) {
        setShowDialog(true);
      } else {
        alert('Error saving profile. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    navigate('/dashboard'); // Redirect to main dashboard
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
                  min="15"
                  max="35"
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
                <label>Education Level *</label>
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  required
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
                <label>Personality Type *</label>
                <select
                  name="personalityType"
                  value={formData.personalityType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Personality Type</option>
                  <option value="extrovert">Extrovert</option>
                  <option value="introvert">Introvert</option>
                  <option value="ambivert">Ambivert</option>
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
              <label>Interests & Hobbies</label>
              <textarea
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Tell us about your interests, hobbies, and what you enjoy doing..."
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
                placeholder="What are your career aspirations and goals?"
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Submit Profile'}
            </button>
          </form>
        </div>
      </div>

      {/* Success Dialog */}
      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-icon">✅</div>
            <h3>Profile Completed Successfully!</h3>
            <p>Your profile has been saved. You can now access personalized career recommendations.</p>
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