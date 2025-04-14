import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Animated,
    ScrollView
} from 'react-native';
import { Svg, Path, Circle, Line, G, Text as SvgText, Rect } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import consts from '../../const/consts';

const { width: screenWidth } = Dimensions.get('window');
const graphWidth = screenWidth - 70; // More padding to ensure it stays in container
const graphHeight = 220;

interface DataPoint {
    value: number;
    date: string;
    label?: string;
}

interface GraphProps {
    data: DataPoint[];
    title: string;
    unit?: string;
    color?: string;
    showLabels?: boolean;
    maxValue?: number;
    type?: 'line' | 'bar';
    timeFrame?: 'week' | 'month' | 'year';
    onPointPress?: (point: DataPoint) => void;
}

const Graph: React.FC<GraphProps> = ({
    data,
    title,
    unit = '',
    color = consts.blueGrotto,
    showLabels = true,
    maxValue,
    type = 'line',
    timeFrame = 'week',
    onPointPress,
}) => {
    const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);
    const [focusAnim] = useState(new Animated.Value(0));
    const actualMaxValue = maxValue || Math.max(...data.map(point => point.value)) * 1.2;

    // Calculate time frame labels
    const getTimeFrameLabels = () => {
        if (timeFrame === 'week') {
            return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        } else if (timeFrame === 'month') {
            return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        } else {
            return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        }
    };

    // Calculate graph points
    const getGraphPath = () => {
        if (data.length < 2) return '';

        let path = '';
        const stepX = graphWidth / (data.length - 1);

        // First create the line
        data.forEach((point, index) => {
            const x = index * stepX;
            const y = graphHeight - (point.value / actualMaxValue) * graphHeight;

            if (index === 0) {
                path += `M ${x} ${y}`;
            } else {
                path += ` L ${x} ${y}`;
            }
        });

        // Create gradient fill path
        const lastPoint = data[data.length - 1];
        const lastX = (data.length - 1) * stepX;
        const lastY = graphHeight - (lastPoint.value / actualMaxValue) * graphHeight;

        // Add bottom corners to create closed shape for fill
        path += ` L ${lastX} ${graphHeight} L 0 ${graphHeight} Z`;

        return path;
    };

    const getLinePath = () => {
        if (data.length < 2) return '';

        let path = '';
        const stepX = graphWidth / (data.length - 1);

        // Just the line without fill
        data.forEach((point, index) => {
            const x = index * stepX;
            const y = graphHeight - (point.value / actualMaxValue) * graphHeight;

            if (index === 0) {
                path += `M ${x} ${y}`;
            } else {
                path += ` L ${x} ${y}`;
            }
        });

        return path;
    };

    // Calculate bar positions and sizes for bar chart
    const getBarProps = () => {
        const barWidth = (graphWidth / data.length) * 0.7;
        const spacing = (graphWidth / data.length) * 0.3;

        return data.map((point, index) => {
            const height = (point.value / actualMaxValue) * graphHeight;
            const x = (index * (barWidth + spacing)) + spacing / 2;
            const y = graphHeight - height;

            return {
                x,
                y,
                width: barWidth,
                height,
                point,
            };
        });
    };

    // Handle point selection
    const handlePointPress = (point: DataPoint) => {
        setSelectedPoint(point);

        Animated.sequence([
            Animated.timing(focusAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(focusAnim, {
                toValue: 0.8,
                duration: 100,
                useNativeDriver: true,
            })
        ]).start();

        if (onPointPress) {
            onPointPress(point);
        }
    };

    // Render y-axis labels
    const renderYAxisLabels = () => {
        const divisions = 4; // Reduced for cleaner look
        const labels = [];

        for (let i = 0; i <= divisions; i++) {
            const value = (actualMaxValue / divisions) * i;
            const y = graphHeight - (value / actualMaxValue) * graphHeight;

            labels.push(
                <View key={`y-label-${i}`} style={[styles.yAxisLabel, { bottom: y - 10 }]}>
                    <Text style={styles.axisText}>{Math.round(value)}{unit}</Text>
                </View>
            );

            // Horizontal grid line
            labels.push(
                <View key={`grid-${i}`} style={[styles.gridLine, { bottom: y }]} />
            );
        }

        return labels;
    };

    // Timeframe selector
    const renderTimeFrameSelector = () => {
        const options = ['Week', 'Month', 'Year'];

        return (
            <View style={styles.timeFrameSelector}>
                {options.map((option, index) => (
                    <TouchableOpacity
                        key={option}
                        style={[
                            styles.timeFrameOption,
                            timeFrame.toLowerCase() === option.toLowerCase() && styles.selectedTimeFrame
                        ]}
                    >
                        <Text style={[
                            styles.timeFrameText,
                            timeFrame.toLowerCase() === option.toLowerCase() && styles.selectedTimeFrameText
                        ]}>
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{title}</Text>
                    {selectedPoint && (
                        <Animated.Text
                            style={[
                                styles.selectedValue,
                                { transform: [{ scale: focusAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }) }] }
                            ]}
                        >
                            {selectedPoint.value}{unit}
                        </Animated.Text>
                    )}
                </View>
                <View style={styles.iconContainer}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Feather name="info" size={18} color={consts.midnightBlue} />
                    </TouchableOpacity>
                </View>
            </View>

            {renderTimeFrameSelector()}

            <View style={styles.graphContainer}>
                {renderYAxisLabels()}

                <Svg height={graphHeight} width={graphWidth}>
                    {type === 'line' ? (
                        <>
                            {/* Gradient fill under line */}
                            <Path
                                d={getGraphPath()}
                                fill={`${color}15`} // Very transparent fill
                                stroke="none"
                            />

                            {/* Line graph */}
                            <Path
                                d={getLinePath()}
                                stroke={color}
                                strokeWidth={3}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                            />

                            {/* Data points */}
                            {data.map((point, index) => {
                                const x = (index / (data.length - 1)) * graphWidth;
                                const y = graphHeight - (point.value / actualMaxValue) * graphHeight;
                                const isSelected = selectedPoint === point;

                                return (
                                    <G key={index}>
                                        {/* Larger touch target */}
                                        <Circle
                                            cx={x}
                                            cy={y}
                                            r={15}
                                            fill="transparent"
                                            onPress={() => handlePointPress(point)}
                                        />

                                        {/* Visible point */}
                                        <Circle
                                            cx={x}
                                            cy={y}
                                            r={isSelected ? 7 : 5}
                                            fill={isSelected ? color : consts.white}
                                            stroke={color}
                                            strokeWidth={isSelected ? 3 : 2}
                                        />

                                        {/* Pulse effect on selected point */}
                                        {isSelected && (
                                            <Circle
                                                cx={x}
                                                cy={y}
                                                r={12}
                                                fill="transparent"
                                                stroke={color}
                                                strokeWidth={1.5}
                                                strokeOpacity={0.5}
                                            />
                                        )}
                                    </G>
                                );
                            })}
                        </>
                    ) : (
                        // Bar chart with rounded corners
                        <>
                            {getBarProps().map((bar, index) => (
                                <G key={index}>
                                    {/* Bar with rounded top corners */}
                                    <Path
                                        d={`
                                            M ${bar.x} ${bar.y + 5}
                                            C ${bar.x} ${bar.y}, ${bar.x} ${bar.y}, ${bar.x + 5} ${bar.y}
                                            L ${bar.x + bar.width - 5} ${bar.y}
                                            C ${bar.x + bar.width} ${bar.y}, ${bar.x + bar.width} ${bar.y}, ${bar.x + bar.width} ${bar.y + 5}
                                            L ${bar.x + bar.width} ${bar.y + bar.height}
                                            L ${bar.x} ${bar.y + bar.height}
                                            Z
                                        `}
                                        fill={selectedPoint === bar.point ? color : `${color}CC`}
                                        onPress={() => handlePointPress(bar.point)}
                                    />
                                </G>
                            ))}
                        </>
                    )}
                </Svg>

                {/* X-axis labels */}
                {showLabels && (
                    <View style={styles.xAxisLabels}>
                        {getTimeFrameLabels().map((label, index) => (
                            <View
                                key={`x-label-${index}`}
                                style={[
                                    styles.xAxisLabelContainer,
                                    { width: graphWidth / getTimeFrameLabels().length }
                                ]}
                            >
                                <Text style={styles.axisText}>{label}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {selectedPoint && selectedPoint.label && (
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>{selectedPoint.label}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: consts.white,
        borderRadius: 38,
        padding: 20,
        marginBottom: 20,
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 30,
        elevation: 5,
        alignItems: 'center',
        overflow: 'hidden',
        marginHorizontal: 6,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        width: '100%',
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: consts.midnightBlue,
        marginBottom: 2,
    },
    selectedValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: consts.blueGrotto,
    },
    iconContainer: {
        flexDirection: 'row',
    },
    iconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.03)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    graphContainer: {
        height: graphHeight,
        marginTop: 25,
        marginLeft: 36, // Space for y-axis labels
        position: 'relative',
        alignSelf: 'center',
        marginBottom: 20,
    },
    yAxisLabel: {
        position: 'absolute',
        left: -34,
        width: 30,
        alignItems: 'flex-end',
    },
    axisText: {
        fontSize: 11,
        color: consts.midnightBlue,
        opacity: 0.6,
        fontWeight: '500',
    },
    xAxisLabels: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: -20,
        left: 0,
        right: 0,
    },
    xAxisLabelContainer: {
        alignItems: 'center',
    },
    gridLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: 'rgba(230, 230, 230, 0.7)',
    },
    labelContainer: {
        marginTop: 22,
        padding: 14,
        backgroundColor: consts.ivory,
        borderRadius: 20,
        width: '100%',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
    },
    label: {
        fontSize: 14,
        color: consts.midnightBlue,
        lineHeight: 20,
        textAlign: 'center',
    },
    timeFrameSelector: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        backgroundColor: consts.ivory,
        borderRadius: 34,
        padding: 4,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 23,
    },
    timeFrameOption: {
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 20,
    },
    selectedTimeFrame: {
        backgroundColor: consts.white,
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    timeFrameText: {
        fontSize: 14,
        fontWeight: '500',
        color: consts.midnightBlue,
        opacity: 0.5,
    },
    selectedTimeFrameText: {
        color: consts.midnightBlue,
        fontWeight: '600',
        opacity: 1,
    }
});

export default Graph;
