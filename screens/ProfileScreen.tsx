import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, ActivityIndicator, Alert, Share, TextInput, Modal } from 'react-native';
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
        generateNewPlan,
        userInfo,
        updateUserInfo,
        resetWeeklyProgress,
        resetDailyProgress
    } = useMealPlanContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);

    // Create user metrics and preferences objects from context
    const userMetrics: UserMetrics = {
        age: userInfo.age,
        weight: userInfo.weight,
        height: userInfo.height,
        gender: userInfo.gender as Gender,
        unit: unitSystem,
        activityLevel: userInfo.activityLevel
    };
    
    const userPreferences: UserPreferences = {
        goals: ['weight_loss', 'general_health'] as DietGoal[],
        dietType: 'low_carb' as DietType,
        allergies: ['peanuts'],
        dislikes: ['olives', 'sardines'],
        mealCount: 4
    };

    const handleEditField = (field: string, currentValue: string | number) => {
        setEditingField(field);
        setEditValue(currentValue.toString());
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        if (!editingField) return;
        
        const updates: any = {};
        if (editingField === 'name' || editingField === 'email') {
            updates[editingField] = editValue;
        } else {
            updates[editingField] = parseFloat(editValue) || 0;
        }
        
        updateUserInfo(updates);
        setShowEditModal(false);
        setEditingField(null);
        setEditValue('');
    };

    const handleResetProgress = (type: 'daily' | 'weekly') => {
        Alert.alert(
            `Reset ${type.charAt(0).toUpperCase() + type.slice(1)} Progress`,
            `Are you sure you want to reset your ${type} progress? This will clear all tracked data for this ${type === 'daily' ? 'day' : 'week'}.`,
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Reset', 
                    style: 'destructive',
                    onPress: () => {
                        if (type === 'daily') {
                            resetDailyProgress();
                        } else {
                            resetWeeklyProgress();
                        }
                        Alert.alert('Success', `${type.charAt(0).toUpperCase() + type.slice(1)} progress has been reset.`);
                    }
                }
            ]
        );
    };

    const handleGeneratePlan = async (metrics: UserMetrics, preferences: UserPreferences) => {
        setLoading(true);
        setError(null);
        try {
            await generateNewPlan(metrics, preferences, "Generate a balanced meal plan suitable for my goals and preferences");
            Alert.alert('Success!', 'Your new meal plan has been created!');
        } catch (err) {
            setError('Failed to generate meal plan. Please try again.');
            console.error('Plan generation error:', err);
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
                    <TouchableOpacity 
                        style={styles.editableRow}
                        onPress={() => handleEditField('name', userInfo.name)}
                    >
                        <Text style={styles.userName}>{userInfo.name}</Text>
                        <Feather name="edit-2" size={16} color={consts.deepGreen} />
                    </TouchableOpacity>
                    <Text style={styles.userStats}>Goal: Lose weight | Plan: Low Carb</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>

                    <TouchableOpacity 
                        style={styles.infoItem}
                        onPress={() => handleEditField('height', userInfo.height)}
                    >
                        <Text style={styles.infoLabel}>Height</Text>
                        <View style={styles.editableValue}>
                            <Text style={styles.infoValue}>
                                {unitSystem === 'metric' ? `${userInfo.height} cm` : `${Math.floor(userInfo.height / 2.54 / 12)}'${Math.round((userInfo.height / 2.54) % 12)}"`}
                            </Text>
                            <Feather name="edit-2" size={14} color={consts.deepGreen} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.infoItem}
                        onPress={() => handleEditField('weight', userInfo.weight)}
                    >
                        <Text style={styles.infoLabel}>Weight</Text>
                        <View style={styles.editableValue}>
                            <Text style={styles.infoValue}>
                                {unitSystem === 'metric' ? `${userInfo.weight} kg` : `${Math.round(userInfo.weight * 2.20462)} lbs`}
                            </Text>
                            <Feather name="edit-2" size={14} color={consts.deepGreen} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.infoItem}
                        onPress={() => handleEditField('age', userInfo.age)}
                    >
                        <Text style={styles.infoLabel}>Age</Text>
                        <View style={styles.editableValue}>
                            <Text style={styles.infoValue}>{userInfo.age}</Text>
                            <Feather name="edit-2" size={14} color={consts.deepGreen} />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Activity Level</Text>
                        <Text style={styles.infoValue}>{userInfo.activityLevel.replace('_', ' ')}</Text>
                    </View>

                    <TouchableOpacity 
                        style={styles.infoItem}
                        onPress={() => handleEditField('email', userInfo.email || '')}
                    >
                        <Text style={styles.infoLabel}>Email</Text>
                        <View style={styles.editableValue}>
                            <Text style={styles.infoValue}>{userInfo.email || 'Not set'}</Text>
                            <Feather name="edit-2" size={14} color={consts.deepGreen} />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Progress Tracking</Text>
                    <Text style={styles.infoText}>
                        Reset your progress tracking to start fresh. This will clear your logged meals, hydration, and activity data.
                    </Text>
                    
                    <View style={styles.resetContainer}>
                        <Button 
                            text="Reset Daily Progress" 
                            variant="secondary" 
                            onPress={() => handleResetProgress('daily')}
                        />
                        <Button 
                            text="Reset Weekly Progress" 
                            variant="secondary" 
                            onPress={() => handleResetProgress('weekly')}
                        />
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
                            <Text style={styles.errorText}>Error: {error}</Text>
                            <Button 
                                text="Try Again" 
                                variant="primary" 
                                onPress={() => handleGeneratePlan(userMetrics, userPreferences)}
                            />
                        </View>
                    ) : currentPlan ? (
                        <View style={styles.mealPlanPreview}>
                            <Text style={styles.previewTitle}>Your Meal Plan is Ready!</Text>
                            <Text style={styles.previewDetail}>
                                Total calories: {currentPlan.dailyTotals?.calories || 0} kcal
                            </Text>
                            <Text style={styles.previewDetail}>
                                Protein: {currentPlan.dailyTotals?.protein || 0}g | 
                                Carbs: {currentPlan.dailyTotals?.carbohydrates || 0}g | 
                                Fats: {currentPlan.dailyTotals?.fats || 0}g
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

            {/* Edit Modal */}
            <Modal
                visible={showEditModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowEditModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Edit {editingField ? editingField.charAt(0).toUpperCase() + editingField.slice(1) : ''}
                        </Text>
                        
                        <TextInput
                            style={styles.modalInput}
                            value={editValue}
                            onChangeText={setEditValue}
                            placeholder={`Enter ${editingField}`}
                            keyboardType={
                                editingField === 'email' ? 'email-address' :
                                editingField === 'name' ? 'default' : 'numeric'
                            }
                            autoFocus
                        />
                        
                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setShowEditModal(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleSaveEdit}
                            >
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        paddingTop: 16 + consts.platform.topMargin, // Extra top padding for Android
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 24,
        paddingVertical: 20,
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
        backgroundColor: consts.white, // White component
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
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    settingContent: {
        flex: 1,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: consts.richGray,
        marginBottom: 2,
    },
    settingDescription: {
        fontSize: 14,
        color: '#666',
    },
    editableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    editableValue: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    resetContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: consts.white,
        borderRadius: 16,
        padding: 24,
        width: '80%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: consts.richGray,
        marginBottom: 16,
        textAlign: 'center',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: '#f8fafc',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f1f5f9',
    },
    saveButton: {
        backgroundColor: consts.deepGreen,
    },
    cancelButtonText: {
        color: consts.richGray,
        fontWeight: '500',
    },
    saveButtonText: {
        color: consts.white,
        fontWeight: '600',
    },
});

export default ProfileScreen;
