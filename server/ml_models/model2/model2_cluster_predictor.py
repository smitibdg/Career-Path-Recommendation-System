import pandas as pd
import numpy as np
import joblib
import json
import sys
import warnings
warnings.filterwarnings('ignore')

class CareerPredictor:
    def __init__(self, model_path='ml_models/model2'):
        """Initialize the career predictor with saved models"""
        try:
            # Load your trained models (from your .ipynb)
            self.model = joblib.load(f'{model_path}/best_model_2.pkl')
            self.label_encoders = joblib.load(f'{model_path}/label_encoders.pkl')
            self.feature_names = joblib.load(f'{model_path}/feature_names.pkl')
            self.model_loaded = True
            print("SUCCESS: Career prediction model loaded successfully!")
        except Exception as e:
            print(f"ERROR: Error loading model: {e}")
            self.model_loaded = False
    
    def encode_categorical_data(self, data):
        """Encode categorical variables using saved label encoders"""
        encoded_data = data.copy()
        
        categorical_columns = ['gender', 'educationLevel', 'interests', 'personalityType']
        
        for column in categorical_columns:
            if column in encoded_data:
                try:
                    # Handle new/unknown categories
                    if encoded_data[column] in self.label_encoders[column].classes_:
                        encoded_data[column] = self.label_encoders[column].transform([encoded_data[column]])[0]
                    else:
                        # Assign most common category for unknown values
                        encoded_data[column] = 0
                except Exception as e:
                    print(f"Warning: Error encoding {column}: {e}")
                    encoded_data[column] = 0
        
        return encoded_data
    
    def predict_career(self, user_data):
        """Make career cluster prediction for user data"""
        if not self.model_loaded:
            return {"error": "Model not loaded", "success": False}
        
        try:
            # Prepare input data
            input_data = {
                'age': user_data.get('age', 25),
                'gender': user_data.get('gender', 'Male'),
                'educationLevel': user_data.get('educationLevel', 'bachelors'),
                'interests': user_data.get('interests', 'Programming'),
                'personalityType': user_data.get('personalityType', 'Ambivert'),
                'personalityScore': user_data.get('personalityScore', 75),
                'cognitiveScore': user_data.get('cognitiveScore', 80),
                'skillsScore': user_data.get('skillsScore', 80),
                'situationalScore': user_data.get('situationalScore', 75),
                'valuesScore': user_data.get('valuesScore', 75)
            }
            
            print(f"Processing user data: {input_data}") 
            
            # Encode categorical variables
            encoded_data = self.encode_categorical_data(input_data)
            
            # Create feature vector in correct order
            feature_vector = []
            for feature in self.feature_names:
                feature_vector.append(encoded_data[feature])
            
            # Reshape for single prediction
            feature_vector = np.array(feature_vector).reshape(1, -1)
            
            # Make prediction
            prediction = self.model.predict(feature_vector)[0]
            probabilities = self.model.predict_proba(feature_vector)[0]
            confidence = np.max(probabilities)
            
            print(f"SUCCESS: Prediction: {prediction} (Confidence: {confidence:.3f})")
            
            return {
                "success": True,
                "prediction": prediction,
                "confidence": float(confidence),
                "method": "RandomForest_87.5%_Accuracy",
                "all_probabilities": dict(zip(self.model.classes_, probabilities))
            }
            
        except Exception as e:
            print(f"ERROR: Prediction error: {e}")
            return {"error": str(e), "success": False}

def main():
    """Main function for command line usage"""
    if len(sys.argv) < 2:
        print("Usage: python career_predictor.py <user_data_json>")
        return
    
    # Initialize predictor
    predictor = CareerPredictor()
    
    # Parse user data
    try:
        user_data = json.loads(sys.argv[1])
        
        # Make prediction
        result = predictor.predict_career(user_data)
        
        # Output result as JSON
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {"error": str(e), "success": False}
        print(json.dumps(error_result))

if __name__ == "__main__":
    main()