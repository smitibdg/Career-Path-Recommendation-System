import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Initial state
const initialState = {
  user: null,
  profile: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  profileLoaded: false, // Track if profile has been loaded from API
  assessmentProgress: {
    personality: { completed: false, score: null, responses: [] },
    skills: { completed: false, score: null, responses: [] },
    cognitive: { completed: false, score: null, responses: [] },
    situational: { completed: false, score: null, responses: [] },
    values: { completed: false, score: null, responses: [] }
  },
  currentEducationLevel: null,
  availableQuestionLevels: ['Foundation', 'Intermediate', 'Advanced']
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_USER: 'SET_USER',
  SET_PROFILE: 'SET_PROFILE',
  SET_PROFILE_LOADED: 'SET_PROFILE_LOADED',
  LOGOUT_USER: 'LOGOUT_USER',
  UPDATE_ASSESSMENT_PROGRESS: 'UPDATE_ASSESSMENT_PROGRESS',
  COMPLETE_ASSESSMENT: 'COMPLETE_ASSESSMENT',
  RESET_ASSESSMENTS: 'RESET_ASSESSMENTS',
  SET_EDUCATION_LEVEL: 'SET_EDUCATION_LEVEL',
  UPDATE_USER_PROFILE: 'UPDATE_USER_PROFILE'
};

