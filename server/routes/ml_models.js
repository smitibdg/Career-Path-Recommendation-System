const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
// ROUTE TO HANDLE CHECK-ASSESSMENT-STATUS
router.post('/check-assessment-status', async (req, res) => {
  try {
    const { userId } = req.body;
    console.log('ML Route: Checking assessment status for:', userId);

    if (!userId) {
      return res.status(400).json({ 
        success: false,
        error: 'User ID required' 
      });
    }

    const User = require('../models/User');
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ 
        success: true, 
        hasResults: false,
        message: 'User not found'
      });
    }

    console.log('ML Route: Assessment completed?', user.assessmentResults?.isAssessmentCompleted);

    // Check if user has completed assessments
    if (user.assessmentResults && user.assessmentResults.isAssessmentCompleted) {
      // Build completed tests array
      const completedTests = [];
      if (user.assessmentResults.personalityScore) completedTests.push('Personality');
      if (user.assessmentResults.cognitiveScore) completedTests.push('Cognitive');
      if (user.assessmentResults.skillsScore) completedTests.push('Skills');
      if (user.assessmentResults.situationalScore) completedTests.push('Situational');
      if (user.assessmentResults.valuesScore) completedTests.push('Values');

      const results = {
        user: {
          name: user.name,
          educationLevel: user.educationLevel || 'Intermediate'
        },
        completedAt: user.assessmentResults.assessmentCompletedAt || new Date(),
        personalityProfile: user.assessmentResults.personalityDetails || {},
        testResults: {
          cognitive: {
            correct: Math.round((user.assessmentResults.cognitiveScore / 100) * 15),
            total: 15,
            percentage: user.assessmentResults.cognitiveScore || 0
          },
          skills: {
            correct: Math.round((user.assessmentResults.skillsScore / 100) * 19),
            total: 19,
            percentage: user.assessmentResults.skillsScore || 0
          },
          situational: {
            correct: Math.round((user.assessmentResults.situationalScore / 100) * 11),
            total: 11,
            percentage: user.assessmentResults.situationalScore || 0
          },
          values: {
            correct: Math.round((user.assessmentResults.valuesScore / 100) * 11),
            total: 11,
            percentage: user.assessmentResults.valuesScore || 0
          }
        },
        overallScores: {
          cognitive: user.assessmentResults.cognitiveScore || 0,
          skills: user.assessmentResults.skillsScore || 0,
          situational: user.assessmentResults.situationalScore || 0,
          values: user.assessmentResults.valuesScore || 0,
          personality: (user.assessmentResults.personalityScore || 0) / 100
        }
      };

      console.log('ML Route: Returning completed results');
      return res.json({
        success: true,
        hasResults: true,
        results,
        completedTests
      });
    }

    console.log(' ML Route: No completed assessments');
    return res.json({
      success: true,
      hasResults: false,
      results: null,
      completedTests: []
    });

  } catch (error) {
    console.error('ML Route: check-assessment-status error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error checking assessment status'
    });
  }
});

const { spawn } = require('child_process');
const path = require('path');
const User = require('../models/User');
const TestResponse = require('../models/TestResponse');
// const Assessment = require('../models/Assessment');

