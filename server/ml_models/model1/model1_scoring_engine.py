#!/usr/bin/env python3
"""
Model 1 Scoring Engine  
Processes user assessment responses and generates personality, cognitive, and skills scores
"""

import json
import sys
import io

# Fix encoding issues for Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

class Model1ScoringEngine:
    def __init__(self):
        """Initialize the scoring engine with question banks and scoring rules"""
        self.personality_scores = {
            'Extraversion': 0, 'Conscientiousness': 0, 'Openness': 0,
            'Agreeableness': 0, 'Neuroticism': 0
        }
        self.cognitive_score = 0
        self.skills_score = 0
        self.situational_score = 0
        self.values_score = 0
        
        # Track detailed scores for frontend display
        self.detailed_scores = {
            'personality': {'responses': 0, 'total_possible': 0},
            'cognitive': {'correct': 0, 'total': 0, 'percentage': 0},
            'skills': {'correct': 0, 'total': 0, 'percentage': 0},
            'situational': {'correct': 0, 'total': 0, 'percentage': 0},
            'values': {'correct': 0, 'total': 0, 'percentage': 0}
        }

    def normalize_question_id(self, question_id: str) -> str:
        """Normalize question ID by removing underscores"""
        # Convert I_P001 -> IP001, I_S001 -> IS001, etc.
        if '_' in question_id:
            return question_id.replace('_', '')
        return question_id

    def load_questions_database(self, education_level: str) -> dict:
        """Load question database based on education level"""
        level_mapping = {
            'Foundation': 'Foundation',
            'Intermediate': 'Intermediate', 
            'Advanced': 'Advanced'
        }
        
        prefix = level_mapping.get(education_level, 'Intermediate')
        
        if prefix == 'Foundation':
            return self._get_foundation_questions()
        elif prefix == 'Intermediate':
            return self._get_intermediate_questions()
        else:  # Advanced
            return self._get_advanced_questions()

    def _get_foundation_questions(self) -> dict:
        return {
            # Personality Questions (FP001-FP019) - Likert scale
            'FP001': {'type': 'Personality', 'trait': 'Extraversion', 'scoring': 'likert_scale'},
            'FP002': {'type': 'Personality', 'trait': 'Extraversion', 'scoring': 'likert_reverse'},
            'FP003': {'type': 'Personality', 'trait': 'Extraversion', 'scoring': 'likert_scale'},
            'FP004': {'type': 'Personality', 'trait': 'Extraversion', 'scoring': 'likert_scale'},
            'FP005': {'type': 'Personality', 'trait': 'Conscientiousness', 'scoring': 'likert_scale'},
            'FP006': {'type': 'Personality', 'trait': 'Conscientiousness', 'scoring': 'likert_scale'},
            'FP007': {'type': 'Personality', 'trait': 'Conscientiousness', 'scoring': 'likert_reverse'},
            'FP008': {'type': 'Personality', 'trait': 'Openness', 'scoring': 'likert_scale'},
            'FP009': {'type': 'Personality', 'trait': 'Openness', 'scoring': 'likert_scale'},
            'FP010': {'type': 'Personality', 'trait': 'Openness', 'scoring': 'likert_reverse'},
            'FP011': {'type': 'Personality', 'trait': 'Agreeableness', 'scoring': 'likert_scale'},
            'FP012': {'type': 'Personality', 'trait': 'Agreeableness', 'scoring': 'likert_scale'},
            'FP013': {'type': 'Personality', 'trait': 'Agreeableness', 'scoring': 'likert_reverse'},
            'FP014': {'type': 'Personality', 'trait': 'Neuroticism', 'scoring': 'likert_scale'},
            'FP015': {'type': 'Personality', 'trait': 'Neuroticism', 'scoring': 'likert_reverse'},
            'FP016': {'type': 'Personality', 'trait': 'Neuroticism', 'scoring': 'likert_scale'},
            'FP017': {'type': 'Personality', 'trait': 'Neuroticism', 'scoring': 'likert_reverse'},
            'FP018': {'type': 'Personality', 'trait': 'Openness', 'scoring': 'likert_scale'},
            'FP019': {'type': 'Personality', 'trait': 'Conscientiousness', 'scoring': 'likert_scale'},
            
            # SKILLS QUESTIONS (FS001-FS019)
            'FS001': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},
            'FS002': {'type': 'Skills', 'correct_answer': 'A', 'weight': 1},
            'FS003': {'type': 'Skills', 'correct_answer': 'C', 'weight': 1},
            'FS004': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},
            'FS005': {'type': 'Skills', 'correct_answer': 'C', 'weight': 1},
            'FS006': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},
            'FS007': {'type': 'Skills', 'correct_answer': 'C', 'weight': 1},
            'FS008': {'type': 'Skills', 'correct_answer': 'D', 'weight': 1},
            'FS009': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},
            'FS010': {'type': 'Skills', 'correct_answer': 'C', 'weight': 1},
            'FS011': {'type': 'Skills', 'correct_answer': 'A', 'weight': 1},
            'FS012': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},
            'FS013': {'type': 'Skills', 'correct_answer': 'C', 'weight': 1},
            'FS014': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},
            'FS015': {'type': 'Skills', 'correct_answer': 'A', 'weight': 1},
            'FS016': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},
            'FS017': {'type': 'Skills', 'correct_answer': 'C', 'weight': 1},
            'FS018': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},
            'FS019': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},
            
            # COGNITIVE QUESTIONS (FC001-FC015)
            'FC001': {'type': 'Cognitive', 'correct_answer': 'A', 'weight': 1},
            'FC002': {'type': 'Cognitive', 'correct_answer': 'B', 'weight': 1},
            'FC003': {'type': 'Cognitive', 'correct_answer': 'D', 'weight': 1},
            'FC004': {'type': 'Cognitive', 'correct_answer': 'B', 'weight': 1},
            'FC005': {'type': 'Cognitive', 'correct_answer': 'C', 'weight': 1},
            'FC006': {'type': 'Cognitive', 'correct_answer': 'C', 'weight': 1},
            'FC007': {'type': 'Cognitive', 'correct_answer': 'A', 'weight': 1},
            'FC008': {'type': 'Cognitive', 'correct_answer': 'C', 'weight': 1},
            'FC009': {'type': 'Cognitive', 'correct_answer': 'C', 'weight': 1},
            'FC010': {'type': 'Cognitive', 'correct_answer': 'C', 'weight': 1},
            'FC011': {'type': 'Cognitive', 'correct_answer': 'A', 'weight': 1},
            'FC012': {'type': 'Cognitive', 'correct_answer': 'C', 'weight': 1},
            'FC013': {'type': 'Cognitive', 'correct_answer': 'B', 'weight': 1},
            'FC014': {'type': 'Cognitive', 'correct_answer': 'A', 'weight': 1},
            'FC015': {'type': 'Cognitive', 'correct_answer': 'C', 'weight': 1},
            
            # SITUATIONAL (FT001-FT011)
            'FT001': {'type': 'Situational', 'scoring_map': {'A': 1, 'B': 5, 'C': 2, 'D': 3, 'E': 1}},
            'FT002': {'type': 'Situational', 'scoring_map': {'A': 1, 'B': 2, 'C': 5, 'D': 1, 'E': 1}},
            'FT003': {'type': 'Situational', 'scoring_map': {'A': 2, 'B': 1, 'C': 5, 'D': 1, 'E': 1}},
            'FT004': {'type': 'Situational', 'scoring_map': {'A': 2, 'B': 1, 'C': 5, 'D': 1, 'E': 1}},
            'FT005': {'type': 'Situational', 'scoring_map': {'A': 1, 'B': 5, 'C': 1, 'D': 2, 'E': 2}},
            'FT006': {'type': 'Situational', 'scoring_map': {'A': 1, 'B': 2, 'C': 5, 'D': 1, 'E': 1}},
            'FT007': {'type': 'Situational', 'scoring_map': {'A': 1, 'B': 2, 'C': 5, 'D': 1, 'E': 1}},
            'FT008': {'type': 'Situational', 'scoring_map': {'A': 1, 'B': 2, 'C': 5, 'D': 1, 'E': 1}},
            'FT009': {'type': 'Situational', 'scoring_map': {'A': 3, 'B': 5, 'C': 1, 'D': 1, 'E': 2}},
            'FT010': {'type': 'Situational', 'scoring_map': {'A': 1, 'B': 5, 'C': 2, 'D': 1, 'E': 1}},
            'FT011': {'type': 'Situational', 'scoring_map': {'A': 1, 'B': 2, 'C': 5, 'D': 3, 'E': 1}},
            
            # VALUES (FV001-FV011)
            'FV001': {'type': 'Values', 'scoring_map': {'A': 3, 'B': 5, 'C': 4, 'D': 2, 'E': 3}},
            'FV002': {'type': 'Values', 'scoring_map': {'A': 2, 'B': 4, 'C': 5, 'D': 3, 'E': 4}},
            'FV003': {'type': 'Values', 'scoring_map': {'A': 2, 'B': 1, 'C': 5, 'D': 4, 'E': 3}},
            'FV004': {'type': 'Values', 'scoring_map': {'A': 3, 'B': 5, 'C': 2, 'D': 1, 'E': 4}},
            'FV005': {'type': 'Values', 'scoring_map': {'A': 4, 'B': 3, 'C': 5, 'D': 2, 'E': 1}},
            'FV006': {'type': 'Values', 'scoring_map': {'A': 2, 'B': 3, 'C': 5, 'D': 1, 'E': 4}},
            'FV007': {'type': 'Values', 'scoring_map': {'A': 1, 'B': 5, 'C': 3, 'D': 2, 'E': 4}},
            'FV008': {'type': 'Values', 'scoring_map': {'A': 5, 'B': 2, 'C': 3, 'D': 4, 'E': 1}},
            'FV009': {'type': 'Values', 'scoring_map': {'A': 3, 'B': 2, 'C': 4, 'D': 5, 'E': 1}},
            'FV010': {'type': 'Values', 'scoring_map': {'A': 1, 'B': 5, 'C': 3, 'D': 2, 'E': 4}},
            'FV011': {'type': 'Values', 'scoring_map': {'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1}},
        }

    def _get_intermediate_questions(self) -> dict:
        """Intermediate level questions database - NO UNDERSCORES (MATCHES CSV)"""
        return {
            # PERSONALITY QUESTIONS (IP001-IP019)
            'IP001': {'type': 'Personality', 'trait': 'Extraversion', 'scoring': 'likert_scale'},
            'IP002': {'type': 'Personality', 'trait': 'Extraversion', 'scoring': 'likert_reverse'},
            'IP003': {'type': 'Personality', 'trait': 'Extraversion', 'scoring': 'likert_scale'},
            'IP004': {'type': 'Personality', 'trait': 'Extraversion', 'scoring': 'likert_scale'},
            'IP005': {'type': 'Personality', 'trait': 'Conscientiousness', 'scoring': 'likert_scale'},
            'IP006': {'type': 'Personality', 'trait': 'Conscientiousness', 'scoring': 'likert_scale'},
            'IP007': {'type': 'Personality', 'trait': 'Conscientiousness', 'scoring': 'likert_reverse'},
            'IP008': {'type': 'Personality', 'trait': 'Openness', 'scoring': 'likert_scale'},
            'IP009': {'type': 'Personality', 'trait': 'Openness', 'scoring': 'likert_scale'},
            'IP010': {'type': 'Personality', 'trait': 'Openness', 'scoring': 'likert_reverse'},
            'IP011': {'type': 'Personality', 'trait': 'Agreeableness', 'scoring': 'likert_scale'},
            'IP012': {'type': 'Personality', 'trait': 'Agreeableness', 'scoring': 'likert_scale'},
            'IP013': {'type': 'Personality', 'trait': 'Agreeableness', 'scoring': 'likert_reverse'},
            'IP014': {'type': 'Personality', 'trait': 'Neuroticism', 'scoring': 'likert_scale'},
            'IP015': {'type': 'Personality', 'trait': 'Neuroticism', 'scoring': 'likert_reverse'},
            'IP016': {'type': 'Personality', 'trait': 'Neuroticism', 'scoring': 'likert_scale'},
            'IP017': {'type': 'Personality', 'trait': 'Neuroticism', 'scoring': 'likert_reverse'},
            'IP018': {'type': 'Personality', 'trait': 'Openness', 'scoring': 'likert_scale'},
            'IP019': {'type': 'Personality', 'trait': 'Conscientiousness', 'scoring': 'likert_scale'},
            
            # SKILLS QUESTIONS (IS001-IS019)
            'IS001': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},  # Excel
            'IS002': {'type': 'Skills', 'correct_answer': 'C', 'weight': 1},  # Application Programming Interface  
            'IS003': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},  # Agile
            'IS004': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},  # Clear concise language
            'IS005': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},  # Provide specific examples
            'IS006': {'type': 'Skills', 'correct_answer': 'C', 'weight': 1},  # Prioritize based on importance
            'IS007': {'type': 'Skills', 'correct_answer': 'D', 'weight': 1},  # 230000
            'IS008': {'type': 'Skills', 'correct_answer': 'C', 'weight': 1},  # 750
            'IS009': {'type': 'Skills', 'correct_answer': 'C', 'weight': 1},  # Combination of methods
            'IS010': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},  # Ask for help
            'IS011': {'type': 'Skills', 'correct_answer': 'C', 'weight': 1},  # Balance technical details
            'IS012': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},  # Query and manipulate data
            'IS013': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},  # Define problem clearly
            'IS014': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},  # 8320
            'IS015': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},  # Adapt communication style
            'IS016': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},  # Establish clear objectives
            'IS017': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},  # Read publications and courses
            'IS018': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},  # Listen to all parties
            'IS019': {'type': 'Skills', 'correct_answer': 'C', 'weight': 1},  # Achievement of objectives
            
            # COGNITIVE QUESTIONS (IC001-IC015)
            'IC001': {'type': 'Cognitive', 'correct_answer': 'B', 'weight': 1},  # 96
            'IC002': {'type': 'Cognitive', 'correct_answer': 'B', 'weight': 1},  # Some managers may be innovative
            'IC003': {'type': 'Cognitive', 'correct_answer': 'E', 'weight': 1},  # 63
            'IC004': {'type': 'Cognitive', 'correct_answer': 'B', 'weight': 1},  # 500000
            'IC005': {'type': 'Cognitive', 'correct_answer': 'B', 'weight': 1},  # 12
            'IC006': {'type': 'Cognitive', 'correct_answer': 'C', 'weight': 1},  # Crown
            'IC007': {'type': 'Cognitive', 'correct_answer': 'C', 'weight': 1},  # Each term = 2×previous + 1
            'IC008': {'type': 'Cognitive', 'correct_answer': 'B', 'weight': 1},  # 20
            'IC009': {'type': 'Cognitive', 'correct_answer': 'A', 'weight': 1},  # Some risk-takers are not successful
            'IC010': {'type': 'Cognitive', 'correct_answer': 'A', 'weight': 1},  # SUW
            'IC011': {'type': 'Cognitive', 'correct_answer': 'C', 'weight': 1},  # 1980
            'IC012': {'type': 'Cognitive', 'correct_answer': 'A', 'weight': 1},  # Some artists are creative
            'IC013': {'type': 'Cognitive', 'correct_answer': 'D', 'weight': 1},  # 21
            'IC014': {'type': 'Cognitive', 'correct_answer': 'B', 'weight': 1},  # Stability
            'IC015': {'type': 'Cognitive', 'correct_answer': 'B', 'weight': 1},  # 10
            
            # SITUATIONAL (IT001-IT011)
            'IT001': {'type': 'Situational', 'scoring_map': {'A': 1, 'B': 2, 'C': 5, 'D': 1, 'E': 2}},
            'IT002': {'type': 'Situational', 'scoring_map': {'A': 1, 'B': 2, 'C': 5, 'D': 1, 'E': 2}},
            'IT003': {'type': 'Situational', 'scoring_map': {'A': 1, 'B': 2, 'C': 5, 'D': 1, 'E': 2}},
            'IT004': {'type': 'Situational', 'scoring_map': {'A': 1, 'B': 5, 'C': 2, 'D': 1, 'E': 1}},
            'IT005': {'type': 'Situational', 'scoring_map': {'A': 1, 'B': 5, 'C': 2, 'D': 1, 'E': 2}},
            'IT006': {'type': 'Situational', 'scoring_map': {'A': 2, 'B': 2, 'C': 5, 'D': 2, 'E': 3}},
            'IT007': {'type': 'Situational', 'scoring_map': {'A': 1, 'B': 2, 'C': 5, 'D': 1, 'E': 1}},
            'IT008': {'type': 'Situational', 'scoring_map': {'A': 2, 'B': 5, 'C': 3, 'D': 1, 'E': 2}},
            'IT009': {'type': 'Situational', 'scoring_map': {'A': 1, 'B': 5, 'C': 2, 'D': 2, 'E': 1}},
            'IT010': {'type': 'Situational', 'scoring_map': {'A': 1, 'B': 5, 'C': 2, 'D': 2, 'E': 1}},
            'IT011': {'type': 'Situational', 'scoring_map': {'A': 1, 'B': 5, 'C': 2, 'D': 3, 'E': 2}},
            
            # VALUES (IV001-IV011)
            'IV001': {'type': 'Values', 'scoring_map': {'A': 2, 'B': 3, 'C': 4, 'D': 3, 'E': 5}},
            'IV002': {'type': 'Values', 'scoring_map': {'A': 3, 'B': 4, 'C': 2, 'D': 5, 'E': 4}},
            'IV003': {'type': 'Values', 'scoring_map': {'A': 3, 'B': 5, 'C': 4, 'D': 4, 'E': 4}},
            'IV004': {'type': 'Values', 'scoring_map': {'A': 3, 'B': 4, 'C': 3, 'D': 4, 'E': 5}},
            'IV005': {'type': 'Values', 'scoring_map': {'A': 3, 'B': 5, 'C': 4, 'D': 4, 'E': 4}},
            'IV006': {'type': 'Values', 'scoring_map': {'A': 2, 'B': 4, 'C': 3, 'D': 3, 'E': 5}},
            'IV007': {'type': 'Values', 'scoring_map': {'A': 3, 'B': 5, 'C': 4, 'D': 4, 'E': 4}},
            'IV008': {'type': 'Values', 'scoring_map': {'A': 3, 'B': 4, 'C': 3, 'D': 4, 'E': 5}},
            'IV009': {'type': 'Values', 'scoring_map': {'A': 3, 'B': 5, 'C': 2, 'D': 4, 'E': 4}},
            'IV010': {'type': 'Values', 'scoring_map': {'A': 3, 'B': 4, 'C': 3, 'D': 5, 'E': 4}},
            'IV011': {'type': 'Values', 'scoring_map': {'A': 3, 'B': 4, 'C': 4, 'D': 4, 'E': 5}},
        }
    
    def _get_advanced_questions(self) -> dict:
        """Advanced level questions database - NO UNDERSCORES"""
        return {
            # PERSONALITY (AP001-AP019)
            'AP001': {'type': 'Personality', 'trait': 'Extraversion', 'scoring': 'likert_scale'},
            'AP002': {'type': 'Personality', 'trait': 'Extraversion', 'scoring': 'likert_scale'},
            'AP003': {'type': 'Personality', 'trait': 'Extraversion', 'scoring': 'likert_scale'},
            'AP004': {'type': 'Personality', 'trait': 'Extraversion', 'scoring': 'likert_scale'},
            'AP005': {'type': 'Personality', 'trait': 'Conscientiousness', 'scoring': 'likert_scale'},
            'AP006': {'type': 'Personality', 'trait': 'Conscientiousness', 'scoring': 'likert_scale'},
            'AP007': {'type': 'Personality', 'trait': 'Conscientiousness', 'scoring': 'likert_reverse'},
            'AP008': {'type': 'Personality', 'trait': 'Openness', 'scoring': 'likert_scale'},
            'AP009': {'type': 'Personality', 'trait': 'Openness', 'scoring': 'likert_scale'},
            'AP010': {'type': 'Personality', 'trait': 'Openness', 'scoring': 'likert_reverse'},
            'AP011': {'type': 'Personality', 'trait': 'Agreeableness', 'scoring': 'likert_scale'},
            'AP012': {'type': 'Personality', 'trait': 'Agreeableness', 'scoring': 'likert_scale'},
            'AP013': {'type': 'Personality', 'trait': 'Agreeableness', 'scoring': 'likert_reverse'},
            'AP014': {'type': 'Personality', 'trait': 'Neuroticism', 'scoring': 'likert_scale'},
            'AP015': {'type': 'Personality', 'trait': 'Neuroticism', 'scoring': 'likert_reverse'},
            'AP016': {'type': 'Personality', 'trait': 'Neuroticism', 'scoring': 'likert_scale'},
            'AP017': {'type': 'Personality', 'trait': 'Neuroticism', 'scoring': 'likert_reverse'},  
            'AP018': {'type': 'Personality', 'trait': 'Openness', 'scoring': 'likert_scale'},
            'AP019': {'type': 'Personality', 'trait': 'Conscientiousness', 'scoring': 'likert_scale'},
            
            # SKILLS (AS001-AS019)
            'AS001': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},
            'AS002': {'type': 'Skills', 'correct_answer': 'A', 'weight': 1},
            'AS003': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},
            'AS004': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},
            'AS005': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},
            'AS006': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},
            'AS007': {'type': 'Skills', 'correct_answer': 'C', 'weight': 1},
            'AS008': {'type': 'Skills', 'correct_answer': 'A', 'weight': 1},
            'AS009': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},
            'AS010': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},
            'AS011': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},
            'AS012': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},
            'AS013': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},
            'AS014': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},
            'AS015': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},
            'AS016': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},
            'AS017': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},
            'AS018': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},
            'AS019': {'type': 'Skills', 'correct_answer': 'B', 'weight': 1},
            
            # COGNITIVE (AC001-AC015)
            'AC001': {'type': 'Cognitive', 'correct_answer': 'C', 'weight': 1},
            'AC002': {'type': 'Cognitive', 'correct_answer': 'B', 'weight': 1},
            'AC003': {'type': 'Cognitive', 'correct_answer': 'D', 'weight': 1},
            'AC004': {'type': 'Cognitive', 'correct_answer': 'A', 'weight': 1},
            'AC005': {'type': 'Cognitive', 'correct_answer': 'C', 'weight': 1},
            'AC006': {'type': 'Cognitive', 'correct_answer': 'A', 'weight': 1},
            'AC007': {'type': 'Cognitive', 'correct_answer': 'A', 'weight': 1},
            'AC008': {'type': 'Cognitive', 'correct_answer': 'C', 'weight': 1},
            'AC009': {'type': 'Cognitive', 'correct_answer': 'B', 'weight': 1},
            'AC010': {'type': 'Cognitive', 'correct_answer': 'B', 'weight': 1},
            'AC011': {'type': 'Cognitive', 'correct_answer': 'A', 'weight': 1},
            'AC012': {'type': 'Cognitive', 'correct_answer': 'C', 'weight': 1},
            'AC013': {'type': 'Cognitive', 'correct_answer': 'B', 'weight': 1},
            'AC014': {'type': 'Cognitive', 'correct_answer': 'A', 'weight': 1},
            'AC015': {'type': 'Cognitive', 'correct_answer': 'B', 'weight': 1},
            
            # SITUATIONAL (AT001-AT011)
            'AT001': {'type': 'Situational', 'scoring_map': {'A': 1, 'B': 5, 'C': 2, 'D': 1, 'E': 1}},
            'AT002': {'type': 'Situational', 'scoring_map': {'A': 1, 'B': 2, 'C': 5, 'D': 3, 'E': 1}},
            'AT003': {'type': 'Situational', 'scoring_map': {'A': 1, 'B': 2, 'C': 5, 'D': 3, 'E': 2}},
            'AT004': {'type': 'Situational', 'scoring_map': {'A': 1, 'B': 2, 'C': 3, 'D': 5, 'E': 2}},
            'AT005': {'type': 'Situational', 'scoring_map': {'A': 1, 'B': 2, 'C': 5, 'D': 1, 'E': 1}},
            'AT006': {'type': 'Situational', 'scoring_map': {'A': 2, 'B': 1, 'C': 5, 'D': 3, 'E': 2}},
            'AT007': {'type': 'Situational', 'scoring_map': {'A': 1, 'B': 2, 'C': 5, 'D': 1, 'E': 1}},
            'AT008': {'type': 'Situational', 'scoring_map': {'A': 1, 'B': 2, 'C': 5, 'D': 1, 'E': 2}},
            'AT009': {'type': 'Situational', 'scoring_map': {'A': 1, 'B': 2, 'C': 5, 'D': 1, 'E': 1}},
            'AT010': {'type': 'Situational', 'scoring_map': {'A': 1, 'B': 2, 'C': 5, 'D': 1, 'E': 3}},
            'AT011': {'type': 'Situational', 'scoring_map': {'A': 1, 'B': 2, 'C': 5, 'D': 3, 'E': 1}},
            
            # VALUES (AV001-AV011)
            'AV001': {'type': 'Values', 'scoring_map': {'A': 2, 'B': 5, 'C': 1, 'D': 3, 'E': 2}},
            'AV002': {'type': 'Values', 'scoring_map': {'A': 3, 'B': 4, 'C': 4, 'D': 3, 'E': 5}},
            'AV003': {'type': 'Values', 'scoring_map': {'A': 5, 'B': 3, 'C': 4, 'D': 2, 'E': 2}},
            'AV004': {'type': 'Values', 'scoring_map': {'A': 3, 'B': 5, 'C': 2, 'D': 4, 'E': 1}},
            'AV005': {'type': 'Values', 'scoring_map': {'A': 3, 'B': 5, 'C': 4, 'D': 4, 'E': 2}},
            'AV006': {'type': 'Values', 'scoring_map': {'A': 3, 'B': 4, 'C': 2, 'D': 3, 'E': 5}},
            'AV007': {'type': 'Values', 'scoring_map': {'A': 2, 'B': 3, 'C': 4, 'D': 5, 'E': 3}},
            'AV008': {'type': 'Values', 'scoring_map': {'A': 2, 'B': 3, 'C': 2, 'D': 5, 'E': 4}},
            'AV009': {'type': 'Values', 'scoring_map': {'A': 2, 'B': 1, 'C': 5, 'D': 3, 'E': 1}},
            'AV010': {'type': 'Values', 'scoring_map': {'A': 2, 'B': 5, 'C': 3, 'D': 2, 'E': 4}},
            'AV011': {'type': 'Values', 'scoring_map': {'A': 2, 'B': 5, 'C': 3, 'D': 4, 'E': 3}},
        }

    def calculate_personality_score(self, question_id: str, answer: str, question_info: dict) -> None:
        """Calculate personality score for Likert scale questions"""
        trait = question_info['trait']
        scoring_type = question_info['scoring']
        
        # Map numeric answers to Likert responses
        answer_mapping = {
            '1': 'Strongly Disagree', '2': 'Disagree', '3': 'Neutral', 
            '4': 'Agree', '5': 'Strongly Agree'
        }
        
        likert_answer = answer_mapping.get(answer, answer)
        
        # Map Likert responses to numeric scores
        likert_scores = {
            'Strongly Disagree': 1, 'Disagree': 2, 'Neutral': 3, 
            'Agree': 4, 'Strongly Agree': 5
        }
        
        base_score = likert_scores.get(likert_answer, 3)
        
        # Apply scoring rule
        if scoring_type == 'likert_scale':
            if base_score == 5:  # Strongly Agree
                self.personality_scores[trait] += 2
            elif base_score == 4:  # Agree
                self.personality_scores[trait] += 1
            elif base_score == 2:  # Disagree
                self.personality_scores[trait] -= 1
            elif base_score == 1:  # Strongly Disagree
                self.personality_scores[trait] -= 2
            
        elif scoring_type == 'likert_reverse':
            if base_score == 1:  # Strongly Disagree (good for reverse)
                self.personality_scores[trait] += 2
            elif base_score == 2:  # Disagree
                self.personality_scores[trait] += 1
            elif base_score == 4:  # Agree (bad for reverse)
                self.personality_scores[trait] -= 1
            elif base_score == 5:  # Strongly Agree (worst for reverse)
                self.personality_scores[trait] -= 2
        
        self.detailed_scores['personality']['responses'] += 1
        self.detailed_scores['personality']['total_possible'] += 2

    def calculate_cognitive_skills_score(self, question_id: str, answer: str, question_info: dict) -> None:
        """Calculate cognitive and skills scores for multiple choice questions"""
        question_type = question_info['type']
        correct_answer = question_info.get('correct_answer', '')
        weight = question_info.get('weight', 1)
        
        is_correct = answer == correct_answer
        
        if question_type == 'Cognitive':
            # DON'T INCREMENT TOTAL HERE - handled in process_responses
            if is_correct:
                self.cognitive_score += weight
                self.detailed_scores['cognitive']['correct'] += 1
                
        elif question_type == 'Skills':
            # DON'T INCREMENT TOTAL HERE - handled in process_responses
            if is_correct:
                self.skills_score += weight
                self.detailed_scores['skills']['correct'] += 1



    def calculate_situational_values_score(self, question_id, answer, question_info):
        """Calculate scores for situational and values questions"""
        question_type = question_info['type']
        
        if question_type == 'Situational':
            # DON'T INCREMENT TOTAL HERE - handled in process_responses
            if 'scoring_map' in question_info:
                score_map = question_info['scoring_map']
                if answer in score_map:
                    # Consider scores >= 4 as "correct" for display purposes
                    if score_map[answer] >= 4:
                        self.detailed_scores['situational']['correct'] += 1 
                        
        elif question_type == 'Values':
            # DON'T INCREMENT TOTAL HERE - handled in process_responses
            if 'scoring_map' in question_info:
                score_map = question_info['scoring_map']
                if answer in score_map:
                    # Consider scores >= 4 as "correct" for display purposes
                    if score_map[answer] >= 4:
                        self.detailed_scores['values']['correct'] += 1



    def determine_personality_type(self) -> tuple:
        """Determine dominant personality type and traits"""
        # Find dominant trait
        dominant_trait = max(self.personality_scores, key=self.personality_scores.get) if self.personality_scores else 'Extraversion'
        dominant_score = self.personality_scores.get(dominant_trait, 0)
        
        # Generate personality type based on scores
        personality_types = {
            'Extraversion': 'Social Connector',
            'Conscientiousness': 'Organized Achiever', 
            'Openness': 'Creative Explorer',
            'Agreeableness': 'Collaborative Helper',
            'Neuroticism': 'Thoughtful Analyzer'
        }
        
        personality_type = personality_types.get(dominant_trait, 'Balanced Individual')
        
        # Calculate overall personality score (0-100)
        total_possible = len(self.personality_scores) * 4 if self.detailed_scores['personality']['responses'] > 0 else 1
        current_total = sum(abs(score) for score in self.personality_scores.values())
        personality_score = min(100, (current_total / total_possible) * 100) if current_total > 0 else 50
        
        # Generate description
        descriptions = {
            'Extraversion': 'Thrives in social interactions and enjoys meeting new people',
            'Conscientiousness': 'Organized, disciplined, and achievement-oriented',
            'Openness': 'Creative, curious, and open to new experiences', 
            'Agreeableness': 'Cooperative, empathetic, and team-oriented',
            'Neuroticism': 'Thoughtful and analytical, may experience stress in high-pressure situations'
        }
        
        description = descriptions.get(dominant_trait, 'Shows balanced traits across multiple dimensions')
        
        return personality_type, personality_score, dominant_trait, description

    def process_responses(self, responses: list, education_level: str, username: str) -> dict:
        """Main processing function for user responses"""
        try:
            # Load question database
            questions_db = self.load_questions_database(education_level)
            processed_count = 0
            
            # Initialize counters for ACTUAL user attempts
            user_attempts = {'Cognitive': 0, 'Skills': 0, 'Situational': 0, 'Values': 0}
            user_correct = {'Cognitive': 0, 'Skills': 0, 'Situational': 0, 'Values': 0}
            
            # Process each response and count ONLY what user actually attempted
            for response in responses:
                question_id = response.get('Question_ID', '').strip()
                answer = str(response.get('Answer', '')).strip()
                
                if not question_id or not answer:
                    continue
                
                # Normalize question ID
                normalized_id = self.normalize_question_id(question_id)
                question_info = questions_db.get(normalized_id) or questions_db.get(question_id)
                
                if not question_info:
                    continue
                
                processed_count += 1
                question_type = question_info['type']
                
                # Count this as an attempt
                if question_type in user_attempts:
                    user_attempts[question_type] += 1
                
                # Score the question and count if correct
                if question_type == 'Personality':
                    self.calculate_personality_score(question_id, answer, question_info)
                    
                elif question_type == 'Cognitive':
                    correct_answer = question_info.get('correct_answer', '')
                    if answer == correct_answer:
                        user_correct['Cognitive'] += 1
                        
                elif question_type == 'Skills':
                    correct_answer = question_info.get('correct_answer', '')
                    if answer == correct_answer:
                        user_correct['Skills'] += 1
                        
                elif question_type == 'Situational':
                    if 'scoring_map' in question_info:
                        score_map = question_info['scoring_map']
                        if answer in score_map and score_map[answer] >= 4:
                            user_correct['Situational'] += 1
                            
                elif question_type == 'Values':
                    if 'scoring_map' in question_info:
                        score_map = question_info['scoring_map']
                        if answer in score_map and score_map[answer] >= 4:
                            user_correct['Values'] += 1
            
            # SET RESULTS TO EXACTLY WHAT USER ATTEMPTED
            self.detailed_scores['cognitive']['correct'] = user_correct['Cognitive']
            self.detailed_scores['cognitive']['total'] = user_attempts['Cognitive']
            self.detailed_scores['skills']['correct'] = user_correct['Skills'] 
            self.detailed_scores['skills']['total'] = user_attempts['Skills']
            self.detailed_scores['situational']['correct'] = user_correct['Situational']
            self.detailed_scores['situational']['total'] = user_attempts['Situational']
            self.detailed_scores['values']['correct'] = user_correct['Values']
            self.detailed_scores['values']['total'] = user_attempts['Values']
            
            # Calculate percentages
            self._calculate_final_percentages()
            
            # Determine personality type
            personality_type, personality_score, dominant_trait, description = self.determine_personality_type()
            
            # Return results
            results = {
                'username': username,
                'education_level': education_level,
                'personality_type': personality_type,
                'personality_score': personality_score,
                'personality_dominant_trait': dominant_trait,
                'personality_description': description,
                'cognitive_score': self.detailed_scores['cognitive']['percentage'] / 100 if self.detailed_scores['cognitive']['total'] > 0 else 0,
                'skills_score': self.detailed_scores['skills']['percentage'] / 100 if self.detailed_scores['skills']['total'] > 0 else 0,
                'situational_score': self.detailed_scores['situational']['percentage'] / 100 if self.detailed_scores['situational']['total'] > 0 else 0,
                'values_score': self.detailed_scores['values']['percentage'] / 100 if self.detailed_scores['values']['total'] > 0 else 0,
                'detailed_scores': self.detailed_scores,
                'processed_responses': processed_count
            }
            
            return results
            
        except Exception as e:
            raise e




        
    def calculate_final_scores(self):
        """Calculate final percentage scores"""
        # Calculate percentages based on correct/total
        if self.detailed_scores['cognitive']['total'] > 0:
            self.detailed_scores['cognitive']['percentage'] = round(
                (self.detailed_scores['cognitive']['correct'] / self.detailed_scores['cognitive']['total']) * 100, 1
            )
        
        if self.detailed_scores['skills']['total'] > 0:
            self.detailed_scores['skills']['percentage'] = round(
                (self.detailed_scores['skills']['correct'] / self.detailed_scores['skills']['total']) * 100, 1
            )
        
        # Proper percentage calculation for situational
        if self.detailed_scores['situational']['total'] > 0:
            self.detailed_scores['situational']['percentage'] = round(
                (self.detailed_scores['situational']['correct'] / self.detailed_scores['situational']['total']) * 100, 1
            )
        
        # This will show 100%
        if self.detailed_scores['values']['total'] > 0:
            percentage = (self.detailed_scores['values']['correct'] / self.detailed_scores['values']['total']) * 100
            self.detailed_scores['values']['percentage'] = round(percentage, 1)
            print(f"🔍 Values calc: {self.detailed_scores['values']['correct']}/{self.detailed_scores['values']['total']} = {percentage}%")



    def _calculate_final_percentages(self):
        """Calculate percentage scores for display"""
        # Cognitive percentage
        if self.detailed_scores['cognitive']['total'] > 0:
            self.detailed_scores['cognitive']['percentage'] = round(
                (self.detailed_scores['cognitive']['correct'] / self.detailed_scores['cognitive']['total']) * 100, 1
            )
        
        # Skills percentage  
        if self.detailed_scores['skills']['total'] > 0:
            self.detailed_scores['skills']['percentage'] = round(
                (self.detailed_scores['skills']['correct'] / self.detailed_scores['skills']['total']) * 100, 1
            )

        # Situational percentage
        if self.detailed_scores['situational']['total'] > 0:
            self.detailed_scores['situational']['percentage'] = round(
                (self.detailed_scores['situational']['correct'] / self.detailed_scores['situational']['total']) * 100, 1
            )
        
        # Values percentage
        if self.detailed_scores['values']['total'] > 0:
            max_values = self.detailed_scores['values']['total'] * 5
            self.detailed_scores['values']['percentage'] = round(
                (self.detailed_scores['values']['correct'] / self.detailed_scores['values']['total']) * 100, 1
            )

def main():
    """Main entry point for the scoring engine"""
    try:
        # Read input from Node.js
        input_data = sys.stdin.read().strip()
        
        if not input_data:
            raise ValueError("No input data received")
        
        # Parse JSON input
        data = json.loads(input_data)
        
        # Extract parameters
        responses = data.get('responses', [])
        education_level = data.get('education_level', 'Intermediate')
        username = data.get('username', 'Unknown User')
        
        if not responses:
            raise ValueError("No responses provided")
        
        # Initialize and run scoring engine
        engine = Model1ScoringEngine()
        results = engine.process_responses(responses, education_level, username)
        
        # Output ONLY JSON results (no print statements)
        print(json.dumps(results, indent=2, ensure_ascii=False))
        
    except Exception as e:
        error_result = {
            "error": str(e),
            "username": "Unknown",
            "education_level": "Unknown", 
            "personality_type": "Assessment Error",
            "personality_score": 0,
            "cognitive_score": 0,
            "skills_score": 0,
            "situational_score": 0,
            "values_score": 0,
            "processed_responses": 0
        }
        print(json.dumps(error_result))
        sys.exit(1)

if __name__ == "__main__":
    main()
