// UPDATE YOUR EXISTING controllers/profileController.js
const Profile = require('../models/Profile');
const User = require('../models/User');

// Create or update user profile
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const profileData = req.body;

    // Check if profile already exists
    let profile = await Profile.findOne({ user: userId });

    if (profile) {
      // Update existing profile
      Object.assign(profile, profileData);
      profile.profileCompleted = true;
      profile.updatedAt = new Date();
      await profile.save();
    } else {
      // Create new profile
      profile = new Profile({
        user: userId,
        ...profileData,
        profileCompleted: true
      });
      await profile.save();
    }

    // Update user's profileCompleted status
    await User.findByIdAndUpdate(userId, { 
      profileCompleted: true,
      updatedAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Profile saved successfully',
      profile
    });

  } catch (error) {
    console.error('Profile save error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saving profile'
    });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const profile = await Profile.findOne({ user: userId }).populate('user', 'name email');
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      profile
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
};

// Delete user profile
exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    await Profile.findOneAndDelete({ user: userId });
    
    // Update user's profileCompleted status
    await User.findByIdAndUpdate(userId, { 
      profileCompleted: false,
      updatedAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully'
    });

  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting profile'
    });
  }
};