import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, View } from 'react-native';
import colors from '../../const/colors';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    title,
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    style,
    ...rest
}) => {
    const getBackgroundColor = () => {
        switch (variant) {
            case 'primary':
                return colors.blueGrotto;
            case 'secondary':
                return colors.midnightBlue;
            case 'outline':
                return 'transparent';
            default:
                return colors.blueGrotto;
        }
    };

    const getTextColor = () => {
        return variant === 'outline' ? colors.blueGrotto : colors.white;
    };

    const getBorderStyle = () => {
        return variant === 'outline' ? { borderWidth: 2, borderColor: colors.blueGrotto } : {};
    };

    // Get fixed dimensions based on size
    const getFixedDimensions = () => {
        switch (size) {
            case 'small':
                return { width: 120, height: 36 };
            case 'medium':
                return { width: 160, height: 46 };
            case 'large':
                return { width: 200, height: 56 };
            default:
                return { width: 160, height: 46 };
        }
    };

    const dimensions = getFixedDimensions();
    const finalWidth = fullWidth ? { width: '100%' as const } : { width: dimensions.width };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: getBackgroundColor() },
                { height: dimensions.height },
                finalWidth,
                getBorderStyle(),
                style,
            ]}
            {...rest}
        >
            <Text
                style={[styles.text, { color: getTextColor() }]}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginVertical: 5,
        paddingHorizontal: 16,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        maxWidth: '90%',
    },
});

export default Button;