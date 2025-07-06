import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, ActivityIndicator, Alert, Share } from 'react-native';
import { Feather } from '@expo/vector-icons';
import consts from '../const/consts';
import Button from '../components/ui/Button';
import { useUnit } from '../contexts/UnitContext';
import { useMealPlanContext } from '../contexts/MealPlanContext';
import { UserMetrics, UserPreferences, Gender, DietType, DietGoal } from '../types/user';

const ProfileScreen: React.FC = () => {
    const { unitSystem, toggleUnitSystem, formatWeight, formatHeight } = useUnit();
    const { 
        currentPlan, 
        userProgress, 
        appSettings, 
        updateSettings, 
        exportData, 
        importData,
        generateNewPlan 
    } = useMealPlanContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Mock user data - in a real app, this would come from a user profile store or API
    // Assuming height is 5'11" (71 inches) and weight is 152 lbs
    const heightInInches = 71; // 5'11"
    const weightInLbs = 152;
    
    // Create user metrics and preferences objects
    const userMetrics: UserMetrics = {
        age: 32,
        weight: unitSystem === 'metric' ? Math.round(weightInLbs * 0.453592) : weightInLbs,
        height: unitSystem === 'metric' ? Math.round(heightInInches * 2.54) : heightInInches,
        gender: 'male' as Gender,
        unit: unitSystem,
        activityLevel: 'moderate'
    };
    
    const userPreferences: UserPreferences = {
        goals: ['weight_loss', 'general_health'] as DietGoal[],
        dietType: 'low_carb' as DietType,
        allergies: ['peanuts'],
        dislikes: ['olives', 'sardines'],
        mealCount: 4
    };

    const handleGeneratePlan = async (metrics: UserMetrics, preferences: UserPreferences) => {
        setLoading(true);
        setError(null);
        try {
            // This would integrate with the meal plan generation logic
            Alert.alert('Plan Generated', 'Your new meal plan has been created!');
        } catch (err) {
            setError('Failed to generate meal plan');
        } finally {
            setLoading(false);
        }
    };

    const handleExportData = async () => {
        try {
            const data = await exportData();
            const message = `AI Diet Planner Data Export\n\nTotal Points: ${userProgress.points}\nCurrent Streak: ${userProgress.streaks.current}\nMeals Logged: ${Object.keys(data).length}\n\nExported on: ${new Date().toLocaleDateString()}`;
            
            await Share.share({
                message: message,
                title: 'AI Diet Planner Export'
            });
        } catch (error) {
            Alert.alert('Export Error', 'Failed to export data');
        }
    };

    const handlePrivacyToggle = (setting: string, value: boolean) => {
        updateSettings({
            ...appSettings,
            privacy: {
                ...appSettings.privacy,
                [setting]: value
            }
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Feather name="user" size={50} color={consts.deepGreen} />
                        </View>
                        <TouchableOpacity style={styles.editButton}>
                            <Feather name="edit-2" size={16} color={consts.offWhite} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>John Doe</Text>
                    <Text style={styles.userStats}>Goal: Lose weight | Plan: Low Carb</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Height</Text>
                        <Text style={styles.infoValue}>{formatHeight(heightInInches)}</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Weight</Text>
                        <Text style={styles.infoValue}>{formatWeight(weightInLbs)}</Text>
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

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>App Settings</Text>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Units</Text>
                        <View style={styles.unitToggleContainer}>
                            <Text style={[
                                styles.unitLabel,
                                unitSystem === 'imperial' ? styles.activeUnitLabel : {}
                            ]}>
                                Imperial
                            </Text>
                            <Switch
                                trackColor={{ false: consts.lightPeach, true: consts.lightPeach }}
                                thumbColor={unitSystem === 'metric' ? consts.deepGreen : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleUnitSystem}
                                value={unitSystem === 'metric'}
                                style={styles.switch}
                            />
                            <Text style={[
                                styles.unitLabel,
                                unitSystem === 'metric' ? styles.activeUnitLabel : {}
                            ]}>
                                Metric
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>AI Meal Plan Generation</Text>
                    <Text style={styles.infoText}>
                        Generate a personalized meal plan based on your profile using our AI-powered system.
                    </Text>
                    
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={consts.deepGreen} />
                            <Text style={styles.loadingText}>Generating your personalized meal plan...</Text>
                        </View>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>Error: {error.message}</Text>
                            <Button 
                                text="Try Again" 
                                variant="primary" 
                                onPress={() => handleGeneratePlan(userMetrics, userPreferences)}
                            />
                        </View>
                    ) : mealPlan ? (
                        <View style={styles.mealPlanPreview}>
                            <Text style={styles.previewTitle}>Your Meal Plan is Ready!</Text>
                            <Text style={styles.previewDetail}>
                                Total calories: {mealPlan.dailyTotals.calories} kcal
                            </Text>
                            <Text style={styles.previewDetail}>
                                Protein: {mealPlan.dailyTotals.protein}g | 
                                Carbs: {mealPlan.dailyTotals.carbohydrates}g | 
                                Fats: {mealPlan.dailyTotals.fats}g
                            </Text>
                            <Button 
                                text="View Full Meal Plan" 
                                variant="primary" 
                                onPress={() => Alert.alert('Navigate to Meal Plan', 'In a complete app, this would navigate to the meal plan details screen.')}
                            />
                        </View>
                    ) : (
                        <Button 
                            text="Generate Meal Plan" 
                            variant="primary" 
                            onPress={() => handleGeneratePlan(userMetrics, userPreferences)}
                        />
                    )}
                </View>

                {/* Privacy & Data Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Privacy & Data</Text>
                    
                    <View style={styles.settingItem}>
                        <View style={styles.settingContent}>
                            <Text style={styles.settingLabel}>Local Data Only</Text>
                            <Text style={styles.settingDescription}>All your data stays on your device</Text>
                        </View>
                        <View style={styles.privacyBadge}>
                            <Feather name="shield" size={16} color={consts.deepGreen} />
                            <Text style={styles.privacyText}>Secured</Text>
                        </View>
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingContent}>
                            <Text style={styles.settingLabel}>Analytics</Text>
                            <Text style={styles.settingDescription}>Help improve the app with anonymous usage data</Text>
                        </View>
                        <Switch
                            value={appSettings.privacy?.allowAnalytics ?? false}
                            onValueChange={(value) => handlePrivacyToggle('allowAnalytics', value)}
                            trackColor={{ false: '#d1d5db', true: consts.deepGreen }}
                        />
                    </View>

                    <TouchableOpacity style={styles.actionButton} onPress={handleExportData}>
                        <Feather name="download" size={20} color={consts.deepGreen} />
                        <Text style={styles.actionButtonText}>Export My Data</Text>
                        <Feather name="chevron-right" size={20} color={consts.richGray} />
                    </TouchableOpacity>
                </View>

                {/* Gamification Progress */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your Progress</Text>
                    
                    <View style={styles.progressCard}>
                        <View style={styles.progressItem}>
                            <Text style={styles.progressValue}>{userProgress.points}</Text>
                            <Text style={styles.progressLabel}>Total Points</Text>
                        </View>
                        <View style={styles.progressItem}>
                            <Text style={styles.progressValue}>{userProgress.streaks.current}</Text>
                            <Text style={styles.progressLabel}>Day Streak</Text>
                        </View>
                        <View style={styles.progressItem}>
                            <Text style={styles.progressValue}>{userProgress.badges.length}</Text>
                            <Text style={styles.progressLabel}>Badges Earned</Text>
                        </View>
                    </View>
                </View>

                <Button
                    text='Edit Profile'
                    onPress={() => console.log('Edit Profile')}
                    variant='primary'
                    size='medium'
                    fullWidth
                />
                <Button
                    text='Logout'
                    onPress={() => console.log('Logout')}
                    variant='outline'
                    size='medium'
                    fullWidth
                />

                {/* Add extra padding space at bottom to prevent navbar overlap */}
                <View style={styles.bottomPadding} />
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: consts.lightPeach,
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
        backgroundColor: consts.offWhite,
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
        backgroundColor: consts.deepGreen,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: consts.offWhite,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: consts.deepGreen,
    },
    userStats: {
        fontSize: 16,
        color: consts.richGray,
        marginTop: 4,
    },
    section: {
        backgroundColor: consts.offWhite,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: consts.deepGreen,
        marginBottom: 12,
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        alignItems: 'center',
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
        backgroundColor: 'rgba(28, 83, 74, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        color: consts.deepGreen,
        fontWeight: '500',
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        padding: 15,
        backgroundColor: '#fee2e2',
        borderRadius: 8,
        marginVertical: 10,
    },
    errorText: {
        color: '#ef4444',
        marginBottom: 10,
    },
    mealPlanPreview: {
        backgroundColor: '#f0fdf4',
        padding: 15,
        borderRadius: 8,
        marginVertical: 10,
    },
    previewTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: consts.deepGreen,
        marginBottom: 5,
    },
    previewDetail: {
        fontSize: 14,
        color: '#333',
        marginBottom: 10,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
    },
    unitToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    switch: {
        marginHorizontal: 5,
    },
    unitLabel: {
        fontSize: 14,
        color: '#666',
    },
    activeUnitLabel: {
        fontWeight: '600',
        color: consts.deepGreen,
    },
    bottomPadding: {
        height: 20,
        marginBottom: 10,
    },
    privacyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(28, 83, 74, 0.1)',
        borderRadius: 16,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    privacyText: {
        color: consts.deepGreen,
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: consts.white,
        borderRadius: 16,
        marginTop: 8,
    },
    actionButtonText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: consts.richGray,
        marginLeft: 12,
    },
    progressCard: {
        flexDirection: 'row',
        backgroundColor: consts.white,
        borderRadius: 16,
        padding: 16,
        justifyContent: 'space-around',
    },
    progressItem: {
        alignItems: 'center',
    },
    progressValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: consts.deepGreen,
        marginBottom: 4,
    },
    progressLabel: {
        fontSize: 12,
        color: consts.richGray,
        textAlign: 'center',
    },
    footerSpace: {
        height: 80,
    },
});

export default ProfileScreen;
