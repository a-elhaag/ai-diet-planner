import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Dimensions,
    Modal,
    TextInput,
    Alert
} from 'react-native';
import DayTabs from '../components/ui/DayTabs';
import MealCard from '../components/ui/MealCard';
import StatsTipsTab from '../components/ui/StatsTipsTab';
import Button from '../components/ui/Button';
import { Feather } from '@expo/vector-icons';
import consts from '../const/consts';
import { useMealPlanContext } from '../contexts/MealPlanContext';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
    const [userName, setUserName] = useState('John'); // Default name, would come from user profile
    const [selectedTab, setSelectedTab] = useState<'meals' | 'stats'>('meals');
    const [selectedDay, setSelectedDay] = useState(0);
    const [activeStatsTab, setActiveStatsTab] = useState<'stats' | 'tips'>('stats');
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [quickMealForm, setQuickMealForm] = useState({
        name: '',
        category: 'breakfast' as 'breakfast' | 'lunch' | 'dinner' | 'snack',
        calories: ''
    });
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    
    // Get data from new context
    const { 
        currentPlan, 
        userProgress, 
        dailyTracking, 
        logQuickMeal,
        updateHydration,
        addPoints,
        updateStreak
    } = useMealPlanContext();

    // Calculate daily progress based on context data
    const progress = Math.round(
        (dailyTracking.mealsLogged.length * 25) + 
        (dailyTracking.hydration.glasses / dailyTracking.hydration.target * 25)
    );

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
    }, [progress]);

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

    // Use real meal plan data if available, otherwise fallback to mock data
    const weekMeals = currentPlan?.weeklyPlans ? Object.keys(currentPlan.weeklyPlans).map(day => {
        const dailyPlan = currentPlan.weeklyPlans?.[day];
        return {
            breakfast: dailyPlan?.breakfast?.name || "No breakfast plan",
            lunch: dailyPlan?.lunch?.name || "No lunch plan",
            dinner: dailyPlan?.dinner?.name || "No dinner plan",
            snacks: dailyPlan?.snacks?.map((snack: any) => snack.name) || ["No snacks planned"]
        };
    }) : [
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

    // Use real nutrition data if available, otherwise fallback to mock data
    const nutritionSummary = currentPlan?.dailyTotals ? {
        calories: currentPlan.dailyTotals.calories,
        protein: currentPlan.dailyTotals.protein,
        carbs: currentPlan.dailyTotals.carbohydrates, // Map to carbs
        fat: currentPlan.dailyTotals.fats // Map to fat
    } : {
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

    const handleQuickAdd = () => {
        setShowQuickAdd(true);
    };

    const handleQuickMealSubmit = () => {
        if (!quickMealForm.name.trim() || !quickMealForm.calories) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        logQuickMeal({
            name: quickMealForm.name,
            category: quickMealForm.category,
            calories: parseInt(quickMealForm.calories),
        });

        setQuickMealForm({ name: '', category: 'breakfast', calories: '' });
        setShowQuickAdd(false);
        Alert.alert('Success', 'Meal logged successfully! +5 points');
    };

    const handleHydrationUpdate = (glasses: number) => {
        updateHydration(glasses);
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
                <Text style={styles.waterAmount}>
                    {dailyTracking.hydration.glasses} / {dailyTracking.hydration.target} glasses
                </Text>
            </View>

            <View style={styles.waterTracker}>
                {Array.from({ length: dailyTracking.hydration.target }, (_, index) => (
                    <TouchableOpacity 
                        key={index + 1} 
                        style={styles.waterGlassContainer}
                        onPress={() => handleHydrationUpdate(index + 1)}
                    >
                        <View style={[
                            styles.waterGlass,
                            index < dailyTracking.hydration.glasses ? styles.waterGlassFilled : {}
                        ]}>
                            <Feather
                                name="droplet"
                                size={18}
                                color={index < dailyTracking.hydration.glasses ? consts.white : consts.babyBlue}
                            />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </Animated.View>
    );

    const renderGamification = () => (
        <Animated.View
            style={[
                styles.gamificationCard,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
        >
            <View style={styles.gamificationHeader}>
                <Text style={styles.gamificationTitle}>Progress & Rewards</Text>
                <View style={styles.pointsBadge}>
                    <Feather name="star" size={16} color={consts.white} />
                    <Text style={styles.pointsText}>{userProgress.points}</Text>
                </View>
            </View>
            
            <View style={styles.gamificationContent}>
                <View style={styles.streakContainer}>
                    <Feather name="zap" size={20} color={consts.blueGrotto} />
                    <Text style={styles.streakText}>{userProgress.streaks.current} day streak!</Text>
                </View>
                
                <View style={styles.badgesContainer}>
                    <Text style={styles.badgesLabel}>Recent Badges:</Text>
                    <View style={styles.badgesList}>
                        {userProgress.badges.slice(-3).map((badge, index) => (
                            <View key={index} style={styles.badgeItem}>
                                <Text style={styles.badgeEmoji}>🏆</Text>
                                <Text style={styles.badgeName}>{badge}</Text>
                            </View>
                        ))}
                        {userProgress.badges.length === 0 && (
                            <Text style={styles.noBadgesText}>Complete goals to earn badges!</Text>
                        )}
                    </View>
                </View>
            </View>
        </Animated.View>
    );

    const renderQuickAddModal = () => (
        <Modal
            visible={showQuickAdd}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowQuickAdd(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Quick Add Meal</Text>
                        <TouchableOpacity onPress={() => setShowQuickAdd(false)}>
                            <Feather name="x" size={24} color={consts.richGray} />
                        </TouchableOpacity>
                    </View>
                    
                    <TextInput
                        style={styles.input}
                        placeholder="Meal name (e.g., Greek yogurt with berries)"
                        value={quickMealForm.name}
                        onChangeText={(text) => setQuickMealForm({ ...quickMealForm, name: text })}
                    />
                    
                    <View style={styles.categoryContainer}>
                        {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((category) => (
                            <TouchableOpacity
                                key={category}
                                style={[
                                    styles.categoryButton,
                                    quickMealForm.category === category && styles.categoryButtonActive
                                ]}
                                onPress={() => setQuickMealForm({ ...quickMealForm, category })}
                            >
                                <Text style={[
                                    styles.categoryButtonText,
                                    quickMealForm.category === category && styles.categoryButtonTextActive
                                ]}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    
                    <TextInput
                        style={styles.input}
                        placeholder="Estimated calories"
                        value={quickMealForm.calories}
                        onChangeText={(text) => setQuickMealForm({ ...quickMealForm, calories: text })}
                        keyboardType="numeric"
                    />
                    
                    <View style={styles.modalActions}>
                        <Button
                            title="Cancel"
                            onPress={() => setShowQuickAdd(false)}
                            variant="secondary"
                            size="medium"
                        />
                        <Button
                            title="Log Meal"
                            onPress={handleQuickMealSubmit}
                            variant="primary"
                            size="medium"
                        />
                    </View>
                </View>
            </View>
        </Modal>
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
                            {currentPlan ? (
                                <MealCard meals={weekMeals[selectedDay]} />
                            ) : (
                                <View style={styles.noMealPlanContainer}>
                                    <Text style={styles.noMealPlanText}>No active meal plan</Text>
                                    <Button 
                                        title="Generate Meal Plan"
                                        onPress={() => { /* Navigate to profile screen */ }}
                                        variant="primary"
                                        size="small"
                                    />
                                </View>
                            )}
                            {renderNutritionSummary()}
                            {renderWaterIntake()}
                            {renderGamification()}
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

                <View style={styles.buttonsContainer}>
                    <Button
                        title={selectedTab === 'meals' ? "View Stats" : "View Meals"}
                        onPress={() => setSelectedTab(selectedTab === 'meals' ? 'stats' : 'meals')}
                        variant="primary"
                        size="medium"
                    />
                    <Button
                        title="Quick Add Meal"
                        onPress={handleQuickAdd}
                        variant="secondary"
                        size="medium"
                    />
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
            
            {renderQuickAddModal()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: consts.offWhite,
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
        color: consts.richGray,
        marginBottom: 4,
    },
    date: {
        fontSize: 16,
        color: '#666',
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: consts.white,
        borderRadius: 28,
        padding: 16,
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
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
        backgroundColor: consts.blueGrotto,
        borderRadius: 15,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '700',
        color: consts.midnightBlue,
        zIndex: 1,
    },
    progressInfo: {
        flex: 1,
    },
    progressLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: consts.midnightBlue,
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
    gamificationCard: {
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
    gamificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    gamificationTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: consts.midnightBlue,
    },
    pointsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: consts.blueGrotto,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    pointsText: {
        color: consts.white,
        fontWeight: '600',
        marginLeft: 4,
    },
    gamificationContent: {
        gap: 12,
    },
    streakContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    streakText: {
        fontSize: 16,
        fontWeight: '600',
        color: consts.midnightBlue,
        marginLeft: 8,
    },
    badgesContainer: {},
    badgesLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: consts.richGray,
        marginBottom: 8,
    },
    badgesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    badgeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    badgeEmoji: {
        fontSize: 16,
        marginRight: 6,
    },
    badgeName: {
        fontSize: 12,
        fontWeight: '500',
        color: consts.richGray,
    },
    noBadgesText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
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
    buttonsContainer: {
        marginTop: 16,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    noMealPlanContainer: {
        backgroundColor: consts.white,
        borderRadius: 28,
        padding: 24,
        marginVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
    },
    noMealPlanText: {
        fontSize: 18,
        fontWeight: '600',
        color: consts.midnightBlue,
        marginBottom: 16,
        textAlign: 'center',
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: consts.white,
        borderRadius: 28,
        padding: 24,
        width: '100%',
        maxWidth: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: consts.midnightBlue,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        marginBottom: 16,
        backgroundColor: '#f8fafc',
    },
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    categoryButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 16,
        backgroundColor: '#f1f5f9',
        marginHorizontal: 4,
        alignItems: 'center',
    },
    categoryButtonActive: {
        backgroundColor: consts.blueGrotto,
    },
    categoryButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: consts.richGray,
    },
    categoryButtonTextActive: {
        color: consts.white,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 8,
    },
});

export default HomeScreen;
