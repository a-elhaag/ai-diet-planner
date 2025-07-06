import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MealPlan } from '../services/mealPlanService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the maximum number of meal plans to store in history
const MAX_HISTORY_SIZE = 3;

// Define the context value interface
interface MealPlanContextType {
  // Current active meal plan
  currentPlan: MealPlan | null;
  // List of previous meal plans (limited to MAX_HISTORY_SIZE)
  planHistory: MealPlan[];
  // Set a new meal plan as current and add current to history
  setNewMealPlan: (plan: MealPlan) => void;
  // Get a specific meal plan from history by index
  getMealPlanFromHistory: (index: number) => MealPlan | null;
  // Clear all meal plans
  clearAllMealPlans: () => void;
}

// Create the context
const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
  CURRENT_PLAN: 'ai_diet_planner_current_plan',
  PLAN_HISTORY: 'ai_diet_planner_plan_history'
};

// Provider component
export const MealPlanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State for current meal plan and history
  const [currentPlan, setCurrentPlan] = useState<MealPlan | null>(null);
  const [planHistory, setPlanHistory] = useState<MealPlan[]>([]);

  // Load meal plans from AsyncStorage on component mount
  useEffect(() => {
    const loadMealPlans = async () => {
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
      } catch (error) {
        console.error('Error loading meal plans from storage:', error);
      }
    };

    loadMealPlans();
  }, []);

  // Save current plan to AsyncStorage whenever it changes
  useEffect(() => {
    const saveCurrentPlan = async () => {
      if (currentPlan) {
        try {
          await AsyncStorage.setItem(
            STORAGE_KEYS.CURRENT_PLAN,
            JSON.stringify(currentPlan)
          );
        } catch (error) {
          console.error('Error saving current meal plan:', error);
        }
      }
    };

    saveCurrentPlan();
  }, [currentPlan]);

  // Save plan history to AsyncStorage whenever it changes
  useEffect(() => {
    const savePlanHistory = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEYS.PLAN_HISTORY,
          JSON.stringify(planHistory)
        );
      } catch (error) {
        console.error('Error saving meal plan history:', error);
      }
    };

    savePlanHistory();
  }, [planHistory]);

  // Set a new meal plan, moving the current plan to history
  const setNewMealPlan = (plan: MealPlan) => {
    // First, if there's a current plan, add it to history
    if (currentPlan) {
      // Add timestamp if not present
      const planWithTimestamp = {
        ...currentPlan,
        timestamp: currentPlan.timestamp || new Date().toISOString()
      };

      // Add to history and limit size
      setPlanHistory(prevHistory => {
        const newHistory = [planWithTimestamp, ...prevHistory];
        return newHistory.slice(0, MAX_HISTORY_SIZE);
      });
    }

    // Set new plan as current with timestamp
    setCurrentPlan({
      ...plan,
      timestamp: plan.timestamp || new Date().toISOString()
    });
  };

  // Get a meal plan from history by index
  const getMealPlanFromHistory = (index: number): MealPlan | null => {
    return planHistory[index] || null;
  };

  // Clear all meal plans
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

  const value = {
    currentPlan,
    planHistory,
    setNewMealPlan,
    getMealPlanFromHistory,
    clearAllMealPlans
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
