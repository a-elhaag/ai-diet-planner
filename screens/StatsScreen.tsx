import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Animated,
    TouchableOpacity
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import consts from '../const/consts';
import { useUnit } from '../contexts/UnitContext';
import { useAuth } from '../contexts/AuthContext';
import StatsTipsTab from '../components/ui/StatsTipsTab';

interface MetricCardProps {
    title: string;
    value: string;
    change: number;
    icon: React.ComponentProps<typeof Feather>['name'];
    color?: string;
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

const StatsScreen: React.FC = () => {
    const [activeTab] = useState<'stats' | 'tips'>('stats');
    const { formatWeight, formatHeight } = useUnit();
    const { user } = useAuth();

    return (
        <View style={styles.container}>
            <ScrollView 
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Statistics</Text>
                    <Text style={styles.subtitle}>Track your progress</Text>
                </View>

                <View style={styles.metricsGrid}>
                    <MetricCard
                        title="Current Weight"
                        value={formatWeight(user?.weight || 0)}
                        change={-2.5}
                        icon="activity"
                        color={consts.blueGrotto}
                    />
                    <MetricCard
                        title="Height"
                        value={formatHeight(user?.height || 0)}
                        change={0}
                        icon="arrow-up"
                        color="#4CAF50"
                    />
                    <MetricCard
                        title="Activity Level"
                        value={user?.activityLevel || 'N/A'}
                        change={5}
                        icon="trending-up"
                        color="#FF9800"
                    />
                    <MetricCard
                        title="Days Active"
                        value="5/7"
                        change={10}
                        icon="calendar"
                        color="#9C27B0"
                    />
                </View>

                <View style={styles.section}>
                    <StatsTipsTab
                        activeTab={activeTab}
                        setActiveTab={() => {}}
                    />
                </View>

                <View style={styles.navbarSpacing} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: consts.white,
    },
    scrollContainer: {
        flex: 1,
    },
    header: {
        padding: consts.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: consts.ivory,
    },
    title: {
        fontSize: consts.font.xxlarge,
        fontWeight: 'bold',
        color: consts.midnightBlue,
        marginBottom: consts.spacing.xs,
    },
    subtitle: {
        fontSize: consts.font.medium,
        color: '#666',
    },
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: consts.spacing.md,
        padding: consts.spacing.lg,
    },
    section: {
        padding: consts.spacing.lg,
    },
    navbarSpacing: {
        height: consts.platform.contentPadding,
    },
    metricCard: {
        width: '47%',
        backgroundColor: consts.white,
        borderRadius: 20,
        padding: 14,
        marginBottom: 12,
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
        marginBottom: 10,
    },
    metricTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 3,
    },
    metricValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: consts.midnightBlue,
        marginBottom: 5,
    },
    changeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    changeText: {
        fontSize: 12,
        marginLeft: 4,
    },
});

export default StatsScreen;