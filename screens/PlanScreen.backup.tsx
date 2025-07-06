import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Modal, TextInput, FlatList } from 'react-native';
import consts from '../const/consts';
import DayTabs from '../components/ui/DayTabs';
import MealCard from '../components/ui/MealCard';
import Button from '../components/ui/Button';
import { useMealPlanContext } from '../contexts/MealPlanContext';
import { Feather } from '@expo/vector-icons';

// Define interface for processed meal data
interface ProcessedMealData {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string[];
}

interface ChatMessage {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

const PlanScreen: React.FC = () => {
    const [selectedDay, setSelectedDay] = useState(0);
    const [viewingHistory, setViewingHistory] = useState(false);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [showChatModal, setShowChatModal] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            text: "Hi! I'm your AI diet coach. I can help you with meal suggestions, nutrition advice, and answer any questions about your meal plan. How can I assist you today?",
            isUser: false,
            timestamp: new Date()
        }
    ]);
    const [chatInput, setChatInput] = useState('');
    
    // Get data from context instead of hook
    const { currentPlan, planHistory } = useMealPlanContext();
    const [loading, setLoading] = useState(false);
    
    // Days of the week for tab labels
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Convert meal plan data to format needed by MealCard
    const formatMealData = (plan: any): ProcessedMealData | null => {
        if (!plan) return null;
        
        // For weekly plans with weeklyPlans property
        if (plan.weeklyPlans && daysOfWeek[selectedDay]) {
            const dayKey = daysOfWeek[selectedDay].toLowerCase();
            const dayPlan = plan.weeklyPlans[dayKey];
            
            if (dayPlan) {
                return {
                    breakfast: dayPlan.breakfast?.items?.join(', ') || "No breakfast planned",
                    lunch: dayPlan.lunch?.items?.join(', ') || "No lunch planned",
                    dinner: dayPlan.dinner?.items?.join(', ') || "No dinner planned",
                    snacks: dayPlan.snacks?.map((snack: any) => snack.items?.join(', ')) || []
                };
            }
        }
        
        // For daily plans or fallback
        if (plan.meals) {
            let breakfast = "";
            let lunch = "";
            let dinner = "";
            const snacks: string[] = [];
            
            plan.meals.forEach((meal: any) => {
                if (meal.name.toLowerCase().includes('breakfast')) {
                    breakfast = meal.items.join(', ');
                } else if (meal.name.toLowerCase().includes('lunch')) {
                    lunch = meal.items.join(', ');
                } else if (meal.name.toLowerCase().includes('dinner')) {
                    dinner = meal.items.join(', ');
                } else if (meal.name.toLowerCase().includes('snack')) {
                    snacks.push(meal.items.join(', '));
                }
            });
            
            return {
                breakfast,
                lunch,
                dinner,
                snacks
            };
        }
        
        // Default fallback
        return {
            breakfast: "No current meal plan",
            lunch: "Generate a new plan from the Profile tab",
            dinner: "Or tap 'Create New Diet Plan' below",
            snacks: []
        };
    };
    
    const currentPlanData = formatMealData(viewingHistory ? planHistory[historyIndex] : currentPlan);
    
    const handleCreateNewPlan = () => {
        Alert.alert(
            'Generate New Meal Plan',
            'Go to Profile tab to generate a new personalized meal plan based on your preferences',
            [
                {
                    text: 'OK',
                    onPress: () => console.log('OK Pressed')
                }
            ]
        );
    };
    
    const handleToggleHistory = () => {
        if (planHistory.length === 0) {
            Alert.alert('No History', 'You don\'t have any previous meal plans saved.');
            return;
        }
        
        setViewingHistory(!viewingHistory);
        setHistoryIndex(0);
    };
    
    const handleHistoryNavigation = (direction: 'prev' | 'next') => {
        if (direction === 'prev' && historyIndex < planHistory.length - 1) {
            setHistoryIndex(historyIndex + 1);
        } else if (direction === 'next' && historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
        }
    };

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            text: chatInput,
            isUser: true,
            timestamp: new Date()
        };

        setChatMessages(prev => [...prev, userMessage]);
        setChatInput('');

        // Simulate AI response
        setTimeout(() => {
            const aiResponse = generateAIResponse(chatInput);
            const aiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                text: aiResponse,
                isUser: false,
                timestamp: new Date()
            };
            setChatMessages(prev => [...prev, aiMessage]);
        }, 1000);
    };

    const generateAIResponse = (userInput: string): string => {
        const input = userInput.toLowerCase();
        
        if (input.includes('swap') || input.includes('substitute') || input.includes('replace')) {
            return "I can help you swap meals! What meal would you like to replace and what are your preferences? For example, you could say 'swap chicken for fish' or 'replace breakfast with something vegetarian'.";
        } else if (input.includes('calories') || input.includes('nutrition')) {
            return "Your current meal plan is designed to meet your nutritional goals. Each meal is balanced with the right mix of proteins, carbohydrates, and healthy fats. Would you like specific nutritional information about any meal?";
        } else if (input.includes('allerg') || input.includes('intolerance')) {
            return "I understand dietary restrictions are important. I can help modify your meal plan to avoid any allergens or foods you can't tolerate. What specific dietary restrictions do you have?";
        } else if (input.includes('protein') || input.includes('vegetarian') || input.includes('vegan')) {
            return "I can suggest great protein alternatives! For plant-based options, consider quinoa, lentils, chickpeas, tofu, tempeh, and nuts. Would you like me to suggest specific meals?";
        } else if (input.includes('recipe') || input.includes('cook') || input.includes('ingredients')) {
            return "I'd be happy to help with recipes! Are you looking for cooking instructions for a specific meal from your plan, or would you like suggestions for meal prep techniques?";
        } else {
            return "That's a great question! I'm here to help you succeed with your nutrition goals. Feel free to ask me about meal swaps, recipes, nutrition facts, or any dietary concerns you might have.";
        }
    };

    const renderChatMessage = ({ item }: { item: ChatMessage }) => (
        <View style={[
            styles.chatMessage,
            item.isUser ? styles.userMessage : styles.aiMessage
        ]}>
            <Text style={[
                styles.messageText,
                item.isUser ? styles.userMessageText : styles.aiMessageText
            ]}>
                {item.text}
            </Text>
            <Text style={styles.messageTime}>
                {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
        </View>
    );

    const renderChatModal = () => (
        <Modal
            visible={showChatModal}
            animationType="slide"
            transparent={false}
            onRequestClose={() => setShowChatModal(false)}
        >
            <View style={styles.chatContainer}>
                <View style={styles.chatHeader}>
                    <View style={styles.chatHeaderLeft}>
                        <Feather name="message-circle" size={24} color={consts.white} />
                        <Text style={styles.chatHeaderTitle}>AI Diet Coach</Text>
                    </View>
                    <TouchableOpacity onPress={() => setShowChatModal(false)}>
                        <Feather name="x" size={24} color={consts.white} />
                    </TouchableOpacity>
                </View>
                
                <FlatList
                    data={chatMessages}
                    renderItem={renderChatMessage}
                    keyExtractor={(item) => item.id}
                    style={styles.chatMessages}
                    contentContainerStyle={styles.chatMessagesContent}
                />
                
                <View style={styles.chatInputContainer}>
                    <TextInput
                        style={styles.chatInput}
                        placeholder="Ask about nutrition, swaps, recipes..."
                        value={chatInput}
                        onChangeText={setChatInput}
                        multiline
                        maxLength={500}
                    />
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            !chatInput.trim() && styles.sendButtonDisabled
                        ]}
                        onPress={handleSendMessage}
                        disabled={!chatInput.trim()}
                    >
                        <Feather name="send" size={20} color={consts.white} />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>
                        {viewingHistory ? 'Previous Meal Plan' : 'Current Meal Plan'}
                    </Text>
                    {planHistory.length > 0 && (
                        <TouchableOpacity 
                            style={styles.historyButton}
                            onPress={handleToggleHistory}
                        >
                            <Feather 
                                name={viewingHistory ? "clock" : "clock"} 
                                size={20} 
                                color={consts.deepGreen} 
                            />
                            <Text style={styles.historyButtonText}>
                                {viewingHistory ? 'View Current' : 'View History'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {viewingHistory && planHistory.length > 0 && (
                    <View style={styles.historyNavigation}>
                        <TouchableOpacity 
                            style={[
                                styles.historyNavButton, 
                                historyIndex >= planHistory.length - 1 && styles.disabledButton
                            ]}
                            disabled={historyIndex >= planHistory.length - 1}
                            onPress={() => handleHistoryNavigation('prev')}
                        >
                            <Feather name="chevron-left" size={20} color={consts.deepGreen} />
                            <Text style={styles.historyNavText}>Older</Text>
                        </TouchableOpacity>
                        <Text style={styles.historyIndexText}>
                            Plan {historyIndex + 1} of {planHistory.length}
                        </Text>
                        <TouchableOpacity 
                            style={[
                                styles.historyNavButton, 
                                historyIndex <= 0 && styles.disabledButton
                            ]}
                            disabled={historyIndex <= 0}
                            onPress={() => handleHistoryNavigation('next')}
                        >
                            <Text style={styles.historyNavText}>Newer</Text>
                            <Feather name="chevron-right" size={20} color={consts.deepGreen} />
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.tabsWrapper}>
                    <DayTabs
                        days={daysOfWeek}
                        selectedDay={selectedDay}
                        onSelectDay={(index) => setSelectedDay(index)}
                    />
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={consts.deepGreen} />
                        <Text style={styles.loadingText}>Loading meal plan...</Text>
                    </View>
                ) : (
                    currentPlanData && <MealCard meals={currentPlanData as any} />
                )}

                <Button
                    text="Create New Diet Plan"
                    onPress={handleCreateNewPlan}
                    variant="primary"
                    size="medium"
                    fullWidth
                />

                {/* Extra padding space to avoid navbar overlap */}
                <View style={styles.bottomSpacer} />
            </ScrollView>

            {/* Chat Coach Button */}
            <TouchableOpacity 
                style={styles.chatCoachButton}
                onPress={() => setShowChatModal(true)}
            >
                <Feather name="message-circle" size={24} color={consts.white} />
                <Text style={styles.chatCoachButtonText}>Chat with Coach</Text>
            </TouchableOpacity>

            {/* Chat Coach Modal */}
            {renderChatModal()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: consts.lightPeach,
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: consts.richGray,
        flex: 1,
    },
    historyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(28, 83, 74, 0.1)',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    historyButtonText: {
        color: consts.deepGreen,
        marginLeft: 4,
        fontWeight: '500',
        fontSize: 14,
    },
    historyNavigation: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    historyNavButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    disabledButton: {
        opacity: 0.5,
    },
    historyNavText: {
        color: consts.deepGreen,
        fontSize: 14,
        fontWeight: '600',
        marginHorizontal: 4,
    },
    historyIndexText: {
        color: consts.richGray,
        fontSize: 14,
    },
    tabsWrapper: {
        marginBottom: 16,
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: consts.richGray,
        fontSize: 16,
    },
    button: {
        backgroundColor: consts.deepGreen,
        borderRadius: 30,
        padding: 16,
        alignItems: 'center',
        marginVertical: 24,
    },
    buttonText: {
        color: consts.offWhite,
        fontWeight: '600',
        fontSize: 16,
    },
    bottomSpacer: {
        height: 25,
    },
    chatCoachButton: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: consts.deepGreen,
        borderRadius: 30,
        paddingHorizontal: 12,
        paddingVertical: 8,
        elevation: 4,
    },
    chatCoachButtonText: {
        color: consts.white,
        marginLeft: 8,
        fontWeight: '500',
        fontSize: 16,
    },
    chatContainer: {
        flex: 1,
        backgroundColor: consts.offWhite,
        paddingTop: 40,
        paddingHorizontal: 16,
    },
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    chatHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chatHeaderTitle: {
        color: consts.white,
        fontWeight: 'bold',
        fontSize: 18,
        marginLeft: 8,
    },
    chatMessages: {
        flex: 1,
        marginBottom: 16,
    },
    chatMessagesContent: {
        paddingBottom: 16,
    },
    chatMessage: {
        marginBottom: 12,
        maxWidth: '80%',
        borderRadius: 16,
        padding: 10,
        position: 'relative',
    },
    userMessage: {
        backgroundColor: consts.lightPeach,
        alignSelf: 'flex-end',
        borderTopRightRadius: 0,
    },
    aiMessage: {
        backgroundColor: consts.deepGreen,
        alignSelf: 'flex-start',
        borderTopLeftRadius: 0,
    },
    messageText: {
        color: consts.richGray,
        fontSize: 16,
        lineHeight: 22,
    },
    userMessageText: {
        color: consts.deepGreen,
    },
    aiMessageText: {
        color: consts.offWhite,
    },
    messageTime: {
        position: 'absolute',
        right: 10,
        bottom: 8,
        color: consts.richGray,
        fontSize: 12,
    },
    chatInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: consts.lightGray,
        paddingTop: 8,
        paddingBottom: 16,
    },
    chatInput: {
        flex: 1,
        backgroundColor: consts.lightestGray,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8,
        color: consts.richGray,
        fontSize: 16,
    },
    sendButton: {
        backgroundColor: consts.deepGreen,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: consts.gray,
    },
});

export default PlanScreen;