import React, { useState } from 'react';
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

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, color = consts.blueGrotto }) => {
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
                    color={change >= 0 ? consts.babyBlue : consts.babyBlue}
                />
                <Text
                    style={[
                        styles.changeText,
                        { color: change >= 0 ? consts.babyBlue : consts.babyBlue }
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

    // Mock data for progress cards
    const caloriesData = {
        current: 1850,
        target: 2100,
        percentage: 88,
        color: '#F2994A'
    };

    const weightData = {
        current: 183.2,
        target: 175,
        percentage: 18,
        color: consts.babyBlue
    };

    const macrosData = [
        { name: 'Protein', current: 114, target: 120, percentage: 95, color: '#9B51E0', icon: 'box' as React.ComponentProps<typeof Feather>['name'] },
        { name: 'Carbs', current: 210, target: 225, percentage: 93, color: '#F2994A', icon: 'pie-chart' as React.ComponentProps<typeof Feather>['name'] },
        { name: 'Fats', current: 60, target: 65, percentage: 92, color: '#219653', icon: 'droplet' as React.ComponentProps<typeof Feather>['name'] }
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

    const renderOverviewTab = () => {
        return (
            <View>
                <View style={styles.dateHeader}>
                    <Text style={styles.dateText}>April 7 - 13, 2025</Text>
                </View>

                <View style={styles.metricsContainer}>
                    <MetricCard
                        title="Average Calories"
                        value="2,036"
                        change={3.2}
                        icon="zap"
                    />
                    <MetricCard
                        title="Weight Change"
                        value="-1.8 lbs"
                        change={-0.98}
                        icon="trending-down"
                        color={consts.midnightBlue}
                    />
                    <MetricCard
                        title="Protein Intake"
                        value="114g"
                        change={5.5}
                        icon="box"
                        color="#9B51E0"
                    />
                    <MetricCard
                        title="Water Intake"
                        value="6.1 glasses"
                        change={-10}
                        icon="droplet"
                        color={consts.babyBlue}
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
                    value={weightData.current}
                    target={weightData.target}
                    percentage={weightData.percentage}
                    color={weightData.color}
                    icon="trending-down"
                    unit=" lbs"
                />
            </View>
        );
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
                    color={waterData.color}
                    icon="droplet"
                    unit=" glasses"
                />

                <View style={styles.nutritionInfoCard}>
                    <View style={styles.nutritionInfoHeader}>
                        <Feather name="info" size={16} color={consts.midnightBlue} />
                        <Text style={styles.nutritionInfoTitle}>Nutrition Insight</Text>
                    </View>
                    <Text style={styles.nutritionInfoText}>
                        Your protein intake is consistent with your goals.
                        Consider increasing water intake by 1-2 glasses daily for optimal hydration.
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
                    value={weightData.current}
                    target={weightData.target}
                    percentage={weightData.percentage}
                    color={weightData.color}
                    icon="trending-down"
                    unit=" lbs"
                />

                <View style={styles.bodyStatsCard}>
                    <Text style={styles.bodyStatsTitle}>Body Measurements</Text>

                    <View style={styles.measurementRow}>
                        <View style={styles.measurement}>
                            <Text style={styles.measurementLabel}>Starting Weight</Text>
                            <Text style={styles.measurementValue}>185 lbs</Text>
                        </View>
                        <View style={styles.measurement}>
                            <Text style={styles.measurementLabel}>Current Weight</Text>
                            <Text style={styles.measurementValue}>183.2 lbs</Text>
                        </View>
                    </View>

                    <View style={styles.measurementRow}>
                        <View style={styles.measurement}>
                            <Text style={styles.measurementLabel}>Goal Weight</Text>
                            <Text style={styles.measurementValue}>175 lbs</Text>
                        </View>
                        <View style={styles.measurement}>
                            <Text style={styles.measurementLabel}>Total Loss</Text>
                            <Text style={[styles.measurementValue, { color: consts.babyBlue }]}>-1.8 lbs</Text>
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
        backgroundColor: consts.ivory,
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        padding: 12, // Decreased from 16
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: consts.midnightBlue,
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
        backgroundColor: '#f0f1f5',
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
        backgroundColor: '#f0f1f5',
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
        backgroundColor: '#f8f9ff',
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