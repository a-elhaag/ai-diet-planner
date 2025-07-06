import * as SQLite from 'expo-sqlite';
import { UserPreferences, UserMetrics } from '../types/user';
import { MealPlan } from './mealPlanService';

// Open database
const db = SQLite.openDatabaseSync('ai_diet_planner.db');

// Database schema
export interface DatabaseUser {
  id: number;
  name: string;
  email?: string;
  metrics: string; // JSON string of UserMetrics
  preferences: string; // JSON string of UserPreferences
  created_at: string;
  updated_at: string;
}

export interface DatabaseMealPlan {
  id: number;
  user_id: number;
  plan_data: string; // JSON string of MealPlan
  plan_type: 'daily' | 'weekly';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseMealLog {
  id: number;
  user_id: number;
  meal_name: string;
  meal_category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  date: string;
  created_at: string;
}

export interface DatabaseHydration {
  id: number;
  user_id: number;
  glasses: number;
  target: number;
  date: string;
  created_at: string;
}

export interface DatabaseChatMessage {
  id: number;
  user_id: number;
  message: string;
  is_user: boolean;
  created_at: string;
}

export interface DatabaseUserProgress {
  id: number;
  user_id: number;
  points: number;
  streaks_current: number;
  streaks_longest: number;
  badges: string; // JSON array of badge names
  updated_at: string;
}

class DatabaseService {
  private initialized = false;

  constructor() {
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    try {
      // Users table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT,
          metrics TEXT NOT NULL,
          preferences TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Meal plans table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS meal_plans (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          plan_data TEXT NOT NULL,
          plan_type TEXT CHECK(plan_type IN ('daily', 'weekly')) NOT NULL,
          is_active BOOLEAN DEFAULT FALSE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        );
      `);

      // Meal logs table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS meal_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          meal_name TEXT NOT NULL,
          meal_category TEXT CHECK(meal_category IN ('breakfast', 'lunch', 'dinner', 'snack')) NOT NULL,
          calories INTEGER NOT NULL,
          date DATE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        );
      `);

      // Hydration tracking table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS hydration_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          glasses INTEGER NOT NULL,
          target INTEGER NOT NULL,
          date DATE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        );
      `);

      // Chat messages table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS chat_messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          message TEXT NOT NULL,
          is_user BOOLEAN NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        );
      `);

