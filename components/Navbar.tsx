import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Platform,
    Dimensions,
    Easing,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import consts from '../const/consts';

// Define our tab types
type TabName = 'home' | 'stats' | 'plan' | 'profile';

interface ActionItem {
    id: string;
    icon: React.ComponentProps<typeof Feather>['name'];
    text: string;
    onPress: () => void;
}

interface NavbarProps {
    activeTab: TabName;
    onTabPress: (tab: TabName) => void;
}

interface NavItemProps {
    tabName: TabName;
    iconName: React.ComponentProps<typeof Feather>['name'];
    text: string;
    isActive: boolean;
    onPress: () => void;
}

const { width } = Dimensions.get('window');

const NavItem: React.FC<NavItemProps> = ({ iconName, text, isActive, onPress }) => {
    // Animation value for icon scaling
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
        if (isActive) {
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.2,
                    duration: 200,
                    useNativeDriver: true
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true
                })
            ]).start();
        }
    }, [isActive]);

    const handlePress = () => {
        onPress();
    };

    return (
        <TouchableOpacity
            style={[styles.navItem, isActive && styles.activeItem]}
            onPress={handlePress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={text}
            accessibilityState={{ selected: isActive }}
        >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Feather
                    name={iconName}
                    size={26}
                    color={isActive ? consts.blueGrotto : '#6b7280'}
                    style={styles.icon}
                />
            </Animated.View>
            <Text style={[styles.navText, isActive && styles.activeText]}>{text}</Text>
        </TouchableOpacity>
    );
};

