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
import Graph from '../components/ui/graph';
import colors from '../const/colors';

interface MetricCardProps {
    title: string;
    value: string;
    change: number;
    icon: React.ComponentProps<typeof Feather>['name'];
    color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, color = colors.blueGrotto }) => {
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
                    color={change >= 0 ? colors.babyBlue : colors.babyBlue}
                />
                <Text
                    style={[
                        styles.changeText,
                        { color: change >= 0 ? colors.babyBlue : colors.babyBlue }
                    ]}
                >
                    {Math.abs(change)}%
                </Text>
            </View>
        </View>
    );
};

const StatsScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'nutrition' | 'body'>('overview');
    const [caloriesTimeFrame, setCaloriesTimeFrame] = useState<'week' | 'month' | 'year'>('week');

    // Mock data for graphs
    const caloriesData = [
        { value: 1750, date: '2025-04-07', label: 'Monday: 1750 cal - Under target by 250 cal' },
        { value: 2100, date: '2025-04-08', label: 'Tuesday: 2100 cal - On target' },
        { value: 1900, date: '2025-04-09', label: 'Wednesday: 1900 cal - On target' },
        { value: 2300, date: '2025-04-10', label: 'Thursday: 2300 cal - Over target by 200 cal' },
        { value: 2000, date: '2025-04-11', label: 'Friday: 2000 cal - On target' },
        { value: 2400, date: '2025-04-12', label: 'Saturday: 2400 cal - Over target by 300 cal' },
        { value: 1800, date: '2025-04-13', label: 'Sunday: 1800 cal - On target' }
    ];

    const weightData = [
        { value: 185, date: '2025-04-01', label: 'April 1: 185 lbs' },
        { value: 184, date: '2025-04-06', label: 'April 6: 184 lbs' },
        { value: 183.2, date: '2025-04-13', label: 'April 13: 183.2 lbs' }
    ];

    const macrosData = [
        { value: 110, date: '2025-04-07', label: 'Monday: 110g protein (22% of calories)' },
        { value: 125, date: '2025-04-08', label: 'Tuesday: 125g protein (24% of calories)' },
        { value: 95, date: '2025-04-09', label: 'Wednesday: 95g protein (20% of calories)' },
        { value: 130, date: '2025-04-10', label: 'Thursday: 130g protein (22% of calories)' },
        { value: 115, date: '2025-04-11', label: 'Friday: 115g protein (23% of calories)' },
        { value: 100, date: '2025-04-12', label: 'Saturday: 100g protein (17% of calories)' },
        { value: 120, date: '2025-04-13', label: 'Sunday: 120g protein (27% of calories)' }
    ];

    const waterData = [
        { value: 5, date: '2025-04-07', label: '5 glasses (1.25L)' },
        { value: 7, date: '2025-04-08', label: '7 glasses (1.75L)' },
        { value: 6, date: '2025-04-09', label: '6 glasses (1.5L)' },
        { value: 8, date: '2025-04-10', label: '8 glasses (2L)' },
        { value: 7, date: '2025-04-11', label: '7 glasses (1.75L)' },
        { value: 4, date: '2025-04-12', label: '4 glasses (1L)' },
        { value: 6, date: '2025-04-13', label: '6 glasses (1.5L)' }
    ];

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
                        color={colors.midnightBlue}
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
                        color={colors.babyBlue}
                    />
                </View>

                <Graph
                    data={caloriesData}
                    title="Calorie Intake"
                    unit=" cal"
                    type="bar"
                />

                <Graph
                    data={weightData}
                    title="Weight Progress"
                    unit=" lbs"
                    color={colors.babyBlue}
                    showLabels={true}
                />
            </View>
        );
    };

    const renderNutritionTab = () => {
        return (
            <View>
                <View style={styles.nutritionCards}>
                    <View style={styles.macroCard}>
                        <Text style={styles.macroTitle}>Proteins</Text>
                        <View style={styles.macroValueContainer}>
                            <Text style={[styles.macroValue, { color: "#9B51E0" }]}>114g</Text>
                            <Text style={styles.macroTarget}>/ 120g</Text>
                        </View>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: "95%", backgroundColor: "#9B51E0" }]} />
                        </View>
                    </View>

                    <View style={styles.macroCard}>
                        <Text style={styles.macroTitle}>Carbs</Text>
                        <View style={styles.macroValueContainer}>
                            <Text style={[styles.macroValue, { color: "#F2994A" }]}>210g</Text>
                            <Text style={styles.macroTarget}>/ 225g</Text>
                        </View>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: "93%", backgroundColor: "#F2994A" }]} />
                        </View>
                    </View>

                    <View style={styles.macroCard}>
                        <Text style={styles.macroTitle}>Fats</Text>
                        <View style={styles.macroValueContainer}>
                            <Text style={[styles.macroValue, { color: "#219653" }]}>60g</Text>
                            <Text style={styles.macroTarget}>/ 65g</Text>
                        </View>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: "92%", backgroundColor: "#219653" }]} />
                        </View>
                    </View>
                </View>

                <Graph
                    data={macrosData}
                    title="Protein Intake"
                    unit="g"
                    color="#9B51E0"
                    showLabels={true}
                />

                <Graph
                    data={waterData}
                    title="Water Intake"
                    unit=" glasses"
                    color={colors.babyBlue}
                    type="bar"
                />
            </View>
        );
    };

    const renderBodyTab = () => {
        return (
            <View>
                <Graph
                    data={weightData}
                    title="Weight Progress"
                    unit=" lbs"
                    color={colors.babyBlue}
                    timeFrame="month"
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
                            <Text style={[styles.measurementValue, { color: colors.babyBlue }]}>-1.8 lbs</Text>
                        </View>
                    </View>

                    <View style={styles.progressBarContainer}>
                        <Text style={styles.progressLabel}>18% of goal reached</Text>
                        <View style={styles.progressBar}>
                            <View style={[
                                styles.progressFill,
                                { width: "18%", backgroundColor: colors.babyBlue }
                            ]} />
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
        backgroundColor: colors.ivory,
    },
    scrollContainer: {
        flex: 1,
        padding: 16,
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.midnightBlue,
        marginBottom: 4,
    },
    screenSubtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
    tabSelector: {
        flexDirection: 'row',
        backgroundColor: '#f0f1f5',
        borderRadius: 10,
        marginVertical: 16,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: colors.white,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    activeTabText: {
        color: colors.midnightBlue,
        fontWeight: '600',
    },
    dateHeader: {
        alignItems: 'center',
        marginBottom: 16,
    },
    dateText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.midnightBlue,
    },
    metricsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    metricCard: {
        width: '48%',
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    metricTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    metricValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.midnightBlue,
        marginBottom: 6,
    },
    changeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    changeText: {
        fontSize: 12,
        marginLeft: 4,
    },
    bottomPadding: {
        height: 100,
    },
    nutritionCards: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    macroCard: {
        width: '31%',
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
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
    progressBar: {
        height: 4,
        backgroundColor: '#f0f1f5',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
    bodyStatsCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        marginVertical: 16,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    bodyStatsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.midnightBlue,
        marginBottom: 16,
    },
    measurementRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    measurement: {
        width: '48%',
    },
    measurementLabel: {
        fontSize: 14,
        color: '#667085',
        marginBottom: 4,
    },
    measurementValue: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.midnightBlue,
    },
    progressBarContainer: {
        marginTop: 8,
    },
    progressLabel: {
        fontSize: 14,
        color: '#667085',
        marginBottom: 6,
    },
});

export default StatsScreen;