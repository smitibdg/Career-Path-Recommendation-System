#!/usr/bin/env python3
"""
Model 3: Career Role Recommendation System
Hybrid KNN + Cosine Similarity Approach
"""

import pandas as pd
import numpy as np
import json
import sys
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import LabelEncoder, StandardScaler
import warnings
warnings.filterwarnings('ignore')

class CareerRolePredictor:
    def __init__(self):
        self.df = None
        self.content_sim_matrix = None
        self.knn_model = None
        self.scaler = None
        self.tfidf_vectorizer = None
        self.label_encoders = {}
        self.model_loaded = False
        
        self.load_dataset()
        self.train_model()
    
    def load_dataset(self):
        """Load career roles from CSV file"""
        import os
        
        # Path to your existing CSV file
        csv_path = os.path.join(os.path.dirname(__file__), '..', 'datasets', 'DS3_Career_Role_Recommendation.csv')
        
        try:
            # Load the CSV file
            self.df = pd.read_csv(csv_path)
            
            # Standardize column names (your CSV uses different casing)
            column_mapping = {
                'CareerCluster': 'Career_Cluster',
                'CareerRole': 'Career_Role',
                'RequiredSkills': 'Required_Skills',
                'EducationLevelRequired': 'Education_Level_Required',
                'AvgSalaryRange': 'Avg_Salary_Range',
                'JobOutlook': 'Job_Outlook',
                'GrowthPath': 'Growth_Path',
                'LearningResources': 'Learning_Resources',
                'EntranceExams': 'Entrance_Exams',
                'FieldforAdmission': 'Field_for_Admission',
                'OnlineResourcesLinks': 'Online_Resources_Links',
                'FreeCertifications': 'Free_Certifications'
            }
            
            # Rename columns to match expected format
            self.df.rename(columns=column_mapping, inplace=True)
            
            print(f"Dataset loaded with {len(self.df)} career roles from CSV")
            print(f"Available clusters: {self.df['Career_Cluster'].unique().tolist()}")
            
        except FileNotFoundError:
            print(f"ERROR: CSV file not found at {csv_path}")
            print("Creating fallback dataset...")
            self._create_fallback_dataset()
        except Exception as e:
            print(f"ERROR loading CSV: {e}")
            print("Creating fallback dataset...")
            self._create_fallback_dataset()

    def _create_fallback_dataset(self):
        """Fallback: create minimal dataset if CSV loading fails"""
        data = []
        
        # Minimal fallback data
        clusters_data = {
            'IT': ['Software Developer', 'Web Developer', 'Mobile App Developer', 'DevOps Engineer']
        }
        
        for cluster, roles in clusters_data.items():
            for role in roles:
                data.append({
                    'Career_Cluster': cluster,
                    'Career_Role': role,
                    'Required_Skills': 'Programming; Problem Solving; Debugging',
                    'Education_Level_Required': 'Graduation',
                    'Avg_Salary_Range': '7-25 LPA',
                    'Job_Outlook': 'High',
                    'Growth_Path': f'Junior {role} > {role} > Senior {role}',
                    'Learning_Resources': 'Online Courses; Certifications',
                    'Entrance_Exams': 'Technical Tests',
                    'Field_for_Admission': 'Computer Science',
                    'Online_Resources_Links': 'https://coursera.org',
                    'Free_Certifications': 'Google IT'
                })
        
        self.df = pd.DataFrame(data)
        print(f"Fallback dataset created with {len(self.df)} career roles")


    
    def train_model(self):
        try:
            self.df['Skills_Text'] = self.df['Required_Skills'].fillna('')
            self.df['Skills_List'] = self.df['Required_Skills'].apply(lambda x: x.split('; ') if pd.notna(x) else [])
            
            def extract_salary_midpoint(salary_str):
                try:
                    if pd.isna(salary_str):
                        return 10
                    numbers = salary_str.split(' ')[0].split('-')
                    if len(numbers) == 2:
                        return (float(numbers[0]) + float(numbers[1])) / 2
                    return 10
                except:
                    return 10
            
            self.df['Salary_Midpoint'] = self.df['Avg_Salary_Range'].apply(extract_salary_midpoint)
            
            self.label_encoders['education'] = LabelEncoder()
            self.label_encoders['outlook'] = LabelEncoder()
            self.label_encoders['cluster'] = LabelEncoder()
            
            self.df['Education_Encoded'] = self.label_encoders['education'].fit_transform(self.df['Education_Level_Required'].fillna('Graduation'))
            self.df['Outlook_Encoded'] = self.label_encoders['outlook'].fit_transform(self.df['Job_Outlook'].fillna('Medium'))
            self.df['Cluster_Encoded'] = self.label_encoders['cluster'].fit_transform(self.df['Career_Cluster'])
            
            self.tfidf_vectorizer = TfidfVectorizer(
                max_features=200,
                stop_words='english',
                ngram_range=(1, 2),
                min_df=1,
                max_df=0.95
            )
            
            skills_tfidf_matrix = self.tfidf_vectorizer.fit_transform(self.df['Skills_Text'])
            self.content_sim_matrix = cosine_similarity(skills_tfidf_matrix)
            
            self.df['Skills_Count'] = self.df['Skills_List'].apply(len)
            collab_features = self.df[['Education_Encoded', 'Salary_Midpoint', 'Outlook_Encoded', 'Skills_Count']].values
            
            self.scaler = StandardScaler()
            collab_features_scaled = self.scaler.fit_transform(collab_features)
            
            self.knn_model = NearestNeighbors(
                n_neighbors=min(15, len(self.df)),
                metric='euclidean',
                algorithm='auto'
            )
            self.knn_model.fit(collab_features_scaled)
            
            self.model_loaded = True
            print("Model training completed successfully")
            
        except Exception as e:
            print(f"Error training model: {e}")
            self.model_loaded = False
    
    def get_content_scores(self, cluster_indices):
        if len(cluster_indices) == 0:
            return np.array([])
        
        cluster_sim_matrix = self.content_sim_matrix[np.ix_(cluster_indices, cluster_indices)]
        content_scores = cluster_sim_matrix.mean(axis=1)
        return content_scores
    
    def get_collaborative_scores(self, cluster_indices):
        if len(cluster_indices) == 0:
            return np.array([])
        
        cluster_features = self.scaler.transform(
            self.df.loc[cluster_indices, ['Education_Encoded', 'Salary_Midpoint', 'Outlook_Encoded', 'Skills_Count']].values
        )
        n_neighbors = min(10, len(cluster_indices))
        
        distances, _ = self.knn_model.kneighbors(cluster_features, n_neighbors=n_neighbors)
        
        collab_scores = []
        for dist_array in distances:
            similarity = 1 / (1 + dist_array.mean())
            collab_scores.append(similarity)
        
        return np.array(collab_scores)
    
    def get_popularity_scores(self, cluster_data):
        popularity_scores = []
        outlook_weights = {'Low': 0.2, 'Medium': 0.5, 'High': 0.8, 'Very High': 1.0}
        
        for _, row in cluster_data.iterrows():
            outlook_score = outlook_weights.get(row['Job_Outlook'], 0.5)
            salary_score = min(row['Salary_Midpoint'] / 25.0, 1.0)
            popularity = (outlook_score * 0.6) + (salary_score * 0.4)
            popularity_scores.append(popularity)
        
        return np.array(popularity_scores)
    
    def predict_career_roles(self, career_cluster, user_education=None, top_n=4):
        if not self.model_loaded:
            return {"success": False, "error": "Model not loaded"}
        
        try:
            cluster_data = self.df[self.df['Career_Cluster'] == career_cluster].copy()
            
            if cluster_data.empty:
                return {
                    "success": False,
                    "error": f"No roles found for cluster: {career_cluster}"
                }
            
            cluster_indices = cluster_data.index.tolist()
            
            content_scores = self.get_content_scores(cluster_indices)
            collab_scores = self.get_collaborative_scores(cluster_indices)
            popularity_scores = self.get_popularity_scores(cluster_data)
            
            def normalize_scores(scores):
                if len(scores) == 0 or scores.std() == 0:
                    return scores
                return (scores - scores.min()) / (scores.max() - scores.min())
            
            content_norm = normalize_scores(content_scores)
            collab_norm = normalize_scores(collab_scores)
            popularity_norm = normalize_scores(popularity_scores)
            
            hybrid_scores = (0.4 * content_norm + 0.3 * collab_norm + 0.3 * popularity_norm)
            
            if user_education:
                education_match = cluster_data['Education_Level_Required'] == user_education
                hybrid_scores += education_match.values * 0.15
            
            top_indices = np.argsort(-hybrid_scores)[:top_n]
            
            recommendations = []
            for i, idx in enumerate(top_indices):
                row = cluster_data.iloc[idx]
                
                recommendation = {
                    'rank': i + 1,
                    'career_role': row['Career_Role'],
                    'career_cluster': career_cluster,
                    'required_skills': row['Required_Skills'],
                    'education_level_required': row['Education_Level_Required'],
                    'avg_salary_range': row['Avg_Salary_Range'],
                    'job_outlook': row['Job_Outlook'],
                    'growth_path': row['Growth_Path'],
                    'learning_resources': row['Learning_Resources'],
                    'entrance_exams': row['Entrance_Exams'],
                    'field_for_admission': row['Field_for_Admission'],
                    'online_resources_links': row['Online_Resources_Links'],
                    'free_certifications': row['Free_Certifications'],
                    'confidence_score': round(float(hybrid_scores[idx]), 3),
                    'content_score': round(float(content_norm[idx]), 3) if len(content_norm) > idx else 0,
                    'collaborative_score': round(float(collab_norm[idx]), 3) if len(collab_norm) > idx else 0,
                    'popularity_score': round(float(popularity_norm[idx]), 3)
                }
                recommendations.append(recommendation)
            
            return {
                "success": True,
                "career_cluster": career_cluster,
                "total_recommendations": len(recommendations),
                "user_education": user_education,
                "recommendations": recommendations,
                "algorithm": "Hybrid KNN + Cosine Similarity",
                "model_version": "3.0"
            }
            
        except Exception as e:
            return {"success": False, "error": str(e)}
        
