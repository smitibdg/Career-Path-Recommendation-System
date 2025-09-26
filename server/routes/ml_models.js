const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');
const User = require('../models/User');
const TestResponse = require('../models/TestResponse');
const Assessment = require('../models/Assessment');

// Enhanced Model 1 function that calls Python script
const runModel1Enhanced = (responses, educationLevel, username) => {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '../ml_models/model1/model1_scoring_engine.py');
    console.log('🚀 Starting Model 1 Enhanced Processing...');
    console.log('📊 Input:', {
      responses: responses.length,
      educationLevel,
      username
    });
    console.log('📍 Python script path:', pythonScript);

    const inputData = {
      responses: responses,
      education_level: educationLevel,
      username: username
    };

    const jsonInput = JSON.stringify(inputData);
    console.log('📤 Sending to Python:', jsonInput.substring(0, 200) + '...');

    const pythonProcess = spawn('python', [pythonScript]);
    
    let outputData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
      console.log('🐍 Python error:', data.toString());
    });

    pythonProcess.on('close', (code) => {
      console.log('🐍 Python process completed with code:', code);
      
      if (code !== 0) {
        console.log('❌ Python process failed');
        return reject(new Error(`Python process failed with code ${code}: ${errorData}`));
      }

      // ✅ FIX: Clean the output data properly
      const cleanOutput = outputData.trim();
      console.log('📥 Raw Python output length:', cleanOutput.length);
      
      if (!cleanOutput) {
        return reject(new Error('No output from Python script'));
      }

      try {
        // ✅ FIX: Find the JSON part by looking for the first {
        const firstBrace = cleanOutput.indexOf('{');
        const lastBrace = cleanOutput.lastIndexOf('}');
        
        if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
          console.log('❌ No valid JSON structure found');
          console.log('Raw output:', cleanOutput);
          return reject(new Error('No valid JSON structure in Python output'));
        }

        // Extract only the JSON part
        const jsonPart = cleanOutput.substring(firstBrace, lastBrace + 1);
        console.log('📥 Extracted JSON length:', jsonPart.length);
        
        // Parse the extracted JSON
        const result = JSON.parse(jsonPart);
        
        console.log('✅ Model 1 Enhanced completed successfully');
        resolve(result);
        
      } catch (parseError) {
        console.log('❌ Error parsing Python output:', parseError.message);
        console.log('❌ Raw output:', cleanOutput);
        reject(new Error(`Failed to parse Python output: ${parseError.message}`));
      }
    });

    pythonProcess.on('error', (error) => {
      console.log('❌ Python process error:', error.message);
      reject(new Error(`Python process failed: ${error.message}`));
    });

    // Send input to Python
    pythonProcess.stdin.write(jsonInput);
    pythonProcess.stdin.end();
  });
};


