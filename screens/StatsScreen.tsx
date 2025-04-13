import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import colors from '../const/colors';

const StatsScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.header}>Statistics</Text>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Weekly Progress</Text>
                    <Text style={styles.cardText}>Your diet adherence this week: 85%</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Nutrition Summary</Text>
                    <Text style={styles.cardText}>Average calories: 1,800 per day</Text>
                    <Text style={styles.cardText}>Protein: 110g (24%)</Text>
                    <Text style={styles.cardText}>Carbs: 195g (43%)</Text>
                    <Text style={styles.cardText}>Fat: 67g (33%)</Text>
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
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.midnightBlue,
        marginBottom: 20,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: colors.midnightBlue,
    },
    cardText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 6,
    },
});

export default StatsScreen;