// Reducer function
const userReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload, error: null };

    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };

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
        currentEducationLevel: action.payload?.educationLevel,
        profileLoaded: true, 
        loading: false,
        error: null
      };

    case actionTypes.SET_PROFILE_LOADED:
      return { ...state, profileLoaded: action.payload };

    case actionTypes.SET_EDUCATION_LEVEL:
      return {
        ...state,
        currentEducationLevel: action.payload,
        profile: { ...state.profile, educationLevel: action.payload }
      };

    case actionTypes.UPDATE_USER_PROFILE:
      return {
        ...state,
        profile: { ...state.profile, ...action.payload },
        currentEducationLevel: action.payload.educationLevel || state.currentEducationLevel,
        profileLoaded: true
      };

    case actionTypes.LOGOUT_USER:
      return { ...initialState };

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
      return { ...state, assessmentProgress: initialState.assessmentProgress };

    default:
      return state;
  }
};

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        console.log('🔄 [UserContext] Loading user data from localStorage...');
        
        const userData = localStorage.getItem('userData');
        const profileData = localStorage.getItem('userProfile');
        
        if (userData) {
          const user = JSON.parse(userData);
          dispatch({ type: actionTypes.SET_USER, payload: user });
          console.log('👤 [UserContext] User loaded from localStorage:', user);
        }
        
        if (profileData) {
          const profile = JSON.parse(profileData);
          dispatch({ type: actionTypes.SET_PROFILE, payload: profile });
          console.log('📋 [UserContext] Profile loaded from localStorage:', profile);
        } else {
          // If no profile in localStorage, mark as not loaded yet
          dispatch({ type: actionTypes.SET_PROFILE_LOADED, payload: false });
        }
      } catch (error) {
        console.error('[UserContext] Error loading user data:', error);
        dispatch({ type: actionTypes.SET_ERROR, payload: 'Failed to load user data' });
      }
    };

    loadUserData();
  }, []);

  // Helper function to get auth token
  const getAuthToken = useCallback(() => {
    return localStorage.getItem('token') || state.user?.token;
  }, [state.user]);

  // API function to get user profile
  // IMPROVED API function to get user profile with assessment status - WRAPPED IN useCallback
  const getUserProfile = useCallback(async (forceRefresh = false) => {
    try {
      console.log('🔍 getUserProfile: Starting...');
      console.log('🔄 getUserProfile: Force refresh:', forceRefresh);
      console.log('👤 getUserProfile: User:', state.user);

      if (!state.user) {
        console.log('getUserProfile: No user found');
        dispatch({ type: actionTypes.SET_PROFILE_LOADED, payload: true });
        return { success: false, error: 'No user logged in' };
      }

      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const token = getAuthToken();
      console.log('getUserProfile: Token:', token ? 'Present' : 'Missing');

      const url = `${API_BASE_URL}/api/profile`;
      console.log('getUserProfile: Fetch URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      console.log('📡 getUserProfile: Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('getUserProfile: Success data:', data);

        if (data.profile || data.user) {
          const profileData = data.profile || data.user || data;
          
          // CHECK FOR ASSESSMENT COMPLETION STATUS
          try {
            const assessmentResponse = await fetch('/api/ml-models/check-assessment-status', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ userId: state.user.id })
            });
            
            const assessmentData = await assessmentResponse.json();
            console.log('Assessment status check:', assessmentData);
            
            // Add assessment status to profile
            profileData.hasCompletedAssessments = assessmentData.hasResults;
            profileData.assessmentResults = assessmentData.results;
            
          } catch (assessmentError) {
            console.log('⚠️ Could not check assessment status:', assessmentError.message);
          }

          dispatch({ type: actionTypes.SET_PROFILE, payload: profileData });
          console.log('getUserProfile: Profile set successfully');
          return { success: true, profile: profileData };
        } else {
          console.log('getUserProfile: No profile data in response');
          dispatch({ type: actionTypes.SET_PROFILE_LOADED, payload: true });
          return { success: false, error: 'No profile data found' };
        }
      } else if (response.status === 404) {
        console.log('ℹgetUserProfile: Profile not found (404)');
        dispatch({ type: actionTypes.SET_PROFILE_LOADED, payload: true });
        return { success: false, error: 'Profile not found' };
      } else {
        const errorData = await response.json().catch(() => ({ message: 'API Error' }));
        console.log('getUserProfile: Error response:', errorData);
        dispatch({ type: actionTypes.SET_ERROR, payload: errorData.message || 'Failed to fetch profile' });
        dispatch({ type: actionTypes.SET_PROFILE_LOADED, payload: true });
        return { success: false, error: errorData.message || 'Failed to fetch profile' };
      }
    } catch (error) {
      console.error('getUserProfile: Catch error:', error);
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      dispatch({ type: actionTypes.SET_PROFILE_LOADED, payload: true });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
    }
  }, [state.user]); // Only depend on state.user


  // Auto-fetch profile when user is loaded but no profile exists
  useEffect(() => {
    const autoFetchProfile = async () => {
      if (state.user && !state.profile && !state.profileLoaded && !state.loading) {
        console.log('🔄 [UserContext] Auto-fetching profile for logged-in user...');
        await getUserProfile(true);
      }
    };

    autoFetchProfile();
  }, [state.user, state.profile, state.profileLoaded, state.loading, getUserProfile]);

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

  

  

  // API function to create user profile
  const createUserProfile = async (profileData) => {
    try {
      console.log('[createUserProfile] Starting...');
      console.log('[createUserProfile] Profile data:', profileData);
      console.log('[createUserProfile] User:', state.user);
      
      if (!state.user) {
        console.log('[createUserProfile] No user found');
        return { success: false, error: 'No user logged in' };
      }

      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const token = getAuthToken();
      console.log('[createUserProfile] Token:', token ? 'Present' : 'Missing');

      const url = `${API_BASE_URL}/api/profile`;
      console.log('[createUserProfile] Fetch URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          ...profileData,
          userId: state.user.id || state.user._id,
          email: profileData.email || state.user.email
        }),
      });

      console.log('📡 [createUserProfile] Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('[createUserProfile] Success data:', data);
        
        const profileResult = data.profile || data.user || data;
        dispatch({ type: actionTypes.SET_PROFILE, payload: profileResult });
        return { success: true, profile: profileResult };
      } else {
        const errorData = await response.json().catch(() => ({ message: 'API Error' }));
        console.log('[createUserProfile] Error response:', errorData);
        return { success: false, error: errorData.message || 'Failed to create profile' };
      }
    } catch (error) {
      console.error('[createUserProfile] Catch error:', error);
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
    }
  };

  // API function to update user profile
  const updateUserProfile = async (profileData) => {
    try {
      console.log('[updateUserProfile] Starting...');
      console.log('[updateUserProfile] Profile data:', profileData);
      console.log('[updateUserProfile] User:', state.user);
      
      if (!state.user) {
        console.log('[updateUserProfile] No user found');
        return { success: false, error: 'No user logged in' };
      }

      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      const token = getAuthToken();
      console.log('[updateUserProfile] Token:', token ? 'Present' : 'Missing');

      const url = `${API_BASE_URL}/api/profile`;
      console.log('[updateUserProfile] Fetch URL:', url);

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          ...profileData,
          userId: state.user.id || state.user._id,
          email: profileData.email || state.user.email
        }),
      });

      console.log('[updateUserProfile] Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('[updateUserProfile] Success data:', data);
        
        const profileResult = data.profile || data.user || data;
        dispatch({ type: actionTypes.SET_PROFILE, payload: profileResult });
        return { success: true, profile: profileResult };
      } else {
        const errorData = await response.json().catch(() => ({ message: 'API Error' }));
        console.log('[updateUserProfile] Error response:', errorData);
        return { success: false, error: errorData.message || 'Failed to update profile' };
      }
    } catch (error) {
      console.error('[updateUserProfile] Catch error:', error);
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
    }
  };

  // Basic state actions
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

  const setEducationLevel = (educationLevel) => {
    dispatch({ type: actionTypes.SET_EDUCATION_LEVEL, payload: educationLevel });
  };

  const logoutUser = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('assessmentData');
    localStorage.removeItem('token');
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
    
    const assessmentData = JSON.parse(localStorage.getItem('assessmentData') || '{}');
    assessmentData[testType] = { score, responses, completedAt: new Date().toISOString() };
    localStorage.setItem('assessmentData', JSON.stringify(assessmentData));
  };

  const resetAssessments = () => {
    localStorage.removeItem('assessmentData');
    dispatch({ type: actionTypes.RESET_ASSESSMENTS });
  };

  // Helper functions
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

  const getEducationLevel = () => {
    return state.currentEducationLevel || state.profile?.educationLevel || 'Not set';
  };

  const hasEducationLevel = () => {
    return !!(state.currentEducationLevel || state.profile?.educationLevel);
  };

  // Check if profile exists (considering loading state)
  const hasProfile = () => {
    return !!(state.profile && state.profile.educationLevel);
  };

  const contextValue = {
    // State
    ...state,
    
    // Basic Actions
    setLoading,
    setError,
    clearError,
    setUser,
    setProfile,
    setEducationLevel,
    logoutUser,
    updateAssessmentProgress,
    completeAssessment,
    resetAssessments,
    
    // API Functions
    getUserProfile,
    createUserProfile,
    updateUserProfile,
    
    // Helper functions
    getQuestionLevel,
    getEducationLevel,
    hasEducationLevel,
    hasProfile
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;