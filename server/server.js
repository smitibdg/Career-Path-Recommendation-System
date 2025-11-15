const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Add these lines after your existing requires
const TestResponse = require('./models/TestResponse');

// IMPORT THE EXISTING USER MODEL
const User = require('./models/User');

// CORRECTED: Remove src from path
const mlRoutes = require('./routes/ml_models');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// CORRECTED: ML routes
app.use('/api/ml', mlRoutes);

// In your server.js file, add this line with other route imports
app.use('/api/auth', require('./routes/auth'));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/career-path-db';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});


// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Career Path Backend API is running!',
    timestamp: new Date().toISOString()
  });
});

// EDUCATION LEVEL MAPPING HELPER FUNCTION
const getEducationLevelMapping = () => ({
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
});

// Profile Creation/Update Route
app.post('/api/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }


    const educationLevelMapping = getEducationLevelMapping();
    const educationLevel = req.body.educationLevel || 'bachelors';
    const assessmentLevel = educationLevelMapping[educationLevel.toLowerCase()] || 'Intermediate';


    // Handle interests properly (convert to array if needed)
    let interests = req.body.interests;
    if (typeof interests === 'string') {
      interests = [interests]; // Convert string to array
    } else if (Array.isArray(interests)) {
      interests = interests;
    } else {
      interests = [];
    }

    // Add profile fields to the User model
    user.age = req.body.age;
    user.gender = req.body.gender;
    user.educationLevel = educationLevel;
    user.assessmentLevel = assessmentLevel;
    user.personalityType = req.body.personalityType;
    user.phoneNumber = req.body.phoneNumber || '';
    user.city = req.body.city || '';
    user.state = req.body.state || '';
    user.interests = interests;
    user.profileCompleted = true;
    
    await user.save();

    console.log('Profile updated successfully:', user._id);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        educationLevel: user.educationLevel,
        assessmentLevel: user.assessmentLevel,
        personalityType: user.personalityType,
        phoneNumber: user.phoneNumber,
        city: user.city,
        state: user.state,
        interests: user.interests
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

// Get Profile Route
app.get('/api/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        educationLevel: user.educationLevel,
        assessmentLevel: user.assessmentLevel,
        personalityType: user.personalityType,
        phoneNumber: user.phoneNumber,
        city: user.city,
        state: user.state,
        interests: user.interests
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting profile'
    });
  }
});

// Profile Update Route for Dashboard
app.put('/api/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate assessmentLevel in PUT route too
    const educationLevelMapping = getEducationLevelMapping();
    const educationLevel = req.body.educationLevel || user.educationLevel;
    const assessmentLevel = educationLevelMapping[educationLevel.toLowerCase()] || 'Intermediate';

    // Handle interests properly
    let interests = req.body.interests;
    if (typeof interests === 'string') {
      interests = [interests];
    } else if (Array.isArray(interests)) {
      interests = interests;
    } else {
      interests = user.interests || [];
    }

    // Update fields
    user.age = req.body.age;
    user.gender = req.body.gender;
    user.educationLevel = educationLevel;
    user.assessmentLevel = assessmentLevel; 
    user.personalityType = req.body.personalityType;
    user.phoneNumber = req.body.phoneNumber || '';
    user.city = req.body.city || '';
    user.state = req.body.state || '';
    user.interests = interests; 
    
    await user.save();

    console.log('Profile updated from dashboard:', user._id);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        educationLevel: user.educationLevel,
        assessmentLevel: user.assessmentLevel,
        personalityType: user.personalityType,
        phoneNumber: user.phoneNumber,
        city: user.city,
        state: user.state,
        interests: user.interests
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

// Get Profile by UserID Route
app.get('/api/profile/:userId', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        educationLevel: user.educationLevel,
        assessmentLevel: user.assessmentLevel,
        careerCluster: user.careerCluster,
        careerRole: user.careerRole,
        roleConfidence: user.roleConfidence,
        interests: user.interests
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Assessment types endpoint
app.get('/api/assessments/types', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's completed tests from TestResponse
    const testResponse = await TestResponse.findOne({ 
      userId: user._id, 
      isActive: true 
    });

    const completedTestTypes = testResponse ? 
      [...new Set(testResponse.responses.map(r => r.testType))] : [];

    const assessmentTypes = [
      {
        id: 'personality',
        title: 'Personality Assessment',
        icon: '🧠',
        duration: '12-18 mins',
        questions: 19,
        completed: completedTestTypes.includes('personality')
      },
      {
        id: 'skills',
        title: 'Skills Evaluation', 
        icon: '💪',
        duration: '15-20 mins',
        questions: 19,
        completed: completedTestTypes.includes('skills')
      },
      {
        id: 'cognitive',
        title: 'Cognitive Assessment',
        icon: '🎯',
        duration: '10-15 mins', 
        questions: 15,
        completed: completedTestTypes.includes('cognitive')
      },
      {
        id: 'values',
        title: 'Values Assessment',
        icon: '💎',
        duration: '7-12 mins',
        questions: 11,
        completed: completedTestTypes.includes('values')
      },
      {
        id: 'situational',
        title: 'Situational Judgment',
        icon: '🤔',
        duration: '8-15 mins',
        questions: 11,
        completed: completedTestTypes.includes('situational')
      }
    ];

    res.json({
      success: true,
      assessmentTypes
    });

  } catch (error) {
    console.error('Error loading assessment types:', error);
    res.status(500).json({
      success: false,
      message: 'Error loading assessment types'
    });
  }
});

// Catch-all route
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({
      success: false,
      message: `API endpoint not found: ${req.method} ${req.path}`
    });
  } else {
    next();
  }
});

// Start Server - Use PORT variable
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`ML API: http://localhost:${PORT}/api/ml`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down server...');
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});