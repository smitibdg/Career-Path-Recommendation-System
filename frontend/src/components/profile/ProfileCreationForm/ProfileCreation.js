import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import ProfileForm from './ProfileForm';
import Loader from '../../common/Loader/Loader';
import './ProfileCreation.css';

const ProfileCreation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { updateUserProfile } = useUser();
  const navigate = useNavigate();

  const handleProfileSubmit = async (formData) => {
    setLoading(true);
    setError('');

    const result = await updateUserProfile(formData);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Failed to create profile');
    }

    setLoading(false);
  };

  if (loading) {
    return <Loader message="Creating your profile..." />;
  }

  return (
    <div className="profile-creation-container">
      <div className="profile-creation-content">
        <div className="profile-creation-header">
          <h1>Complete Your Profile</h1>
          <p>Help us understand you better to provide personalized career recommendations</p>
        </div>

        {error && (
          <div className="error-alert">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <ProfileForm onSubmit={handleProfileSubmit} />
      </div>
    </div>
  );
};

export default ProfileCreation;