      // User progress table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS user_progress (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL UNIQUE,
          points INTEGER DEFAULT 0,
          streaks_current INTEGER DEFAULT 0,
          streaks_longest INTEGER DEFAULT 0,
          badges TEXT DEFAULT '[]',
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        );
      `);

      this.initialized = true;
    } catch (error) {
      console.error('Database initialization failed:', error);
    }
  }

  // User operations
  async createUser(name: string, metrics: UserMetrics, preferences: UserPreferences, email?: string): Promise<number> {
    try {
      const result = db.runSync(
        'INSERT INTO users (name, email, metrics, preferences) VALUES (?, ?, ?, ?)',
        [name, email || '', JSON.stringify(metrics), JSON.stringify(preferences)]
      );
      
      const userId = result.lastInsertRowId;
      // Initialize user progress
      db.runSync('INSERT INTO user_progress (user_id) VALUES (?)', [userId]);
      
      return userId;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUser(userId: number): Promise<DatabaseUser | null> {
    try {
      const result = db.getFirstSync<DatabaseUser>('SELECT * FROM users WHERE id = ?', [userId]);
      return result || null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async updateUser(userId: number, updates: Partial<Pick<DatabaseUser, 'name' | 'email' | 'metrics' | 'preferences'>>): Promise<void> {
    try {
      const fields = Object.keys(updates);
      const values = fields.map(field => {
        const value = updates[field as keyof typeof updates];
        return value === undefined ? null : value;
      });
      
      if (fields.length > 0) {
        db.runSync(
          `UPDATE users SET ${fields.map(f => `${f} = ?`).join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [...values, userId]
        );
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Meal plan operations
  async saveMealPlan(userId: number, mealPlan: MealPlan, planType: 'daily' | 'weekly' = 'weekly'): Promise<number> {
    try {
      // First, deactivate all existing plans
      db.runSync('UPDATE meal_plans SET is_active = FALSE WHERE user_id = ?', [userId]);
      
      // Then insert the new active plan
      const result = db.runSync(
        'INSERT INTO meal_plans (user_id, plan_data, plan_type, is_active) VALUES (?, ?, ?, TRUE)',
        [userId, JSON.stringify(mealPlan), planType]
      );
      
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error saving meal plan:', error);
      throw error;
    }
  }

  async getActiveMealPlan(userId: number): Promise<MealPlan | null> {
    try {
      const result = db.getFirstSync<{plan_data: string}>(
        'SELECT plan_data FROM meal_plans WHERE user_id = ? AND is_active = TRUE ORDER BY created_at DESC LIMIT 1',
        [userId]
      );
      
      return result ? JSON.parse(result.plan_data) : null;
    } catch (error) {
      console.error('Error getting active meal plan:', error);
      return null;
    }
  }

  async getMealPlanHistory(userId: number, limit: number = 10): Promise<MealPlan[]> {
    try {
      const results = db.getAllSync<{plan_data: string}>(
        'SELECT plan_data FROM meal_plans WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
        [userId, limit]
      );
      
      return results.map(row => JSON.parse(row.plan_data));
    } catch (error) {
      console.error('Error getting meal plan history:', error);
      return [];
    }
  }

  // Meal logging operations
  async logMeal(userId: number, mealName: string, category: 'breakfast' | 'lunch' | 'dinner' | 'snack', calories: number, date?: string): Promise<number> {
    try {
      const logDate = date || new Date().toISOString().split('T')[0];
      
      const result = db.runSync(
        'INSERT INTO meal_logs (user_id, meal_name, meal_category, calories, date) VALUES (?, ?, ?, ?, ?)',
        [userId, mealName, category, calories, logDate]
      );
      
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error logging meal:', error);
      throw error;
    }
  }

  async getMealsForDate(userId: number, date?: string): Promise<DatabaseMealLog[]> {
    try {
      const searchDate = date || new Date().toISOString().split('T')[0];
      
      const results = db.getAllSync<DatabaseMealLog>(
        'SELECT * FROM meal_logs WHERE user_id = ? AND date = ? ORDER BY created_at ASC',
        [userId, searchDate]
      );
      
      return results;
    } catch (error) {
      console.error('Error getting meals for date:', error);
      return [];
    }
  }

  // Hydration tracking
  async updateHydration(userId: number, glasses: number, target: number = 8, date?: string): Promise<void> {
    try {
      const logDate = date || new Date().toISOString().split('T')[0];
      
      // Check if entry exists for today
      const existing = db.getFirstSync<{id: number}>(
        'SELECT id FROM hydration_logs WHERE user_id = ? AND date = ?',
        [userId, logDate]
      );
      
      if (existing) {
        // Update existing entry
        db.runSync(
          'UPDATE hydration_logs SET glasses = ?, target = ? WHERE user_id = ? AND date = ?',
          [glasses, target, userId, logDate]
        );
      } else {
        // Create new entry
        db.runSync(
          'INSERT INTO hydration_logs (user_id, glasses, target, date) VALUES (?, ?, ?, ?)',
          [userId, glasses, target, logDate]
        );
      }
    } catch (error) {
      console.error('Error updating hydration:', error);
      throw error;
    }
  }

  async getHydrationForDate(userId: number, date?: string): Promise<{ glasses: number; target: number } | null> {
    try {
      const searchDate = date || new Date().toISOString().split('T')[0];
      
      const result = db.getFirstSync<{glasses: number; target: number}>(
        'SELECT glasses, target FROM hydration_logs WHERE user_id = ? AND date = ? ORDER BY created_at DESC LIMIT 1',
        [userId, searchDate]
      );
      
      return result || null;
    } catch (error) {
      console.error('Error getting hydration for date:', error);
      return null;
    }
  }

  // Chat operations
  async saveChatMessage(userId: number, message: string, isUser: boolean): Promise<number> {
    try {
      const result = db.runSync(
        'INSERT INTO chat_messages (user_id, message, is_user) VALUES (?, ?, ?)',
        [userId, message, isUser]
      );
      
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error saving chat message:', error);
      throw error;
    }
  }

  async getChatHistory(userId: number, limit: number = 50): Promise<DatabaseChatMessage[]> {
    try {
      const results = db.getAllSync<DatabaseChatMessage>(
        'SELECT * FROM chat_messages WHERE user_id = ? ORDER BY created_at ASC LIMIT ?',
        [userId, limit]
      );
      
      return results;
    } catch (error) {
      console.error('Error getting chat history:', error);
      return [];
    }
  }

  // User progress operations
  async getUserProgress(userId: number): Promise<DatabaseUserProgress | null> {
    try {
      const result = db.getFirstSync<DatabaseUserProgress>(
        'SELECT * FROM user_progress WHERE user_id = ?',
        [userId]
      );
      
      return result || null;
    } catch (error) {
      console.error('Error getting user progress:', error);
      return null;
    }
  }

  async updateUserProgress(userId: number, updates: Partial<Pick<DatabaseUserProgress, 'points' | 'streaks_current' | 'streaks_longest' | 'badges'>>): Promise<void> {
    try {
      const fields = Object.keys(updates);
      const values = fields.map(field => {
        const value = updates[field as keyof typeof updates];
        return value === undefined ? null : value;
      });
      
      if (fields.length > 0) {
        db.runSync(
          `UPDATE user_progress SET ${fields.map(f => `${f} = ?`).join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
          [...values, userId]
        );
      }
    } catch (error) {
      console.error('Error updating user progress:', error);
      throw error;
    }
  }

  async addPoints(userId: number, points: number): Promise<void> {
    try {
      db.runSync(
        'UPDATE user_progress SET points = points + ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
        [points, userId]
      );
    } catch (error) {
      console.error('Error adding points:', error);
      throw error;
    }
  }

  async addBadge(userId: number, badgeName: string): Promise<void> {
    try {
      const result = db.getFirstSync<{badges: string}>(
        'SELECT badges FROM user_progress WHERE user_id = ?',
        [userId]
      );
      
      if (result) {
        const currentBadges = JSON.parse(result.badges);
        if (!currentBadges.includes(badgeName)) {
          currentBadges.push(badgeName);
          db.runSync(
            'UPDATE user_progress SET badges = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
            [JSON.stringify(currentBadges), userId]
          );
        }
      }
    } catch (error) {
      console.error('Error adding badge:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();
