import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import consts from '../const/consts';
import DayTabs from '../components/ui/DayTabs';
import MealCard from '../components/ui/MealCard';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';


// Detailed mock meal data for demo
const MOCK_WEEK_MEALS = [
  {
    breakfast: {
      name: 'Greek Yogurt Parfait',
      ingredients: ['1 cup Greek yogurt', '1/2 cup mixed berries', '1 tbsp honey'],
      preparation: 'Layer yogurt, berries, and honey in a glass.',
      nutrition: { calories: 250, protein: 15, carbs: 30, fats: 8 }
    },
    lunch: {
      name: 'Grilled Chicken Salad',
      ingredients: ['150g chicken breast', '2 cups mixed greens', '1/2 avocado', '1 tbsp olive oil'],
      preparation: 'Grill chicken, slice and toss with greens, avocado, and dressing.',
      nutrition: { calories: 400, protein: 35, carbs: 10, fats: 20 }
    },
    dinner: {
      name: 'Baked Salmon with Veggies',
      ingredients: ['200g salmon fillet', '1 cup broccoli', '1/2 cup carrots'],
      preparation: 'Bake salmon and veggies at 200°C for 20 minutes.',
      nutrition: { calories: 450, protein: 40, carbs: 15, fats: 25 }
    },
    snacks: [
      {
        name: 'Apple & Almond Butter',
        ingredients: ['1 apple', '2 tbsp almond butter'],
        preparation: 'Slice apple and serve with almond butter.',
        nutrition: { calories: 180, protein: 4, carbs: 22, fats: 9 }
      },
      {
        name: 'Protein Shake',
        ingredients: ['1 scoop whey protein', '250ml almond milk'],
        preparation: 'Blend ingredients until smooth.',
        nutrition: { calories: 200, protein: 25, carbs: 8, fats: 5 }
      }
    ]
  },
  {
    breakfast: {
      name: 'Overnight Oats',
      ingredients: ['1/2 cup rolled oats', '1 cup almond milk', '1/2 banana', '1 tbsp chia seeds'],
      preparation: 'Mix ingredients in a jar and refrigerate overnight.',
      nutrition: { calories: 300, protein: 10, carbs: 50, fats: 8 }
    },
    lunch: {
      name: 'Quinoa Bowl',
      ingredients: ['1 cup cooked quinoa', '1/2 cup black beans', '1/2 avocado', 'Salsa'],
      preparation: 'Combine all ingredients in a bowl.',
      nutrition: { calories: 350, protein: 12, carbs: 60, fats: 10 }
    },
    dinner: {
      name: 'Beef Stir-fry',
      ingredients: ['200g beef strips', '2 cups mixed vegetables', '2 tbsp soy sauce'],
      preparation: 'Stir-fry beef and vegetables, add soy sauce to taste.',
      nutrition: { calories: 500, protein: 40, carbs: 20, fats: 30 }
    },
    snacks: [
      {
        name: 'Greek Yogurt',
        ingredients: ['1 cup Greek yogurt'],
        preparation: 'Serve Greek yogurt plain or with honey.',
        nutrition: { calories: 100, protein: 10, carbs: 15, fats: 0 }
      },
      {
        name: 'Mixed Nuts',
        ingredients: ['30g mixed nuts'],
        preparation: 'Serve mixed nuts as a snack.',
        nutrition: { calories: 200, protein: 5, carbs: 10, fats: 18 }
      }
    ]
  },
  {
    breakfast: {
      name: 'Scrambled Eggs with Spinach',
      ingredients: ['3 eggs', '1 cup spinach', 'Salt and pepper'],
      preparation: 'Scramble eggs, add spinach, and cook until wilted.',
      nutrition: { calories: 220, protein: 18, carbs: 2, fats: 15 }
    },
    lunch: {
      name: 'Tuna Wrap',
      ingredients: ['1 can tuna', '1 whole wheat wrap', 'Lettuce', 'Tomato', 'Cucumber'],
      preparation: 'Mix tuna with chopped veggies, wrap in a tortilla.',
      nutrition: { calories: 350, protein: 30, carbs: 40, fats: 10 }
    },
    dinner: {
      name: 'Grilled Chicken with Sweet Potatoes',
      ingredients: ['200g chicken breast', '1 sweet potato', 'Olive oil', 'Rosemary'],
      preparation: 'Grill chicken, roast sweet potatoes with olive oil and rosemary.',
      nutrition: { calories: 500, protein: 45, carbs: 50, fats: 15 }
    },
    snacks: [
      {
        name: 'Protein Bar',
        ingredients: ['1 protein bar'],
        preparation: 'Consume as a quick snack.',
        nutrition: { calories: 200, protein: 20, carbs: 25, fats: 5 }
      },
      {
        name: 'Orange',
        ingredients: ['1 orange'],
        preparation: 'Peel and eat the orange.',
        nutrition: { calories: 80, protein: 2, carbs: 20, fats: 0 }
      }
    ]
  },
  {
    breakfast: {
      name: 'Protein Smoothie',
      ingredients: ['1 scoop protein powder', '1 banana', '250ml almond milk', '1 tbsp peanut butter'],
      preparation: 'Blend all ingredients until smooth.',
      nutrition: { calories: 350, protein: 30, carbs: 40, fats: 10 }
    },
    lunch: {
      name: 'Chickpea Salad',
      ingredients: ['1 cup chickpeas', '1/2 cucumber', '1/2 bell pepper', '2 tbsp olive oil', 'Lemon juice'],
      preparation: 'Mix all ingredients in a bowl.',
      nutrition: { calories: 300, protein: 10, carbs: 40, fats: 12 }
    },
    dinner: {
      name: 'Baked Cod with Veggies',
      ingredients: ['200g cod fillet', '1 cup zucchini', '1/2 cup cherry tomatoes'],
      preparation: 'Bake cod and veggies at 200°C for 25 minutes.',
      nutrition: { calories: 400, protein: 35, carbs: 15, fats: 20 }
    },
    snacks: [
      {
        name: 'Cottage Cheese',
        ingredients: ['1 cup cottage cheese'],
        preparation: 'Serve cottage cheese plain or with fruit.',
        nutrition: { calories: 200, protein: 28, carbs: 6, fats: 10 }
      },
      {
        name: 'Carrot Sticks',
        ingredients: ['2 carrots'],
        preparation: 'Cut carrots into sticks and serve raw.',
        nutrition: { calories: 50, protein: 1, carbs: 12, fats: 0 }
      }
    ]
  },
  {
    breakfast: {
      name: 'Avocado Toast',
      ingredients: ['2 slices whole grain bread', '1 avocado', 'Salt', 'Pepper', 'Lemon juice'],
      preparation: 'Mash avocado, spread on toast, and season.',
      nutrition: { calories: 300, protein: 8, carbs: 40, fats: 15 }
    },
    lunch: {
      name: 'Turkey Soup',
      ingredients: ['200g ground turkey', '1 cup mixed vegetables', '4 cups chicken broth'],
      preparation: 'Cook turkey and vegetables in broth until done.',
      nutrition: { calories: 350, protein: 30, carbs: 20, fats: 15 }
    },
    dinner: {
      name: 'Grilled Steak with Asparagus',
      ingredients: ['200g steak', '1 bunch asparagus', 'Olive oil', 'Garlic'],
      preparation: 'Grill steak and asparagus, season with garlic and oil.',
      nutrition: { calories: 500, protein: 50, carbs: 10, fats: 30 }
    },
    snacks: [
      {
        name: 'Apple',
        ingredients: ['1 apple'],
        preparation: 'Wash and slice the apple.',
        nutrition: { calories: 95, protein: 0, carbs: 25, fats: 0 }
      },
      {
        name: 'Protein Balls',
        ingredients: ['1 cup oats', '1/2 cup peanut butter', '1/4 cup honey', '1/4 cup chocolate chips'],
        preparation: 'Mix ingredients, roll into balls, and refrigerate.',
        nutrition: { calories: 150, protein: 5, carbs: 20, fats: 7 }
      }
    ]
  },
  {
    breakfast: {
      name: 'Pancakes with Syrup',
      ingredients: ['1 cup flour', '2 eggs', '1 cup milk', 'Maple syrup'],
      preparation: 'Mix ingredients, cook on griddle, and serve with syrup.',
      nutrition: { calories: 350, protein: 10, carbs: 60, fats: 8 }
    },
    lunch: {
      name: 'Burger and Fries',
      ingredients: ['1 beef patty', '1 bun', 'Lettuce', 'Tomato', 'Fries'],
      preparation: 'Cook burger, assemble with veggies, and serve with fries.',
      nutrition: { calories: 800, protein: 40, carbs: 50, fats: 45 }
    },
    dinner: {
      name: 'Pizza with Side Salad',
      ingredients: ['1 pizza base', 'Tomato sauce', 'Cheese', 'Pepperoni', 'Mixed greens', 'Vinaigrette'],
      preparation: 'Top pizza base with ingredients and bake. Serve salad on the side.',
      nutrition: { calories: 600, protein: 25, carbs: 70, fats: 25 }
    },
    snacks: [
      {
        name: 'Mixed Berries',
        ingredients: ['1/2 cup strawberries', '1/2 cup blueberries'],
        preparation: 'Mix berries in a bowl.',
        nutrition: { calories: 70, protein: 1, carbs: 17, fats: 0 }
      },
      {
        name: 'Trail Mix',
        ingredients: ['1/4 cup nuts', '1/4 cup dried fruit', '1/4 cup chocolate chips'],
        preparation: 'Mix ingredients in a bowl.',
        nutrition: { calories: 200, protein: 5, carbs: 30, fats: 10 }
      }
    ]
  },
  {
    breakfast: {
      name: 'French Toast',
      ingredients: ['2 slices bread', '2 eggs', '1/2 cup milk', 'Syrup'],
      preparation: 'Dip bread in egg mixture, cook on griddle, and serve with syrup.',
      nutrition: { calories: 300, protein: 10, carbs: 40, fats: 10 }
    },
    lunch: {
      name: 'Veggie Wrap',
      ingredients: ['1 wrap', 'Hummus', 'Cucumber', 'Bell pepper', 'Spinach'],
      preparation: 'Spread hummus on wrap, add veggies, and roll up.',
      nutrition: { calories: 250, protein: 8, carbs: 35, fats: 10 }
    },
    dinner: {
      name: 'Grilled Fish with Potatoes',
      ingredients: ['200g fish fillet', '1 cup potatoes', 'Olive oil', 'Lemon'],
      preparation: 'Grill fish, boil potatoes, and serve with lemon.',
      nutrition: { calories: 400, protein: 35, carbs: 45, fats: 10 }
    },
    snacks: [
      {
        name: 'Banana',
        ingredients: ['1 banana'],
        preparation: 'Peel and eat the banana.',
        nutrition: { calories: 105, protein: 1, carbs: 27, fats: 0 }
      },
      {
        name: 'Almonds',
        ingredients: ['30g almonds'],
        preparation: 'Serve almonds as a snack.',
        nutrition: { calories: 170, protein: 6, carbs: 6, fats: 15 }
      }
    ]
  }
];

