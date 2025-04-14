import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import consts from '../const/consts';
import Button from '../components/ui/Button';

const ProfileScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Feather name="user" size={50} color={consts.blueGrotto} />
                        </View>
                        <TouchableOpacity style={styles.editButton}>
                            <Feather name="edit-2" size={16} color={consts.white} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>John Doe</Text>
                    <Text style={styles.userStats}>Goal: Lose weight | Plan: Low Carb</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Height</Text>
                        <Text style={styles.infoValue}>5'11" (180 cm)</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Weight</Text>
                        <Text style={styles.infoValue}>185 lbs (84 kg)</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Age</Text>
                        <Text style={styles.infoValue}>32</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Activity Level</Text>
                        <Text style={styles.infoValue}>Moderately active</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences & Allergies</Text>

                    <View style={styles.tagContainer}>
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>No Peanuts</Text>
                        </View>
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>Vegetarian</Text>
                        </View>
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>Low Sodium</Text>
                        </View>
                    </View>
                </View>
                <Button
                    title='Edit Profile'
                    onPress={() => console.log('Edit Profile')}
                    variant='primary'
                    size='medium'
                    fullWidth
                />
                <Button
                    title='Logout'
                    onPress={() => console.log('Logout')}
                    variant='outline'
                    size='medium'
                    fullWidth
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: consts.ivory,
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: consts.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
    },
    editButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: consts.blueGrotto,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: consts.white,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: consts.midnightBlue,
    },
    userStats: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    section: {
        backgroundColor: consts.white,
        borderRadius: 30,
        padding: 16,
        marginBottom: 20,
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        color: consts.midnightBlue,
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    infoLabel: {
        fontSize: 16,
        color: '#666',
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        backgroundColor: consts.babyBlue + '30',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 38,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        color: consts.blueGrotto,
        fontWeight: '500',
    },
    button: {
        backgroundColor: consts.blueGrotto,
        borderRadius: 30,
        padding: 16,
        alignItems: 'center',
        marginBottom: 12,
    },
    buttonText: {
        color: consts.white,
        fontWeight: '600',
        fontSize: 16,
    },
    logoutButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#d1d5db',
        marginBottom: 30,
    },
    logoutText: {
        color: '#ef4444',
    }
});

export default ProfileScreen;