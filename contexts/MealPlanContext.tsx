import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MealPlan } from '../services/mealPlanService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the maximum number of meal plans to store in history
const MAX_HISTORY_SIZE = 3;

// Enhanced interfaces for new features
interface QuickMeal {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  timestamp: string;
  photo?: string;
}

interface UserInfo {
  name: string;
  email?: string;
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  unit: 'metric' | 'imperial';
}

interface ProgressTracking {
  resetPeriod: 'daily' | 'weekly' | 'monthly';
  lastResetDate: string;
  weeklyGoals: {
    mealsLogged: number;
    hydrationDays: number;
    exerciseDays: number;
  };
  currentWeekProgress: {
    mealsLogged: number;
    hydrationDays: number;
    exerciseDays: number;
  };
}

interface UserProgress {
  points: number;
  badges: string[];
  streaks: {
    current: number;
    longest: number;
    lastLogDate: string;
  };
  challenges: {
    id: string;
    name: string;
    progress: number;
    target: number;
    completed: boolean;
  }[];
  tracking: ProgressTracking;
}

interface DailyTracking {
  date: string;
  hydration: {
    glasses: number;
    target: number;
  };
  activity: {
    steps: number;
    minutes: number;
    target: number;
  };
  mealsLogged: QuickMeal[];
  mood?: 'great' | 'good' | 'okay' | 'poor';
}

interface AppSettings {
  notifications: {
    enabled: boolean;
    mealReminders: boolean;
    hydrationReminders: boolean;
    motivationalMessages: boolean;
    times: {
      breakfast: string;
      lunch: string;
      dinner: string;
      hydration: string[];
    };
  };
  privacy: {
    dataStaysLocal: boolean;
    allowAnalytics: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    units: 'metric' | 'imperial';
    language: string;
  };
}

// Define the enhanced context value interface
interface MealPlanContextType {
  // User info (editable)
  userInfo: UserInfo;
  // Current active meal plan
  currentPlan: MealPlan | null;
  // List of previous meal plans (limited to MAX_HISTORY_SIZE)
  planHistory: MealPlan[];
  // User progress and gamification
  userProgress: UserProgress;
  // Daily tracking data
  dailyTracking: DailyTracking;
  // App settings
  appSettings: AppSettings;
  // Quick meal logging
  quickMeals: QuickMeal[];
  // Recipe suggestions and grocery list
  recipeHistory: string[];
  groceryList: string[];
  
  // Original functions
  setNewMealPlan: (plan: MealPlan) => void;
  getMealPlanFromHistory: (index: number) => MealPlan | null;
  clearAllMealPlans: () => void;
  
  // New functions for enhanced features
  updateUserInfo: (info: Partial<UserInfo>) => void;
  logQuickMeal: (meal: Omit<QuickMeal, 'id' | 'timestamp'>) => void;
  updateHydration: (glasses: number) => void;
  updateActivity: (steps: number, minutes: number) => void;
  addPoints: (points: number) => void;
  unlockBadge: (badgeId: string) => void;
  updateStreak: () => void;
  resetWeeklyProgress: () => void;
  resetDailyProgress: () => void;
  addToGroceryList: (items: string[]) => void;
  removeFromGroceryList: (item: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  exportData: () => Promise<string>;
  importData: (data: string) => Promise<void>;
  generateNewPlan: (metrics: any, preferences: any, prompt?: string) => Promise<void>;
}

// Create the context
const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
  USER_INFO: 'ai_diet_planner_user_info',
  CURRENT_PLAN: 'ai_diet_planner_current_plan',
  PLAN_HISTORY: 'ai_diet_planner_plan_history',
  USER_PROGRESS: 'ai_diet_planner_user_progress',
  DAILY_TRACKING: 'ai_diet_planner_daily_tracking',
  APP_SETTINGS: 'ai_diet_planner_app_settings',
  QUICK_MEALS: 'ai_diet_planner_quick_meals',
  RECIPE_HISTORY: 'ai_diet_planner_recipe_history',
  GROCERY_LIST: 'ai_diet_planner_grocery_list',
};

