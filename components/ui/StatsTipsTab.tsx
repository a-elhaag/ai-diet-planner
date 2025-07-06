import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import consts from '../../const/consts';
import { useMealPlan } from '../../hooks/useMealPlan';

interface StatsTipsTabProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const StatsTipsTab: React.FC<StatsTipsTabProps> = ({ activeTab, setActiveTab }) => {
    // Get meal plan data from context
    const { mealPlan, planHistory } = useMealPlan();

    // Generate tips based on meal plan data
    const tips = useMemo(() => {
        if (!mealPlan) {
            return "Generate a meal plan to get personalized nutrition tips.";
        }

        // Generate a random tip based on meal plan data
        const tipOptions = [
            "Try to drink water 30 minutes before meals to help with portion control and improve digestion.",
            `Including more ${mealPlan.dailyTotals.protein > 100 ? 'vegetables' : 'protein'} in your meals can help you stay full longer.`,
            "Consider meal prepping on weekends to make it easier to stick to your plan during busy weekdays.",
            "Eating slowly can help with digestion and may reduce overall food intake.",
            "Aim for at least 5 servings of vegetables and fruits each day for optimal nutrition."
        ];

        return tipOptions[Math.floor(Math.random() * tipOptions.length)];
    }, [mealPlan]);

    // Calculate adherence stats
    const stats = useMemo(() => {
        const daysOnPlan = mealPlan ? "1/7" : "0/7"; // This would ideally track actual adherence
        const adherencePercentage = mealPlan ? "85%" : "0%";
        
        return { daysOnPlan, adherencePercentage };
    }, [mealPlan]);

    return (
        <View style={styles.container}>
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
                    onPress={() => setActiveTab('stats')}
                >
                    <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>
                        Quick Stats
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'tips' && styles.activeTab]}
                    onPress={() => setActiveTab('tips')}
                >
                    <Text style={[styles.tabText, activeTab === 'tips' && styles.activeTabText]}>
                        Tips
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
                {activeTab === 'stats' ? (
                    <View style={styles.statsContent}>
                        <Text style={styles.statsTitle}>Weekly Progress</Text>
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <View style={styles.statBubble}>
                                    <Text style={styles.statValue}>{stats.daysOnPlan}</Text>
                                </View>
                                <Text style={styles.statLabel}>Days on Plan</Text>
                            </View>
                            <View style={styles.statItem}>
                                <View style={[styles.statBubble, styles.secondaryBubble]}>
                                    <Text style={styles.statValue}>{stats.adherencePercentage}</Text>
                                </View>
                                <Text style={styles.statLabel}>Adherence</Text>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={styles.tipsContent}>
                        <View style={styles.aiIconContainer}>
                            <View style={styles.aiIconBubble}>
                                <Text style={styles.aiIcon}>🤖</Text>
                            </View>
                        </View>
                        <Text style={styles.tipText}>
                            {tips}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 0,
        aspectRatio: 2.5, // Add aspect ratio for consistent sizing
    },
    tabs: {
        flexDirection: 'row',
        borderRadius: consts.radius, // Use radius from constants
        backgroundColor: consts.lightPeach,
        overflow: 'hidden',
    },
    tab: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: consts.deepGreen,
    },
    tabText: {
        fontWeight: '600',
        fontSize: 16,
        color: consts.richGray,
        opacity: 0.7,
    },
    activeTabText: {
        color: consts.offWhite,
        opacity: 1,
    },
    contentContainer: {
        backgroundColor: consts.offWhite,
        borderRadius: consts.radius,
        padding: 20,
        marginTop: 20,
        minHeight: 140,
        elevation: 3,
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 23,
    },
    statsContent: {
        justifyContent: 'center',
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: consts.richGray,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statBubble: {
        width: 70,
        height: 70,
        backgroundColor: consts.deepGreen,
        borderRadius: 35, // Fully circular
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    secondaryBubble: {
        backgroundColor: consts.deepGreen,
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: consts.offWhite,
    },
    statLabel: {
        fontSize: 16,
        color: consts.richGray,
        marginTop: 6,
        fontWeight: '500',
    },
    tipsContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    aiIconContainer: {
        marginRight: 16,
    },
    aiIconBubble: {
        width: 60,
        height: 60,
        backgroundColor: consts.lightPeach,
        borderRadius: 30, // Fully circular
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: consts.borderWidth,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    aiIcon: {
        fontSize: 30,
    },
    tipText: {
        flex: 1,
        fontSize: 16,
        color: consts.richGray,
        lineHeight: 24,
    },
});

export default StatsTipsTab;
