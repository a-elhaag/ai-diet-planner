import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import DayTabs from '../components/ui/DayTabs';
import MealCard from '../components/ui/MealCard';
import StatsTipsTab from '../components/ui/StatsTipsTab';
import Button from '../components/ui/Button';
import colors from '../theme/const';

const HomeScreen: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<'meals' | 'stats'>('meals');
    const [selectedDay, setSelectedDay] = useState(0);
    const [activeStatsTab, setActiveStatsTab] = useState<'stats' | 'tips'>('stats');

    // Mock meal data - ensure all 6 days are populated
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
        }
    ];

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.tabsWrapper}>
                    {selectedTab === 'meals' && (
                        <DayTabs
                            days={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']}
                            selectedDay={selectedDay}
                            onSelectDay={(index) => setSelectedDay(index)}
                        />
                    )}
                </View>

                {selectedTab === 'meals' ? (
                    <MealCard meals={weekMeals[selectedDay]} />
                ) : (
                    <StatsTipsTab
                        activeTab={activeStatsTab}
                        setActiveTab={(tab) => setActiveStatsTab(tab as 'stats' | 'tips')}
                    />
                )}

                <View style={styles.buttonsContainer}>
                    <Button
                        title={selectedTab === 'meals' ? "View Stats" : "View Meals"}
                        onPress={() => setSelectedTab(selectedTab === 'meals' ? 'stats' : 'meals')}
                        variant="primary"
                        size="medium"
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.ivory,
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    tabsWrapper: {
        marginBottom: 16,
    },
    buttonsContainer: {
        marginTop: 20,
        marginBottom: 40,
    }
});

export default HomeScreen;
