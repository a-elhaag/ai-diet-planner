import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Easing,
} from 'react-native';
import Button from './Button';
import colors from '../../theme/const';

interface MealsType {
    breakfast: string;
    lunch: string;
    dinner: string;
}

interface MealCardProps {
    meals?: MealsType; // Make meals optional
}

const MealCard: React.FC<MealCardProps> = ({ meals }) => {
    const [animation] = useState(new Animated.Value(0));
    const [flipped, setFlipped] = useState(false);

    // Use default meals if none provided
    const defaultMeals = {
        breakfast: "Greek yogurt with berries",
        lunch: "Grilled chicken salad",
        dinner: "Baked salmon with vegetables"
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

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.card, frontAnimatedStyle]}>
                {['breakfast', 'lunch', 'dinner'].map((mealType, index) => (
                    <View key={mealType} style={styles.mealSection}>
                        <Text style={styles.mealType}>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</Text>
                        <Text style={styles.mealDescription}>{displayMeals[mealType as keyof MealsType]}</Text>
                        {index < 2 && <View style={styles.divider} />}
                    </View>
                ))}
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
        height: 360,
        marginBottom: 30,
    },
    card: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 20,
        backfaceVisibility: 'hidden',
        elevation: 4,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        justifyContent: 'space-between',
    },
    backCard: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    mealSection: {
        marginBottom: 10,
    },
    mealType: {
        color: colors.blueGrotto,
        fontWeight: '700',
        fontSize: 16,
        marginBottom: 4,
    },
    mealDescription: {
        color: '#333',
        fontSize: 15,
    },
    divider: {
        height: 1,
        backgroundColor: colors.ivory,
        marginTop: 10,
    },
    nutritionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.blueGrotto,
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
        color: colors.blueGrotto,
    },
    nutritionLabel: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },
});

export default MealCard;