// Enhanced Model 1 function that calls Python script
const runModel1Enhanced = (responses, educationLevel, username) => {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '../ml_models/model1/model1_scoring_engine.py');
    console.log('Starting Model 1 Enhanced Processing...');
    console.log('Input:', {
      responses: responses.length,
      educationLevel,
      username
    });
    console.log('Python script path:', pythonScript);

    const inputData = {
      responses: responses,
      education_level: educationLevel,
      username: username
    };

    const jsonInput = JSON.stringify(inputData);
    console.log('Sending to Python:', jsonInput.substring(0, 200) + '...');

    const pythonProcess = spawn('python', [pythonScript]);
    
    let outputData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
      console.log('Python error:', data.toString());
    });

    pythonProcess.on('close', (code) => {
      console.log('Python process completed with code:', code);
      
      if (code !== 0) {
        console.log('Python process failed');
        return reject(new Error(`Python process failed with code ${code}: ${errorData}`));
      }

      const cleanOutput = outputData.trim();
      console.log('Raw Python output length:', cleanOutput.length);
      
      if (!cleanOutput) {
        return reject(new Error('No output from Python script'));
      }

      try {
        const firstBrace = cleanOutput.indexOf('{');
        const lastBrace = cleanOutput.lastIndexOf('}');
        
        if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
          console.log('No valid JSON structure found');
          console.log('Raw output:', cleanOutput);
          return reject(new Error('No valid JSON structure in Python output'));
        }

        const jsonPart = cleanOutput.substring(firstBrace, lastBrace + 1);
        console.log('Extracted JSON length:', jsonPart.length);
        
        const result = JSON.parse(jsonPart);
        
        console.log('Model 1 Enhanced completed successfully');
        resolve(result);
        
      } catch (parseError) {
        console.log('Error parsing Python output:', parseError.message);
        console.log('Raw output:', cleanOutput);
        reject(new Error(`Failed to parse Python output: ${parseError.message}`));
      }
    });

    pythonProcess.on('error', (error) => {
      console.log('Python process error:', error.message);
      reject(new Error(`Python process failed: ${error.message}`));
    });

    pythonProcess.stdin.write(jsonInput);
    pythonProcess.stdin.end();
  });
};

