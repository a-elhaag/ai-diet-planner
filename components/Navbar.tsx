import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import consts from '../const/consts';

export type TabName = 'home' | 'offplan' | 'plan' | 'profile';

interface NavItemProps {
    tabName: TabName;
    iconName: React.ComponentProps<typeof Feather>['name'];
    text: string;
    isActive: boolean;
    onPress: () => void;
}

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

    return (
        <TouchableOpacity
            style={[styles.navItem, isActive && styles.activeItem]}
            onPress={onPress}
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

interface NavbarProps {
    activeTab: TabName;
    onTabPress: (tab: TabName) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabPress }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[
            styles.container,
            { paddingBottom: Math.max(insets.bottom, 4) }
        ]}>
            <View style={styles.navbar}>
                <NavItem
                    tabName="home"
                    iconName="home"
                    text="Home"
                    isActive={activeTab === 'home'}
                    onPress={() => onTabPress('home')}
                />
                <NavItem
                    tabName="offplan"
                    iconName="edit-3"
                    text="Off Plan"
                    isActive={activeTab === 'offplan'}
                    onPress={() => onTabPress('offplan')}
                />
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
        bottom: consts.platform.navbarBottom,
        left: consts.spacing.lg,
        right: consts.spacing.lg,
        zIndex: 1000,
    },
    navbar: {
        flexDirection: 'row',
        backgroundColor: consts.white,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: 60,
        borderRadius: 30,
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        paddingHorizontal: 12,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingVertical: 8,
        height: 60,
    },
    activeItem: {
        position: 'relative',
    },
    icon: {
        marginBottom: 4,
    },
    navText: {
        fontSize: 13,
        color: '#6b7280',
        fontWeight: '500',
    },
    activeText: {
        color: consts.blueGrotto,
        fontWeight: '600',
    }
});

export default Navbar;
