import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Navbar from './Navbar';
import colors from '../const/colors';

interface LayoutProps {
    children: React.ReactNode;
    noScroll?: boolean;
    noNavbar?: boolean;
    hideStatusBar?: boolean;
    backgroundColor?: string;
    contentPadding?: boolean;
    keyboardAvoid?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
    children,
    noScroll = false,
    noNavbar = false,
    hideStatusBar = false,
    backgroundColor = colors.ivory,
    contentPadding = true,
    keyboardAvoid = true
}) => {
    const ContentWrapper = noScroll ? View : ScrollView;
    const contentStyles = [
        styles.content,
        contentPadding && styles.contentPadding,
        { backgroundColor }
    ];

    const renderContent = () => (
        <ContentWrapper
            style={contentStyles}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={noScroll ? { flex: 1 } : undefined}
        >
            {children}
        </ContentWrapper>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <StatusBar
                backgroundColor={backgroundColor}
                barStyle="dark-content"
                hidden={hideStatusBar}
            />

            {keyboardAvoid && Platform.OS === 'ios' ? (
                <KeyboardAvoidingView
                    style={styles.keyboardView}
                    behavior="padding"
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
                >
                    <View style={styles.stack}>
                        {renderContent()}
                        {!noNavbar && <Navbar />}
                    </View>
                </KeyboardAvoidingView>
            ) : (
                <View style={[styles.stack, { flex: 1 }]}>
                    {renderContent()}
                    {!noNavbar && <Navbar />}
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    contentPadding: {
        paddingBottom: 80, // Account for navbar height
    },
    stack: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    }
});

export default Layout;