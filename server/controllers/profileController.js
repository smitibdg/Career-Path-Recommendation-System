const Profile = require('../models/Profile');
const User = require('../models/User');

// Create or update user profile
// API function to create or update user profile
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const profileData = req.body;
    
    
    // COMPLETE EDUCATION LEVEL MAPPING - WORKS FOR ALL LEVELS
    const educationLevelMapping = {
      // Foundation Level (10th-12th)
      'intermediate-10th': 'Foundation',
      'intermediate-11th': 'Foundation', 
      'intermediate-12th': 'Foundation',
      '10th': 'Foundation',
      '11th': 'Foundation',
      '12th': 'Foundation',
      
      // Intermediate Level (Diploma/Bachelor's)
      'diploma': 'Intermediate',
      'bachelors': 'Intermediate',
      'bachelor': 'Intermediate',
      'graduation': 'Intermediate',
      
      // Advanced Level (Master's/PhD)
      'masters': 'Advanced',
      'master': 'Advanced',
      'phd': 'Advanced',
      'doctorate': 'Advanced',
      'postgraduate': 'Advanced'
    };
    
    // DETERMINE ASSESSMENT LEVEL
    const educationLevel = profileData.educationLevel || 'bachelors';
    const assessmentLevel = educationLevelMapping[educationLevel.toLowerCase()] || 'Intermediate';
    
    
    // Check if profile already exists
    let profile = await Profile.findOne({ user: userId });
    
    if (profile) {
      // Update existing profile
      Object.assign(profile, profileData);
      profile.profileCompleted = true;
      profile.assessmentLevel = assessmentLevel; // SET ASSESSMENT LEVEL
      profile.updatedAt = new Date();
      await profile.save();
    } else {
      // Create new profile
      profile = new Profile({
        user: userId,
        ...profileData,
        assessmentLevel: assessmentLevel, // SET ASSESSMENT LEVEL
        profileCompleted: true
      });
      await profile.save();
    }
    
    // Update user's profileCompleted status
    await User.findByIdAndUpdate(userId, { 
      profileCompleted: true,
      educationLevel: educationLevel, // SAVE TO USER TOO
      updatedAt: new Date() 
    });
    
    // Populate user data for response
    await profile.populate('user', 'name email');
    
    console.log('[BACKEND] Profile ID:', profile.id);
    console.log('[BACKEND] Education Level:', profile.educationLevel);
    console.log('[BACKEND] Assessment Level:', profile.assessmentLevel);
    
    // CONSISTENT RESPONSE FORMAT
    const response = {
      success: true,
      message: 'Profile saved successfully',
      profile: profile.toObject ? profile.toObject() : profile
    };
    
    console.log('[BACKEND] Sending response - format check:');
    console.log('- success:', response.success);
    console.log('- profile exists:', !!response.profile);
    console.log('- profile id:', response.profile.id);
    
    res.status(200).json(response);
    
  } catch (error) {
    console.error('[BACKEND] Profile save error:', error);
    console.error('Error stack:', error.stack);
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
    
    console.log('GET Profile - User ID:', userId);
    
    // FIXED: Get profile data directly from User model
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      console.log('No user found for ID:', userId);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('User profile found in User model');
    console.log('Profile completed:', user.profileCompleted);
    console.log('Profile details:', {
      id: user._id,
      name: user.name,
      educationLevel: user.educationLevel,
      profileCompleted: user.profileCompleted
    });
    
    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        educationLevel: user.educationLevel,
        personalityType: user.personalityType,
        phoneNumber: user.phoneNumber,
        city: user.city,
        state: user.state,
        interests: user.interests,
        profileCompleted: user.profileCompleted
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
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

    console.log('🔄 UPDATE Profile request');
    console.log('🔄 User ID:', userId);
    console.log('🔄 Update Data:', updateData);

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

    console.log('Profile updated successfully');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: profile.toObject ? profile.toObject() : profile
    });

  } catch (error) {
    console.error('Profile update error:', error);
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

    console.log('Complete Assessment - User ID:', userId, 'Test:', testType);

    const profile = await Profile.findOne({ user: userId });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Update assessment completion (only if profile has this method)
    if (profile.assessmentsCompleted && typeof profile.assessmentsCompleted.set === 'function') {
      profile.assessmentsCompleted.set(testType, {
        completed: true,
        completedAt: new Date(),
        score: score,
        responses: responses
      });
    }

    await profile.save();

    console.log('Assessment completed successfully');

    res.status(200).json({
      success: true,
      message: 'Assessment completed successfully',
      assessmentProgress: profile.getAssessmentProgress ? profile.getAssessmentProgress() : {}
    });

  } catch (error) {
    console.error('Complete assessment error:', error);
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
      assessmentProgress: profile.getAssessmentProgress ? profile.getAssessmentProgress() : {}
    });

  } catch (error) {
    console.error('Get assessment progress error:', error);
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

    console.log('Profile deleted successfully');

    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully'
    });

  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting profile',
      error: error.message
    });
  }
};