def main():
    if len(sys.argv) < 2:
        print("Usage: python model3_career_role_predictor.py <input_json>")
        return
    
    try:
        input_data = json.loads(sys.argv[1])
        predictor = CareerRolePredictor()
        
        # Get cluster name from input
        career_cluster = input_data.get('careerCluster') or input_data.get('career_cluster', 'IT')
        
        # ✅ ADD CLUSTER MAPPING HERE
        cluster_mapping = {
            'Engineering': 'STEM',
            'Legal': 'Law',
            'Law': 'Legal'
        }
        
        # Map cluster name for CSV compatibility
        mapped_cluster = cluster_mapping.get(career_cluster, career_cluster)
        
        print(f"[Model 3 Python] Received cluster: {career_cluster}", file=sys.stderr)
        print(f"[Model 3 Python] Mapped to CSV cluster: {mapped_cluster}", file=sys.stderr)
        
        # Get other parameters
        user_education = input_data.get('user_education', None)
        top_n = input_data.get('top_n', 4)
        
        # ✅ Use mapped_cluster instead of career_cluster
        result = predictor.predict_career_roles(mapped_cluster, user_education, top_n)
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {"success": False, "error": str(e)}
        print(json.dumps(error_result))

        
    except Exception as e:
        error_result = {"success": False, "error": str(e)}
        print(json.dumps(error_result))

if __name__ == "__main__":
    main()