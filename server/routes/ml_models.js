const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');
const User = require('../models/User');

// Enhanced Model 1 function that calls Python script
const runModel1Enhanced = (responses, educationLevel, username) => {
    return new Promise((resolve, reject) => {
        console.log('🚀 Starting Model 1 Enhanced Processing...');
        console.log('📊 Input:', { responses: responses.length, educationLevel, username });

        // Path to Python script
        const scriptPath = path.join(__dirname, '../ml_models/model1/model1_scoring_engine.py');
        console.log('📍 Python script path:', scriptPath);

        // Prepare input data for Python
        const inputData = JSON.stringify({
            responses: responses,
            education_level: educationLevel,
            username: username
        });

        console.log('📤 Sending to Python:', inputData.substring(0, 200) + '...');

        // Spawn Python process
        const pythonProcess = spawn('python', [scriptPath], {
            stdio: ['pipe', 'pipe', 'pipe'],
            env: { ...process.env, PYTHONPATH: path.join(__dirname, '../ml_models') }
        });

        let outputData = '';
        let errorData = '';

        // Handle Python stdout
        pythonProcess.stdout.on('data', (data) => {
            const output = data.toString();
            console.log('🐍 Python output:', output);
            outputData += output;
        });

        // Handle Python stderr
        pythonProcess.stderr.on('data', (data) => {
            const error = data.toString();
            console.log('🐍 Python error:', error);
            errorData += error;
        });

        // Send input to Python
        pythonProcess.stdin.write(inputData);
        pythonProcess.stdin.end();

        // Handle process completion
        pythonProcess.on('close', (code) => {
            console.log('🐍 Python process completed with code:', code);

            if (code !== 0) {
                console.error('❌ Python process failed:', errorData);
                return reject(new Error(`Python process failed: ${errorData}`));
            }

            try {
                // Parse the last JSON output from Python
                const lines = outputData.trim().split('\n');
                const jsonLine = lines[lines.length - 1];
                
                console.log('📥 Python final output:', jsonLine);

                if (!jsonLine || jsonLine.trim() === '') {
                    throw new Error('No output from Python script');
                }

                const result = JSON.parse(jsonLine);
                console.log('✅ Successfully parsed Python result');
                console.log('📊 Result keys:', Object.keys(result));

                resolve(result);
            } catch (parseError) {
                console.error('❌ Error parsing Python output:', parseError);
                console.error('❌ Raw output:', outputData);
                reject(new Error(`Failed to parse Python output: ${parseError.message}`));
            }
        });

        // Handle process errors
        pythonProcess.on('error', (error) => {
            console.error('❌ Failed to start Python process:', error);
            reject(new Error(`Failed to start Python process: ${error.message}`));
        });

        // Timeout after 60 seconds
        setTimeout(() => {
            pythonProcess.kill();
            reject(new Error('Python process timed out after 60 seconds'));
        }, 60000);
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

            // Map education level
            const educationMapping = {
                'highschool': 'Foundation',
                'bachelors': 'Intermediate',
                'masters': 'Advanced',
                'phd': 'Advanced'
            };
            
            const mappedEducationLevel = educationMapping[user.educationLevel?.toLowerCase()] || 'Intermediate';

            // Format responses for Python Model 1
            const formattedResponses = testResponses.map(response => ({
                Question_ID: response.questionId,
                Answer: response.answer
            }));

            console.log('📋 Formatted responses sample:', formattedResponses.slice(0, 3));

            try {
                console.log('🧮 Calling Python Model 1...');
                
                // Call the real Python Model 1
                const model1Result = await runModel1Enhanced(formattedResponses, mappedEducationLevel, user.name);
                
                console.log('✅ Model 1 completed successfully');

                // Build final results using REAL calculated scores from Python
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
                            correct: model1Result.detailed_scores.cognitive.correct,
                            total: model1Result.detailed_scores.cognitive.total,
                            percentage: model1Result.detailed_scores.cognitive.percentage
                        },
                        skills: {
                            correct: model1Result.detailed_scores.skills.correct,
                            total: model1Result.detailed_scores.skills.total,
                            percentage: model1Result.detailed_scores.skills.percentage
                        },
                        situational: {
                            score: model1Result.detailed_scores.situational.correct,
                            total: model1Result.detailed_scores.situational.total,
                            percentage: model1Result.detailed_scores.situational.percentage
                        },
                        values: {
                            score: model1Result.detailed_scores.values.correct,
                            total: model1Result.detailed_scores.values.total,
                            percentage: model1Result.detailed_scores.values.percentage
                        }
                    },
                    overallScores: {
                        cognitive: model1Result.cognitive_score,
                        skills: model1Result.skills_score,
                        situational: model1Result.situational_score,
                        values: model1Result.values_score,
                        personality: model1Result.personality_score / 100
                    }
                };

                console.log('📋 Final results structure built');
                console.log('🎯 Test Results Summary:');
                console.log(`   Cognitive: ${detailedResults.testResults.cognitive.correct}/${detailedResults.testResults.cognitive.total}`);
                console.log(`   Skills: ${detailedResults.testResults.skills.correct}/${detailedResults.testResults.skills.total}`);
                console.log(`   Situational: ${detailedResults.testResults.situational.score}/${detailedResults.testResults.situational.total}`);
                console.log(`   Values: ${detailedResults.testResults.values.score}/${detailedResults.testResults.values.total}`);

                return res.status(200).json({
                    success: true,
                    message: 'Assessment processed successfully with REAL Model 1',
                    data: {
                        detailedResults: detailedResults,
                        user: detailedResults.user
                    }
                });

            } catch (pythonError) {
                console.error('❌ Python Model 1 failed:', pythonError.message);
                
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

module.exports = router;