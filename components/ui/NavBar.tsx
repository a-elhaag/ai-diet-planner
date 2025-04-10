import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/const';

// Define navigation tabs
const TABS = [
    { id: 'home', label: 'Home', iconName: 'home' },
    { id: 'stats', label: 'Stats', iconName: 'bar-chart' },
    { id: 'plan', label: 'Plan', iconName: 'restaurant' },
    { id: 'profile', label: 'Profile', iconName: 'person' }
];

interface NavBarProps {
    activeTab: string;
    onTabPress: (tabId: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ activeTab, onTabPress }) => {
    return (
        <View style={styles.container}>
            {TABS.map(tab => {
                const isActive = activeTab === tab.id;
                // Add -outline suffix for inactive icons
                const iconName = isActive ? tab.iconName : `${tab.iconName}-outline`;

                return (
                    <TouchableOpacity
                        key={tab.id}
                        style={styles.tabItem}
                        onPress={() => onTabPress(tab.id)}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={iconName as any}
                            size={24}
                            color={isActive ? colors.blueGrotto : '#888'}
                        />
                        <Text style={[
                            styles.tabLabel,
                            isActive && styles.activeTabLabel
                        ]}>
                            {tab.label}
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
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: '#ECECEC',
        height: 70,
        paddingBottom: 10,
        paddingTop: 10,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabLabel: {
        fontSize: 12,
        marginTop: 3,
        color: '#888',
        fontWeight: '500'
    },
    activeTabLabel: {
        color: colors.blueGrotto,
        fontWeight: '600',
    }
});

export default NavBar;
