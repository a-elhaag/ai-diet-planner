import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import consts from '../const/consts';

interface LogMessage {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

const MealLogScreen: React.FC = () => {
    const [messages, setMessages] = useState<LogMessage[]>([
        {
            id: '1',
            text: "Hi! What did you eat today? You can tell me anything you've had, and I'll help track it.",
            isUser: false,
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage: LogMessage = {
            id: Date.now().toString(),
            text: input,
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: LogMessage = {
                id: (Date.now() + 1).toString(),
                text: "Thanks for logging that! I've added it to your daily intake. Would you like me to analyze the nutritional content?",
                isUser: false,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
        }, 1000);

        setInput('');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Off Plan</Text>
                <Text style={styles.subtitle}>Tell me what you ate today</Text>
            </View>

            <ScrollView style={styles.messagesContainer}>
                {messages.map((message) => (
                    <View 
                        key={message.id} 
                        style={[
                            styles.messageContainer,
                            message.isUser ? styles.userMessage : styles.aiMessage
                        ]}
                    >
                        <View style={[
                            styles.messageBubble,
                            message.isUser ? styles.userBubble : styles.aiBubble
                        ]}>
                            <Text style={[
                                styles.messageText,
                                message.isUser ? styles.userText : styles.aiText
                            ]}>
                                {message.text}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Type what you ate..."
                    placeholderTextColor="#666"
                    multiline
                />
                <TouchableOpacity 
                    style={styles.sendButton} 
                    onPress={handleSend}
                >
                    <Feather name="send" size={24} color={consts.white} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: consts.white,
        paddingBottom: 100, // Add padding to account for navbar height
    },
    header: {
        padding: 20,
        backgroundColor: consts.white,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: consts.midnightBlue,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    messagesContainer: {
        flex: 1,
        padding: 16,
        paddingBottom: 100,
    },
    messageContainer: {
        marginBottom: 16,
        flexDirection: 'row',
    },
    userMessage: {
        justifyContent: 'flex-end',
    },
    aiMessage: {
        justifyContent: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 20,
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    userBubble: {
        backgroundColor: consts.blueGrotto,
        borderTopRightRadius: 4,
    },
    aiBubble: {
        backgroundColor: consts.white,
        borderTopLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    userText: {
        color: consts.white,
    },
    aiText: {
        color: consts.midnightBlue,
    },
    inputContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: consts.white,
        alignItems: 'flex-end',
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 8,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    input: {
        flex: 1,
        backgroundColor: consts.ivory,
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 12,
        paddingRight: 44,
        fontSize: 16,
        maxHeight: 100,
        marginRight: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.08)',
    },
    sendButton: {
        backgroundColor: consts.blueGrotto,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: consts.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
});

export default MealLogScreen;
