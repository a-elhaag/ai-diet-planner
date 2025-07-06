import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import consts from '../../const/consts';

interface MealsType {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks?: string[];
}

interface MealCardProps {
    meals?: MealsType;
}

const MealCard: React.FC<MealCardProps> = ({ meals }) => {
    // Dynamically create completedMeals state keys for snacks
    const snackCount = meals?.snacks?.length || 2;
    const initialCompleted: { [key: string]: boolean } = {
        breakfast: false,
        lunch: false,
        dinner: false,
    };
    for (let i = 1; i <= snackCount; i++) {
        initialCompleted[`snack${i}`] = false;
    }
    const [completedMeals, setCompletedMeals] = useState<{ [key: string]: boolean }>(initialCompleted);

    // Use default meals if none provided
    const defaultMeals = {
        breakfast: "Greek yogurt with berries",
        lunch: "Grilled chicken salad",
        dinner: "Baked salmon with vegetables",
        snacks: ["Apple with almond butter", "Protein shake"]
    };

    // Use provided meals or fallback to defaults
    const displayMeals = meals || defaultMeals;

    const toggleMealComplete = (mealKey: string) => {
        setCompletedMeals(prev => ({
            ...prev,
            [mealKey]: !prev[mealKey]
        }));
    };

    // Calculate progress percentage
    const getTotalMeals = () => {
        let count = 3; // breakfast, lunch, dinner
        if (displayMeals.snacks && displayMeals.snacks.length > 0) {
            count += displayMeals.snacks.length;
        }
        return count;
    };

    const getCompletedMeals = () => {
        return Object.values(completedMeals).filter(Boolean).length;
    };

    const progressPercentage = (getCompletedMeals() / getTotalMeals()) * 100;

    const renderMealCheckItem = (mealType: string, mealText: string, mealKey: string) => (
        <TouchableOpacity
            key={mealKey}
            style={styles.mealCheckItem}
            onPress={() => toggleMealComplete(mealKey)}
            activeOpacity={0.7}
        >
            <View style={[
                styles.checkbox,
                completedMeals[mealKey] && styles.checkboxChecked
            ]}>
                {completedMeals[mealKey] && (
                    <Feather name="check" size={16} color={consts.offWhite} />
                )}
            </View>

            <View style={styles.mealTextContainer}>
                <Text style={styles.mealType}>{mealType}</Text>
                <Text style={[
                    styles.mealDescription,
                    completedMeals[mealKey] && styles.mealCompleted
                ]}>
                    {mealText}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.contentContainer}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressText}>
                            Today's Meals {getCompletedMeals()}/{getTotalMeals()}
                        </Text>
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    { width: `${progressPercentage}%` }
                                ]}
                            />
                        </View>
                    </View>
                    <View style={styles.mealsList}>
                        {renderMealCheckItem('Breakfast', displayMeals.breakfast, 'breakfast')}
                        {renderMealCheckItem('Lunch', displayMeals.lunch, 'lunch')}
                        {renderMealCheckItem('Dinner', displayMeals.dinner, 'dinner')}
                        {displayMeals.snacks && displayMeals.snacks.map((snack, index) =>
                            renderMealCheckItem(
                                `Snack ${index + 1}`,
                                snack,
                                `snack${index + 1}`
                            )
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignSelf: 'stretch',
        marginBottom: consts.spacing.xl,
    },
    card: {
        backgroundColor: consts.offWhite,
        borderRadius: 38,
        padding: 20,
        flexDirection: 'column',
        minHeight: 320,
        maxWidth: '100%',
        ...Platform.select({
            ios: {
                shadowColor: consts.black,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 38,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    contentContainer: {
        flex: 1,
    },
    progressHeader: {
        marginBottom: 16,
    },
    progressText: {
        fontSize: 16,
        fontWeight: '700',
        color: consts.richGray,
        marginBottom: 8,
    },
    progressBar: {
        height: 6,
        backgroundColor: '#f1f5f9',
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: consts.deepGreen,
        borderRadius: 38,
    },
    mealsList: {
        marginBottom: 16,
    },
    mealCheckItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 38,
        borderWidth: 2,
        borderColor: consts.deepGreen,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: consts.deepGreen,
        borderColor: consts.deepGreen,
    },
    mealTextContainer: {
        flex: 1,
    },
    mealType: {
        color: consts.deepGreen,
        fontWeight: '700',
        fontSize: 16,
        marginBottom: 4,
    },
    mealDescription: {
        color: '#333',
        fontSize: 15,
    },
    mealCompleted: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
});

export default MealCard;