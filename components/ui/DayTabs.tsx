import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
} from 'react-native';
import colors from '../../theme/const';

interface DayTabsProps {
    days: string[];
    selectedDay: number;
    onSelectDay: (index: number) => void;
}

const DayTabs: React.FC<DayTabsProps> = ({
    days,
    selectedDay,
    onSelectDay,
}) => {
    // Convert full day names to abbreviated forms
    const abbreviatedDays = days.map(day => {
        // Take first 3 characters of each day
        return day.substring(0, 3);
    });

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {abbreviatedDays.map((day, index) => {
                    const isSelected = selectedDay === index;
                    const isFreeDay = index === 5;

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => onSelectDay(index)}
                            style={[
                                styles.dayTab,
                                isSelected && styles.selectedDayTab,
                                isFreeDay && styles.freeDayTab,
                            ]}
                            activeOpacity={0.85}
                        >
                            <View style={styles.dayTabContent}>
                                <Text
                                    style={[
                                        styles.dayText,
                                        isSelected && styles.selectedDayText,
                                    ]}
                                    numberOfLines={1}
                                >
                                    {day}
                                </Text>
                                {isFreeDay && (
                                    <Text
                                        style={[styles.freeDayLabel, isSelected && styles.selectedFreeDayLabel]}
                                        numberOfLines={1}
                                    >
                                        Free 🎉
                                    </Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 12,
        marginBottom: 24,
        paddingHorizontal: 12,
    },
    scrollContent: {
        paddingVertical: 6,
        alignItems: 'center',
    },
    dayTab: {
        width: 70, // Fixed width
        height: 70, // Fixed height
        marginHorizontal: 5,
        backgroundColor: '#E0F2FF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.babyBlue,
        overflow: 'hidden', // Keep the content within borders
    },
    dayTabContent: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
    },
    selectedDayTab: {
        backgroundColor: colors.blueGrotto,
        borderColor: colors.blueGrotto,
    },
    freeDayTab: {
        borderStyle: 'dashed',
        borderWidth: 1.5,
    },
    dayText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.blueGrotto,
        textAlign: 'center',
    },
    selectedDayText: {
        color: colors.white,
        fontWeight: '700',
    },
    freeDayLabel: {
        fontSize: 11,
        marginTop: 3,
        color: colors.babyBlue,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    selectedFreeDayLabel: {
        color: colors.white,
    },
});

export default DayTabs;