// Default values for new features
const defaultUserInfo: UserInfo = {
  name: 'John Doe',
  email: '',
  age: 30,
  weight: 70,
  height: 175,
  gender: 'male',
  activityLevel: 'moderate',
  unit: 'metric',
};
const defaultUserProgress: UserProgress = {
  points: 0,
  badges: [],
  streaks: {
    current: 0,
    longest: 0,
    lastLogDate: '',
  },
  challenges: [
    {
      id: 'daily_log',
      name: 'Log meals for 7 days',
      progress: 0,
      target: 7,
      completed: false,
    },
    {
      id: 'hydration_goal',
      name: 'Drink 8 glasses of water',
      progress: 0,
      target: 8,
      completed: false,
    },
  ],
  tracking: {
    resetPeriod: 'weekly',
    lastResetDate: new Date().toISOString().split('T')[0],
    weeklyGoals: {
      mealsLogged: 21, // 3 meals x 7 days
      hydrationDays: 7,
      exerciseDays: 5,
    },
    currentWeekProgress: {
      mealsLogged: 0,
      hydrationDays: 0,
      exerciseDays: 0,
    },
  },
};

const defaultDailyTracking: DailyTracking = {
  date: new Date().toISOString().split('T')[0],
  hydration: { glasses: 0, target: 8 },
  activity: { steps: 0, minutes: 0, target: 10000 },
  mealsLogged: [],
};

const defaultAppSettings: AppSettings = {
  notifications: {
    enabled: true,
    mealReminders: true,
    hydrationReminders: true,
    motivationalMessages: true,
    times: {
      breakfast: '08:00',
      lunch: '12:00',
      dinner: '18:00',
      hydration: ['10:00', '14:00', '16:00', '20:00'],
    },
  },
  privacy: {
    dataStaysLocal: true,
    allowAnalytics: false,
  },
  preferences: {
    theme: 'light',
    units: 'metric',
    language: 'en',
  },
};

