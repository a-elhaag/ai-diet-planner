import { Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Responsive sizing helper
const scale = (size: number): number => {
    const baseWidth = 375; // Standard iPhone width
    const widthPercent = (size * width) / baseWidth;
    return Math.round(widthPercent);
};

// Platform-specific values
const platformValues = {
    navbarBottom: Platform.OS === 'android' ? 20 : 0,
    contentPadding: Platform.OS === 'android' ? 110 : 90,
    cardHeight: Platform.OS === 'android' ? 500 : 470,
    buttonShadow: Platform.OS === 'android' ? 2 : 4,
};

const consts = {
    midnightBlue: "#265B8B",
    ivory: "#ECECEB",
    babyBlue: "#84C7F2",
    blueGrotto: "#1181C8",
    white: "#FFF",
    black: "#000",
    radius: 15,
    borderWidth: 2,

    // Spacing
    spacing: {
        xs: scale(4),
        sm: scale(8),
        md: scale(16),
        lg: scale(24),
        xl: scale(32),
        xxl: scale(48),
    },

    // Typography
    font: {
        small: scale(12),
        medium: scale(14),
        large: scale(16),
        xlarge: scale(18),
        xxlarge: scale(22),
    },

    // Platform specific values
    platform: platformValues,

    // Responsive functions
    scale,

    // Device info
    deviceWidth: width,
    deviceHeight: height,
};

export default consts;
