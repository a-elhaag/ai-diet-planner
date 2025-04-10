import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/const';

interface NavMenuProps {
    currentScreen: string;
    onNavigate: (screen: string) => void;
}

const NavMenu: React.FC<NavMenuProps> = ({ currentScreen, onNavigate }) => {
    const menuItems = [
        { name: 'home', icon: 'home-outline', activeIcon: 'home', label: 'Home' },
        { name: 'meals', icon: 'restaurant-outline', activeIcon: 'restaurant', label: 'Meals' },
        { name: 'progress', icon: 'bar-chart-outline', activeIcon: 'bar-chart', label: 'Progress' },
        { name: 'profile', icon: 'person-outline', activeIcon: 'person', label: 'Profile' },
    ];

    return (
        <View style={styles.container}>
            {menuItems.map((item) => {
                const isActive = currentScreen === item.name;
                return (
                    <TouchableOpacity
                        key={item.name}
                        style={styles.menuItem}
                        onPress={() => onNavigate(item.name)}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={isActive ? item.activeIcon as any : item.icon as any}
                            size={24}
                            color={isActive ? colors.blueGrotto : '#888'}
                        />
                        <Text style={[
                            styles.menuText,
                            isActive && styles.activeMenuText
                        ]}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 70,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: '#ECECEC',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 10,
    },
    menuItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingVertical: 10,
    },
    menuText: {
        fontSize: 12,
        marginTop: 3,
        color: '#888',
    },
    activeMenuText: {
        color: colors.blueGrotto,
        fontWeight: '600',
    },
});

export default NavMenu;