// MODEL 2: CAREER CLUSTER PREDICTION FUNCTIONS

const { spawn } = require('child_process');
const path = require('path');

// MODEL 2: Predict Career Cluster for specific user (REAL ML VERSION with CORRECT MongoDB save)
exports.predictCareerCluster = async (req, res) => {
  try {
    const { userId } = req.body;
    
    console.log('Model 2: REAL ML career prediction for user:', userId);
    
    const User = require('../models/User');
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Prepare data for your REAL trained ML model
    const userData = {
      age: user.age || 25,
      gender: user.gender || 'Female',
      educationLevel: user.educationLevel || 'bachelors',
      interests: Array.isArray(user.interests) 
        ? user.interests[0] 
        : (user.interests || 'Programming'),
      personalityType: user.personalityType || 'Ambivert',
      personalityScore: user.assessmentResults?.personalityScore || 75,
      cognitiveScore: user.assessmentResults?.cognitiveScore || 80,
      skillsScore: user.assessmentResults?.skillsScore || 80,
      situationalScore: user.assessmentResults?.situationalScore || 75,
      valuesScore: user.assessmentResults?.valuesScore || 75
    };
    
    console.log('Sending data to your 87.5% accuracy trained model:', userData);
    
    // Call your REAL Python ML model
    const pythonScriptPath = path.join(__dirname, '..', 'ml_models', 'model2', 'model2_cluster_predictor.py');
    
    console.log('Calling Python script at:', pythonScriptPath);
    
    const pythonProcess = spawn('python', [
      pythonScriptPath,
      JSON.stringify(userData)
    ]);
    
    let result = '';
    let error = '';
    let responseHandled = false;
    let timeoutHandle;
    
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    pythonProcess.on('close', async (code) => {
      if (responseHandled) return;
      
      clearTimeout(timeoutHandle);
      responseHandled = true;
      
      if (code !== 0) {
        console.error('Python ML error:', error);
        return res.status(500).json({
          success: false,
          message: 'ML model prediction failed',
          error: error || 'Python script failed'
        });
      }
      
      try {
        console.log('Raw Python output:', result);
        
        const lines = result.trim().split('\n');
        const lastLine = lines[lines.length - 1];
        const mlResult = JSON.parse(lastLine);
        
        console.log('Your 87.5% accuracy ML model prediction:', mlResult);
        
        if (!mlResult.success) {
          return res.status(500).json({
            success: false,
            message: 'ML prediction failed',
            error: mlResult.error
          });
        }
        
        // INITIALIZE assessmentResults if it doesn't exist
        if (!user.assessmentResults) {
          user.assessmentResults = {
            cognitiveScore: 0,
            skillsScore: 0,  
            situationalScore: 0,
            valuesScore: 0,
            personalityScore: 0,
            testScores: {},
            personalityDetails: {},
            careerCluster: {},
            careerRecommendations: [],
            model2Results: {},
            model3Results: { predictedCareerRoles: [] },
            testCompletionStatus: {
              personalityTest: false,
              cognitiveTest: false,
              skillsTest: false,
              situationalTest: false,
              valuesTest: false
            },
            isAssessmentCompleted: false,
            modelVersion: '1.0',
            lastUpdated: new Date()
          };
        }
        
        // SAVE CAREER CLUSTER PREDICTION TO CORRECT MongoDB STRUCTURE
        user.assessmentResults.model2Results = {
          predictedCareerCluster: mlResult.prediction,
          predictionConfidence: mlResult.confidence,
          predictionMethod: mlResult.method,
          predictionProbabilities: mlResult.all_probabilities,
          lastPredictionDate: new Date()
        };
        
        await user.save();
        
        console.log('Career cluster saved to MongoDB (CORRECT structure):', user.assessmentResults.model2Results);
        
        res.json({
          success: true,
          message: 'Career cluster prediction completed and saved',
          data: {
            userId: userId,
            userProfile: {
              name: user.name,
              age: user.age,
              interests: user.interests,
              educationLevel: user.educationLevel
            },
            prediction: {
              careerCluster: mlResult.prediction,
              confidence: (mlResult.confidence * 100).toFixed(1) + '%',
              method: mlResult.method,
              timestamp: new Date().toISOString(),
              savedToDatabase: true
            },
            inputData: userData,
            modelDetails: {
              allProbabilities: mlResult.all_probabilities,
              trainingAccuracy: '87.5%',
              algorithm: 'Random Forest (100 estimators)',
              featuresUsed: Object.keys(userData)
            }
          }
        });
        
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        res.status(500).json({
          success: false,
          message: 'Failed to parse ML result',
          error: parseError.message
        });
      }
    });
    
    timeoutHandle = setTimeout(() => {
      if (!responseHandled) {
        responseHandled = true;
        console.error('Python script timeout - killing process');
        pythonProcess.kill('SIGKILL');
        res.status(500).json({
          success: false,
          message: 'ML prediction timeout',
          error: 'Python script took too long to respond'
        });
      }
    }, 30000);
    
  } catch (error) {
    console.error('Model 2 Prediction Error:', error);
    res.status(500).json({
      success: false,
      message: 'Model 2 prediction failed',
      error: error.message
    });
  }
};


