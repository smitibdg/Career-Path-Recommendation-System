import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  user: null,
  profile: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  assessmentProgress: {
    personality: { completed: false, score: null, responses: [] },
    skills: { completed: false, score: null, responses: [] },
    cognitive: { completed: false, score: null, responses: [] },
    situational: { completed: false, score: null, responses: [] },
    values: { completed: false, score: null, responses: [] }
  },
  currentEducationLevel: null, // NEW: Track user's education level
  availableQuestionLevels: ['Foundation', 'Intermediate', 'Advanced'] // NEW
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_USER: 'SET_USER',
  SET_PROFILE: 'SET_PROFILE',
  LOGOUT_USER: 'LOGOUT_USER',
  UPDATE_ASSESSMENT_PROGRESS: 'UPDATE_ASSESSMENT_PROGRESS',
  COMPLETE_ASSESSMENT: 'COMPLETE_ASSESSMENT',
  RESET_ASSESSMENTS: 'RESET_ASSESSMENTS',
  SET_EDUCATION_LEVEL: 'SET_EDUCATION_LEVEL', // NEW
  UPDATE_USER_PROFILE: 'UPDATE_USER_PROFILE' // NEW
};

// Reducer function
const userReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: null
      };

    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
        error: null
      };

    case actionTypes.SET_PROFILE:
      return {
        ...state,
        profile: action.payload,
        currentEducationLevel: action.payload?.educationLevel, // NEW: Set education level
        loading: false,
        error: null
      };

    case actionTypes.SET_EDUCATION_LEVEL: // NEW ACTION
      return {
        ...state,
        currentEducationLevel: action.payload,
        profile: {
          ...state.profile,
          educationLevel: action.payload
        }
      };

    case actionTypes.UPDATE_USER_PROFILE: // NEW ACTION
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.payload
        },
        currentEducationLevel: action.payload.educationLevel || state.currentEducationLevel
      };

    case actionTypes.LOGOUT_USER:
      return {
        ...initialState
      };

    case actionTypes.UPDATE_ASSESSMENT_PROGRESS:
      return {
        ...state,
        assessmentProgress: {
          ...state.assessmentProgress,
          [action.payload.testType]: {
            ...state.assessmentProgress[action.payload.testType],
            ...action.payload.data
          }
        }
      };

    case actionTypes.COMPLETE_ASSESSMENT:
      return {
        ...state,
        assessmentProgress: {
          ...state.assessmentProgress,
          [action.payload.testType]: {
            completed: true,
            score: action.payload.score,
            responses: action.payload.responses,
            completedAt: new Date().toISOString()
          }
        }
      };

    case actionTypes.RESET_ASSESSMENTS:
      return {
        ...state,
        assessmentProgress: initialState.assessmentProgress
      };

    default:
      return state;
  }
};

// Create context
const UserContext = createContext();

// Context provider component
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const userData = localStorage.getItem('userData');
        const profileData = localStorage.getItem('userProfile');
        
        if (userData) {
          const user = JSON.parse(userData);
          dispatch({ type: actionTypes.SET_USER, payload: user });
        }
        
        if (profileData) {
          const profile = JSON.parse(profileData);
          dispatch({ type: actionTypes.SET_PROFILE, payload: profile });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        dispatch({ type: actionTypes.SET_ERROR, payload: 'Failed to load user data' });
      }
    };

    loadUserData();
  }, []);

  // Save user data to localStorage whenever user changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('userData', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('userData');
    }
  }, [state.user]);

  // Save profile data to localStorage whenever profile changes
  useEffect(() => {
    if (state.profile) {
      localStorage.setItem('userProfile', JSON.stringify(state.profile));
    } else {
      localStorage.removeItem('userProfile');
    }
  }, [state.profile]);

  // Actions
  const setLoading = (loading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: actionTypes.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  };

  const setUser = (userData) => {
    dispatch({ type: actionTypes.SET_USER, payload: userData });
  };

  const setProfile = (profileData) => {
    dispatch({ type: actionTypes.SET_PROFILE, payload: profileData });
  };

  // NEW: Set education level
  const setEducationLevel = (educationLevel) => {
    dispatch({ type: actionTypes.SET_EDUCATION_LEVEL, payload: educationLevel });
  };

  // NEW: Update user profile
  const updateUserProfile = (profileUpdates) => {
    dispatch({ type: actionTypes.UPDATE_USER_PROFILE, payload: profileUpdates });
  };

  const logoutUser = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('assessmentData');
    dispatch({ type: actionTypes.LOGOUT_USER });
  };

  const updateAssessmentProgress = (testType, data) => {
    dispatch({
      type: actionTypes.UPDATE_ASSESSMENT_PROGRESS,
      payload: { testType, data }
    });
  };

  const completeAssessment = (testType, score, responses) => {
    dispatch({
      type: actionTypes.COMPLETE_ASSESSMENT,
      payload: { testType, score, responses }
    });
    
    // Save to localStorage
    const assessmentData = JSON.parse(localStorage.getItem('assessmentData') || '{}');
    assessmentData[testType] = { score, responses, completedAt: new Date().toISOString() };
    localStorage.setItem('assessmentData', JSON.stringify(assessmentData));
  };

  const resetAssessments = () => {
    localStorage.removeItem('assessmentData');
    dispatch({ type: actionTypes.RESET_ASSESSMENTS });
  };

  // NEW: Get appropriate question level based on education
  const getQuestionLevel = () => {
    const educationLevel = state.currentEducationLevel || state.profile?.educationLevel;
    
    const levelMap = {
      'intermediate-10th': 'Foundation',
      'intermediate-11th': 'Foundation',
      'intermediate-12th': 'Foundation',
      'diploma': 'Intermediate', 
      'bachelors': 'Intermediate',
      'masters': 'Advanced',
      'phd': 'Advanced'
    };
    
    return levelMap[educationLevel] || 'Foundation';
  };

  // NEW: Check if user has completed profile with education level
  const hasEducationLevel = () => {
    return !!(state.currentEducationLevel || state.profile?.educationLevel);
  };

  const contextValue = {
    // State
    ...state,
    
    // Actions
    setLoading,
    setError,
    clearError,
    setUser,
    setProfile,
    setEducationLevel, // NEW
    updateUserProfile, // NEW
    logoutUser,
    updateAssessmentProgress,
    completeAssessment,
    resetAssessments,
    
    // NEW: Helper functions
    getQuestionLevel,
    hasEducationLevel
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;