import React from 'react';
import Layout from '../components/Layout';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import consts from '../const/consts';

interface ActionItemProps {
    icon: React.ComponentProps<typeof Feather>['name'];
    title: string;
    description: string;
    onPress: () => void;
}

const ActionItem: React.FC<ActionItemProps> = ({ icon, title, description, onPress }) => {
    return (
        <TouchableOpacity style={styles.actionItem} onPress={onPress}>
            <View style={styles.actionIcon}>
                <Feather name={icon} size={22} color={consts.midnightBlue} />
            </View>
            <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{title}</Text>
                <Text style={styles.actionDescription}>{description}</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#AAAAAA" />
        </TouchableOpacity>
    );
};

export default function Settings() {
    return (
        <Layout>
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Settings</Text>
                    <Text style={styles.subtitle}>Manage your preferences and account settings</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <View style={styles.actionStack}>
                        <ActionItem
                            icon="user"
                            title="Profile Information"
                            description="Update your personal details"
                            onPress={() => { }}
                        />
                        <ActionItem
                            icon="bell"
                            title="Notifications"
                            description="Configure app notifications"
                            onPress={() => { }}
                        />
                        <ActionItem
                            icon="shield"
                            title="Privacy"
                            description="Manage your data and privacy"
                            onPress={() => { }}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <View style={styles.actionStack}>
                        <ActionItem
                            icon="target"
                            title="Goals"
                            description="Set your health and fitness goals"
                            onPress={() => { }}
                        />
                        <ActionItem
                            icon="pie-chart"
                            title="Dietary Restrictions"
                            description="Customize your diet preferences"
                            onPress={() => { }}
                        />
                        <ActionItem
                            icon="activity"
                            title="Activity Level"
                            description="Update your exercise frequency"
                            onPress={() => { }}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>App Settings</Text>
                    <View style={styles.actionStack}>
                        <ActionItem
                            icon="globe"
                            title="Language"
                            description="Choose your preferred language"
                            onPress={() => { }}
                        />
                        <ActionItem
                            icon="moon"
                            title="Appearance"
                            description="Set light or dark mode"
                            onPress={() => { }}
                        />
                        <ActionItem
                            icon="help-circle"
                            title="Help & Support"
                            description="Get assistance with using the app"
                            onPress={() => { }}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.actionStack}>
                        <TouchableOpacity style={[styles.actionItem, styles.dangerAction]}>
                            <Feather name="log-out" size={22} color="#E53935" />
                            <Text style={styles.dangerText}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.version}>App Version 1.0.0</Text>
                </View>
            </ScrollView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: consts.ivory,
    },
    header: {
        padding: 20,
        paddingTop: 40,
        backgroundColor: consts.white,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: consts.midnightBlue,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 10,
    },
    section: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: consts.midnightBlue,
        marginBottom: 12,
        paddingHorizontal: 20,
    },
    actionStack: {
        backgroundColor: consts.white,
        borderRadius: 16,
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        marginHorizontal: 16,
        overflow: 'hidden',
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(132, 199, 242, 0.15)', // Using babyBlue with opacity
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    actionContent: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: consts.midnightBlue,
        marginBottom: 4,
    },
    actionDescription: {
        fontSize: 14,
        color: '#666',
    },
    dangerAction: {
        justifyContent: 'center',
    },
    dangerText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#E53935',
        marginLeft: 12,
    },
    footer: {
        padding: 20,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 50,
    },
    version: {
        fontSize: 14,
        color: '#999',
    },
});
