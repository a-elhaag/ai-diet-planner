import { useState, useCallback } from 'react';
import { generateMealPlan, MealPlan, calculateApproximateCalorieNeeds } from '../services/mealPlanService';
import { UserMetrics, UserPreferences } from '../types/user';
import { useMealPlanContext } from '../contexts/MealPlanContext';

export interface UseMealPlanResult {
  mealPlan: MealPlan | null;
  loading: boolean;
  error: Error | null;
  generatePlan: (
    metrics: UserMetrics, 
    preferences: UserPreferences, 
    prompt?: string,
    planType?: 'daily' | 'weekly'
  ) => Promise<void>;
  clearMealPlan: () => void;
  planHistory: MealPlan[];
  getMealPlanFromHistory: (index: number) => MealPlan | null;
  calculateCalorieNeeds: (metrics: UserMetrics) => number;
}

/**
 * Custom hook for meal plan generation functionality
 * This hook integrates with MealPlanContext for persistent storage
 */
export const useMealPlan = (): UseMealPlanResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Use the meal plan context
  const { 
    currentPlan, 
    planHistory, 
    setNewMealPlan, 
    getMealPlanFromHistory,
    clearAllMealPlans 
  } = useMealPlanContext();

  // Generate a new meal plan
  const generatePlan = useCallback(async (
    metrics: UserMetrics,
    preferences: UserPreferences,
    prompt: string = "Generate a balanced meal plan for today",
    planType: 'daily' | 'weekly' = 'daily'
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const newMealPlan = await generateMealPlan(metrics, preferences, prompt, planType);
      // Store the new meal plan in context
      setNewMealPlan(newMealPlan);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      console.error('Error in useMealPlan:', err);
    } finally {
      setLoading(false);
    }
  }, [setNewMealPlan]);

  // Clear the current meal plan
  const clearMealPlan = useCallback(() => {
    clearAllMealPlans();
  }, [clearAllMealPlans]);

  // Helper function to calculate calorie needs without generating a plan
  const calculateCalorieNeeds = useCallback((metrics: UserMetrics): number => {
    return calculateApproximateCalorieNeeds(metrics);
  }, []);

  return {
    mealPlan: currentPlan,
    loading,
    error,
    generatePlan,
    clearMealPlan,
    planHistory,
    getMealPlanFromHistory,
    calculateCalorieNeeds
  };
};
