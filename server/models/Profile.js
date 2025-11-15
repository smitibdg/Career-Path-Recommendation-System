const mongoose = require('mongoose');

const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  age: {
    type: Number,
    min: 1,
    max: 120
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  educationLevel: {
    type: String,
    enum: [
      // Foundation Level
      'intermediate-10th', 'intermediate-11th', 'intermediate-12th', 
      '10th', '11th', '12th',
      
      // Intermediate Level
      'diploma', 'bachelors', 'bachelor', 'graduation',
      
      // Advanced Level
      'masters', 'master', 'phd', 'doctorate', 'postgraduate'
    ],
    required: true
  },
  personalityType: {
    type: String,
    enum: ['Extrovert', 'Introvert', 'Ambivert']
  },
  phoneNumber: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^[0-9\-\+\s\(\)]{10,15}$/.test(v.replace(/\D/g, ''));
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  interests: {
    type: String,
    required: true,
    trim: true
  },
  profileCompleted: {
    type: Boolean,
    default: true
  },
  
  // COMPLETE ASSESSMENT LEVEL LOGIC
  assessmentLevel: {
    type: String,
    enum: ['Foundation', 'Intermediate', 'Advanced'],
    default: 'Foundation'
  },
  
  // Assessment-related fields
  assessmentsCompleted: {
    type: Map,
    of: {
      completed: { type: Boolean, default: false },
      completedAt: { type: Date },
      score: { type: Number, min: 0, max: 100 },
      responses: { type: mongoose.Schema.Types.Mixed }
    },
    default: function() {
      return new Map([
        ['Personality', { completed: false, score: null, responses: [] }],
        ['Skills', { completed: false, score: null, responses: [] }],
        ['Cognitive', { completed: false, score: null, responses: [] }],
        ['Situational', { completed: false, score: null, responses: [] }],
        ['Values', { completed: false, score: null, responses: [] }]
      ]);
    }
  }
}, {
  timestamps: true // This will automatically handle createdAt and updatedAt
});

