// UPDATE YOUR EXISTING models/Profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Personal Information
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  phone: String,
  
  // Education Information
  currentEducation: String,
  institution: String,
  fieldOfStudy: String,
  graduationYear: String,
  
  // Career Preferences
  careerInterests: [String],
  preferredIndustries: [String],
  workEnvironmentPreference: String,
  
  // Skills
  technicalSkills: [String],
  softSkills: [String],
  experience: String,
  
  // Goals
  careerGoals: String,
  timeframe: String,
  
  // Metadata
  profileCompleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
profileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Profile', profileSchema);