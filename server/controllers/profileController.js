const Profile = require('../models/Profile');
const User = require('../models/User');

// Create or update user profile
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const profileData = req.body;

    console.log('💾 CREATE/UPDATE Profile - User ID:', userId);
    console.log('📝 Profile Data:', profileData);

    // Check if profile already exists
    let profile = await Profile.findOne({ user: userId });

    if (profile) {
      console.log('📝 Updating existing profile...');
      // Update existing profile
      Object.assign(profile, profileData);
      profile.profileCompleted = true;
      profile.updatedAt = new Date();
      await profile.save();
    } else {
      console.log('📝 Creating new profile...');
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

    // Update user's profileCompleted status
    await User.findByIdAndUpdate(userId, { 
      profileCompleted: true,
      updatedAt: new Date()
    });

    // Populate user data for response
    await profile.populate('user', 'name email');

    console.log('✅ Profile saved successfully - Full object:', JSON.stringify(profile, null, 2));

    // ENSURE CONSISTENT RESPONSE FORMAT
    const response = {
      success: true,
      message: 'Profile saved successfully',
      profile: profile
    };

    console.log('📤 Sending response:', JSON.stringify(response, null, 2));

    res.status(200).json(response);

  } catch (error) {
    console.error('❌ Profile save error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saving profile',
      error: error.message
    });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    console.log('📖 GET Profile - User ID:', userId);
    
    const profile = await Profile.findOne({ user: userId }).populate('user', 'name email');
    
    if (!profile) {
      console.log('❌ No profile found for user:', userId);
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    console.log('✅ Profile found:', {
      id: profile._id,
      educationLevel: profile.educationLevel,
      assessmentLevel: profile.assessmentLevel
    });
    
    res.status(200).json({
      success: true,
      profile
    });

  } catch (error) {
    console.error('❌ Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      error: error.message
    });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updateData = req.body;

    console.log('🔄 UPDATE Profile - User ID:', userId);
    console.log('📝 Update Data:', updateData);

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    console.log('✅ Profile updated successfully:', {
      id: profile._id,
      educationLevel: profile.educationLevel,
      assessmentLevel: profile.assessmentLevel
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile
    });

  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
      error: error.message
    });
  }
};

// Complete assessment
exports.completeAssessment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { testType, responses, score } = req.body;

    console.log('🏆 Complete Assessment - User ID:', userId, 'Test:', testType);

    const profile = await Profile.findOne({ user: userId });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Update assessment completion
    profile.assessmentsCompleted.set(testType, {
      completed: true,
      completedAt: new Date(),
      score: score,
      responses: responses
    });

    await profile.save();

    console.log('✅ Assessment completed successfully');

    res.status(200).json({
      success: true,
      message: 'Assessment completed successfully',
      assessmentProgress: profile.getAssessmentProgress()
    });

  } catch (error) {
    console.error('❌ Complete assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error completing assessment',
      error: error.message
    });
  }
};

// Get assessment progress
exports.getAssessmentProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const profile = await Profile.findOne({ user: userId });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      assessmentLevel: profile.assessmentLevel,
      assessmentProgress: profile.getAssessmentProgress()
    });

  } catch (error) {
    console.error('❌ Get assessment progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching assessment progress',
      error: error.message
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

    console.log('✅ Profile deleted successfully');

    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting profile',
      error: error.message
    });
  }
};