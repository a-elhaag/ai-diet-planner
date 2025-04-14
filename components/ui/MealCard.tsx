import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Easing,
    TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Button from './Button';
import consts from '../../const/consts';

interface MealsType {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks?: string[];
}

interface MealCardProps {
    meals?: MealsType; // Make meals optional
}

const MealCard: React.FC<MealCardProps> = ({ meals }) => {
    const [animation] = useState(new Animated.Value(0));
    const [flipped, setFlipped] = useState(false);
    const [completedMeals, setCompletedMeals] = useState<{ [key: string]: boolean }>({
        breakfast: false,
        lunch: false,
        dinner: false,
        snack1: false,
        snack2: false,
    });

    // Use default meals if none provided
    const defaultMeals = {
        breakfast: "Greek yogurt with berries",
        lunch: "Grilled chicken salad",
        dinner: "Baked salmon with vegetables",
        snacks: ["Apple with almond butter", "Protein shake"]
    };

    // Use provided meals or fallback to defaults
    const displayMeals = meals || defaultMeals;

    const flipCard = () => {
        const toValue = flipped ? 0 : 180;

        Animated.timing(animation, {
            toValue,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
        }).start(() => setFlipped(!flipped));
    };

    const frontAnimatedStyle = {
        transform: [{ perspective: 1000 }, {
            rotateY: animation.interpolate({
                inputRange: [0, 180],
                outputRange: ['0deg', '180deg'],
            })
        }],
        opacity: animation.interpolate({
            inputRange: [0, 90, 180],
            outputRange: [1, 0, 0],
        }),
    };

    const backAnimatedStyle = {
        transform: [{ perspective: 1000 }, {
            rotateY: animation.interpolate({
                inputRange: [0, 180],
                outputRange: ['180deg', '360deg'],
            })
        }],
        opacity: animation.interpolate({
            inputRange: [0, 90, 180],
            outputRange: [0, 0, 1],
        }),
    };

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
            style={styles.mealCheckItem}
            onPress={() => toggleMealComplete(mealKey)}
            activeOpacity={0.7}
        >
            <View style={[
                styles.checkbox,
                completedMeals[mealKey] && styles.checkboxChecked
            ]}>
                {completedMeals[mealKey] && (
                    <Feather name="check" size={16} color={consts.white} />
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
            <Animated.View style={[styles.card, frontAnimatedStyle]}>
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

                    {displayMeals.snacks && displayMeals.snacks.map((snack, index) => (
                        renderMealCheckItem(
                            `Snack ${index + 1}`,
                            snack,
                            `snack${index + 1}`
                        )
                    ))}
                </View>

                <Button
                    title="View Nutrition Info"
                    onPress={flipCard}
                    variant="primary"
                    size="medium"
                    fullWidth
                />
            </Animated.View>

            <Animated.View style={[styles.card, styles.backCard, backAnimatedStyle]}>
                <Text style={styles.nutritionTitle}>Nutrition Breakdown</Text>
                <View style={styles.nutritionContainer}>
                    {[
                        { label: 'Calories', value: '1,850' },
                        { label: 'Protein', value: '125g' },
                        { label: 'Carbs', value: '180g' },
                        { label: 'Fats', value: '65g' },
                        { label: 'Fiber', value: '30g' },
                    ].map((item, i) => (
                        <View key={i} style={styles.nutritionItem}>
                            <Text style={styles.nutritionValue}>{item.value}</Text>
                            <Text style={styles.nutritionLabel}>{item.label}</Text>
                        </View>
                    ))}
                </View>
                <Button
                    title="Back to Meals"
                    onPress={flipCard}
                    variant="outline"
                    size="medium"
                    fullWidth
                />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 470, // Increased height to accommodate checklist
        marginBottom: 30,
    },
    card: {
        flex: 1,
        backgroundColor: consts.white,
        borderRadius: 38,
        padding: 20,
        backfaceVisibility: 'hidden',
        elevation: 4,
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 38,
        justifyContent: 'space-between',
    },
    backCard: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    progressHeader: {
        marginBottom: 16,
    },
    progressText: {
        fontSize: 16,
        fontWeight: '700',
        color: consts.midnightBlue,
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
        backgroundColor: consts.blueGrotto,
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
        borderColor: consts.babyBlue,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: consts.blueGrotto,
        borderColor: consts.blueGrotto,
    },
    mealTextContainer: {
        flex: 1,
    },
    mealType: {
        color: consts.blueGrotto,
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
    divider: {
        height: 1,
        backgroundColor: consts.ivory,
        marginTop: 10,
    },
    nutritionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: consts.blueGrotto,
        textAlign: 'center',
        marginBottom: 12,
    },
    nutritionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    nutritionItem: {
        width: '40%',
        alignItems: 'center',
        marginVertical: 12,
    },
    nutritionValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: consts.blueGrotto,
    },
    nutritionLabel: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },
});

export default MealCard;