// Main ML Prediction Route
router.post('/predict', async (req, res) => {
    console.log('🎯 ML Prediction endpoint called');
    console.log('📋 Request body keys:', Object.keys(req.body));
    
    const { userId, testResponses, action, modelType } = req.body;

    if (!userId) {
        return res.status(400).json({
            success: false,
            error: 'User ID is required'
        });
    }

    try {
        // ACTION: CHECK FOR EXISTING RESULTS
        if (action === 'results') {
            try {
                const user = await User.findById(userId);
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        error: 'User not found'
                    });
                }

                return res.status(404).json({
                    success: false,
                    error: 'No existing results found'
                });
                
            } catch (dbError) {
                console.error('❌ Database error:', dbError);
                return res.status(404).json({
                    success: false,
                    error: 'No existing results found'
                });
            }
        }

        // 🎯 ACTION: SUBMIT ASSESSMENT WITH REAL MODEL 1
        if (action === 'submit' && testResponses && testResponses.length > 0) {
            console.log('🔄 Processing assessment submission with REAL Model 1...');
            console.log('📊 Received responses:', testResponses.length);
            
            // 🔍 ADD THIS EXACT LINE HERE:
            console.log("🔍 ALL RESPONSES FROM FRONTEND:", JSON.stringify(testResponses.slice(0, 10), null, 2));

            // Get user details
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            console.log('✅ User found:', user.name);
            console.log('📚 User education:', user.educationLevel);
            
            // ✅ FIX: Save test responses to MongoDB FIRST before processing
            let testResponseDoc = await TestResponse.findOne({ 
                userId: user._id, 
                isActive: true 
            });

            if (!testResponseDoc) {
                testResponseDoc = new TestResponse({
                    userId: user._id,
                    username: user.name, // ✅ FIX: Use user.name as username
                        educationLevel: user.educationLevel || 'intermediate',
                        responses: [],
                        isActive: true,
                    isScored: false
                });
            }

            // ✅ CLEAR OLD RESPONSES and use ONLY current submission
            testResponseDoc.responses = [];  // Clear old data

            // Add ONLY current attempt responses
            testResponses.forEach(response => {
                testResponseDoc.responses.push({
                    questionId: response.questionId,
                    answer: response.answer,
                    testType: response.testType
                });
            });


            await testResponseDoc.save();
            console.log('✅ Test responses saved to MongoDB:', testResponseDoc._id);
            console.log('Total responses saved:', testResponseDoc.responses.length);

            // Map education level
            const educationMapping = {
                'highschool': 'Foundation',
                'bachelors': 'Intermediate',
                'masters': 'Advanced',
                'phd': 'Advanced'
            };
            
            const mappedEducationLevel = educationMapping[user.educationLevel?.toLowerCase()] || 'Intermediate';

            // Format responses for Python Model 1 using ALL saved responses
            const formattedResponses = testResponseDoc.responses.map(response => {
                let answerValue;
                
                // ✅ FIX: Convert numeric answers to proper format based on question type
                if (response.questionId.includes('P')) {
                    // Personality questions: keep numeric (1-5)
                    answerValue = String(response.answer);
                } else {
                    // Skills/Cognitive/Situational/Values: convert number to letter
                    const optionMap = { 1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E' };
                    answerValue = optionMap[response.answer] || 'A';
                }
                
                return {
                    Question_ID: response.questionId,
                    Answer: answerValue
                };
            });

            // 🔍 ADD THIS DEBUG LINE RIGHT HERE:
            console.log('📋 Formatted responses by type:', {
                personality: formattedResponses.filter(r => r.Question_ID.includes('P')).length,
                skills: formattedResponses.filter(r => r.Question_ID.includes('S')).length,
                cognitive: formattedResponses.filter(r => r.Question_ID.includes('C')).length,
                situational: formattedResponses.filter(r => r.Question_ID.includes('T')).length,
                values: formattedResponses.filter(r => r.Question_ID.includes('V')).length
            });

            console.log('📋 Formatted responses sample:', formattedResponses.slice(0, 3));

            try {
                console.log('🧮 Calling Python Model 1...');
                
                // Call the real Python Model 1 with ALL saved responses
                const model1Result = await runModel1Enhanced(formattedResponses, mappedEducationLevel, user.name);
                
                console.log('✅ Model 1 completed successfully');

                // ✅ ADD: Debug what Python actually returned
                console.log('🐍 Python model1Result keys:', Object.keys(model1Result));
                console.log('🐍 cognitive_score:', model1Result.cognitive_score);
                console.log('🐍 skills_score:', model1Result.skills_score);
                console.log('🐍 detailed_scores:', JSON.stringify(model1Result.detailed_scores, null, 2));
                console.log('🐍 detailed_scores.cognitive:', model1Result.detailed_scores?.cognitive);
                console.log('🐍 detailed_scores.skills:', model1Result.detailed_scores?.skills);

                
                // ✅ FIX: Always create NEW assessment or update existing with LATEST results
                let assessment = await Assessment.findOne({ 
                userId: user._id, 
                isActive: true 
                });

                if (!assessment) {
                assessment = new Assessment({
                    userId: user._id,
                    testResponseId: testResponseDoc._id,
                    educationLevel: mappedEducationLevel
                });
                } else {
                // ✅ CRITICAL: Update existing assessment with new test response
                assessment.testResponseId = testResponseDoc._id;
                assessment.completedAt = new Date();
                }

                // ✅ FIX: Update assessment with results from the working Python model
                assessment.cognitiveScore = Math.round((model1Result.cognitive_score || 0) * 100);
                assessment.skillsScore = Math.round((model1Result.skills_score || 0) * 100);
                assessment.situationalScore = Math.round((model1Result.situational_score || 0) * 100);
                assessment.valuesScore = Math.round((model1Result.values_score || 0) * 100);
                assessment.personalityType = model1Result.personality_type || 'Balanced Individual';
                assessment.personalityScore = model1Result.personality_score || 50;
                assessment.personalityDominantTrait = model1Result.personality_dominant_trait || 'balanced';
                assessment.personalityDescription = model1Result.personality_description || 'Shows balanced traits';
                
                // ✅ FIX: Store detailed scores for frontend
                assessment.testScores = model1Result.detailed_scores || {};

                await assessment.save();
                console.log('✅ Assessment results saved to MongoDB:', assessment._id);

                // ✅ FIX: Build final results using REAL calculated scores from Python
                const detailedResults = {
                    user: {
                        name: user.name,
                        educationLevel: mappedEducationLevel
                    },
                    completedAt: new Date().toISOString(),
                    personalityProfile: {
                        type: model1Result.personality_type,
                        score: model1Result.personality_score,
                        dominantTrait: model1Result.personality_dominant_trait,
                        description: model1Result.personality_description
                    },
                    testResults: {
                        cognitive: {
                        correct: model1Result.detailed_scores?.cognitive?.correct || 0,
                        total: model1Result.detailed_scores?.cognitive?.total || 15,
                        percentage: model1Result.detailed_scores?.cognitive?.percentage || 0
                        },
                        skills: {
                        correct: model1Result.detailed_scores?.skills?.correct || 0,
                        total: model1Result.detailed_scores?.skills?.total || 19,
                        percentage: model1Result.detailed_scores?.skills?.percentage || 0
                        },
                        situational: {
                        correct: model1Result.detailed_scores?.situational?.correct || 0,
                        total: model1Result.detailed_scores?.situational?.total || 11,
                        percentage: model1Result.detailed_scores?.situational?.percentage || 0
                        },
                        values: {
                        correct: model1Result.detailed_scores?.values?.correct || 0,
                        total: model1Result.detailed_scores?.values?.total || 11,
                        percentage: model1Result.detailed_scores?.values?.percentage || 0
                        }
                    },
                    overallScores: {
                        cognitive: model1Result.cognitive_score || 0,
                        skills: model1Result.skills_score || 0,
                        situational: model1Result.situational_score || 0,
                        values: model1Result.values_score || 0,
                        personality: (model1Result.personality_score || 50) / 100
                    },
                    processedResponses: model1Result.processed_responses || 0,
                    
                    // ✅ ADD: Debug info to see what Python actually returned
                    debugPythonOutput: {
                        raw_cognitive_score: model1Result.cognitive_score,
                        raw_skills_score: model1Result.skills_score,
                        raw_detailed_scores: model1Result.detailed_scores
                    }
                };


                console.log('Final results structure built');
                
                return res.status(200).json({
                    success: true,
                    message: 'Assessment processed successfully with REAL Model 1',
                    data: {
                    detailedResults: detailedResults,
                    user: detailedResults.user
                    }
                });

                } catch (pythonError) {
                console.error('Python Model 1 failed:', pythonError.message);
                
                // Return error response
                return res.status(500).json({
                    success: false,
                    error: 'Model 1 processing failed',
                    details: pythonError.message
                });
            }
        }

        // ACTION: GET CAREER RECOMMENDATIONS
        if (action === 'career-recommendations') {
            const sampleRecommendations = [
                {
                    title: "Software Developer",
                    match: "92%",
                    description: "Design and develop software applications",
                    skills: ["Programming", "Problem Solving", "Logic"],
                    education: "Bachelor's Degree",
                    salary: "$70,000 - $120,000"
                },
                {
                    title: "Data Analyst", 
                    match: "87%",
                    description: "Analyze data to help businesses make decisions",
                    skills: ["Analytics", "Statistics", "Communication"],
                    education: "Bachelor's Degree",
                    salary: "$60,000 - $100,000"
                }
            ];

            return res.status(200).json({
                success: true,
                data: {
                    recommendations: sampleRecommendations,
                    totalMatches: sampleRecommendations.length
                }
            });
        }

        return res.status(400).json({
            success: false,
            error: 'Invalid action specified'
        });

    } catch (error) {
        console.error('❌ CRITICAL ERROR in ML prediction:', error.message);
        console.error('❌ Error stack:', error.stack);
        
        return res.status(500).json({
            success: false,
            error: 'Assessment processing failed',
            details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Test endpoint
router.get('/test', (req, res) => {
    console.log('🧪 ML Models test endpoint working');
    res.json({
        success: true,
        message: 'ML Models API is working',
        timestamp: new Date().toISOString()
    });
});

// ✅ ADD THIS ROUTE
// ✅ REPLACE the entire /check-assessment-status route (lines ~406-435) with this:
router.post('/check-assessment-status', async (req, res) => {
  console.log('🔍 Check assessment status route hit');
  console.log('📋 Request body:', req.body);
  
  try {
    const { userId } = req.body;
    console.log('👤 Extracted userId:', userId);
    
    if (!userId) {
      console.log('❌ No userId provided');
      return res.status(400).json({ error: 'User ID required' });
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    // Find the most recent assessment
    const assessmentResult = await Assessment.findOne({ 
      userId: objectId
    }).sort({ createdAt: -1 });
    
    console.log('📊 Found assessment result:', !!assessmentResult);
    
    if (assessmentResult) {
      console.log('📊 Found assessment result:', !!assessmentResult);
      // 🔍 ADD THESE NEW DEBUG LINES:
      console.log('🔍 Assessment testScores keys:', Object.keys(assessmentResult.testScores || {}));
      console.log('🔍 Assessment data structure:', JSON.stringify(assessmentResult, null, 2));
  
      // 🎯 CRITICAL: Build the EXACT format your frontend expects
      const detailedResults = {
        user: {
          name: assessmentResult.username || 'User',
          educationLevel: assessmentResult.educationLevel || 'Intermediate'
        },
        completedAt: assessmentResult.completedAt || assessmentResult.createdAt,
        personalityProfile: {
          type: assessmentResult.personalityType || 'Balanced Individual',
          score: assessmentResult.personalityScore || 50,
          dominantTrait: assessmentResult.personalityDominantTrait || 'balanced',
          description: assessmentResult.personalityDescription || 'Shows balanced traits'
        },

        detailed_scores: {
        // 🎯 ADD: Missing personality data
        personality: assessmentResult.testScores?.personality || {
            score: assessmentResult.personalityScore || 50,
            total: 100,
            percentage: assessmentResult.personalityScore || 50,
            type: assessmentResult.personalityType || 'Social Connector',
            dominantTrait: assessmentResult.personalityDominantTrait || 'balanced'
        },
        cognitive: assessmentResult.testScores?.cognitive || {
            correct: Math.round((assessmentResult.cognitiveScore || 0) * 0.15 / 100),
            total: 15,
            percentage: assessmentResult.cognitiveScore || 0
        },
        skills: assessmentResult.testScores?.skills || {
            correct: Math.round((assessmentResult.skillsScore || 0) * 0.19 / 100), 
            total: 19,
            percentage: assessmentResult.skillsScore || 0
        },
        situational: assessmentResult.testScores?.situational || {
            correct: Math.round((assessmentResult.situationalScore || 0) * 0.11 / 100),
            total: 11, 
            percentage: assessmentResult.situationalScore || 0
        },
        values: assessmentResult.testScores?.values || {
            correct: Math.round((assessmentResult.valuesScore || 0) * 0.11 / 100),
            total: 11,
            percentage: assessmentResult.valuesScore || 0
        }
        },
        
        overallScores: {
          cognitive: (assessmentResult.cognitiveScore || 0) / 100,
          skills: (assessmentResult.skillsScore || 0) / 100,
          situational: (assessmentResult.situationalScore || 0) / 100,
          values: (assessmentResult.valuesScore || 0) / 100
        }
      };

      console.log('✅ Sending results with detailed_scores:', Object.keys(detailedResults.detailed_scores));
      
      return res.json({
        success: true,
        hasResults: true,        // ← Frontend checks this
        results: detailedResults // ← Frontend uses this
      });
    } else {
      console.log('📊 No assessment found');
      return res.json({
        success: true,
        hasResults: false,
        results: null
      });
    }
  } catch (error) {
    console.error('❌ Error checking assessment status:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});


module.exports = router;