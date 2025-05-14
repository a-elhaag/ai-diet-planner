import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated
} from 'react-native';
import consts from '../../const/consts';

interface StatsTipsTabProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const StatsTipsTab: React.FC<StatsTipsTabProps> = ({ activeTab, setActiveTab }) => {
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [activeTab]);

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

            <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
                {activeTab === 'stats' ? (
                    <View style={styles.statsContent}>
                        <Text style={styles.statsTitle}>Weekly Progress</Text>
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <View style={styles.statBubble}>
                                    <Text style={styles.statValue}>5/7</Text>
                                </View>
                                <Text style={styles.statLabel}>Days on Plan</Text>
                            </View>
                            <View style={styles.statItem}>
                                <View style={[styles.statBubble, styles.secondaryBubble]}>
                                    <Text style={styles.statValue}>85%</Text>
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
                            Try to drink water 30 minutes before meals to help with portion control and improve digestion.
                        </Text>
                    </View>
                )}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 0,
        aspectRatio: 2.5,
    },
    tabs: {
        flexDirection: 'row',
        borderRadius: consts.radius,
        backgroundColor: consts.ivory,
        overflow: 'hidden',
    },
    tab: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: consts.blueGrotto,
    },
    tabText: {
        fontWeight: '600',
        fontSize: 16,
        color: consts.midnightBlue,
        opacity: 0.7,
    },
    activeTabText: {
        color: consts.white,
        opacity: 1,
    },
    contentContainer: {
        backgroundColor: consts.white,
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
        color: consts.midnightBlue,
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
        backgroundColor: consts.blueGrotto,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    secondaryBubble: {
        backgroundColor: consts.babyBlue,
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: consts.white,
    },
    statLabel: {
        fontSize: 16,
        color: consts.midnightBlue,
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
        backgroundColor: consts.ivory,
        borderRadius: 30,
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
        color: consts.midnightBlue,
        lineHeight: 24,
    },
});

export default StatsTipsTab;