// MODEL 2: Batch test functionality
exports.batchTestModel2 = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Batch test for Model 2 - Coming soon!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Batch Test Error:', error);
    res.status(500).json({
      success: false,
      message: 'Batch test failed',
      error: error.message
    });
  }
};

// MODEL 2: Get career prediction for user
exports.getCareerPrediction = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const User = require('../models/User');
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        userId: userId,
        careerCluster: user.careerCluster || null,
        confidence: user.predictionConfidence || null,
        lastPrediction: user.lastPrediction || null
      }
    });
    
  } catch (error) {
    console.error('Get Career Prediction Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get career prediction',
      error: error.message
    });
  }
};


// Function to mark test as completed (REAL tracking)
exports.markTestCompleted = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { testType, score, responses } = req.body;
    
    console.log(`Marking test completed - User: ${userId}, Test: ${testType}, Score: ${score}`);
    
    const User = require('../models/User');
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Initialize assessmentResults if not exists
    if (!user.assessmentResults) {
      user.assessmentResults = {
        cognitiveScore: 0,
        skillsScore: 0,  
        situationalScore: 0,
        valuesScore: 0,
        personalityScore: 0,
        testScores: {},
        personalityDetails: {},
        careerCluster: {},
        careerRecommendations: [],
        model2Results: {},
        model3Results: { predictedCareerRoles: [] },
        isAssessmentCompleted: false,
        modelVersion: '1.0',
        lastUpdated: new Date()
      };
    }
    
    // MARK SPECIFIC TEST AS COMPLETED
    switch (testType) {
      case 'personality':
        user.assessmentResults.testCompletionStatus.personalityTest = true;
        user.assessmentResults.personalityScore = score;
        break;
      case 'cognitive':
        user.assessmentResults.testCompletionStatus.cognitiveTest = true;
        user.assessmentResults.cognitiveScore = score;
        break;
      case 'skills':
        user.assessmentResults.testCompletionStatus.skillsTest = true;
        user.assessmentResults.skillsScore = score;
        break;
      case 'situational':
        user.assessmentResults.testCompletionStatus.situationalTest = true;
        user.assessmentResults.situationalScore = score;
        break;
      case 'values':
        user.assessmentResults.testCompletionStatus.valuesTest = true;
        user.assessmentResults.valuesScore = score;
        break;
    }
    
    // Store test responses
    if (!user.assessmentResults.testScores) {
      user.assessmentResults.testScores = {};
    }
    user.assessmentResults.testScores[testType] = {
      score: score,
      responses: responses,
      completedAt: new Date()
    };
    
    // Check if all tests completed
    const allCompleted = user.allTestsCompleted();
    user.assessmentResults.isAssessmentCompleted = allCompleted;
    
    if (allCompleted) {
      user.assessmentResults.assessmentCompletedAt = new Date();
    }
    
    user.assessmentResults.lastUpdated = new Date();
    
    await user.save();
    
    console.log(`Test ${testType} marked as completed. All tests completed: ${allCompleted}`);
    console.log(`Current completion status:`, user.assessmentResults.testCompletionStatus);
    
    res.json({
      success: true,
      message: `${testType} test completed successfully`,
      data: {
        testType: testType,
        score: score,
        allTestsCompleted: allCompleted,
        completionStatus: user.assessmentResults.testCompletionStatus,
        completionPercentage: user.getTestCompletionPercentage()
      }
    });
    
  } catch (error) {
    console.error(`Error marking test ${testType} completed:`, error);
    res.status(500).json({
      success: false,
      message: 'Error saving test completion',
      error: error.message
    });
  }
};
