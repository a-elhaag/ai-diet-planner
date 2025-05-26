import React, { createContext, useContext, useState, ReactNode } from 'react';
import { aiDietPlannerApi } from '../api/aiDietPlanner';

interface AiContextType {
  loading: boolean;
  error: string | null;
  dietPlan: any | null;
  generateDietPlan: (user: any, preferences?: any) => Promise<void>;
  clearDietPlan: () => void;
}

// Create the context
const AiContext = createContext<AiContextType | undefined>(undefined);

// Provider component
export const AiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dietPlan, setDietPlan] = useState<any | null>(null);

  // Generate a diet plan using the Azure OpenAI API
  const generateDietPlan = async (user: any, preferences: any = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const plan = await aiDietPlannerApi.generateDietPlan(user, preferences);
      setDietPlan(plan);
    } catch (err: any) {
      console.error('Failed to generate diet plan:', err);
      setError(err.message || 'Failed to generate diet plan');
      setDietPlan(null);
    } finally {
      setLoading(false);
    }
  };

  // Clear the current diet plan
  const clearDietPlan = () => {
    setDietPlan(null);
    setError(null);
  };

  // Context value
  const value = {
    loading,
    error,
    dietPlan,
    generateDietPlan,
    clearDietPlan
  };

  return <AiContext.Provider value={value}>{children}</AiContext.Provider>;
};

// Custom hook to use the AI context
export const useAi = () => {
  const context = useContext(AiContext);
  if (context === undefined) {
    throw new Error('useAi must be used within an AiProvider');
  }
  return context;
};