// ENHANCED PRE-SAVE MIDDLEWARE
profileSchema.pre('save', function(next) {
  console.log('[PROFILE] Pre-save middleware triggered');
  console.log('[PROFILE] Education level:', this.educationLevel);
  
  // Update assessmentLevel when educationLevel changes
  if (this.isModified('educationLevel') || this.isNew) {
    // COMPLETE MAPPING FOR ALL LEVELS
    const levelMap = {
      // Foundation Level (10th-12th pass students)
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
    
    const newAssessmentLevel = levelMap[this.educationLevel?.toLowerCase()] || 'Foundation';
    console.log('[PROFILE] Setting assessment level to:', newAssessmentLevel);
    this.assessmentLevel = newAssessmentLevel;
  }
  
  // Update timestamp
  this.updatedAt = new Date();
  next();
});

// POST-SAVE MIDDLEWARE FOR DEBUGGING
profileSchema.post('save', function(doc) {
  console.log('[PROFILE] Profile saved successfully');
  console.log('- ID:', doc.id);
  console.log('- Name:', doc.name);
  console.log('- Education Level:', doc.educationLevel);
  console.log('- Assessment Level:', doc.assessmentLevel);
});

// INSTANCE METHODS
profileSchema.methods.getQuestionLevel = function() {
  return this.assessmentLevel || 'Foundation';
};

profileSchema.methods.isAssessmentCompleted = function(testType) {
  const assessment = this.assessmentsCompleted.get(testType);
  return assessment ? assessment.completed : false;
};

profileSchema.methods.getAssessmentProgress = function() {
  const testTypes = ['Personality', 'Skills', 'Cognitive', 'Situational', 'Values'];
  const progress = {};
  
  testTypes.forEach(testType => {
    const assessment = this.assessmentsCompleted.get(testType);
    progress[testType] = {
      completed: assessment ? assessment.completed : false,
      score: assessment ? assessment.score : null,
      completedAt: assessment ? assessment.completedAt : null,
      responses: assessment ? assessment.responses : []
    };
  });
  
  return progress;
};

// STATIC METHODS
profileSchema.statics.getEducationLevelMap = function() {
  return {
    // Foundation Level
    'intermediate-10th': 'Foundation',
    'intermediate-11th': 'Foundation', 
    'intermediate-12th': 'Foundation',
    
    // Intermediate Level
    'diploma': 'Intermediate',
    'bachelors': 'Intermediate',
    
    // Advanced Level
    'masters': 'Advanced',
    'phd': 'Advanced'
  };
};

profileSchema.statics.getAssessmentLevelFromEducation = function(educationLevel) {
  const levelMap = this.getEducationLevelMap();
  return levelMap[educationLevel] || 'Foundation';
};

// VIRTUAL FOR FULL PROFILE DATA
profileSchema.virtual('fullProfile').get(function() {
  return {
    id: this.id,
    user: this.user,
    name: this.name,
    email: this.email,
    age: this.age,
    gender: this.gender,
    educationLevel: this.educationLevel,
    personalityType: this.personalityType,
    phoneNumber: this.phoneNumber,
    city: this.city,
    state: this.state,
    interests: this.interests,
    profileCompleted: this.profileCompleted,
    assessmentLevel: this.assessmentLevel,
    assessmentProgress: this.getAssessmentProgress(),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
});

// Ensure virtuals are included in JSON output
profileSchema.set('toJSON', { virtuals: true });
profileSchema.set('toObject', { virtuals: true });

// INDEX FOR BETTER PERFORMANCE
profileSchema.index({ user: 1 });
profileSchema.index({ educationLevel: 1 });
profileSchema.index({ assessmentLevel: 1 });

module.exports = mongoose.model('Profile', profileSchema);


// ENHANCED PRE-SAVE MIDDLEWARE
profileSchema.pre('save', function(next) {
  console.log('Profile pre-save middleware triggered');
  console.log('Education level:', this.educationLevel);
  
  // Update assessmentLevel when educationLevel changes
  if (this.isModified('educationLevel') || this.isNew) {
    const levelMap = {
      'intermediate-10th': 'Foundation',
      'intermediate-11th': 'Foundation',
      'intermediate-12th': 'Foundation',
      'diploma': 'Intermediate',
      'bachelors': 'Intermediate',
      'masters': 'Advanced',
      'phd': 'Advanced'
    };
    
    const newAssessmentLevel = levelMap[this.educationLevel] || 'Foundation';
    console.log('Setting assessment level to:', newAssessmentLevel);
    this.assessmentLevel = newAssessmentLevel;
  }
  
  // Update timestamp
  this.updatedAt = new Date();
  
  next();
});

// POST-SAVE MIDDLEWARE FOR DEBUGGING
profileSchema.post('save', function(doc) {
  console.log('Profile saved successfully:');
  console.log('- ID:', doc._id);
  console.log('- Name:', doc.name);
  console.log('- Education Level:', doc.educationLevel);
  console.log('- Assessment Level:', doc.assessmentLevel);
});

// INSTANCE METHODS
profileSchema.methods.getQuestionLevel = function() {
  return this.assessmentLevel || 'Foundation';
};

profileSchema.methods.isAssessmentCompleted = function(testType) {
  const assessment = this.assessmentsCompleted.get(testType);
  return assessment ? assessment.completed : false;
};

profileSchema.methods.getAssessmentProgress = function() {
  const testTypes = ['Personality', 'Skills', 'Cognitive', 'Situational', 'Values'];
  const progress = {};
  
  testTypes.forEach(testType => {
    const assessment = this.assessmentsCompleted.get(testType);
    progress[testType] = {
      completed: assessment ? assessment.completed : false,
      score: assessment ? assessment.score : null,
      completedAt: assessment ? assessment.completedAt : null,
      responses: assessment ? assessment.responses : []
    };
  });
  
  return progress;
};

// STATIC METHODS
profileSchema.statics.getEducationLevelMap = function() {
  return {
    'intermediate-10th': 'Foundation',
    'intermediate-11th': 'Foundation',
    'intermediate-12th': 'Foundation',
    'diploma': 'Intermediate',
    'bachelors': 'Intermediate',
    'masters': 'Advanced',
    'phd': 'Advanced'
  };
};

profileSchema.statics.getAssessmentLevelFromEducation = function(educationLevel) {
  const levelMap = this.getEducationLevelMap();
  return levelMap[educationLevel] || 'Foundation';
};

// VIRTUAL FOR FULL PROFILE DATA
profileSchema.virtual('fullProfile').get(function() {
  return {
    _id: this._id,
    user: this.user,
    name: this.name,
    email: this.email,
    age: this.age,
    gender: this.gender,
    educationLevel: this.educationLevel,
    personalityType: this.personalityType,
    phoneNumber: this.phoneNumber,
    city: this.city,
    state: this.state,
    interests: this.interests,
    profileCompleted: this.profileCompleted,
    assessmentLevel: this.assessmentLevel,
    assessmentProgress: this.getAssessmentProgress(),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
});

// ENSURE VIRTUALS ARE INCLUDED IN JSON
profileSchema.set('toJSON', { virtuals: true });
profileSchema.set('toObject', { virtuals: true });

// INDEX FOR BETTER PERFORMANCE
profileSchema.index({ user: 1 });
profileSchema.index({ educationLevel: 1 });
profileSchema.index({ assessmentLevel: 1 });

module.exports = mongoose.model('Profile', profileSchema);