import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import consts from '../const/consts';
import { useUnit } from '../contexts/UnitContext';
import { useMealPlan } from '../hooks/useMealPlan';

interface MetricCardProps {
    title: string;
    value: string;
    change: number;
    icon: React.ComponentProps<typeof Feather>['name'];
    color?: string;
}

interface ProgressCardProps {
    title: string;
    value: string | number;
    target: string | number;
    percentage: number;
    color?: string;
    icon?: React.ComponentProps<typeof Feather>['name'];
    unit?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, color = consts.deepGreen }) => {
    return (
        <View style={[styles.metricCard, { borderLeftColor: color }]}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                <Feather name={icon} size={18} color={color} />
            </View>
            <Text style={styles.metricTitle}>{title}</Text>
            <Text style={styles.metricValue}>{value}</Text>
            <View style={styles.changeContainer}>
                <Feather
                    name={change >= 0 ? "arrow-up" : "arrow-down"}
                    size={12}
                    color={change >= 0 ? consts.deepGreen : consts.richGray}
                />
                <Text
                    style={[
                        styles.changeText,
                        { color: change >= 0 ? consts.deepGreen : consts.richGray }
                    ]}
                >
                    {Math.abs(change)}%
                </Text>
            </View>
        </View>
    );
};

const ProgressCard: React.FC<ProgressCardProps> = ({
    title,
    value,
    target,
    percentage,
    color = consts.blueGrotto,
    icon,
    unit = ''
}) => {
    return (
        <View style={styles.progressCard}>
            <View style={styles.progressCardHeader}>
                <View style={styles.progressCardTitleContainer}>
                    {icon && (
                        <View style={[styles.smallIconContainer, { backgroundColor: `${color}20` }]}>
                            <Feather name={icon} size={14} color={color} />
                        </View>
                    )}
                    <Text style={styles.progressCardTitle}>{title}</Text>
                </View>
                <Text style={[styles.progressCardValue, { color }]}>
                    {value}{unit} <Text style={styles.progressCardTarget}>/ {target}{unit}</Text>
                </Text>
            </View>
            <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${Math.min(percentage, 100)}%`, backgroundColor: color }
                        ]}
                    />
                </View>
                <Text style={styles.progressPercentage}>{percentage}%</Text>
            </View>
        </View>
    );
};

const StatsScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'nutrition' | 'body'>('overview');
    const { unitSystem, formatWeight } = useUnit();
    const { mealPlan, planHistory } = useMealPlan();

    // Use real meal plan data if available
    const hasActivePlan = !!mealPlan;
    const hasPlanHistory = planHistory.length > 0;
    
    // Extract nutritional data from meal plan if available
    const caloriesData = mealPlan ? {
        current: mealPlan.dailyTotals.calories,
        target: 2100, // This could come from user profile
        percentage: Math.round((mealPlan.dailyTotals.calories / 2100) * 100),
        color: consts.deepGreen
    } : {
        current: 1850,
        target: 2100,
        percentage: 88,
        color: consts.deepGreen
    };

    // Weight data in lbs (imperial)
    const weightData = {
        currentLbs: 183.2,
        targetLbs: 175,
        percentage: 18,
        color: consts.deepGreen
    };

    // Format for display based on unit system
    const weightChangeValue = unitSystem === 'imperial'
        ? `-1.8 lbs`
        : `-${(1.8 / 2.20462).toFixed(1)} kg`;

    const currentWeightValue = formatWeight(weightData.currentLbs);
    const targetWeightValue = formatWeight(weightData.targetLbs);
    const startingWeightValue = formatWeight(185);

    // Target values for macros - could come from user profile
    const targetProtein = 120;
    const targetCarbs = 225;
    const targetFats = 65;

    // Use meal plan data if available, otherwise use mock data
    const macrosData = mealPlan ? [
        { 
            name: 'Protein', 
            current: mealPlan.dailyTotals.protein, 
            target: targetProtein, 
            percentage: Math.round((mealPlan.dailyTotals.protein / targetProtein) * 100), 
            color: '#9B51E0', 
            icon: 'box' as React.ComponentProps<typeof Feather>['name'] 
        },
        { 
            name: 'Carbs', 
            current: mealPlan.dailyTotals.carbohydrates, 
            target: targetCarbs, 
            percentage: Math.round((mealPlan.dailyTotals.carbohydrates / targetCarbs) * 100), 
            color: consts.deepGreen, 
            icon: 'pie-chart' as React.ComponentProps<typeof Feather>['name'] 
        },
        { 
            name: 'Fats', 
            current: mealPlan.dailyTotals.fats, 
            target: targetFats, 
            percentage: Math.round((mealPlan.dailyTotals.fats / targetFats) * 100), 
            color: consts.richGray, 
            icon: 'droplet' as React.ComponentProps<typeof Feather>['name'] 
        }
    ] : [
        { name: 'Protein', current: 114, target: targetProtein, percentage: 95, color: '#9B51E0', icon: 'box' as React.ComponentProps<typeof Feather>['name'] },
        { name: 'Carbs', current: 210, target: targetCarbs, percentage: 93, color: consts.deepGreen, icon: 'pie-chart' as React.ComponentProps<typeof Feather>['name'] },
        { name: 'Fats', current: 60, target: targetFats, percentage: 92, color: consts.richGray, icon: 'droplet' as React.ComponentProps<typeof Feather>['name'] }
    ];

    const waterData = {
        current: 6,
        target: 8,
        percentage: 75,
        color: consts.babyBlue
    };

    const renderTabSelector = () => {
        return (
            <View style={styles.tabSelector}>
                {['Overview', 'Nutrition', 'Body'].map(tab => {
                    const tabKey = tab.toLowerCase() as 'overview' | 'nutrition' | 'body';
                    const isActive = activeTab === tabKey;
                    return (
                        <TouchableOpacity
                            key={tab}
                            style={[
                                styles.tab,
                                isActive && styles.activeTab
                            ]}
                            onPress={() => setActiveTab(tabKey)}
                        >
                            <Text style={[
                                styles.tabText,
                                isActive && styles.activeTabText
                            ]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    // Get current date range for display
    const getCurrentDateRange = () => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // First day of current week (Sunday)
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Last day of current week (Saturday)
        
        const formatDate = (date: Date) => {
            const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
            return date.toLocaleDateString(undefined, options);
        };
        
        return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}, ${today.getFullYear()}`;
    };

    const renderOverviewTab = () => {
        // Calculate average calories from meal plan if available
        const averageCalories = mealPlan ? mealPlan.dailyTotals.calories.toLocaleString() : "2,036";
        const proteinIntake = mealPlan ? `${Math.round(mealPlan.dailyTotals.protein)}g` : "114g";
        
        return (
            <View>
                <View style={styles.dateHeader}>
                    <Text style={styles.dateText}>{getCurrentDateRange()}</Text>
                </View>

                <View style={styles.metricsContainer}>
                    <MetricCard
                        title="Average Calories"
                        value={averageCalories}
                        change={3.2}
                        icon="zap"
                        color={consts.deepGreen}
                    />
                    <MetricCard
                        title="Weight Change"
                        value={weightChangeValue}
                        change={-0.98}
                        icon="trending-down"
                        color={consts.richGray}
                    />
                    <MetricCard
                        title="Protein Intake"
                        value={proteinIntake}
                        change={5.5}
                        icon="box"
                        color="#9B51E0"
                    />
                    <MetricCard
                        title="Water Intake"
                        value="6.1 glasses"
                        change={-10}
                        icon="droplet"
                        color={consts.deepGreen}
                    />
                </View>

                {/* Calorie intake progress card instead of graph */}
                <ProgressCard
                    title="Calorie Intake"
                    value={caloriesData.current}
                    target={caloriesData.target}
                    percentage={caloriesData.percentage}
                    color={caloriesData.color}
                    icon="zap"
                    unit=" cal"
                />

                {/* Weight progress card instead of graph */}
                <ProgressCard
                    title="Weight Progress"
                    value={unitSystem === 'imperial' ? weightData.currentLbs : (weightData.currentLbs / 2.20462).toFixed(1)}
                    target={unitSystem === 'imperial' ? weightData.targetLbs : (weightData.targetLbs / 2.20462).toFixed(1)}
                    percentage={weightData.percentage}
                    color={weightData.color}
                    icon="trending-down"
                    unit={unitSystem === 'imperial' ? " lbs" : " kg"}
                />
            </View>
        );
    };

    // Generate personalized insights based on meal plan data
    const generateNutritionInsights = () => {
        if (!mealPlan) {
            return "Generate a meal plan to see personalized nutrition insights.";
        }
        
        const { protein, carbohydrates, fats } = mealPlan.dailyTotals;
        
        // Calculate macronutrient ratios
        const totalMacros = protein + carbohydrates + fats;
        const proteinRatio = Math.round((protein / totalMacros) * 100);
        const carbsRatio = Math.round((carbohydrates / totalMacros) * 100);
        const fatsRatio = Math.round((fats / totalMacros) * 100);
        
        // Generate insights based on ratio analysis
        let insights = [];
        
        if (proteinRatio < 20) {
            insights.push("Consider increasing your protein intake to support muscle maintenance and recovery.");
        } else if (proteinRatio > 35) {
            insights.push("Your protein intake is high. Ensure you're drinking enough water to help your kidneys process the protein.");
        } else {
            insights.push("Your protein intake is well-balanced.");
        }
        
        if (carbsRatio < 40) {
            insights.push("Your carbohydrate intake is relatively low. Ensure you're getting enough fiber.");
        } else if (carbsRatio > 60) {
            insights.push("Consider balancing your meal plan with more protein and healthy fats.");
        }
        
        // Add water recommendation
        insights.push("Aim for 8 glasses of water daily for optimal hydration.");
        
        return insights.join(" ");
    };

    const renderNutritionTab = () => {
        return (
            <View>
                {/* Macros progress cards */}
                {macrosData.map((macro, index) => (
                    <ProgressCard
                        key={index}
                        title={macro.name}
                        value={macro.current}
                        target={macro.target}
                        percentage={macro.percentage}
                        color={macro.color}
                        icon={macro.icon}
                        unit="g"
                    />
                ))}

                {/* Water intake progress card */}
                <ProgressCard
                    title="Water Intake"
                    value={waterData.current}
                    target={waterData.target}
                    percentage={waterData.percentage}
                    color={consts.deepGreen}
                    icon="droplet"
                    unit=" glasses"
                />

                <View style={styles.nutritionInfoCard}>
                    <View style={styles.nutritionInfoHeader}>
                        <Feather name="info" size={16} color={consts.richGray} />
                        <Text style={styles.nutritionInfoTitle}>Nutrition Insight</Text>
                    </View>
                    <Text style={styles.nutritionInfoText}>
                        {generateNutritionInsights()}
                    </Text>
                </View>
            </View>
        );
    };

    const renderBodyTab = () => {
        return (
            <View>
                <ProgressCard
                    title="Weight Goal Progress"
                    value={unitSystem === 'imperial' ? weightData.currentLbs : (weightData.currentLbs / 2.20462).toFixed(1)}
                    target={unitSystem === 'imperial' ? weightData.targetLbs : (weightData.targetLbs / 2.20462).toFixed(1)}
                    percentage={weightData.percentage}
                    color={weightData.color}
                    icon="trending-down"
                    unit={unitSystem === 'imperial' ? " lbs" : " kg"}
                />

                <View style={styles.bodyStatsCard}>
                    <Text style={styles.bodyStatsTitle}>Body Measurements</Text>

                    <View style={styles.measurementRow}>
                        <View style={styles.measurement}>
                            <Text style={styles.measurementLabel}>Starting Weight</Text>
                            <Text style={styles.measurementValue}>{startingWeightValue}</Text>
                        </View>
                        <View style={styles.measurement}>
                            <Text style={styles.measurementLabel}>Current Weight</Text>
                            <Text style={styles.measurementValue}>{currentWeightValue}</Text>
                        </View>
                    </View>

                    <View style={styles.measurementRow}>
                        <View style={styles.measurement}>
                            <Text style={styles.measurementLabel}>Goal Weight</Text>
                            <Text style={styles.measurementValue}>{targetWeightValue}</Text>
                        </View>
                        <View style={styles.measurement}>
                            <Text style={styles.measurementLabel}>Total Loss</Text>
                            <Text style={[styles.measurementValue, { color: consts.babyBlue }]}>
                                {weightChangeValue}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.milestoneCard}>
                    <Text style={styles.milestoneTitle}>Milestones</Text>

                    <View style={styles.milestone}>
                        <View style={[styles.milestoneIconContainer, { backgroundColor: `${consts.babyBlue}20` }]}>
                            <Feather name="check-circle" size={16} color={consts.babyBlue} />
                        </View>
                        <View style={styles.milestoneContent}>
                            <Text style={styles.milestoneName}>First pound lost</Text>
                            <Text style={styles.milestoneDate}>Apr 9, 2025</Text>
                        </View>
                    </View>

                    <View style={styles.milestone}>
                        <View style={[styles.milestoneIconContainer, { backgroundColor: `${consts.blueGrotto}20` }]}>
                            <Feather name="flag" size={16} color={consts.blueGrotto} />
                        </View>
                        <View style={styles.milestoneContent}>
                            <Text style={styles.milestoneName}>5% of goal weight lost</Text>
                            <Text style={styles.milestoneDate}>Expected: May 14, 2025</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Text style={styles.screenTitle}>Statistics</Text>
                <Text style={styles.screenSubtitle}>Your health and nutrition insights</Text>

                {renderTabSelector()}

                {activeTab === 'overview' && renderOverviewTab()}
                {activeTab === 'nutrition' && renderNutritionTab()}
                {activeTab === 'body' && renderBodyTab()}

                <View style={styles.bottomPadding} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: consts.lightPeach, // Peachy background
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        padding: 12, // Decreased from 16
        paddingTop: 12 + consts.platform.topMargin, // Extra top padding for Android
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: consts.richGray,
        marginBottom: 2, // Decreased from 4
        paddingHorizontal: 4, // Added horizontal padding
    },
    screenSubtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 12, // Decreased from 16
        paddingHorizontal: 4, // Added horizontal padding
    },
    tabSelector: {
        flexDirection: 'row',
        backgroundColor: consts.white, // White component
        borderRadius: 20,
        marginVertical: 10, // Decreased from 16
        marginHorizontal: 4, // Added horizontal margin
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 18,
    },
    activeTab: {
        backgroundColor: consts.white,
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    activeTabText: {
        color: consts.midnightBlue,
        fontWeight: '600',
    },
    dateHeader: {
        alignItems: 'center',
        marginBottom: 12, // Decreased from 16
    },
    dateText: {
        fontSize: 16,
        fontWeight: '600',
        color: consts.midnightBlue,
    },
    metricsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 16, // Decreased from 20
        paddingHorizontal: 2, // Added horizontal padding
    },
    metricCard: {
        width: '48%',
        backgroundColor: consts.white,
        borderRadius: 20, // Decreased from 28
        padding: 14, // Decreased from 16
        marginBottom: 12, // Decreased from 16
        borderLeftWidth: 4,
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10, // Decreased from 12
    },
    metricTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 3, // Decreased from 4
    },
    metricValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: consts.midnightBlue,
        marginBottom: 5, // Decreased from 6
    },
    changeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    changeText: {
        fontSize: 12,
        marginLeft: 4,
    },
    progressCard: {
        backgroundColor: consts.white,
        borderRadius: 20,
        padding: 16,
        marginVertical: 8, // Added spacing between cards
        marginHorizontal: 2, // Added horizontal margin
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 2,
    },
    progressCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    progressCardTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    smallIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    progressCardTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: consts.midnightBlue,
    },
    progressCardValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    progressCardTarget: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#666',
    },
    progressBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBar: {
        flex: 1,
        height: 8, // Increased from 6
        backgroundColor: consts.white, // White component
        borderRadius: 4,
        overflow: 'hidden',
        marginRight: 10,
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressPercentage: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        width: 40, // Fixed width for alignment
        textAlign: 'right',
    },
    bottomPadding: {
        height: 120, // Increased from 100 to account for the floating navbar
    },
    nutritionCards: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    macroCard: {
        width: '31%',
        backgroundColor: consts.white,
        borderRadius: 20, // Decreased from 28
        padding: 12,
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    macroTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    macroValueContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 8,
    },
    macroValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    macroTarget: {
        fontSize: 12,
        color: '#999',
        marginLeft: 3,
    },
    nutritionInfoCard: {
        backgroundColor: consts.white, // White component
        borderRadius: 20,
        padding: 16,
        marginVertical: 10,
        marginHorizontal: 2,
        borderLeftWidth: 4,
        borderLeftColor: consts.midnightBlue,
    },
    nutritionInfoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    nutritionInfoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: consts.midnightBlue,
        marginLeft: 8,
    },
    nutritionInfoText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
    bodyStatsCard: {
        backgroundColor: consts.white,
        borderRadius: 20, // Decreased from 38
        padding: 16,
        marginVertical: 10, // Decreased from 16
        marginHorizontal: 2,
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    bodyStatsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: consts.midnightBlue,
        marginBottom: 14, // Decreased from 16
    },
    measurementRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 14, // Decreased from 16
    },
    measurement: {
        width: '48%',
    },
    measurementLabel: {
        fontSize: 14,
        color: '#667085',
        marginBottom: 3, // Decreased from 4
    },
    measurementValue: {
        fontSize: 18,
        fontWeight: '600',
        color: consts.midnightBlue,
    },
    milestoneCard: {
        backgroundColor: consts.white,
        borderRadius: 20,
        padding: 16,
        marginVertical: 10,
        marginHorizontal: 2,
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 2,
    },
    milestoneTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: consts.midnightBlue,
        marginBottom: 14,
    },
    milestone: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    milestoneIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    milestoneContent: {
        flex: 1,
    },
    milestoneName: {
        fontSize: 15,
        fontWeight: '500',
        color: consts.midnightBlue,
        marginBottom: 2,
    },
    milestoneDate: {
        fontSize: 13,
        color: '#667085',
    },
});

export default StatsScreen;