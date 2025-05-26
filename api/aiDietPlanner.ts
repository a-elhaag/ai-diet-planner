import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Set the base URL for the backend API
const getBaseUrl = (): string => {
  if (Platform.OS === 'web') {
    // Web proxy to /api
    return '/api';
  } else if (Platform.OS === 'android') {
    // Android emulator
    return 'http://10.0.2.2:3000/api';
  } else {
    // iOS simulator or physical device pointed at local machine
    return 'http://localhost:3000/api';
  }
};

const BASE_URL = getBaseUrl();

// API client for diet plan generation
export const aiDietPlannerApi = {
  /**
   * Generate a diet plan based on user data
   * 
   * @param user - User data including name, age, weight, height, etc.
   * @param preferences - Additional preferences for diet planning
   * @returns The generated diet plan
   */
  generateDietPlan: async (user: any, preferences: any = {}): Promise<any> => {
    try {
      const response = await fetch(`${BASE_URL}/generate-diet-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, preferences }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate diet plan');
      }

      const data = await response.json();
      return data.dietPlan;
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },

  /**
   * Check if the API is running
   */
  checkHealth: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('API health check error:', error);
      return false;
    }
  }
};
