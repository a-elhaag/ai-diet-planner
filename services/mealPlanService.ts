import { UserPreferences, UserMetrics } from '../types/user';

// Define the API endpoint and API key
const API_URL = process.env.API_URL 
const API_KEY = process.env.API_KEY 

// Type definitions for meal plan data
export interface NutritionalValues {
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
}

export interface MealItem {
  name: string;
  items: string[];
  nutritionalValues: NutritionalValues;
  nutritionalBenefits: string;
}

export interface MealPlan {
  meals: MealItem[];
  dailyTotals: NutritionalValues;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    costUsd: number;
  };
  timestamp?: string;
  name?: string;
  planId?: string;
  weeklyPlans?: {
    [day: string]: {
      breakfast?: MealItem;
      lunch?: MealItem;
      dinner?: MealItem;
      snacks?: MealItem[];
    }
  };
}

/**
 * Generate a meal plan using Azure Function API
 * 
 * @param metrics User metrics (age, weight, height, gender)
 * @param preferences User preferences and dietary restrictions
 * @param prompt Specific user request for the meal plan
 * @param planType Type of meal plan to generate (daily or weekly)
 * @returns Promise with meal plan data
 */
export const generateMealPlan = async (
  metrics: UserMetrics,
  preferences: UserPreferences,
  prompt: string,
  planType: 'daily' | 'weekly' = 'daily'
): Promise<MealPlan> => {
  try {
    const requestBody = {
      user: {
        metrics: `Age: ${metrics.age}, Weight: ${metrics.weight}${metrics.unit === 'metric' ? 'kg' : 'lbs'}, Height: ${metrics.height}${metrics.unit === 'metric' ? 'cm' : 'in'}, Gender: ${metrics.gender}, Activity Level: ${metrics.activityLevel}`,
        preferences: `Goals: ${preferences.goals.join(', ')}, Diet type: ${preferences.dietType}, Allergies: ${preferences.allergies.join(', ')}, Dislikes: ${preferences.dislikes.join(', ')}, Meals per day: ${preferences.mealCount}`
      },
      chat: {
        mode: "meal_plan",
        prompt: prompt || `Generate a balanced ${planType} meal plan`,
        planType: planType
      }
    };

    // Calculate approximate calorie needs if target not specified
    if (!preferences.calorieTarget) {
      const calorieTarget = calculateApproximateCalorieNeeds(metrics);
      requestBody.user.preferences += `, Approximate calorie target: ${calorieTarget}`;
    } else {
      requestBody.user.preferences += `, Calorie target: ${preferences.calorieTarget}`;
    }

    const response = await fetch(`${API_URL}?code=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch meal plan: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Add timestamp and generate plan ID if not present
    return {
      ...data,
      timestamp: new Date().toISOString(),
      planId: data.planId || `plan-${Date.now()}`,
      name: data.name || `${preferences.dietType} ${preferences.goals[0]} plan`
    };
  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw error;
  }
};

/**
 * Calculate approximate calorie needs based on user metrics
 * This uses the Mifflin-St Jeor equation for BMR and then applies activity factor
 * 
 * @param metrics User metrics
 * @returns Approximate daily calorie needs
 */
export const calculateApproximateCalorieNeeds = (metrics: UserMetrics): number => {
  // Convert height to cm and weight to kg if in imperial
  const weightInKg = metrics.unit === 'metric' ? 
    metrics.weight : metrics.weight * 0.453592;
  const heightInCm = metrics.unit === 'metric' ? 
    metrics.height : metrics.height * 2.54;
  
  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr: number;
  if (metrics.gender === 'male') {
    bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * metrics.age) + 5;
  } else {
    bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * metrics.age) - 161;
  }
  
  // Apply activity factor
  const activityFactors: {[key: string]: number} = {
    'sedentary': 1.2,      // Little or no exercise
    'light': 1.375,        // Light exercise 1-3 days/week
    'moderate': 1.55,      // Moderate exercise 3-5 days/week
    'active': 1.725,       // Heavy exercise 6-7 days/week
    'very_active': 1.9     // Very heavy exercise, physical job or training twice a day
  };
  
  const activityFactor = activityFactors[metrics.activityLevel] || 1.55;
  const totalCalories = Math.round(bmr * activityFactor);
  
  return totalCalories;
};

/**
 * Generate a mock meal plan as fallback when API is unavailable
 * This ensures the app continues to work even without internet connectivity
 */
export const generateMockMealPlan = (metrics: UserMetrics, preferences: UserPreferences): MealPlan => {
  const calorieTarget = calculateApproximateCalorieNeeds(metrics);
  
  // Base meal templates based on diet type
  const mealTemplates: Record<string, any> = {
    'low_carb': {
      breakfast: ['Scrambled eggs with spinach', 'Avocado slices', 'Greek yogurt'],
      lunch: ['Grilled chicken salad', 'Mixed greens', 'Olive oil dressing'],
      dinner: ['Baked salmon', 'Steamed broccoli', 'Cauliflower rice'],
      snacks: ['Nuts and seeds', 'Cheese cubes']
    },
    'vegetarian': {
      breakfast: ['Oatmeal with berries', 'Almond milk', 'Chia seeds'],
      lunch: ['Quinoa bowl', 'Black beans', 'Roasted vegetables'],
      dinner: ['Lentil curry', 'Brown rice', 'Naan bread'],
      snacks: ['Hummus with vegetables', 'Fruit smoothie']
    },
    'keto': {
      breakfast: ['Bacon and eggs', 'Avocado', 'Bulletproof coffee'],
      lunch: ['Caesar salad with chicken', 'Parmesan cheese', 'Olive oil'],
      dinner: ['Ribeye steak', 'Asparagus', 'Butter sauce'],
      snacks: ['Macadamia nuts', 'Cheese']
    },
    'mediterranean': {
      breakfast: ['Greek yogurt with honey', 'Walnuts', 'Fresh berries'],
      lunch: ['Mediterranean bowl', 'Chickpeas', 'Feta cheese', 'Olive oil'],
      dinner: ['Grilled fish', 'Quinoa', 'Roasted vegetables'],
      snacks: ['Olives', 'Hummus with pita']
    }
  };

  const template = mealTemplates[preferences.dietType] || mealTemplates['mediterranean'];
  
  // Calculate nutritional values based on calorie target
  const protein = Math.round(calorieTarget * 0.25 / 4); // 25% of calories from protein
  const carbs = Math.round(calorieTarget * 0.45 / 4); // 45% from carbs (adjust for low carb)
  const fats = Math.round(calorieTarget * 0.30 / 9); // 30% from fats

  const adjustedValues = preferences.dietType === 'low_carb' ? {
    protein: Math.round(calorieTarget * 0.30 / 4),
    carbs: Math.round(calorieTarget * 0.20 / 4),
    fats: Math.round(calorieTarget * 0.50 / 9)
  } : { protein, carbs, fats };

  return {
    meals: [
      {
        name: 'Breakfast',
        items: template.breakfast,
        nutritionalValues: {
          calories: Math.round(calorieTarget * 0.25),
          protein: Math.round(adjustedValues.protein * 0.25),
          carbohydrates: Math.round(adjustedValues.carbs * 0.25),
          fats: Math.round(adjustedValues.fats * 0.25)
        },
        nutritionalBenefits: 'Provides sustained energy and essential nutrients to start your day'
      },
      {
        name: 'Lunch',
        items: template.lunch,
        nutritionalValues: {
          calories: Math.round(calorieTarget * 0.35),
          protein: Math.round(adjustedValues.protein * 0.35),
          carbohydrates: Math.round(adjustedValues.carbs * 0.35),
          fats: Math.round(adjustedValues.fats * 0.35)
        },
        nutritionalBenefits: 'Balanced macronutrients to maintain energy levels throughout the afternoon'
      },
      {
        name: 'Dinner',
        items: template.dinner,
        nutritionalValues: {
          calories: Math.round(calorieTarget * 0.30),
          protein: Math.round(adjustedValues.protein * 0.30),
          carbohydrates: Math.round(adjustedValues.carbs * 0.30),
          fats: Math.round(adjustedValues.fats * 0.30)
        },
        nutritionalBenefits: 'Light yet satisfying meal to support recovery and prepare for rest'
      },
      {
        name: 'Snacks',
        items: template.snacks,
        nutritionalValues: {
          calories: Math.round(calorieTarget * 0.10),
          protein: Math.round(adjustedValues.protein * 0.10),
          carbohydrates: Math.round(adjustedValues.carbs * 0.10),
          fats: Math.round(adjustedValues.fats * 0.10)
        },
        nutritionalBenefits: 'Healthy snacks to maintain steady blood sugar and prevent overeating'
      }
    ],
    dailyTotals: {
      calories: calorieTarget,
      protein: adjustedValues.protein,
      carbohydrates: adjustedValues.carbs,
      fats: adjustedValues.fats
    },
    timestamp: new Date().toISOString(),
    planId: `mock-plan-${Date.now()}`,
    name: `${preferences.dietType} ${preferences.goals[0]} plan`
  };
};

/**
 * Enhanced meal plan generation with fallback to mock data
 */
export const generateMealPlanWithFallback = async (
  metrics: UserMetrics,
  preferences: UserPreferences,
  prompt: string,
  planType: 'daily' | 'weekly' = 'daily'
): Promise<MealPlan> => {
  try {
    // Try to generate using the API first
    return await generateMealPlan(metrics, preferences, prompt, planType);
  } catch (error) {
    console.warn('API meal plan generation failed, using mock data:', error);
    // Fallback to mock meal plan
    return generateMockMealPlan(metrics, preferences);
  }
};
