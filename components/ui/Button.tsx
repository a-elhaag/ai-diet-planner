import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, View } from 'react-native';
import consts from '../../const/consts';

interface ButtonProps extends TouchableOpacityProps {
    title?: string; // Title text (either title or text is required)
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    text?: string; // Alternative to title (for backward compatibility)
    textStyle?: any; // For styling text
}

const Button: React.FC<ButtonProps> = ({
    title,
    text,
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    style,
    textStyle,
    ...rest
}) => {
    // Ensure we use text or title or empty string (for safety)
    const buttonText = text || title || '';
    const getBackgroundColor = () => {
        switch (variant) {
            case 'primary':
                return consts.deepGreen;
            case 'secondary':
                return consts.richGray;
            case 'outline':
                return 'transparent';
            default:
                return consts.deepGreen;
        }
    };

    const getTextColor = () => {
        return variant === 'outline' ? consts.deepGreen : consts.offWhite;
    };

    const getBorderStyle = () => {
        return variant === 'outline' ? { borderWidth: 2, borderColor: consts.deepGreen } : {};
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
                style={[styles.text, { color: getTextColor() }, textStyle]}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {buttonText}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 28,
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