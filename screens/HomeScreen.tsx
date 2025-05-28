import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Dimensions
} from 'react-native';
import DayTabs from '../components/ui/DayTabs';
import MealCard from '../components/ui/MealCard';
import Button from '../components/ui/Button';
import { Feather } from '@expo/vector-icons';
import consts from '../const/consts';
import { useAuth } from '../contexts/AuthContext';
import { useUnit } from '../contexts/UnitContext';
import { useWater } from '../contexts/WaterContext';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
    const { user } = useAuth();
    const { formatWeight } = useUnit();
    const { waterGlasses, totalGlasses, addWaterGlass, removeWaterGlass } = useWater();
    const [selectedDay, setSelectedDay] = useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const weekMeals = [
        {
            breakfast: "Greek yogurt with berries and honey",
            lunch: "Grilled chicken salad with avocado",
            dinner: "Baked salmon with roasted vegetables",
            snacks: ["Apple with almond butter", "Protein shake"]
        },
        {
            breakfast: "Overnight oats with nuts and fruits",
            lunch: "Quinoa bowl with mixed vegetables and tofu",
            dinner: "Lean beef stir-fry with brown rice",
            snacks: ["Greek yogurt", "Mixed nuts"]
        },
        {
            breakfast: "Scrambled eggs with spinach",
            lunch: "Tuna salad wrap",
            dinner: "Grilled chicken with sweet potatoes",
            snacks: ["Protein bar", "Orange"]
        },
        {
            breakfast: "Protein smoothie with banana",
            lunch: "Mediterranean chickpea salad",
            dinner: "Baked cod with roasted vegetables",
            snacks: ["Cottage cheese with berries", "Carrot sticks"]
        },
        {
            breakfast: "Avocado toast with eggs",
            lunch: "Turkey and vegetable soup",
            dinner: "Grilled steak with asparagus",
            snacks: ["Apple", "Protein balls"]
        },
        {
            breakfast: "Pancakes with maple syrup",
            lunch: "Burger with sweet potato fries",
            dinner: "Pizza with side salad",
            snacks: ["Ice cream", "Popcorn"]
        },
        {
            breakfast: "French toast with fruit compote",
            lunch: "Pasta with tomato sauce",
            dinner: "Grilled fish with roasted potatoes",
            snacks: ["Yogurt parfait", "Dark chocolate"]
        }
    ];

    const nutritionSummary = {
        calories: 1850,
        protein: 120,
        carbs: 180,
        fat: 65
    };

    const handleDaySelect = (index: number) => {
        fadeAnim.setValue(0);
        slideAnim.setValue(20);

        setSelectedDay(index);

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.headerContent}>
                <View>
                    <Text style={styles.greeting}>Hello,</Text>
                    <Text style={styles.userName}>{user?.name || 'User'}</Text>
                </View>
                <View style={styles.statsPreview}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{formatWeight(user?.weight || 0)}</Text>
                        <Text style={styles.statLabel}>Current Weight</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{user?.goal}</Text>
                        <Text style={styles.statLabel}>Goal</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderNutritionSummary = () => (
        <Animated.View
            style={[
                styles.nutritionCard,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
        >
            <Text style={styles.nutritionTitle}>Today's Nutrition</Text>
            <View style={styles.macrosContainer}>
                <View style={styles.macroItem}>
                    <Text style={styles.macroValue}>{nutritionSummary.calories}</Text>
                    <Text style={styles.macroLabel}>Calories</Text>
                </View>
                <View style={styles.macroItem}>
                    <Text style={styles.macroValue}>{nutritionSummary.protein}g</Text>
                    <Text style={styles.macroLabel}>Protein</Text>
                </View>
                <View style={styles.macroItem}>
                    <Text style={styles.macroValue}>{nutritionSummary.carbs}g</Text>
                    <Text style={styles.macroLabel}>Carbs</Text>
                </View>
                <View style={styles.macroItem}>
                    <Text style={styles.macroValue}>{nutritionSummary.fat}g</Text>
                    <Text style={styles.macroLabel}>Fat</Text>
                </View>
            </View>
        </Animated.View>
    );

    const renderWaterIntake = () => (
        <Animated.View
            style={[
                styles.waterCard,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
        >
            <View style={styles.waterHeader}>
                <Text style={styles.waterTitle}>Water Intake</Text>
                <Text style={styles.waterAmount}>{waterGlasses} / {totalGlasses} glasses</Text>
            </View>

            <View style={styles.waterTracker}>
                {Array.from({ length: totalGlasses }).map((_, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={styles.waterGlassContainer}
                        onPress={() => index < waterGlasses ? removeWaterGlass() : addWaterGlass()}
                    >
                        <View style={[
                            styles.waterGlass,
                            index < waterGlasses ? styles.waterGlassFilled : {}
                        ]}>
                            <Feather
                                name="droplet"
                                size={18}
                                color={index < waterGlasses ? consts.white : consts.babyBlue}
                            />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </Animated.View>
    );

    const renderTip = () => (
        <Animated.View
            style={[
                styles.tipCard,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
        >
            <View style={styles.tipHeader}>
                <Feather name="zap" size={20} color={consts.midnightBlue} />
                <Text style={styles.tipTitle}>Daily Tip</Text>
            </View>
            <Text style={styles.tipText}>
                Try to have protein with every meal to help maintain muscle mass and keep you feeling full longer.
            </Text>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {renderHeader()}

                <View style={styles.tabsWrapper}>
                    <DayTabs
                        days={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
                        selectedDay={selectedDay}
                        onSelectDay={handleDaySelect}
                    />
                </View>

                <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                    <MealCard meals={weekMeals[selectedDay]} />
                    {renderNutritionSummary()}
                    {renderWaterIntake()}
                    {renderTip()}
                </Animated.View>

                <View style={{ height: 100 }} />
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
        marginBottom: 20,
    },
    headerContent: {
        marginBottom: 16,
    },
    greeting: {
        fontSize: 26,
        fontWeight: 'bold',
        color: consts.midnightBlue,
        marginBottom: 4,
    },
    userName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: consts.blueGrotto,
    },
    statsPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: consts.blueGrotto,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#ccc',
        marginHorizontal: 16,
    },
    tabsWrapper: {
        marginBottom: 16,
    },
    nutritionCard: {
        backgroundColor: consts.white,
        borderRadius: 28,
        padding: 16,
        marginVertical: 12,
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
    },
    nutritionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: consts.midnightBlue,
        marginBottom: 16,
    },
    macrosContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    macroItem: {
        alignItems: 'center',
    },
    macroValue: {
        fontSize: 18,
        fontWeight: '700',
        color: consts.blueGrotto,
        marginBottom: 4,
    },
    macroLabel: {
        fontSize: 14,
        color: '#666',
    },
    waterCard: {
        backgroundColor: consts.white,
        borderRadius: 28,
        padding: 16,
        marginVertical: 12,
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
    },
    waterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    waterTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: consts.midnightBlue,
    },
    waterAmount: {
        fontSize: 16,
        fontWeight: '600',
        color: consts.blueGrotto,
    },
    waterTracker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    waterGlassContainer: {
        width: '12.5%',
        alignItems: 'center',
    },
    waterGlass: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(132, 199, 242, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: consts.babyBlue,
    },
    waterGlassFilled: {
        backgroundColor: consts.blueGrotto,
    },
    tipCard: {
        backgroundColor: consts.white,
        borderRadius: 28,
        padding: 16,
        marginVertical: 12,
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
    },
    tipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    tipTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: consts.midnightBlue,
        marginLeft: 8,
    },
    tipText: {
        fontSize: 15,
        lineHeight: 22,
        color: '#4b5563',
    },
});

export default HomeScreen;