const FloatingButton: React.FC<{
    item: ActionItem,
    animation: Animated.Value,
    index: number,
    onPress: () => void
}> = ({ item, animation, index, onPress }) => {

    // For a stack layout, we'll position buttons vertically above the main FAB
    // Each button will be positioned at a consistent vertical distance
    const buttonDistance = 70 + (index * 75); // Increased distance for each button

    const buttonAnimation = {
        opacity: animation,
        transform: [
            {
                translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -buttonDistance]
                })
            },
            {
                scale: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1]
                })
            }
        ]
    };

    return (
        <Animated.View style={[styles.floatingButtonContainer, buttonAnimation]}>
            <TouchableOpacity
                style={styles.actionButton}
                onPress={onPress}
                activeOpacity={0.8}
            >
                <View style={styles.actionIconContainer}>
                    <Feather name={item.icon} size={22} color={consts.white} />
                </View>
                <View style={styles.actionLabelContainer}>
                    <Text style={styles.actionLabel}>{item.text}</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabPress }) => {
    const insets = useSafeAreaInsets();
    const [menuVisible, setMenuVisible] = useState(false);
    const [buttonsAnimated, setButtonsAnimated] = useState(false);

    // Animation for the FAB rotation
    const rotationValue = useState(new Animated.Value(0))[0];
    const rotationDegree = rotationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg']
    });

    // Animations for each floating button
    const buttonAnimations = useRef(Array(4).fill(0).map(() => new Animated.Value(0))).current;

    // Handle FAB press - show/hide menu
    const handleFabPress = () => {
        if (!menuVisible) {
            // Opening the menu
            setMenuVisible(true);

            // Animate FAB rotation
            Animated.timing(rotationValue, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            // Stagger animation for buttons popping up one after another
            Animated.stagger(
                100, // Stagger time between animations
                buttonAnimations.map(anim =>
                    Animated.spring(anim, {
                        toValue: 1,
                        tension: 50,
                        friction: 7,
                        useNativeDriver: true
                    })
                )
            ).start(() => {
                setButtonsAnimated(true);
            });
        } else {
            // Closing the menu

            // Animate FAB rotation
            Animated.timing(rotationValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();

            // Better closing animation sequence:
            // Buttons fly back to the FAB with a nicer curve
            Animated.stagger(
                60,
                [...buttonAnimations].reverse().map(anim =>
                    Animated.timing(anim, {
                        toValue: 0,
                        duration: 250,
                        easing: Easing.bezier(0.25, 1, 0.5, 1), // Smooth curve for retraction
                        useNativeDriver: true
                    })
                )
            ).start(() => {
                setMenuVisible(false);
                setButtonsAnimated(false);
            });
        }
    };

    // Handle button press with animation
    const handleButtonPress = (callback: () => void) => {
        // Execute the action callback
        callback();

        // Animate button press with a bounce effect
        Animated.sequence([
            // First close other buttons
            Animated.parallel([
                Animated.timing(rotationValue, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]),

            // Then animate buttons closing with delay to show pressed effect
            Animated.delay(100),

            Animated.stagger(
                50,
                [...buttonAnimations].reverse().map(anim =>
                    Animated.timing(anim, {
                        toValue: 0,
                        duration: 200,
                        easing: Easing.bezier(0.25, 1, 0.5, 1), // Smooth curve for retraction
                        useNativeDriver: true
                    })
                )
            )
        ]).start(() => {
            setMenuVisible(false);
            setButtonsAnimated(false);
        });
    };

    // Define action items
    const actionItems: ActionItem[] = [
        {
            id: 'off-plan',
            icon: 'menu',
            text: 'Ate Off Plan',
            onPress: () => {
                console.log('Ate something off plan');
                // Open form to log what the user actually ate
                // Trigger AI to adapt the rest of the day
            }
        },
        {
            id: 'quick-add',
            icon: 'camera',
            text: 'Quick Add',
            onPress: () => {
                console.log('Quick add meal');
                // Use AI/vision to scan a plate or describe the meal
            }
        },
        {
            id: 'regenerate',
            icon: 'refresh-cw',
            text: 'Regenerate',
            onPress: () => {
                console.log('Regenerate meals');
                // Ask: "Do you want to update just today's meals?"
                // Call Azure Function to modify the current day in the weekly plan
            }
        },
        {
            id: 'note',
            icon: 'edit-3',
            text: 'Add Note',
            onPress: () => {
                console.log('Add note for AI');
                // Add note like "Felt tired today"
                // Store in AI memory to personalize future plans
            }
        }
    ];

    return (
        <View style={[
            styles.container,
            { paddingBottom: Math.max(insets.bottom, 4) }
        ]}>
            {/* Floating action buttons */}
            <View style={styles.fabContainer}>
                {menuVisible && actionItems.map((item, index) => (
                    <FloatingButton
                        key={item.id}
                        item={item}
                        animation={buttonAnimations[index]}
                        index={index}
                        onPress={() => handleButtonPress(item.onPress)}
                    />
                ))}

                {/* Main FAB */}
                <TouchableOpacity
                    style={styles.fab}
                    onPress={handleFabPress}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel="Open meal options"
                >
                    <Animated.View style={{ transform: [{ rotate: rotationDegree }] }}>
                        <Feather name="plus" size={28} color={consts.white} />
                    </Animated.View>
                </TouchableOpacity>
            </View>

            <View style={styles.navbar}>
                <NavItem
                    tabName="home"
                    iconName="home"
                    text="Home"
                    isActive={activeTab === 'home'}
                    onPress={() => onTabPress('home')}
                />
                <NavItem
                    tabName="stats"
                    iconName="bar-chart-2"
                    text="Stats"
                    isActive={activeTab === 'stats'}
                    onPress={() => onTabPress('stats')}
                />
                <View style={styles.placeholder} />
                <NavItem
                    tabName="plan"
                    iconName="calendar"
                    text="Plan"
                    isActive={activeTab === 'plan'}
                    onPress={() => onTabPress('plan')}
                />
                <NavItem
                    tabName="profile"
                    iconName="user"
                    text="Profile"
                    isActive={activeTab === 'profile'}
                    onPress={() => onTabPress('profile')}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: consts.platform.navbarBottom, // Using centralized platform-specific value
        left: consts.spacing.lg, // Using responsive spacing
        right: consts.spacing.lg, // Using responsive spacing
        zIndex: 1000,
    },
    navbar: {
        flexDirection: 'row',
        backgroundColor: consts.white,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: 60, // Reduced height from 70 to 60
        borderRadius: 30, // Added rounded corners
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        paddingHorizontal: 12, // Added horizontal padding
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingVertical: 8, // Reduced padding from 10
        height: 60, // Match navbar height
    },
    activeItem: {
        position: 'relative',
    },
    icon: {
        marginBottom: 4,
    },
    navText: {
        fontSize: 13, // Increased font size
        color: '#6b7280',
        fontWeight: '500',
    },
    activeText: {
        color: consts.blueGrotto,
        fontWeight: '600',
    },
    placeholder: {
        width: 65, // Reduced width from 74
    },
    fabContainer: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: Platform.OS === 'android' ? -4 : 26,
        zIndex: 10,
    },
    fab: {
        width: 48, // Reduced from 66
        height: 48, // Reduced from 66
        borderRadius: 29, // Half of width/height
        backgroundColor: consts.blueGrotto,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        marginBottom: 15, // Reduced from 30
        shadowRadius: 6,
        elevation: 5,
        zIndex: 10,
    },
    floatingButtonContainer: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: consts.white,
        borderRadius: 28,
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        marginBottom: 20, // Reduced from 30
        elevation: 5,
        paddingVertical: 8, // Reduced from 10
        paddingHorizontal: 14, // Reduced from 16
        minWidth: 240, // Reduced from 300
    },
    actionIconContainer: {
        width: 38, // Reduced from 42
        height: 38, // Reduced from 42
        borderRadius: 19, // Half of width/height
        backgroundColor: consts.blueGrotto,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionLabelContainer: {
        paddingHorizontal: 4, // Increased padding
        flex: 1, // Take remaining space
    },
    actionLabel: {
        color: consts.midnightBlue,
        fontWeight: '600',
        fontSize: 15, // Increased font size
    }
});

export default Navbar;
