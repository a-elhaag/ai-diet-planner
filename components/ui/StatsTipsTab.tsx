import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import colors from '../../theme/const';

interface StatsTipsTabProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const StatsTipsTab: React.FC<StatsTipsTabProps> = ({ activeTab, setActiveTab }) => {
    // Mock data
    const tips = "Try to drink water 30 minutes before meals to help with portion control and improve digestion.";

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
                                <Text style={styles.statValue}>5/7</Text>
                                <Text style={styles.statLabel}>Days on Plan</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>85%</Text>
                                <Text style={styles.statLabel}>Adherence</Text>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={styles.tipsContent}>
                        <View style={styles.aiIconContainer}>
                            <Text style={styles.aiIcon}>🤖</Text>
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
        marginVertical: 16,
    },
    tabs: {
        flexDirection: 'row',
        borderRadius: 8,
        backgroundColor: '#E0E0E0',
        overflow: 'hidden',
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: colors.blueGrotto,
    },
    tabText: {
        fontWeight: '600',
        color: '#666',
    },
    activeTabText: {
        color: 'white',
    },
    contentContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        minHeight: 120,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    statsContent: {
        justifyContent: 'center',
    },
    statsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.blueGrotto,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    tipsContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    aiIconContainer: {
        marginRight: 12,
    },
    aiIcon: {
        fontSize: 32,
    },
    tipText: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
    },
});

export default StatsTipsTab;
