const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Add these lines after your existing requires
const TestResponse = require('./models/TestResponse');
const Assessment = require('./models/Assessment');

// ✅ IMPORT THE EXISTING USER MODEL (instead of creating a new one)
const User = require('./models/User');

// ✅ CORRECTED: Remove src from path
const mlRoutes = require('./routes/ml_models');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Middleware
app.use(express.json());

// ✅ CORRECTED: ML routes
app.use('/api/ml', mlRoutes);

// ✅ MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/career-path-db';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
});

// ✅ REMOVE THE DUPLICATE USER SCHEMA FROM HERE
// Delete all the userSchema code from your server.js since it's now in models/User.js

// ✅ Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Career Path Backend API is running!',
    timestamp: new Date().toISOString()
  });
});

// ✅ Register Route (updated to use the new User model)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('Registration attempt:', { name, email });

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const user = new User({
      name,
      email,
      password // The User model will hash this automatically
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('✅ User registered successfully:', user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// ✅ Login Route (updated to use comparePassword method)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email });

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // ✅ USE THE comparePassword METHOD from User model
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('✅ User logged in successfully:', user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// ✅ UPDATED: Profile Creation/Update Route
app.post('/api/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // ✅ UPDATED: Add profile fields to the User model or handle differently
    // For now, we'll store profile data in the same User document
    user.age = req.body.age;
    user.gender = req.body.gender;
    user.educationLevel = req.body.educationLevel;
    user.personalityType = req.body.personalityType;
    user.phoneNumber = req.body.phoneNumber || '';
    user.city = req.body.city || '';
    user.state = req.body.state || '';
    user.interests = req.body.interests;
    user.profileCompleted = true;
    
    await user.save();

    console.log('✅ Profile updated successfully:', user._id);

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
        personalityType: user.personalityType,
        phoneNumber: user.phoneNumber,
        city: user.city,
        state: user.state,
        interests: user.interests
      }
    });

  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

// ✅ Get Profile Route
app.get('/api/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
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
        personalityType: user.personalityType,
        phoneNumber: user.phoneNumber,
        city: user.city,
        state: user.state,
        interests: user.interests
      }
    });

  } catch (error) {
    console.error('❌ Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting profile'
    });
  }
});

// ✅ Profile Update Route for Dashboard
app.put('/api/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    user.age = req.body.age;
    user.gender = req.body.gender;
    user.educationLevel = req.body.educationLevel;
    user.personalityType = req.body.personalityType;
    user.phoneNumber = req.body.phoneNumber || '';
    user.city = req.body.city || '';
    user.state = req.body.state || '';
    user.interests = req.body.interests;
    
    await user.save();

    console.log('✅ Profile updated from dashboard:', user._id);

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
        personalityType: user.personalityType,
        phoneNumber: user.phoneNumber,
        city: user.city,
        state: user.state,
        interests: user.interests
      }
    });

  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

// ✅ Catch-all route
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


// ✅ FIX: Assessment types endpoint to fix HTTP 500 error
app.get('/api/assessments/types', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // ✅ Get user's completed tests from TestResponse
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


// ✅ Start Server
app.listen(5000, () => {
  console.log(`🚀 Server running on port ${5000}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🤖 ML API: http://localhost:${PORT}/api/ml`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// ✅ Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await mongoose.connection.close();
  console.log('📡 MongoDB connection closed');
  process.exit(0);
});