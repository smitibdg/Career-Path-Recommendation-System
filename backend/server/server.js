const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// LoginInfo Schema (renamed from User)
const loginInfoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// ProfileInfo Schema (NEW - for user profile details)
const profileInfoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LoginInfo',
        required: true
    },
    age: Number,
    education: String,
    interests: [String],
    location: String,
    phoneNumber: String,
    profilePicture: String,
    bio: String,
    skills: [String],
    experience: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Models
const LoginInfo = mongoose.model('LoginInfo', loginInfoSchema);
const ProfileInfo = mongoose.model('ProfileInfo', profileInfoSchema);

// ROUTES

// Signup Route - Store in LoginInfo collection
app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await LoginInfo.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists with this email' 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user in LoginInfo collection
        const newUser = new LoginInfo({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.json({ 
            success: true, 
            message: 'User created successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// Login Route - Check LoginInfo collection
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user in LoginInfo collection
        const user = await LoginInfo.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// NEW: Create Profile Route - Store in ProfileInfo collection
app.post('/api/profile', async (req, res) => {
    try {
        const { userId, age, education, interests, location, phoneNumber, bio, skills, experience } = req.body;

        // Check if user exists in LoginInfo
        const user = await LoginInfo.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Create profile in ProfileInfo collection
        const newProfile = new ProfileInfo({
            userId,
            age,
            education,
            interests,
            location,
            phoneNumber,
            bio,
            skills,
            experience
        });

        await newProfile.save();

        res.json({
            success: true,
            message: 'Profile created successfully',
            profile: newProfile
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Get Profile Route
app.get('/api/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const profile = await ProfileInfo.findOne({ userId }).populate('userId', 'name email');
        
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        res.json({
            success: true,
            profile
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Get all LoginInfo (to see data like your screenshot)
app.get('/api/logininfo', async (req, res) => {
    try {
        const users = await LoginInfo.find().select('-password');
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get all ProfileInfo
app.get('/api/profileinfo', async (req, res) => {
    try {
        const profiles = await ProfileInfo.find().populate('userId', 'name email');
        res.json({ success: true, profiles });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});