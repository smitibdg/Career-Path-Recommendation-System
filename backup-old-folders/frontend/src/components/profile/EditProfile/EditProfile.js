import React, { useState } from 'react';
import { useUser } from '../../../context/UserContext';
import ProfileForm from '../ProfileCreation/ProfileForm';
import Loader from '../../common/Loader/Loader';
import './EditProfile.css';

const EditProfile = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { userProfile, updateUserProfile } = useUser();

  const handleProfileUpdate = async (formData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await updateUserProfile(formData);

    if (result.success) {
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.message || 'Failed to update profile');
    }

    setLoading(false);
  };

  if (loading) {
    return <Loader message="Updating your profile..." />;
  }

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-content">
        <div className="edit-profile-header">
          <h1>Edit Profile</h1>
          <p>Update your information to get more accurate career recommendations</p>
        </div>

        {success && (
          <div className="success-alert">
            <span>✅</span>
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="error-alert">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <ProfileForm 
          onSubmit={handleProfileUpdate} 
          initialData={userProfile}
        />
      </div>
    </div>
  );
};

export default EditProfile;