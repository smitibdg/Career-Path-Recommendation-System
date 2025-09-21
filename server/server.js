const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

// ✅ UPDATED: Simplified User Schema - Flat Structure (12 columns only)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // ✅ FLAT PROFILE FIELDS (no nested profile object)
  age: { type: Number },
  gender: { type: String },
  educationLevel: { type: String },
  personalityType: { type: String },
  phoneNumber: { type: String },
  city: { type: String },
  state: { type: String },
  interests: { type: String },
  
  // ✅ SINGLE TIMESTAMP
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// ✅ Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Career Path Backend API is running!',
    timestamp: new Date().toISOString()
  });
});

// ✅ Register Route (unchanged)
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

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      name,
      email,
      password: hashedPassword
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

// ✅ Login Route (unchanged)
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

    const isValidPassword = await bcrypt.compare(password, user.password);
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

// ✅ UPDATED: Profile Creation/Update Route (Flat Structure)
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

    // ✅ UPDATED: Direct assignment (flat structure)
    if (req.body.name && req.body.name !== user.name) {
      user.name = req.body.name;
    }
    
    // Update profile fields directly on user object
    user.age = req.body.age;
    user.gender = req.body.gender;
    user.educationLevel = req.body.educationLevel;
    user.personalityType = req.body.personalityType;
    user.phoneNumber = req.body.phoneNumber || '';
    user.city = req.body.city || '';
    user.state = req.body.state || '';
    user.interests = req.body.interests;
    user.timestamp = new Date();
    
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
        interests: user.interests,
        timestamp: user.timestamp
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

// ✅ UPDATED: Get Profile Route (Flat Structure)
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
        interests: user.interests,
        timestamp: user.timestamp
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

// ✅ UPDATED: Profile Update Route for Dashboard (Flat Structure)
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

    // ✅ UPDATED: Direct field updates
    if (req.body.name && req.body.name !== user.name) {
      user.name = req.body.name;
    }
    
    user.age = req.body.age;
    user.gender = req.body.gender;
    user.educationLevel = req.body.educationLevel;
    user.personalityType = req.body.personalityType;
    user.phoneNumber = req.body.phoneNumber || '';
    user.city = req.body.city || '';
    user.state = req.body.state || '';
    user.interests = req.body.interests;
    user.timestamp = new Date();
    
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
        interests: user.interests,
        timestamp: user.timestamp
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

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// ✅ Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await mongoose.connection.close();
  console.log('📡 MongoDB connection closed');
  process.exit(0);
});