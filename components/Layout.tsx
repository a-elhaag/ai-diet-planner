import React, { ReactNode } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Navbar from './Navbar';
import colors from '../const/colors';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {children}
                </ScrollView>
            </View>
            {/* The Navbar component is rendered at the bottom */}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.ivory,
    },
    content: {
        flex: 1,
    },
    scrollContainer: {
        padding: 16,
        paddingBottom: 80, // Extra padding at bottom for navbar
    },
});

export default Layout;