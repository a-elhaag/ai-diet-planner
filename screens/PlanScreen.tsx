import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import consts from '../const/consts';
import DayTabs from '../components/ui/DayTabs';
import MealCard from '../components/ui/MealCard';
import Button from '../components/ui/Button';
import { useMealPlan } from '../hooks/useMealPlan';
import { useUnit } from '../contexts/UnitContext';
import { Feather } from '@expo/vector-icons';
import { MealPlan } from '../services/mealPlanService';

// Define interface for processed meal data
interface ProcessedMealData {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string[];
}

const PlanScreen: React.FC = () => {
    const [selectedDay, setSelectedDay] = useState(0);
    const { mealPlan, planHistory, loading } = useMealPlan();
    const [viewingHistory, setViewingHistory] = useState(false);
    const [historyIndex, setHistoryIndex] = useState(0);
    const { unitSystem } = useUnit();
    
    // Days of the week for tab labels
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Convert meal plan data to format needed by MealCard
    const formatMealData = (plan: MealPlan | null): ProcessedMealData | null => {
        if (!plan) return null;
        
        // For weekly plans with weeklyPlans property
        if (plan.weeklyPlans && daysOfWeek[selectedDay]) {
            const dayKey = daysOfWeek[selectedDay].toLowerCase();
            const dayPlan = plan.weeklyPlans[dayKey];
            
            if (dayPlan) {
                return {
                    breakfast: dayPlan.breakfast?.items?.join(', ') || "No breakfast planned",
                    lunch: dayPlan.lunch?.items?.join(', ') || "No lunch planned",
                    dinner: dayPlan.dinner?.items?.join(', ') || "No dinner planned",
                    snacks: dayPlan.snacks?.map((snack: any) => snack.items?.join(', ')) || []
                };
            }
        }
        
        // For daily plans or fallback
        if (plan.meals) {
            let breakfast = "";
            let lunch = "";
            let dinner = "";
            const snacks: string[] = [];
            
            plan.meals.forEach((meal: any) => {
                if (meal.name.toLowerCase().includes('breakfast')) {
                    breakfast = meal.items.join(', ');
                } else if (meal.name.toLowerCase().includes('lunch')) {
                    lunch = meal.items.join(', ');
                } else if (meal.name.toLowerCase().includes('dinner')) {
                    dinner = meal.items.join(', ');
                } else if (meal.name.toLowerCase().includes('snack')) {
                    snacks.push(meal.items.join(', '));
                }
            });
            
            return {
                breakfast,
                lunch,
                dinner,
                snacks
            };
        }
        
        // Default fallback
        return {
            breakfast: "No current meal plan",
            lunch: "Generate a new plan from the Profile tab",
            dinner: "Or tap 'Create New Diet Plan' below",
            snacks: []
        };
    };
    
    const currentPlanData = formatMealData(viewingHistory ? planHistory[historyIndex] : mealPlan);
    
    const handleCreateNewPlan = () => {
        Alert.alert(
            'Generate New Meal Plan',
            'Go to Profile tab to generate a new personalized meal plan based on your preferences',
            [
                {
                    text: 'OK',
                    onPress: () => console.log('OK Pressed')
                }
            ]
        );
    };
    
    const handleToggleHistory = () => {
        if (planHistory.length === 0) {
            Alert.alert('No History', 'You don\'t have any previous meal plans saved.');
            return;
        }
        
        setViewingHistory(!viewingHistory);
        setHistoryIndex(0);
    };
    
    const handleHistoryNavigation = (direction: 'prev' | 'next') => {
        if (direction === 'prev' && historyIndex < planHistory.length - 1) {
            setHistoryIndex(historyIndex + 1);
        } else if (direction === 'next' && historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>
                        {viewingHistory ? 'Previous Meal Plan' : 'Current Meal Plan'}
                    </Text>
                    {planHistory.length > 0 && (
                        <TouchableOpacity 
                            style={styles.historyButton}
                            onPress={handleToggleHistory}
                        >
                            <Feather 
                                name={viewingHistory ? "clock" : "clock"} 
                                size={20} 
                                color={consts.deepGreen} 
                            />
                            <Text style={styles.historyButtonText}>
                                {viewingHistory ? 'View Current' : 'View History'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {viewingHistory && planHistory.length > 0 && (
                    <View style={styles.historyNavigation}>
                        <TouchableOpacity 
                            style={[
                                styles.historyNavButton, 
                                historyIndex >= planHistory.length - 1 && styles.disabledButton
                            ]}
                            disabled={historyIndex >= planHistory.length - 1}
                            onPress={() => handleHistoryNavigation('prev')}
                        >
                            <Feather name="chevron-left" size={20} color={consts.deepGreen} />
                            <Text style={styles.historyNavText}>Older</Text>
                        </TouchableOpacity>
                        <Text style={styles.historyIndexText}>
                            Plan {historyIndex + 1} of {planHistory.length}
                        </Text>
                        <TouchableOpacity 
                            style={[
                                styles.historyNavButton, 
                                historyIndex <= 0 && styles.disabledButton
                            ]}
                            disabled={historyIndex <= 0}
                            onPress={() => handleHistoryNavigation('next')}
                        >
                            <Text style={styles.historyNavText}>Newer</Text>
                            <Feather name="chevron-right" size={20} color={consts.deepGreen} />
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.tabsWrapper}>
                    <DayTabs
                        days={daysOfWeek}
                        selectedDay={selectedDay}
                        onSelectDay={(index) => setSelectedDay(index)}
                    />
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={consts.deepGreen} />
                        <Text style={styles.loadingText}>Loading meal plan...</Text>
                    </View>
                ) : (
                    currentPlanData && <MealCard meals={currentPlanData as any} />
                )}

                <Button
                    text="Create New Diet Plan"
                    onPress={handleCreateNewPlan}
                    variant="primary"
                    size="medium"
                    fullWidth
                />

                {/* Extra padding space to avoid navbar overlap */}
                <View style={styles.bottomSpacer} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: consts.lightPeach,
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: consts.richGray,
        flex: 1,
    },
    historyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(28, 83, 74, 0.1)',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    historyButtonText: {
        color: consts.deepGreen,
        marginLeft: 4,
        fontWeight: '500',
        fontSize: 14,
    },
    historyNavigation: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    historyNavButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    disabledButton: {
        opacity: 0.5,
    },
    historyNavText: {
        color: consts.deepGreen,
        fontSize: 14,
        fontWeight: '600',
        marginHorizontal: 4,
    },
    historyIndexText: {
        color: consts.richGray,
        fontSize: 14,
    },
    tabsWrapper: {
        marginBottom: 16,
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: consts.richGray,
        fontSize: 16,
    },
    button: {
        backgroundColor: consts.deepGreen,
        borderRadius: 30,
        padding: 16,
        alignItems: 'center',
        marginVertical: 24,
    },
    buttonText: {
        color: consts.offWhite,
        fontWeight: '600',
        fontSize: 16,
    },
    bottomSpacer: {
        height: 25,
    }
});

export default PlanScreen;