// Function to shuffle array elements
const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Function to create a new shuffled week of meals
const generateShuffledMeals = () => {
    return shuffleArray(MOCK_WEEK_MEALS);
};

const PlanScreen: React.FC = () => {
    const [selectedDay, setSelectedDay] = useState(0);
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [weekMeals, setWeekMeals] = useState(MOCK_WEEK_MEALS);

    // Function to shuffle meal plans for the week
    const shuffleMealPlans = () => {
        // Create a copy of the meal plans
        const mealsCopy = [...MOCK_WEEK_MEALS];
        
        // Shuffle the array using Fisher-Yates algorithm
        for (let i = mealsCopy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [mealsCopy[i], mealsCopy[j]] = [mealsCopy[j], mealsCopy[i]];
        }
        
        return mealsCopy;
    };

    const generateMealPlan = () => {
        setLoading(true);
        // Simulate AI thinking
        setTimeout(() => {
            setLoading(false);
            setWeekMeals(shuffleMealPlans());
        }, 2000);
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>Weekly Meal Plan</Text>
                    <Text style={styles.subheader}>
                        Based on your {user?.goal.toLowerCase()} goal
                    </Text>
                </View>

                <View style={styles.tabsWrapper}>
                    <DayTabs
                        days={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                        selectedDay={selectedDay}
                        onSelectDay={(index) => setSelectedDay(index)}
                    />
                </View>

                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={consts.blueGrotto} />
                        <Text style={styles.loaderText}>AI is thinking...
                        Generating your meal plan now</Text>
                    </View>
                ) : (
                    <MealCard meals={weekMeals[selectedDay]} />
                )}

                <View style={styles.buttonContainer}>
                    <Button
                        title="Generate New Meal Plan"
                        onPress={generateMealPlan}
                        variant="primary"
                        size="medium"
                        fullWidth
                    />
                </View>

                {/* Extra padding space to avoid navbar overlap */}
                <View style={{ height: consts.platform.contentPadding }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: consts.white,
    },
    scrollView: {
        flex: 1,
        padding: consts.spacing.lg,
    },
    headerContainer: {
        marginBottom: consts.spacing.lg,
    },
    header: {
        fontSize: consts.font.xxlarge,
        fontWeight: 'bold',
        color: consts.midnightBlue,
        marginBottom: consts.spacing.xs,
    },
    subheader: {
        fontSize: consts.font.medium,
        color: consts.blueGrotto,
    },
    tabsWrapper: {
        marginBottom: consts.spacing.lg,
    },
    buttonContainer: {
        marginTop: consts.spacing.xl,
        marginBottom: consts.spacing.lg,
    },
    loaderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: consts.spacing.xl,
        marginTop: consts.spacing.lg,
    },
    loaderText: {
        fontSize: consts.font.medium,
        color: consts.blueGrotto,
        marginTop: consts.spacing.md,
        textAlign: 'center',
    },
    errorContainer: {
        backgroundColor: consts.ivory,
        padding: consts.spacing.lg,
        borderRadius: consts.radius,
        marginVertical: consts.spacing.lg,
    },
    errorText: {
        color: '#ff4444',
        fontSize: consts.font.medium,
        textAlign: 'center',
    }
});

export default PlanScreen;