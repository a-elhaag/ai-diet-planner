import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Layout from '../components/Layout'; // Corrected import path with proper capitalization
import consts from '../const/consts';

export default function Progress() {
    return (
        <Layout>
            <View style={styles.container}>
                <Text style={styles.title}>Progress</Text>
                <Text style={styles.subtitle}>Track your diet and fitness progress here</Text>
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: consts.midnightBlue,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
});
