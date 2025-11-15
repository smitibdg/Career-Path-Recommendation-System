const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    testResponseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TestResponse'
    },
    
    // Detailed test scores for frontend display
    testScores: {
        cognitive: { 
            correct: { type: Number, default: 0 }, 
            total: { type: Number, default: 0 }, 
            percentage: { type: Number, default: 0 } 
        },
        skills: { 
            correct: { type: Number, default: 0 }, 
            total: { type: Number, default: 0 }, 
            percentage: { type: Number, default: 0 } 
        },
        situational: { 
            score: { type: Number, default: 0 }, 
            total: { type: Number, default: 0 }, 
            percentage: { type: Number, default: 0 } 
        },
        values: { 
            score: { type: Number, default: 0 }, 
            total: { type: Number, default: 0 }, 
            percentage: { type: Number, default: 0 } 
        }
    },
    
    // Raw personality data for reference/debugging
    personalityRawScores: { 
        type: Object, 
        default: {} 
    },
    
    // Individual OCEAN scores (kept for internal calculations but NOT exposed to frontend)
    personalityO: { type: Number, default: 0 },
    personalityC: { type: Number, default: 0 },
    personalityE: { type: Number, default: 0 },
    personalityA: { type: Number, default: 0 },
    personalityN: { type: Number, default: 0 },
    
    // NEW SINGLE PERSONALITY FIELDS (exposed to frontend)
    personalityType: { 
        type: String, 
        default: 'Balanced Individual',
        enum: [
            'Creative Explorer',
            'Organized Achiever', 
            'Social Connector',
            'Collaborative Partner',
            'Analytical Thinker',
            'Balanced Individual'
        ]
    },
    personalityScore: { 
        type: Number, 
        default: 50,
        min: 0,
        max: 100
    },
    personalityDominantTrait: { 
        type: String, 
        default: 'balanced',
        enum: ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism', 'balanced']
    },

    personalityDescription: { 
        type: String, 
        default: 'Shows balanced traits across different personality dimensions',
        maxlength: 500
    },
    
    // Overall percentage scores
    cognitiveScore: { type: Number, default: 0 },
    skillsScore: { type: Number, default: 0 },
    situationalScore: { type: Number, default: 0 },
    valuesScore: { type: Number, default: 0 },
    
    educationLevel: {
        type: String,
        enum: ['Foundation', 'Intermediate', 'Advanced'],
        required: true
    },
    
    // Career prediction results (optional - for future use)
    careerCluster: {
        predicted: { type: String, default: null },
        confidence: { type: Number, default: 0 },
        alternatives: [{ 
            cluster: String, 
            probability: Number 
        }]
    },
    
    careerRecommendations: [{
        role: String,
        cluster: String,
        matchScore: Number,
        requiredSkills: String,
        salaryRange: String
    }],
    
    completedAt: {
        type: Date,
        default: Date.now
    },
    
    // Metadata
    modelVersion: {
        type: String,
        default: '1.0'
    },
    
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes for performance
AssessmentSchema.index({ userId: 1, completedAt: -1 });
AssessmentSchema.index({ userId: 1, isActive: 1 });
AssessmentSchema.index({ personalityType: 1 });
AssessmentSchema.index({ educationLevel: 1 });

// Virtual for displaying personality summary
AssessmentSchema.virtual('personalitySummary').get(function() {
    return {
        type: this.personalityType,
        score: this.personalityScore,
        dominantTrait: this.personalityDominantTrait,
        description: this.personalityDescription
    };
});

// Method to get full personality details (including OCEAN for admin/debugging)
AssessmentSchema.methods.getFullPersonalityData = function() {
    return {
        // Public data (sent to frontend)
        public: {
            type: this.personalityType,
            score: this.personalityScore,
            dominantTrait: this.personalityDominantTrait,
            description: this.personalityDescription
        },
        // Internal data (for debugging/admin)
        internal: {
            Openness: this.personalityO,
            Conscientiousness: this.personalityC,
            Extraversion: this.personalityE,
            Agreeableness: this.personalityA,
            Neuroticism: this.personalityN,
            rawScores: this.personalityRawScores
        }
    };
};


// Method to check if assessment is complete
AssessmentSchema.methods.isComplete = function() {
    return this.cognitiveScore > 0 || 
           this.skillsScore > 0 || 
           this.situationalScore > 0 || 
           this.valuesScore > 0 ||
           this.personalityScore > 0;
};

// Static method to find latest assessment for user
AssessmentSchema.statics.findLatestByUser = function(userId) {
    return this.findOne({ 
        userId: userId, 
        isActive: true 
    })
    .sort({ completedAt: -1 })
    .populate('userId', 'name email educationLevel')
    .populate('testResponseId');
};

// Pre-save middleware to ensure single personality score is calculated
AssessmentSchema.pre('save', function(next) {
    // If we have OCEAN scores but no personality type, calculate it
    if (!this.personalityType || this.personalityType === 'Balanced Individual') {
        if (this.personalityO || this.personalityC || this.personalityE || this.personalityA || this.personalityN) {
            const oceanScores = {
                openness: this.personalityO || 0,
                conscientiousness: this.personalityC || 0,
                extraversion: this.personalityE || 0,
                agreeableness: this.personalityA || 0,
                neuroticism: this.personalityN || 0
            };

            const dominantTrait = Object.keys(oceanScores).reduce((a, b) => 
                oceanScores[a] > oceanScores[b] ? a : b
            );
            
            const personalityTypes = {
                Openness: {
                    type: 'Creative Explorer',
                    description: 'Imaginative, open to new experiences, and intellectually curious'
                },
                Conscientiousness: {
                    type: 'Organized Achiever', 
                    description: 'Disciplined, reliable, and goal-oriented with strong work ethic'
                },
                Extraversion: {
                    type: 'Social Connector',
                    description: 'Outgoing, energetic, and thrives in social interactions'
                },
                Agreeableness: {
                    type: 'Collaborative Partner',
                    description: 'Cooperative, trustful, and values harmony in relationships'
                },
                Neuroticism: {
                    type: 'Analytical Thinker',
                    description: 'Detail-oriented, cautious, and thoughtful in decision-making'
                }
            };


            const result = personalityTypes[dominantTrait] || {
                type: 'Balanced Individual',
                description: 'Shows balanced traits across different personality dimensions'
            };

            this.personalityType = result.type;
            this.personalityScore = Math.round(oceanScores[dominantTrait]);
            this.personalityDominantTrait = dominantTrait;
            this.personalityDescription = result.description;
        }
    }
    
    next();
});

// Ensure virtuals are included in JSON output
AssessmentSchema.set('toJSON', { virtuals: true });
AssessmentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Assessment', AssessmentSchema);