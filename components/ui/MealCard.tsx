import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Easing,
    TouchableOpacity,
    Platform,
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

    const flipCard = () => {
        const toValue = flipped ? 0 : 180;
        Animated.timing(animation, {
            toValue,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
        }).start(() => setFlipped(!flipped));
    };

    // Interpolate rotation for front and back
    const frontInterpolate = animation.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });
    const backInterpolate = animation.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });
    // Opacity for pointer events
    const frontOpacity = animation.interpolate({
        inputRange: [0, 90, 180],
        outputRange: [1, 0, 0],
    });
    const backOpacity = animation.interpolate({
        inputRange: [0, 90, 180],
        outputRange: [0, 0, 1],
    });

    // Android shadow flip: only show shadow on the visible side
    const frontShadowStyle = Platform.OS === 'android' ? {
        elevation: 4,
        shadowColor: consts.black,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 38,
    } : {};
    const backShadowStyle = Platform.OS === 'android' ? {
        elevation: 0,
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
    } : {};

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
            <Animated.View
                style={[styles.card, frontShadowStyle, { transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }] }]}
                pointerEvents={flipped ? 'none' : 'auto'}
            >
                <Animated.View style={{ opacity: frontOpacity, flex: 1 }}>
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
                            {displayMeals.snacks && displayMeals.snacks.map((snack, index) => (
                                renderMealCheckItem(
                                    `Snack ${index + 1}`,
                                    snack,
                                    `snack${index + 1}`
                                )
                            ))}
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button
                            title="View Nutrition Info"
                            onPress={flipCard}
                            variant="primary"
                            size="medium"
                            fullWidth
                        />
                    </View>
                </Animated.View>
            </Animated.View>
            <Animated.View
                style={[styles.card, styles.backCard, backShadowStyle, { transform: [{ perspective: 1000 }, { rotateY: backInterpolate }] }]}
                pointerEvents={flipped ? 'auto' : 'none'}
            >
                <Animated.View style={{ opacity: backOpacity, flex: 1 }}>
                    <View style={styles.contentContainer}>
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
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button
                            title="Back to Meals"
                            onPress={flipCard}
                            variant="outline"
                            size="medium"
                            fullWidth
                        />
                    </View>
                </Animated.View>
            </Animated.View>
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
        backgroundColor: consts.white,
        borderRadius: 38,
        padding: 20,
        backfaceVisibility: 'hidden',
        elevation: 4,
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 38,
        flexDirection: 'column',
        minHeight: 320,
        maxWidth: '100%',
    },
    contentContainer: {
        flex: 1,
    },
    buttonContainer: {
        paddingTop: 16,
        marginTop: 'auto',
    },
    backCard: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        ...Platform.select({
            android: {
                shadowOffset: { width: -2, height: 2 }, // Flip shadow horizontally
                elevation: 2, // Slightly different elevation for effect
            },
        }),
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