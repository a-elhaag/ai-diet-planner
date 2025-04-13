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
import StatsTipsTab from '../components/ui/StatsTipsTab';
import Button from '../components/ui/Button';
import { Feather } from '@expo/vector-icons';
import colors from '../const/colors';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
    const [userName, setUserName] = useState('John'); // Default name, would come from user profile
    const [selectedTab, setSelectedTab] = useState<'meals' | 'stats'>('meals');
    const [selectedDay, setSelectedDay] = useState(0);
    const [activeStatsTab, setActiveStatsTab] = useState<'stats' | 'tips'>('stats');
    const [progress, setProgress] = useState(76); // Mock progress percentage
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

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
            Animated.timing(progressAnim, {
                toValue: progress,
                duration: 1500,
                useNativeDriver: false,
            }),
        ]).start();
    }, []);

    useEffect(() => {
        fadeAnim.setValue(0);
        slideAnim.setValue(30);

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, [selectedTab]);

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

    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
            <View style={styles.headerTextContainer}>
                <Text style={styles.greeting}>Hello, {userName}!</Text>
                <Text style={styles.date}>{`${daysOfWeek[dayOfWeek]}, ${today.toLocaleDateString()}`}</Text>
            </View>

            <Animated.View
                style={[
                    styles.progressContainer,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                ]}
            >
                <View style={styles.progressCircle}>
                    <Animated.View
                        style={[
                            styles.progressFill,
                            {
                                width: progressAnim.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: ['0%', '100%']
                                })
                            }
                        ]}
                    />
                    <Text style={styles.progressText}>{`${progress}%`}</Text>
                </View>
                <View style={styles.progressInfo}>
                    <Text style={styles.progressLabel}>Today's Plan</Text>
                    <Text style={styles.progressSubtext}>You're doing great!</Text>
                </View>
            </Animated.View>
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
                <Text style={styles.waterAmount}>4 / 8 glasses</Text>
            </View>

            <View style={styles.waterTracker}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(glass => (
                    <TouchableOpacity key={glass} style={styles.waterGlassContainer}>
                        <View style={[
                            styles.waterGlass,
                            glass <= 4 ? styles.waterGlassFilled : {}
                        ]}>
                            <Feather
                                name="droplet"
                                size={18}
                                color={glass <= 4 ? colors.white : colors.babyBlue}
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
                <Feather name="zap" size={20} color={colors.midnightBlue} />
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
                    {selectedTab === 'meals' && (
                        <DayTabs
                            days={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
                            selectedDay={selectedDay}
                            onSelectDay={handleDaySelect}
                        />
                    )}
                </View>

                <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                    {selectedTab === 'meals' ? (
                        <>
                            <MealCard meals={weekMeals[selectedDay]} />
                            {renderNutritionSummary()}
                            {renderWaterIntake()}
                        </>
                    ) : (
                        <>
                            <StatsTipsTab
                                activeTab={activeStatsTab}
                                setActiveTab={(tab) => setActiveStatsTab(tab as 'stats' | 'tips')}
                            />
                            {renderTip()}
                        </>
                    )}
                </Animated.View>

                {renderTip()}

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
    header: {
        marginBottom: 20,
    },
    headerTextContainer: {
        marginBottom: 16,
    },
    greeting: {
        fontSize: 26,
        fontWeight: 'bold',
        color: colors.midnightBlue,
        marginBottom: 4,
    },
    date: {
        fontSize: 16,
        color: '#666',
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginVertical: 8,
    },
    progressCircle: {
        width: 60,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    progressFill: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: colors.blueGrotto,
        borderRadius: 15,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.midnightBlue,
        zIndex: 1,
    },
    progressInfo: {
        flex: 1,
    },
    progressLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.midnightBlue,
        marginBottom: 2,
    },
    progressSubtext: {
        fontSize: 14,
        color: '#666',
    },
    tabsWrapper: {
        marginBottom: 16,
    },
    nutritionCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginVertical: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    nutritionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.midnightBlue,
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
        color: colors.blueGrotto,
        marginBottom: 4,
    },
    macroLabel: {
        fontSize: 14,
        color: '#666',
    },
    waterCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginVertical: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
        color: colors.midnightBlue,
    },
    waterAmount: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.blueGrotto,
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
        borderColor: colors.babyBlue,
    },
    waterGlassFilled: {
        backgroundColor: colors.blueGrotto,
    },
    tipCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginVertical: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
        color: colors.midnightBlue,
        marginLeft: 8,
    },
    tipText: {
        fontSize: 15,
        lineHeight: 22,
        color: '#4b5563',
    },
    buttonsContainer: {
        marginTop: 16,
        marginBottom: 80,
    },
});

export default HomeScreen;
