import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, 
    Switch,
    Modal,
    TextInput,
    Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import consts from '../const/consts';
import Button from '../components/ui/Button';
import { useUnit } from '../contexts/UnitContext';
import { useAuth } from '../contexts/AuthContext';
import { Picker } from '@react-native-picker/picker';

const activityLevels = [
    'Sedentary',
    'Lightly Active',
    'Moderately Active',
    'Very Active',
    'Extra Active',
];

const dietaryRestrictionsList = [
    'None',
    'Vegetarian',
    'Vegan',
    'Gluten-free',
    'Dairy-free',
    'Kosher',
    'Halal',
];

interface EditFormData {
    name: string;
    age: string;
    weight: string;
    height: string;
    goal: string;
    activityLevel: string;
    dietaryRestrictions: string[];
}

const ProfileScreen: React.FC = () => {
    const {formatWeight, formatHeight } = useUnit();
    const { user, signOut, signIn } = useAuth();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editData, setEditData] = useState<EditFormData>({
        name: user?.name || '',
        age: user?.age.toString() || '',
        weight: user?.weight.toString() || '',
        height: user?.height.toString() || '',
        goal: user?.goal || '',
        activityLevel: user?.activityLevel || 'Sedentary',
        dietaryRestrictions: user?.dietaryRestrictions || ['None'],
    });

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleSaveProfile = async () => {
        try {
            await signIn({
                ...editData,
                age: parseInt(editData.age),
                weight: parseFloat(editData.weight),
                height: parseFloat(editData.height),
            });
            setIsEditModalVisible(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (!user) return null;

    return (
        <View style={styles.container}>
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
            >
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={styles.profileInfo}>
                            <View style={styles.avatar}>
                                <Feather name="user" size={40} color={consts.blueGrotto} />
                            </View>
                            <View style={styles.nameContainer}>
                                <Text style={styles.name}>{user.name}</Text>
                                <Text style={styles.goal}>{user.goal}</Text>
                            </View>
                        </View>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.editButton]}
                                onPress={() => setIsEditModalVisible(true)}
                            >
                                <Feather name="edit" size={20} color={consts.white} />
                                <Text style={styles.buttonText}>Edit Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.logoutButton]}
                                onPress={handleLogout}
                            >
                                <Feather name="log-out" size={20} color={consts.white} />
                                <Text style={styles.buttonText}>Log Out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>
                    <View style={styles.infoList}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Height</Text>
                            <Text style={styles.infoValue}>{formatHeight(user.height)}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Weight</Text>
                            <Text style={styles.infoValue}>{formatWeight(user.weight)}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Age</Text>
                            <Text style={styles.infoValue}>{user.age} years</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Activity Level</Text>
                            <Text style={styles.infoValue}>{user.activityLevel}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Dietary Restrictions</Text>
                    <View style={styles.tagContainer}>
                        {user.dietaryRestrictions.map((restriction, index) => (
                            restriction !== 'None' && (
                                <View key={index} style={styles.tag}>
                                    <Text style={styles.tagText}>{restriction}</Text>
                                </View>
                            )
                        ))}
                    </View>
                </View>

                {/* <View style={styles.section}>
                    <Text style={styles.sectionTitle}>App Settings</Text>
                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Units</Text>
                        <View style={styles.unitToggleContainer}>
                            <Text style={[styles.unitLabel, unitSystem === 'imperial' && styles.activeUnitLabel]}>
                                Imperial
                            </Text>
                            <Switch
                                trackColor={{ false: consts.babyBlue, true: consts.babyBlue }}
                                thumbColor={unitSystem === 'metric' ? consts.blueGrotto : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleUnitSystem}
                                value={unitSystem === 'metric'}
                            />
                            <Text style={[styles.unitLabel, unitSystem === 'metric' && styles.activeUnitLabel]}>
                                Metric
                            </Text>
                        </View>
                    </View>
                </View> */}

                {/* Add bottom padding for navbar */}
                <View style={styles.navbarSpacing} />
            </ScrollView>

            {/* Edit Profile Modal */}
            <Modal
                visible={isEditModalVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            <Text style={styles.modalTitle}>Edit Profile</Text>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editData.name}
                                    onChangeText={(text) => setEditData({ ...editData, name: text })}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Age</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editData.age}
                                    onChangeText={(text) => setEditData({ ...editData, age: text })}
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Weight (kg)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editData.weight}
                                    onChangeText={(text) => setEditData({ ...editData, weight: text })}
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Height (cm)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editData.height}
                                    onChangeText={(text) => setEditData({ ...editData, height: text })}
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Goal</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    value={editData.goal}
                                    onChangeText={(text) => setEditData({ ...editData, goal: text })}
                                    multiline
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Activity Level</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={editData.activityLevel}
                                        onValueChange={(value) => 
                                            setEditData({ ...editData, activityLevel: value })
                                        }
                                        style={styles.picker}
                                    >
                                        {activityLevels.map((level) => (
                                            <Picker.Item key={level} label={level} value={level} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Dietary Restrictions</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={editData.dietaryRestrictions[0]}
                                        onValueChange={(value) => 
                                            setEditData({ ...editData, dietaryRestrictions: [value] })
                                        }
                                        style={styles.picker}
                                    >
                                        {dietaryRestrictionsList.map((restriction) => (
                                            <Picker.Item key={restriction} label={restriction} value={restriction} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity 
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setIsEditModalVisible(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.modalButton, styles.saveButton]}
                                    onPress={handleSaveProfile}
                                >
                                    <Text style={styles.modalButtonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: consts.white,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 20, // Extra padding at the bottom
    },
    header: {
        backgroundColor: consts.white,
        paddingHorizontal: consts.spacing.lg,
        paddingTop: consts.spacing.lg,
        paddingBottom: consts.spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: consts.ivory,
    },
    headerContent: {
        gap: consts.spacing.lg,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: consts.spacing.md,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: consts.ivory,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameContainer: {
        flex: 1,
    },
    name: {
        fontSize: consts.font.xlarge,
        fontWeight: 'bold',
        color: consts.midnightBlue,
    },
    goal: {
        fontSize: consts.font.medium,
        color: consts.blueGrotto,
        marginTop: 4,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: consts.spacing.md,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: consts.spacing.md,
        borderRadius: consts.radius,
        gap: consts.spacing.sm,
    },
    editButton: {
        backgroundColor: consts.blueGrotto,
    },
    logoutButton: {
        backgroundColor: '#ff4444',
    },
    buttonText: {
        color: consts.white,
        fontSize: consts.font.medium,
        fontWeight: '600',
    },
    section: {
        padding: consts.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: consts.ivory,
    },
    sectionTitle: {
        fontSize: consts.font.large,
        fontWeight: '600',
        color: consts.midnightBlue,
        marginBottom: consts.spacing.md,
    },
    infoList: {
        backgroundColor: consts.white,
        borderRadius: consts.radius,
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: consts.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: consts.ivory,
    },
    infoLabel: {
        fontSize: consts.font.medium,
        color: consts.midnightBlue,
    },
    infoValue: {
        fontSize: consts.font.medium,
        color: consts.blueGrotto,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: consts.spacing.xs,
        gap: consts.spacing.sm,
    },
    tag: {
        backgroundColor: consts.ivory,
        paddingHorizontal: consts.spacing.md,
        paddingVertical: consts.spacing.xs,
        borderRadius: consts.radius,
    },
    tagText: {
        fontSize: consts.font.small,
        color: consts.midnightBlue,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: consts.spacing.md,
    },
    settingLabel: {
        fontSize: consts.font.medium,
        color: consts.midnightBlue,
    },
    unitToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    unitLabel: {
        fontSize: consts.font.medium,
        color: consts.midnightBlue,
        marginHorizontal: consts.spacing.sm,
    },
    activeUnitLabel: {
        color: consts.blueGrotto,
        fontWeight: 'bold',
    },
    navbarSpacing: {
        height: consts.platform.contentPadding, // Using the platform-specific padding for navbar
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: consts.white,
        borderRadius: consts.radius,
        padding: consts.spacing.lg,
        width: '90%',
        maxHeight: '90%',
    },
    modalTitle: {
        fontSize: consts.font.xlarge,
        fontWeight: 'bold',
        color: consts.midnightBlue,
        marginBottom: consts.spacing.lg,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: consts.spacing.lg,
    },
    label: {
        fontSize: consts.font.medium,
        color: consts.midnightBlue,
        marginBottom: consts.spacing.xs,
    },
    input: {
        backgroundColor: consts.ivory,
        borderRadius: consts.radius,
        padding: consts.spacing.md,
        fontSize: consts.font.medium,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    pickerContainer: {
        backgroundColor: consts.ivory,
        borderRadius: consts.radius,
        overflow: 'hidden',
    },
    picker: {
        width: '100%',
        ...Platform.select({
            ios: {
                height: 150,
            },
            android: {
                height: 50,
            },
        }),
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: consts.spacing.lg,
    },
    modalButton: {
        flex: 1,
        padding: consts.spacing.md,
        borderRadius: consts.radius,
        marginHorizontal: consts.spacing.xs,
    },
    cancelButton: {
        backgroundColor: '#ff4444',
    },
    saveButton: {
        backgroundColor: consts.blueGrotto,
    },
    modalButtonText: {
        color: consts.white,
        fontSize: consts.font.medium,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ProfileScreen;