// Main ML Prediction Route
router.post('/predict', async (req, res) => {
    console.log('ML Prediction endpoint called');
    console.log('Request body keys:', Object.keys(req.body));
    
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
                console.error('Database error:', dbError);
                return res.status(404).json({
                    success: false,
                    error: 'No existing results found'
                });
            }
        }

        // SUBMIT ASSESSMENT WITH REAL MODEL 1
        if (action === 'submit' && testResponses && testResponses.length > 0) {
            console.log('Processing assessment submission with REAL Model 1...');
            console.log('Received responses:', testResponses.length);
            
            console.log("ALL RESPONSES FROM FRONTEND:", JSON.stringify(testResponses.slice(0, 10), null, 2));

            // Get user details
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            console.log('User found:', user.name);
            console.log('User education:', user.educationLevel);
            console.log('User assessment level:', user.assessmentLevel);
            
            // Save test responses to TestResponse collection (for backup/audit)
            let testResponseDoc = await TestResponse.findOne({ 
                userId: user._id, 
                isActive: true 
            });

            if (!testResponseDoc) {
                testResponseDoc = new TestResponse({
                    userId: user._id,
                    username: user.name,
                    educationLevel: user.educationLevel || 'intermediate',
                    responses: [],
                    isActive: true,
                    isScored: false
                });
            }

            testResponseDoc.responses = [];
            testResponses.forEach(response => {
                testResponseDoc.responses.push({
                    questionId: response.questionId,
                    answer: response.answer,
                    testType: response.testType
                });
            });

            await testResponseDoc.save();
            console.log('Test responses saved to TestResponse collection:', testResponseDoc._id);

            // COMPLETE EDUCATION MAPPING - MATCHES SERVER.JS
            const educationMapping = {
              // Foundation Level (10th-12th)
              'intermediate-10th': 'Foundation',
              'intermediate-11th': 'Foundation', 
              'intermediate-12th': 'Foundation',
              '10th': 'Foundation',
              '11th': 'Foundation',
              '12th': 'Foundation',
              'highschool': 'Foundation', // Keep this for backward compatibility
              
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

            const mappedEducationLevel = educationMapping[user.educationLevel?.toLowerCase()] || 'Foundation';

            console.log('🎓 [DEBUG] User education level from DB:', user.educationLevel);
            console.log('🎓 [DEBUG] Mapped education level for Python:', mappedEducationLevel);
            console.log('🎓 [DEBUG] Available mappings:', Object.keys(educationMapping));


            // VERIFY MAPPING IS CORRECT
            if (mappedEducationLevel !== user.assessmentLevel) {
                console.log('   [WARNING] Mapping mismatch!');
                console.log('   - Database assessmentLevel:', user.assessmentLevel);
                console.log('   - Mapped for Python:', mappedEducationLevel);
            }



            // Format responses for Python Model 1
            const formattedResponses = testResponseDoc.responses.map(response => {
                let answerValue;
                
                if (response.questionId.includes('P')) {
                    answerValue = String(response.answer);
                } else {
                    const optionMap = { 1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E' };
                    answerValue = optionMap[response.answer] || 'A';
                }
                
                return {
                    Question_ID: response.questionId,
                    Answer: answerValue
                };
            });

            console.log('Formatted responses by type:', {
                personality: formattedResponses.filter(r => r.Question_ID.includes('P')).length,
                skills: formattedResponses.filter(r => r.Question_ID.includes('S')).length,
                cognitive: formattedResponses.filter(r => r.Question_ID.includes('C')).length,
                situational: formattedResponses.filter(r => r.Question_ID.includes('T')).length,
                values: formattedResponses.filter(r => r.Question_ID.includes('V')).length
            });

            try {
                console.log('Calling Python Model 1...');
                
                const model1Result = await runModel1Enhanced(formattedResponses, mappedEducationLevel, user.name);
                
                console.log('Model 1 completed successfully');
                console.log('Python model1Result keys:', Object.keys(model1Result));

                // Update USER document with assessment results
                console.log('Updating user assessment results...');
                
                user.assessmentResults = {
                    // Test Scores
                    cognitiveScore: Math.round((model1Result.cognitive_score || 0) * 100),
                    skillsScore: Math.round((model1Result.skills_score || 0) * 100),
                    situationalScore: Math.round((model1Result.situational_score || 0) * 100),
                    valuesScore: Math.round((model1Result.values_score || 0) * 100),
                    personalityScore: model1Result.personality_score || 50,
                    
                    // Detailed Test Scores with personality included
                    testScores: {
                        ...model1Result.detailed_scores,
                        personality: {
                            score: model1Result.personality_score || 50,
                            total: 100,
                            percentage: model1Result.personality_score || 50,
                            type: model1Result.personality_type || 'Balanced',
                            dominantTrait: model1Result.personality_dominant_trait || 'balanced'
                        }
                    },
                    
                    // Personality Details  
                    personalityDetails: {
                        type: model1Result.personality_type || 'Balanced Individual',
                        dominantTrait: model1Result.personality_dominant_trait || 'balanced',
                        description: model1Result.personality_description || 'Shows balanced traits',
                        traits: {
                            openness: model1Result.personality_o || 0,
                            conscientiousness: model1Result.personality_c || 0,
                            extraversion: model1Result.personality_e || 0,
                            agreeableness: model1Result.personality_a || 0,
                            neuroticism: model1Result.personality_n || 0
                        }
                    },
                    
                    // Test Completion Status
                    testCompletionStatus: {
                        personalityTest: true,
                        cognitiveTest: true,
                        skillsTest: true,
                        situationalTest: true,
                        valuesTest: true
                    },
                    
                    // Metadata
                    isAssessmentCompleted: true,
                    assessmentCompletedAt: new Date(),
                    modelVersion: '1.0',
                    lastUpdated: new Date()
                };

                await user.save();
                console.log('✅ User assessment results saved:', user._id);

                // CALL MODEL 2 SYNCHRONOUSLY BEFORE RESPONSE
                try {
                    console.log('Calling Model 2 for career cluster prediction...');
                    
                    // Prepare data for Model 2
                    const model2InputData = {
                        age: user.age || 25,
                        gender: user.gender || 'Female',
                        educationLevel: user.educationLevel || 'bachelors',
                        interests: Array.isArray(user.interests) ? user.interests[0] : (user.interests || 'Programming'),
                        personalityType: user.personalityType || 'Ambivert',
                        personalityScore: user.assessmentResults.personalityScore || 75,
                        cognitiveScore: user.assessmentResults.cognitiveScore || 80,
                        skillsScore: user.assessmentResults.skillsScore || 80,
                        situationalScore: user.assessmentResults.situationalScore || 75,
                        valuesScore: user.assessmentResults.valuesScore || 75
                    };
                    
                    console.log('Model 2 input data:', model2InputData);
                    
                    // Call Model 2 SYNCHRONOUSLY using Promise wrapper
                    const model2Result = await new Promise((resolve, reject) => {
                        const pythonScriptPath = path.join(__dirname, '../ml_models', 'model2', 'model2_cluster_predictor.py');
                        const model2Process = spawn('python', [pythonScriptPath, JSON.stringify(model2InputData)]);
                        
                        let model2Output = '';
                        let model2Error = '';
                        
                        model2Process.stdout.on('data', (data) => {
                            model2Output += data.toString();
                        });
                        
                        model2Process.stderr.on('data', (data) => {
                            model2Error += data.toString();
                            console.log('Model 2 Python error:', data.toString());
                        });
                        
                        model2Process.on('close', (code) => {
                            console.log('Model 2 Python process completed with code:', code);
                            
                            if (code !== 0) {
                                console.error('Model 2 failed with code:', code, model2Error);
                                return resolve(null); // Continue even if Model 2 fails
                            }
                            
                            try {
                                console.log('Model 2 raw output:', model2Output.trim());
                                
                                // Extract JSON from output - look for the ACTUAL result JSON
                                const cleanOutput = model2Output.trim();

                                // Look for the line that starts with actual JSON (contains "success": true)
                                const lines = cleanOutput.split('\n');
                                let jsonLine = null;

                                for (const line of lines) {
                                    const trimmedLine = line.trim();
                                    if (trimmedLine.startsWith('{"success"')) {
                                        jsonLine = trimmedLine;
                                        break;
                                    }
                                }

                                if (!jsonLine) {
                                    console.log('No JSON result found in Model 2 output');
                                    console.log('Raw Model 2 output:', cleanOutput);
                                    return resolve(null);
                                }

                                console.log('Found Model 2 JSON line:', jsonLine);

                                
                                const result = JSON.parse(jsonLine);
                                console.log('Model 2 prediction result:', result);
                                resolve(result);
                                
                            } catch (parseError) {
                                console.error('Model 2 parse error:', parseError.message);
                                console.log('Failed JSON part:', model2Output.trim());
                                resolve(null); // Continue even if parsing fails
                            }
                        });
                        
                        model2Process.on('error', (error) => {
                            console.error('Model 2 process error:', error.message);
                            resolve(null); // Continue even if process fails
                        });
                    });
                    
                    // Update user with Model 2 results if successful
                    if (model2Result) {
                        // Update the existing careerCluster fields directly
                        user.careerCluster = model2Result.prediction;
                        user.predictionConfidence = model2Result.confidence;
                        user.lastPrediction = new Date();
                        
                        await user.save();
                        console.log('Model 2 results saved to existing careerCluster fields:', model2Result.prediction);

                        // ALSO SAVE TO NESTED STRUCTURE
                        if (!user.assessmentResults.model2Results) {
                            user.assessmentResults.model2Results = {};
                        }

                        user.assessmentResults.model2Results = {
                            predictedCareerCluster: model2Result.prediction,
                            predictionConfidence: model2Result.confidence,
                            predictionMethod: model2Result.method || 'RandomForest',
                            predictionProbabilities: model2Result.all_probabilities || {},
                            lastPredictionDate: new Date()
                        };

                        await user.save(); // Save again after updating nested structure
                        console.log('Model 2 also saved to nested structure');
                    }



                    // CALL MODEL 3 AUTOMATICALLY AFTER MODEL 2 COMPLETION
                    try {
                        console.log('Calling Model 3 for career role recommendations...');
                        
                        const clusterMapping = {
                            'Engineering': 'STEM',
                            'Legal': 'Law',
                            'Law': 'Legal'
                        };

                        const model3Cluster = clusterMapping[user.careerCluster] || user.careerCluster;
                        console.log('[Model 3] Input cluster (from Model 2):', user.careerCluster);
                        console.log('[Model 3] Mapped cluster for Model 3:', model3Cluster);
                        
                        // Prepare data for Model 3 (uses MAPPED cluster)
                        const model3InputData = {
                            careerCluster: user.careerCluster,
                            personalityScore: user.assessmentResults.personalityScore || 50,
                            cognitiveScore: user.assessmentResults.cognitiveScore || 50,
                            skillsScore: user.assessmentResults.skillsScore || 50,  
                            situationalScore: user.assessmentResults.situationalScore || 50,
                            valuesScore: user.assessmentResults.valuesScore || 50,
                            educationLevel: user.educationLevel,
                            interests: Array.isArray(user.interests) ? user.interests[0] : (user.interests || 'General')
                        };

                        console.log('[Model 3] All scores:', {
                            cognitive: model3InputData.cognitiveScore,
                            skills: model3InputData.skillsScore,
                            situational: model3InputData.situationalScore,
                            values: model3InputData.valuesScore
                        });

                        
                        console.log('Model 3 input data:', model3InputData);
                        
                        // Call Model 3 SYNCHRONOUSLY using Promise wrapper
                        const model3Result = await new Promise((resolve, reject) => {
                            const pythonScriptPath = path.join(__dirname, '../ml_models', 'model3', 'model3_career_role_predictor.py');
                            const model3Process = spawn('python', [pythonScriptPath, JSON.stringify(model3InputData)]);

                            // ADD THESE 2 LINES RIGHT HERE:
                            console.log('Model 3 Python script path:', pythonScriptPath);
                            console.log('Model 3 input data:', JSON.stringify(model3InputData));
                            
                            let model3Output = '';
                            let model3Error = '';
                            
                            model3Process.stdout.on('data', (data) => {
                                model3Output += data.toString();
                                console.log('Model 3 stdout:', data.toString());
                                console.log('Model 3 stderr:', data.toString());
                            });
                            
                            model3Process.stderr.on('data', (data) => {
                                model3Error += data.toString();
                                console.log('Model 3 Python error:', data.toString());
                            });
                            
                            model3Process.on('close', (code) => {
                                console.log('Model 3 Python process completed with code:', code);
                                
                                if (code !== 0) {
                                    console.error('Model 3 failed with code:', code, model3Error);
                                    return resolve(null);
                                }
                                
                                try {
                                    console.log('Model 3 raw output:', model3Output.trim());
                                    
                                    // Look for JSON line in Model 3 output
                                    const lines = model3Output.trim().split('\n');
                                    let jsonLine = null;

                                    for (const line of lines) {
                                        const trimmedLine = line.trim();
                                        if (trimmedLine.startsWith('{"success"') || trimmedLine.startsWith('{"recommendations"')) {
                                            jsonLine = trimmedLine;
                                            break;
                                        }
                                    }

                                    if (!jsonLine) {
                                        console.log('No JSON result found in Model 3 output');
                                        return resolve(null);
                                    }

                                    console.log('📥 Found Model 3 JSON line:', jsonLine);
                                    const result = JSON.parse(jsonLine);
                                    console.log('Model 3 prediction result:', result);
                                    resolve(result);
                                    
                                } catch (parseError) {
                                    console.error('Model 3 parse error:', parseError.message);
                                    resolve(null);
                                }
                            });
                            
                            model3Process.on('error', (error) => {
                                console.error('Model 3 process error:', error.message);
                                resolve(null);
                            });
                        });
                        
                        // Update user with Model 3 results if successful
                        if (model3Result && model3Result.recommendations && model3Result.recommendations.length > 0) {
                            console.log('[Model 3] User cluster from Model 2:', user.careerCluster);
                            console.log('[Model 3] Available roles from Model 3:', model3Result.recommendations.map(r => `${r.career_role} (${r.career_cluster})`));
                            
                            // FILTER ROLES BY CORRECT CLUSTER
                            // THIS FIXES THE ISSUE: If model3 gives valid recommendations, use them first -- even if the clusters don't match exactly.

                            let selectedRole;
                            if (model3Result && model3Result.recommendations && model3Result.recommendations.length > 0) {
                              // Use the top-1 recommendation from Model 3, regardless of cluster
                              selectedRole = model3Result.recommendations[0];
                              user.careerRole = selectedRole.career_role;
                              user.roleConfidence = selectedRole.confidence_score;
                              user.lastRolePrediction = new Date();
                              // Also save ALL recommendations for display in frontend, if not already saved
                              if (!user.assessmentResults.model3Results) user.assessmentResults.model3Results = { predictedCareerRoles: [], lastRolePredictionDate: null };
                              user.assessmentResults.model3Results.predictedCareerRoles = model3Result.recommendations.map(rec => ({
                                role: rec.careerrole,
                                confidence: rec.confidence_score,
                                cluster: rec.careercluster,
                                requiredSkills: rec.requiredskills?.split(",") || [],
                                educationRequired: rec.educationlevelrequired,
                                averageSalary: rec.avgsalaryrange,
                                jobOutlook: rec.joboutlook,
                                growthPath: rec.growthpath?.split(",") || [],
                                entranceExams: rec.entranceexams?.split(",") || [],
                                recommendedFields: rec.fieldforadmission?.split(",") || [],
                                predictedAt: new Date()
                              }));
                              user.assessmentResults.model3Results.lastRolePredictionDate = new Date();
                              await user.save();
                              console.log("Model 3 results saved: Top recommendation used:", selectedRole.career_role);
                            } else {
                              // If Model 3 gives no recommendations, only then fallback to generic.
                              selectedRole = {
                                careerrole: user.careerCluster === "Research" ? "Research Scientist" :
                                            user.careerCluster === "Design" ? "UX Designer" :
                                            user.careerCluster === "Business" ? "Business Analyst" :
                                            "Professional Specialist",
                                careercluster: user.careerCluster,
                                confidencescore: 0.8,
                                requiredskills: "Research, Analysis, Problem Solving, Critical Thinking",
                                educationlevelrequired: "Graduation",
                                avgsalaryrange: "8-25 LPA",
                                joboutlook: "Good",
                                growthpath: "Entry Level, Specialist, Senior, Lead, Manager",
                                learningresources: "Professional Development",
                                entranceexams: "Competitive Exams, Industry Certifications",
                                fieldforadmission: user.careerCluster + " Studies"
                              };
                              user.careerRole = selectedRole.career_role;
                              user.roleConfidence = selectedRole.confidence_score;
                              user.lastRolePrediction = new Date();
                              // Store the fallback role for Model 3 as well
                              user.assessmentResults.model3Results = {
                                predictedCareerRoles: [selectedRole],
                                lastRolePredictionDate: new Date()
                              };
                              await user.save();
                              console.log("Model 3: Fallback role created and saved:", selectedRole.careerrole);
                            }

                            
                            // SAVE SELECTED ROLE
                            user.careerRole = selectedRole.career_role;
                            user.roleConfidence = selectedRole.confidence_score || 0.8;
                            user.lastRolePrediction = new Date();
                            
                            // SAVE ALL RECOMMENDATIONS TO USER MODEL
                            if (!user.assessmentResults.model3Results) {
                                user.assessmentResults.model3Results = {
                                    predictedCareerRoles: [],
                                    lastRolePredictionDate: null
                                };
                            }
                            
                            user.assessmentResults.model3Results = {
                                predictedCareerRoles: [
                                    // ADD SELECTED ROLE FIRST
                                    {
                                        role: selectedRole.career_role,
                                        confidence: selectedRole.confidence_score || 0.8,
                                        cluster: selectedRole.career_cluster || user.careerCluster,
                                        predictedAt: new Date(),
                                        requiredSkills: selectedRole.required_skills ? selectedRole.required_skills.split('; ') : ['Research', 'Analysis'],
                                        educationRequired: selectedRole.education_level_required || 'Graduation',
                                        averageSalary: {
                                            min: 8,
                                            max: 25,
                                            currency: 'INR'
                                        },
                                        jobOutlook: selectedRole.job_outlook || 'Good',
                                        growthPath: selectedRole.growth_path ? selectedRole.growth_path.split(' > ') : ['Entry Level', 'Specialist', 'Senior', 'Lead'],
                                        learningResources: [{
                                            title: 'Professional Development',
                                            url: 'https://coursera.org',
                                            type: 'Course',
                                            free: true
                                        }],
                                        entranceExams: ['Competitive Exams', 'Industry Certifications'],
                                        recommendedFields: [user.careerCluster + ' Studies']
                                    },
                                    // ADD OTHER ROLES FROM MODEL 3
                                    ...model3Result.recommendations.slice(0, 3).map(role => ({
                                        role: role.career_role,
                                        confidence: role.confidence_score || 0.7,
                                        cluster: role.career_cluster,
                                        predictedAt: new Date(),
                                        requiredSkills: role.required_skills ? role.required_skills.split('; ') : [],
                                        educationRequired: role.education_level_required || 'Graduation',
                                        averageSalary: {
                                            min: parseFloat(role.avg_salary_range?.split('-')[0]) || 5,
                                            max: parseFloat(role.avg_salary_range?.split('-')[1]) || 15,
                                            currency: 'INR'
                                        },
                                        jobOutlook: role.job_outlook || 'Good',
                                        growthPath: role.growth_path ? role.growth_path.split(' > ') : [],
                                        learningResources: [{
                                            title: role.learning_resources || 'Professional Development',
                                            url: role.online_resources_links?.split('; ')[0] || 'https://coursera.org',
                                            type: 'Course',
                                            free: true
                                        }],
                                        entranceExams: role.entrance_exams ? role.entrance_exams.split('; ') : [],
                                        recommendedFields: [role.field_for_admission || 'Relevant Degree']
                                    }))
                                ],
                                lastRolePredictionDate: new Date()
                            };
                            
                            await user.save();
                            console.log('Model 3 results saved - Role:', user.careerRole);
                            console.log('Model 3 results saved - All roles count:', user.assessmentResults.model3Results.predictedCareerRoles.length);
                        }


                        
                    } catch (model3Error) {
                        console.error('Model 3 call failed:', model3Error.message);
                    }
                    
                } catch (model2Error) {
                    console.error('Model 2 call failed:', model2Error.message);
                }

                // Build response for frontend (AFTER Model 2 completion)
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
                    }
                };

                return res.status(200).json({
                    success: true,
                    message: 'Assessment processed and saved to user profile',
                    data: {
                        detailedResults: detailedResults,
                        user: detailedResults.user
                    }
                });

            } catch (pythonError) {
                console.error('Python Model 1 failed:', pythonError.message);
                
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
        console.error('CRITICAL ERROR in ML prediction:', error.message);
        console.error('Error stack:', error.stack);
        
        return res.status(500).json({
            success: false,
            error: 'Assessment processing failed',
            details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});



// FIXED: Check Assessment Status Route
router.post('/check-assessment-status', async (req, res) => {
  try {
    const { userId } = req.body;
    console.log('Checking assessment status for user:', userId);

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const user = await User.findById(userId);
    console.log('User found:', !!user);

    if (!user) {
      return res.json({ 
        success: true, 
        hasResults: false, 
        results: null,
        message: 'User not found'
      });
    }

    console.log('Assessment completed:', user?.assessmentResults?.isAssessmentCompleted);

    if (user?.assessmentResults?.isAssessmentCompleted) {
      const results = {
        user: {
          name: user.name,
          educationLevel: user.educationLevel || 'Intermediate'
        },
        completedAt: user.assessmentResults.assessmentCompletedAt,
        personalityProfile: user.assessmentResults.personalityDetails,
        testResults: {
          cognitive: {
            correct: Math.round((user.assessmentResults.cognitiveScore / 100) * 15),
            total: 15,
            percentage: user.assessmentResults.cognitiveScore
          },
          skills: {
            correct: Math.round((user.assessmentResults.skillsScore / 100) * 19),
            total: 19,
            percentage: user.assessmentResults.skillsScore
          },
          situational: {
            correct: Math.round((user.assessmentResults.situationalScore / 100) * 11),
            total: 11,
            percentage: user.assessmentResults.situationalScore
          },
          values: {
            correct: Math.round((user.assessmentResults.valuesScore / 100) * 11),
            total: 11,
            percentage: user.assessmentResults.valuesScore
          }
        },
        overallScores: {
          cognitive: user.assessmentResults.cognitiveScore,
          skills: user.assessmentResults.skillsScore,
          situational: user.assessmentResults.situationalScore,
          values: user.assessmentResults.valuesScore,
          personality: user.assessmentResults.personalityScore / 100
        }
      };

      // Determine completed tests based on test completion status
      const completedTests = [];
      if (user.assessmentResults.testCompletionStatus?.personalityTest) completedTests.push('Personality');
      if (user.assessmentResults.testCompletionStatus?.cognitiveTest) completedTests.push('Cognitive');
      if (user.assessmentResults.testCompletionStatus?.skillsTest) completedTests.push('Skills');
      if (user.assessmentResults.testCompletionStatus?.situationalTest) completedTests.push('Situational');
      if (user.assessmentResults.testCompletionStatus?.valuesTest) completedTests.push('Values');

      console.log('Returning results for user:', userId);
      console.log('Completed tests:', completedTests);

      return res.json({
        success: true,
        hasResults: true,
        results,
        completedTests
      });
    }

    console.log('No completed results found for user:', userId);
    return res.json({
      success: true,
      hasResults: false,
      results: null,
      completedTests: []
    });

  } catch (error) {
    console.error('Error in check-assessment-status:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});





// CAREER RECOMMENDATIONS
router.get('/career-recommendations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('Getting career recommendations for user:', userId);
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if assessments are completed
    if (!user.assessmentResults || !user.assessmentResults.isAssessmentCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all assessments first',
        requiresAssessment: true
      });
    }

    // Check if we have career cluster prediction
    if (!user.careerCluster) {
      return res.status(400).json({
        success: false,
        message: 'Career cluster prediction not available. Please retake assessments.',
        requiresRerun: true
      });
    }

    // If we don't have Model 3 results yet, generate them now
    if (!user.careerRole) {
      console.log('Running Model 3 for career role recommendations...');
      
      const model3InputData = {
        career_cluster: user.careerCluster,
        user_education: user.educationLevel || 'Graduation',
        top_n: 5
      };
      
      // Call Model 3 Python script
      const model3Result = await new Promise((resolve) => {
        const pythonScriptPath = path.join(__dirname, '../ml_models', 'model3', 'model3_career_role_predictor.py');
        const model3Process = spawn('python', [pythonScriptPath, JSON.stringify(model3InputData)]);
        
        let model3Output = '';
        
        model3Process.stdout.on('data', (data) => {
          model3Output += data.toString();
        });
        
        model3Process.on('close', (code) => {
          if (code !== 0) {
            return resolve(null);
          }
          
          try {
            const lines = model3Output.trim().split('\n');
            const jsonLine = lines.find(line => line.trim().startsWith('{"success"'));
            
            if (jsonLine) {
              const result = JSON.parse(jsonLine);
              return resolve(result);
            }
            
            resolve(null);
          } catch (e) {
            resolve(null);
          }
        });
      });
      
      // Save Model 3 results if successful
      if (model3Result && model3Result.recommendations) {
        user.careerRole = model3Result.recommendations[0]?.career_role || null;
        user.roleConfidence = model3Result.recommendations[0]?.confidence_score || null;
        user.lastRolePrediction = new Date();
        
        // Also save full recommendations for frontend
        if (!user.assessmentResults.model3Results) {
          user.assessmentResults.model3Results = {};
        }
        
        user.assessmentResults.model3Results.predictedCareerRoles = model3Result.recommendations.map(rec => ({
          role: rec.career_role,
          confidence: rec.confidence_score,
          cluster: rec.career_cluster,
          requiredSkills: rec.required_skills?.split(';') || [],
          educationRequired: rec.education_level_required,
          averageSalary: {
            min: parseInt(rec.avg_salary_range?.split('-')[0]) * 100000 || 600000,
            max: parseInt(rec.avg_salary_range?.split('-')[1]?.split(' ')[0]) * 100000 || 1500000,
            currency: 'INR'
          },
          jobOutlook: rec.job_outlook,
          growthPath: rec.growth_path?.split(' > ') || [],
          entranceExams: rec.entrance_exams?.split(';') || [],
          recommendedFields: rec.field_for_admission?.split(';') || [],
          predictedAt: new Date()
        }));
        user.assessmentResults.model3Results.lastRolePredictionDate = new Date();
        
        await user.save();
        console.log('Model 3 results saved');
      }
    }
    
    // Return career recommendations for frontend
    const recommendations = user.assessmentResults.model3Results?.predictedCareerRoles || [];
    
    console.log('Returning career recommendations:', recommendations.length);
    
    res.status(200).json({
      success: true,
      message: 'Career recommendations retrieved successfully',
      data: {
        recommendations: recommendations,
        totalMatches: recommendations.length,
        careerCluster: user.careerCluster,
        userProfile: {
          name: user.name,
          educationLevel: user.educationLevel,
          assessmentScores: {
            cognitive: user.assessmentResults.cognitiveScore,
            skills: user.assessmentResults.skillsScore,
            personality: user.assessmentResults.personalityScore,
            situational: user.assessmentResults.situationalScore,
            values: user.assessmentResults.valuesScore
          }
        }
      }
    });
    
  } catch (error) {
    console.error('Career recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting career recommendations',
      error: error.message
    });
  }
});

module.exports = router;