// Provider component
export const MealPlanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // User info state
  const [userInfo, setUserInfo] = useState<UserInfo>(defaultUserInfo);
  // Existing state
  const [currentPlan, setCurrentPlan] = useState<MealPlan | null>(null);
  const [planHistory, setPlanHistory] = useState<MealPlan[]>([]);
  
  // New state for enhanced features
  const [userProgress, setUserProgress] = useState<UserProgress>(defaultUserProgress);
  const [dailyTracking, setDailyTracking] = useState<DailyTracking>(defaultDailyTracking);
  const [appSettings, setAppSettings] = useState<AppSettings>(defaultAppSettings);
  const [quickMeals, setQuickMeals] = useState<QuickMeal[]>([]);
  const [recipeHistory, setRecipeHistory] = useState<string[]>([]);
  const [groceryList, setGroceryList] = useState<string[]>([]);

  // Load all data from AsyncStorage on component mount
  useEffect(() => {
    const loadAllData = async () => {
      try {
        // Load current plan
        const storedCurrentPlan = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_PLAN);
        if (storedCurrentPlan) {
          setCurrentPlan(JSON.parse(storedCurrentPlan));
        }

        // Load plan history
        const storedHistory = await AsyncStorage.getItem(STORAGE_KEYS.PLAN_HISTORY);
        if (storedHistory) {
          setPlanHistory(JSON.parse(storedHistory));
        }

        // Load user progress
        const storedProgress = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
        if (storedProgress) {
          setUserProgress(JSON.parse(storedProgress));
        }

        // Load daily tracking
        const storedTracking = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_TRACKING);
        if (storedTracking) {
          const tracking = JSON.parse(storedTracking);
          // Reset daily tracking if it's a new day
          const today = new Date().toISOString().split('T')[0];
          if (tracking.date !== today) {
            setDailyTracking({ ...defaultDailyTracking, date: today });
          } else {
            setDailyTracking(tracking);
          }
        }

        // Load app settings
        const storedSettings = await AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
        if (storedSettings) {
          setAppSettings({ ...defaultAppSettings, ...JSON.parse(storedSettings) });
        }

        // Load quick meals
        const storedQuickMeals = await AsyncStorage.getItem(STORAGE_KEYS.QUICK_MEALS);
        if (storedQuickMeals) {
          setQuickMeals(JSON.parse(storedQuickMeals));
        }

        // Load recipe history
        const storedRecipes = await AsyncStorage.getItem(STORAGE_KEYS.RECIPE_HISTORY);
        if (storedRecipes) {
          setRecipeHistory(JSON.parse(storedRecipes));
        }

        // Load grocery list
        const storedGrocery = await AsyncStorage.getItem(STORAGE_KEYS.GROCERY_LIST);
        if (storedGrocery) {
          setGroceryList(JSON.parse(storedGrocery));
        }
      } catch (error) {
        console.error('Error loading data from storage:', error);
      }
    };

    loadAllData();
  }, []);

  // Save functions for each data type
  const saveToStorage = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  };

  // Auto-save effects
  useEffect(() => {
    if (currentPlan) saveToStorage(STORAGE_KEYS.CURRENT_PLAN, currentPlan);
  }, [currentPlan]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PLAN_HISTORY, planHistory);
  }, [planHistory]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.USER_PROGRESS, userProgress);
  }, [userProgress]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.DAILY_TRACKING, dailyTracking);
  }, [dailyTracking]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.APP_SETTINGS, appSettings);
  }, [appSettings]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.QUICK_MEALS, quickMeals);
  }, [quickMeals]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.RECIPE_HISTORY, recipeHistory);
  }, [recipeHistory]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.GROCERY_LIST, groceryList);
  }, [groceryList]);

  // Original meal plan functions
  const setNewMealPlan = (plan: MealPlan) => {
    if (currentPlan) {
      const planWithTimestamp = {
        ...currentPlan,
        timestamp: currentPlan.timestamp || new Date().toISOString()
      };
      setPlanHistory(prevHistory => {
        const newHistory = [planWithTimestamp, ...prevHistory];
        return newHistory.slice(0, MAX_HISTORY_SIZE);
      });
    }
    setCurrentPlan({
      ...plan,
      timestamp: plan.timestamp || new Date().toISOString()
    });
    // Award points for creating a meal plan
    addPoints(10);
  };

  const getMealPlanFromHistory = (index: number): MealPlan | null => {
    return planHistory[index] || null;
  };

  const clearAllMealPlans = async () => {
    setCurrentPlan(null);
    setPlanHistory([]);
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_PLAN);
      await AsyncStorage.removeItem(STORAGE_KEYS.PLAN_HISTORY);
    } catch (error) {
      console.error('Error clearing meal plans from storage:', error);
    }
  };

  // New feature functions
  const logQuickMeal = (meal: Omit<QuickMeal, 'id' | 'timestamp'>) => {
    const newMeal: QuickMeal = {
      ...meal,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    
    setQuickMeals(prev => [newMeal, ...prev]);
    setDailyTracking(prev => ({
      ...prev,
      mealsLogged: [...prev.mealsLogged, newMeal],
    }));
    
    // Award points and update streak
    addPoints(5);
    updateStreak();
  };

  const updateHydration = (glasses: number) => {
    setDailyTracking(prev => ({
      ...prev,
      hydration: { ...prev.hydration, glasses },
    }));
    
    // Award points for reaching hydration goal
    if (glasses >= dailyTracking.hydration.target) {
      addPoints(5);
      unlockBadge('hydration_hero');
    }
  };

  const updateActivity = (steps: number, minutes: number) => {
    setDailyTracking(prev => ({
      ...prev,
      activity: { ...prev.activity, steps, minutes },
    }));
    
    // Award points for reaching activity goal
    if (steps >= dailyTracking.activity.target) {
      addPoints(10);
      unlockBadge('step_master');
    }
  };

  const addPoints = (points: number) => {
    setUserProgress(prev => ({
      ...prev,
      points: prev.points + points,
    }));
  };

  const unlockBadge = (badgeId: string) => {
    setUserProgress(prev => {
      if (!prev.badges.includes(badgeId)) {
        return {
          ...prev,
          badges: [...prev.badges, badgeId],
          points: prev.points + 20, // Bonus points for badges
        };
      }
      return prev;
    });
  };

  const updateStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    setUserProgress(prev => {
      let newCurrent = prev.streaks.current;
      
      if (prev.streaks.lastLogDate === yesterday) {
        newCurrent += 1;
      } else if (prev.streaks.lastLogDate !== today) {
        newCurrent = 1;
      }
      
      return {
        ...prev,
        streaks: {
          current: newCurrent,
          longest: Math.max(newCurrent, prev.streaks.longest),
          lastLogDate: today,
        },
      };
    });
  };

  const addToGroceryList = (items: string[]) => {
    setGroceryList(prev => [...new Set([...prev, ...items])]);
  };

  const removeFromGroceryList = (item: string) => {
    setGroceryList(prev => prev.filter(i => i !== item));
  };

  const updateSettings = (settings: Partial<AppSettings>) => {
    setAppSettings(prev => ({ ...prev, ...settings }));
  };

  // Generate new meal plan function (integrates with the service)
  const generateNewPlan = async (metrics: any, preferences: any, prompt?: string) => {
    try {
      // Import the service dynamically to avoid circular dependencies
      const { generateMealPlanWithFallback } = await import('../services/mealPlanService');
      const newPlan = await generateMealPlanWithFallback(metrics, preferences, prompt || 'Generate a balanced meal plan');
      setNewMealPlan(newPlan);
    } catch (error) {
      console.error('Error generating new plan:', error);
      throw error;
    }
  };

  // Export data function
  const exportData = async (): Promise<string> => {
    const exportObject = {
      currentPlan,
      planHistory,
      userProgress,
      dailyTracking,
      appSettings,
      quickMeals,
      recipeHistory,
      groceryList,
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(exportObject, null, 2);
  };

  // Import data function
  const importData = async (dataString: string): Promise<void> => {
    try {
      const data = JSON.parse(dataString);
      if (data.userInfo) setUserInfo(data.userInfo);
      if (data.currentPlan) setCurrentPlan(data.currentPlan);
      if (data.planHistory) setPlanHistory(data.planHistory);
      if (data.userProgress) setUserProgress(data.userProgress);
      if (data.dailyTracking) setDailyTracking(data.dailyTracking);
      if (data.appSettings) setAppSettings(data.appSettings);
      if (data.quickMeals) setQuickMeals(data.quickMeals);
      if (data.recipeHistory) setRecipeHistory(data.recipeHistory);
      if (data.groceryList) setGroceryList(data.groceryList);
    } catch (error) {
      throw new Error('Invalid data format for import');
    }
  };

  // Update user info function
  const updateUserInfo = (info: Partial<UserInfo>) => {
    setUserInfo(prevInfo => ({ ...prevInfo, ...info }));
  };

  // Reset progress functions
  const resetWeeklyProgress = () => {
    setUserProgress(prevProgress => ({
      ...prevProgress,
      tracking: {
        ...prevProgress.tracking,
        currentWeekProgress: {
          mealsLogged: 0,
          hydrationDays: 0,
          exerciseDays: 0,
        },
        lastResetDate: new Date().toISOString().split('T')[0],
      },
    }));
  };

  const resetDailyProgress = () => {
    setDailyTracking(prevTracking => ({
      ...prevTracking,
      date: new Date().toISOString().split('T')[0],
      hydration: { ...prevTracking.hydration, glasses: 0 },
      activity: { ...prevTracking.activity, steps: 0, minutes: 0 },
      mealsLogged: [],
    }));
  };

  const value = {
    // User info
    userInfo,
    // Original data
    currentPlan,
    planHistory,
    // New data
    userProgress,
    dailyTracking,
    appSettings,
    quickMeals,
    recipeHistory,
    groceryList,
    // Original functions
    setNewMealPlan,
    getMealPlanFromHistory,
    clearAllMealPlans,
    // New functions
    updateUserInfo,
    logQuickMeal,
    updateHydration,
    updateActivity,
    addPoints,
    unlockBadge,
    updateStreak,
    resetWeeklyProgress,
    resetDailyProgress,
    addToGroceryList,
    removeFromGroceryList,
    updateSettings,
    exportData,
    importData,
    generateNewPlan,
  };

  return <MealPlanContext.Provider value={value}>{children}</MealPlanContext.Provider>;
};

// Custom hook for using the meal plan context
export const useMealPlanContext = (): MealPlanContextType => {
  const context = useContext(MealPlanContext);
  if (context === undefined) {
    throw new Error('useMealPlanContext must be used within a MealPlanProvider');
  }
  return context;
};
