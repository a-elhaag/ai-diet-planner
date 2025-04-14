import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import consts from '../const/consts';
import DayTabs from '../components/ui/DayTabs';
import MealCard from '../components/ui/MealCard';
import Button from '../components/ui/Button';

const PlanScreen: React.FC = () => {
    const [selectedDay, setSelectedDay] = useState(0);

    // Mock meal data
    const weekMeals = [
        {
            breakfast: "Greek yogurt with berries and honey",
            lunch: "Grilled chicken salad with avocado",
            dinner: "Baked salmon with roasted vegetables"
        },
        {
            breakfast: "Overnight oats with nuts and fruits",
            lunch: "Quinoa bowl with mixed vegetables and tofu",
            dinner: "Lean beef stir-fry with brown rice"
        },
        {
            breakfast: "Scrambled eggs with spinach",
            lunch: "Tuna salad wrap",
            dinner: "Grilled chicken with sweet potatoes"
        },
        {
            breakfast: "Protein smoothie with banana",
            lunch: "Mediterranean chickpea salad",
            dinner: "Baked cod with roasted vegetables"
        },
        {
            breakfast: "Avocado toast with eggs",
            lunch: "Turkey and vegetable soup",
            dinner: "Grilled steak with asparagus"
        },
        {
            breakfast: "Pancakes with maple syrup",
            lunch: "Burger with sweet potato fries",
            dinner: "Pizza with side salad"
        },
        {
            breakfast: "French toast with fruit",
            lunch: "Veggie wrap with hummus",
            dinner: "Grilled fish with roasted potatoes"
        }
    ];

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.header}>Weekly Meal Plan</Text>

                <View style={styles.tabsWrapper}>
                    <DayTabs
                        days={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                        selectedDay={selectedDay}
                        onSelectDay={(index) => setSelectedDay(index)}
                    />
                </View>

                <MealCard meals={weekMeals[selectedDay]} />

                <Button
                    title="Create New Diet Plan"
                    onPress={() => console.log('new diet plan created')}
                    variant="primary"
                    size="medium"
                    fullWidth
                />


            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: consts.ivory,
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: consts.midnightBlue,
        marginBottom: 20,
    },
    tabsWrapper: {
        marginBottom: 16,
    },
    button: {
        backgroundColor: consts.blueGrotto,
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginVertical: 24,
    },
    buttonText: {
        color: consts.white,
        fontWeight: '600',
        fontSize: 16,
    }
});

export default PlanScreen;