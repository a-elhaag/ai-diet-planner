import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import consts from '../const/consts';
import DayTabs from '../components/ui/DayTabs';
import MealCard from '../components/ui/MealCard';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const PlanScreen: React.FC = () => {
    const [selectedDay, setSelectedDay] = useState(0);
    const { user } = useAuth();

    // Generate meals based on user preferences
    const generateMealPlan = () => {
        // Here you would typically make an API call to your AI service
        // For now, we'll just show an alert with the user preferences
        Alert.alert(
            "Generating Meal Plan",
            `Creating a meal plan based on:\n\n` +
            `Goal: ${user?.goal}\n` +
            `Activity Level: ${user?.activityLevel}\n` +
            `Dietary Restrictions: ${user?.dietaryRestrictions.join(', ')}`
        );
    };

    // Mock meal data - in a real app, this would come from your AI service
    const weekMeals = [
        {
            breakfast: `${user?.dietaryRestrictions.includes('Vegan') ? 'Vegan yogurt' : 'Greek yogurt'} with berries and honey`,
            lunch: `${user?.dietaryRestrictions.includes('Vegetarian') ? 'Grilled tofu' : 'Grilled chicken'} salad with avocado`,
            dinner: `${user?.dietaryRestrictions.includes('Vegetarian') ? 'Grilled portobello' : 'Baked salmon'} with roasted vegetables`,
            snacks: ["Apple with almond butter", "Protein shake"]
        },
        {
            breakfast: "Overnight oats with nuts and fruits",
            lunch: "Quinoa bowl with mixed vegetables and tofu",
            dinner: `${user?.dietaryRestrictions.includes('Vegetarian') ? 'Tempeh' : 'Lean beef'} stir-fry with brown rice`,
            snacks: ["Greek yogurt", "Mixed nuts"]
        },
        {
            breakfast: `${user?.dietaryRestrictions.includes('Vegan') ? 'Tofu scramble' : 'Scrambled eggs'} with spinach`,
            lunch: `${user?.dietaryRestrictions.includes('Vegan') ? 'Chickpea salad' : 'Tuna salad'} wrap`,
            dinner: `${user?.dietaryRestrictions.includes('Vegetarian') ? 'Grilled tempeh' : 'Grilled chicken'} with sweet potatoes`,
            snacks: ["Protein bar", "Orange"]
        },
        {
            breakfast: "Protein smoothie with banana",
            lunch: "Mediterranean chickpea salad",
            dinner: `${user?.dietaryRestrictions.includes('Vegetarian') ? 'Grilled tofu' : 'Baked cod'} with roasted vegetables`,
            snacks: ["Cottage cheese with berries", "Carrot sticks"]
        },
        {
            breakfast: `${user?.dietaryRestrictions.includes('Vegan') ? 'Avocado toast' : 'Avocado toast with eggs'}`,
            lunch: `${user?.dietaryRestrictions.includes('Vegetarian') ? 'Vegetable soup' : 'Turkey and vegetable soup'}`,
            dinner: `${user?.dietaryRestrictions.includes('Vegetarian') ? 'Grilled portobello' : 'Grilled steak'} with asparagus`,
            snacks: ["Apple", "Protein balls"]
        },
        {
            breakfast: `${user?.dietaryRestrictions.includes('Vegan') ? 'Vegan pancakes' : 'Pancakes'} with maple syrup`,
            lunch: `${user?.dietaryRestrictions.includes('Vegetarian') ? 'Veggie burger' : 'Burger'} with sweet potato fries`,
            dinner: `${user?.dietaryRestrictions.includes('Vegetarian') ? 'Cauliflower crust pizza' : 'Pizza'} with side salad`,
            snacks: ["Mixed berries", "Trail mix"]
        },
        {
            breakfast: `${user?.dietaryRestrictions.includes('Vegan') ? 'Vegan french toast' : 'French toast'} with fruit`,
            lunch: "Veggie wrap with hummus",
            dinner: `${user?.dietaryRestrictions.includes('Vegetarian') ? 'Grilled tofu' : 'Grilled fish'} with roasted potatoes`,
            snacks: ["Banana", "Almonds"]
        }
    ];

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

                <MealCard meals={weekMeals[selectedDay]} />

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
    }
});

export default PlanScreen;