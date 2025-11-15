import React, { useState, useEffect } from 'react';
import { useUser } from '../../../../context/UserContext';
import { useAuth } from '../../../../context/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const { user } = useAuth();
  const { profile, loading, getUserProfile, updateUserProfile, createUserProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', email: '', age: '', gender: '', educationLevel: '',
    personalityType: '', phoneNumber: '', city: '', state: '', interests: '',
  });

  // Load profile on component mount
  useEffect(() => {
    if (!user) {
      console.log('[UserProfile] No user found');
      setInitialLoad(false);
      return;
    }

    const loadProfile = async () => {
      console.log('🔄 [UserProfile] Loading profile for user:', user.id || user._id);
      
      try {
        // First, try to get existing profile
        const result = await getUserProfile(true);
        console.log('[UserProfile] Profile load result:', result);
        
        if (result && result.success && result.profile) {
          console.log('[UserProfile] Profile loaded successfully');
          setHasProfile(true);
        } else {
          console.log('⚠️ [UserProfile] No profile found, user needs to create one');
          setHasProfile(false);
        }
      } catch (error) {
        console.error('[UserProfile] Error loading profile:', error);
        setHasProfile(false);
      } finally {
        setInitialLoad(false);
      }
    };

    if (initialLoad) {
      loadProfile();
    }
  }, [user, getUserProfile, initialLoad]);

  // Update formData when profile changes
  useEffect(() => {
    if (profile) {
      console.log('🔄 [UserProfile] Profile data loaded:', profile);
      setHasProfile(true);
      setFormData({
        name: profile.name || user?.name || '',
        email: profile.email || user?.email || '',
        age: profile.age || '',
        gender: profile.gender || '',
        educationLevel: profile.educationLevel || '',
        personalityType: profile.personalityType || '',
        phoneNumber: profile.phoneNumber || '',
        city: profile.city || '',
        state: profile.state || '',
        interests: profile.interests || '',
      });
    } else if (!initialLoad) {
      // If no profile and not loading, set default form data
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        age: '', gender: '', educationLevel: '',
        personalityType: '', phoneNumber: '', city: '', state: '', interests: ''
      });
      setHasProfile(false);
    }
  }, [profile, user, initialLoad]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      console.log('[UserProfile] Submitting form data:', formData);
      
      let result;
      if (hasProfile) {
        // Update existing profile
        result = await updateUserProfile(formData);
      } else {
        // Create new profile
        result = await createUserProfile(formData);
      }
      
      console.log('[UserProfile] Submit result:', result);
      
      if (result && result.success) {
        console.log('[UserProfile] Profile saved successfully');
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        setHasProfile(true);
        
        // Refresh profile data after successful update
        setTimeout(async () => {
          try {
            await getUserProfile(true);
            setMessage('');
          } catch (refreshError) {
            console.log('[UserProfile] Could not refresh profile data');
          }
        }, 1000);
      } else {
        console.log('[UserProfile] Profile save failed:', result);
        const errorMsg = result?.error || 'Failed to save profile';
        setMessage(`Error: ${errorMsg}`);
      }
      
    } catch (error) {
      console.error('[UserProfile] Submit error:', error);
      setMessage(`Error: ${error.message || 'Network error'}`);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || user?.name || '',
        email: profile.email || user?.email || '',
        age: profile.age || '',
        gender: profile.gender || '',
        educationLevel: profile.educationLevel || '',
        personalityType: profile.personalityType || '',
        phoneNumber: profile.phoneNumber || '',
        city: profile.city || '',
        state: profile.state || '',
        interests: profile.interests || '',
      });
    }
    setIsEditing(false);
    setMessage('');
  };

  const formatDisplayValue = (value) => {
    if (!value) return 'Not set';
    
    const valueMap = {
      'male': 'Male', 'female': 'Female', 'other': 'Other',
      'prefer-not-to-say': 'Prefer not to say',
      'extrovert': 'Extrovert', 'introvert': 'Introvert', 'ambivert': 'Ambivert',
      'high-school': 'High School (10th)', 'intermediate-10th': '10th Pass',
      'intermediate-11th': '11th Standard', 'intermediate-12th': '12th Pass',
      'diploma': 'Diploma', 'bachelors': 'Bachelor\'s Degree', 
      'masters': 'Master\'s Degree', 'phd': 'PhD'
    };
    
    return valueMap[value.toLowerCase()] || value
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // ✅ Loading state
  if (initialLoad || loading) {
    return (
      <div className="user-profile">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // ✅ No user case
  if (!user) {
    return (
      <div className="user-profile">
        <div className="no-profile">
          <div className="no-profile-icon">🔐</div>
          <h3>Authentication Required</h3>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile">
      {/* Profile Header */}
      <div className="profile-header">
        <h2>Profile Settings</h2>
        <div className="header-buttons">
          {!isEditing && (
            <button 
              className="edit-toggle-btn edit"
              onClick={() => setIsEditing(true)}
            >
              ✏️ {hasProfile ? 'Edit Profile' : 'Create Profile'}
            </button>
          )}
        </div>
      </div>

      {/* Success/Error Messages */}
      {message && (
        <div className={`message ${message.includes('❌') || message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="profile-content">
        {isEditing ? (
          <div className="editing-mode">
            <div className="editing-header">
              <h3>{hasProfile ? 'Edit Your Profile' : 'Create Your Profile'}</h3>
              <p>Update your personal information below</p>
            </div>
            
            <form onSubmit={handleSubmit} className="profile-form">
              {/* Personal Information Section */}
              <div className="form-section">
                <h3>Personal Information</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
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
                      style={{background: '#f5f5f5', cursor: 'not-allowed'}}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      min="15"
                      max="80"
                      placeholder="Enter your age"
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

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
              </div>

              {/* Education & Personality Section */}
              <div className="form-section">
                <h3>Education & Personality</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Education Level</label>
                    <select
                      name="educationLevel"
                      value={formData.educationLevel}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Education Level</option>
                      <optgroup label="Foundation Level">
                        <option value="intermediate-10th">10th Pass</option>
                        <option value="intermediate-11th">11th Standard</option>
                        <option value="intermediate-12th">12th Pass</option>
                      </optgroup>
                      <optgroup label="Intermediate Level">
                        <option value="diploma">Diploma</option>
                        <option value="bachelors">Bachelor's Degree</option>
                      </optgroup>
                      <optgroup label="Advanced Level">
                        <option value="masters">Master's Degree</option>
                        <option value="phd">PhD</option>
                      </optgroup>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Personality Type</label>
                    <select name="personalityType" value={formData.personalityType} onChange={handleChange}>
                      <option value="">Select Personality Type</option>
                      <option value="Extrovert">Extrovert</option>
                      <option value="Introvert">Introvert</option>
                      <option value="Ambivert">Ambivert</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Interests Section */}
              <div className="form-section">
                <h3>Interests & Hobbies</h3>
                <div className="form-group">
                  <label>Interests & Hobbies</label>
                  <textarea
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tell us about your interests and hobbies..."
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? 'Saving...' : hasProfile ? 'Save Changes' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="profile-display">
            {hasProfile && profile ? (
              <>
                {/* Personal Information Section */}
                <div className="info-section">
                  <h3>Personal Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Name</span>
                      <span className="info-value">{profile.name || 'Not set'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Email</span>
                      <span className="info-value">{profile.email || user?.email || 'Not set'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Age</span>
                      <span className="info-value">{profile.age || 'Not set'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Gender</span>
                      <span className="info-value">{formatDisplayValue(profile.gender)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Phone</span>
                      <span className="info-value">{profile.phoneNumber || 'Not set'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Location</span>
                      <span className="info-value">
                        {profile.city && profile.state 
                          ? `${profile.city}, ${profile.state}`
                          : profile.city || profile.state || 'Not set'
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
                      <span className="info-value">{formatDisplayValue(profile.educationLevel)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Personality Type</span>
                      <span className="info-value">{formatDisplayValue(profile.personalityType)}</span>
                    </div>
                  </div>
                </div>

                {/* Interests */}
                <div className="info-section">
                  <h3>Interests</h3>
                  <div className="text-content">
                    <div className="text-item">
                      <span className="text-label">Interests & Hobbies</span>
                      <p className="text-value">
                        {profile.interests || 'No interests added yet.'}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="no-profile">
                <div className="no-profile-icon">👤</div>
                <h3>No Profile Found</h3>
                <p>You haven't created your profile yet.</p>
                <p>Click <strong>"Create Profile"</strong> to get started and unlock all features!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;