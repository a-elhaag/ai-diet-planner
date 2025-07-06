/**
 * User-related type definitions
 */

// Unit system for measurements
export type UnitSystem = 'metric' | 'imperial';

// Gender type
export type Gender = 'male' | 'female' | 'other';

// User metrics
export interface UserMetrics {
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  unit: UnitSystem;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

// User goals for diet planning
export type DietGoal = 
  | 'weight_loss'
  | 'maintenance' 
  | 'muscle_gain' 
  | 'general_health'
  | 'energy'
  | 'digestion'
  | 'immune_support';

// Diet types
export type DietType = 
  | 'omnivore'
  | 'vegetarian'
  | 'vegan'
  | 'pescatarian'
  | 'keto'
  | 'paleo'
  | 'mediterranean'
  | 'low_carb'
  | 'gluten_free'
  | 'dairy_free';

// User preferences
export interface UserPreferences {
  goals: DietGoal[];
  dietType: DietType;
  allergies: string[];
  dislikes: string[];
  mealCount: number;  // How many meals per day
  calorieTarget?: number;  // Optional target calories
}

// User profile
export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  metrics: UserMetrics;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}
