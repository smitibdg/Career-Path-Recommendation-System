import React from 'react';
import { useUser } from '../../context/UserContext';
import EditProfile from '../../components/profile/EditProfile/EditProfile';
import ProfileCreation from '../../components/profile/ProfileCreationForm/ProfileCreation';
import Loader from '../../components/common/Loader/Loader';
import './ProfilePage.css';

const ProfilePage = () => {
  const { userProfile, loading } = useUser();

  if (loading) {
    return <Loader message="Loading your profile..." />;
  }

  return (
    <div className="profile-page">
      {userProfile ? <EditProfile /> : <ProfileCreation />}
    </div>
  );
};

export default ProfilePage;