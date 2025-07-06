import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import consts from '../const/consts';
import { useMealPlanContext } from '../contexts/MealPlanContext';
import { databaseService } from '../services/databaseService';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatScreenProps {
  onClose: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hi! I'm your AI diet coach. I can help you with meal suggestions, nutrition advice, answer questions about your meal plan, and provide personalized guidance. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<FlatList>(null);
  
  const { currentPlan, userProgress } = useMealPlanContext();

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      // Assuming user ID 1 for now - in a real app this would come from auth
      const history = await databaseService.getChatHistory(1, 20);
      if (history.length > 0) {
        const formattedMessages = history.map(msg => ({
          id: msg.id.toString(),
          text: msg.message,
          isUser: msg.is_user,
          timestamp: new Date(msg.created_at)
        }));
        setMessages([...messages, ...formattedMessages]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Save user message to database
      await databaseService.saveChatMessage(1, userMessage.text, true);

      // Generate AI response
      const aiResponse = await generateAIResponse(userMessage.text);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Save AI response to database
      await databaseService.saveChatMessage(1, aiResponse, false);

    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (userInput: string): Promise<string> => {
    // For now, generate contextual responses based on keywords
    // In a real app, this would call your Azure OpenAI service
    
    const input = userInput.toLowerCase();
    
    // Context-aware responses
    if (input.includes('meal plan') || input.includes('plan')) {
      if (currentPlan) {
        return `I see you have an active ${currentPlan.name || 'meal plan'}! It looks great. Would you like me to suggest any modifications, or do you have questions about specific meals?`;
      } else {
        return "I notice you don't have an active meal plan yet. Would you like me to help you create one? I can generate a personalized plan based on your goals, dietary preferences, and restrictions.";
      }
    }
    
    if (input.includes('calories') || input.includes('nutrition')) {
      return `Based on your current plan, you're targeting around ${currentPlan?.dailyTotals?.calories || '1800'} calories per day. This includes ${currentPlan?.dailyTotals?.protein || '120'}g protein, ${currentPlan?.dailyTotals?.carbohydrates || '180'}g carbs, and ${currentPlan?.dailyTotals?.fats || '65'}g healthy fats. Is there something specific about your nutrition you'd like to adjust?`;
    }
    
    if (input.includes('weight') || input.includes('lose') || input.includes('gain')) {
      return "Weight management is about creating a sustainable calorie balance. For healthy weight loss, aim for 1-2 pounds per week through a combination of proper nutrition and physical activity. For weight gain, focus on nutrient-dense foods and strength training. What's your current goal?";
    }
    
    if (input.includes('exercise') || input.includes('workout') || input.includes('activity')) {
      return "Great question! Exercise complements your nutrition plan perfectly. For general health, aim for 150 minutes of moderate activity per week plus 2 strength training sessions. I can help adjust your meal plan based on your activity level. What type of exercise do you enjoy?";
    }
    
    if (input.includes('snack') || input.includes('hungry')) {
      return "For healthy snacking, try pairing protein with fiber - like apple slices with almond butter, Greek yogurt with berries, or hummus with vegetables. These combinations help keep you satisfied longer. What time of day do you usually feel hungry?";
    }
    
    if (input.includes('water') || input.includes('hydration')) {
      return "Staying hydrated is crucial! Aim for about 8 glasses of water daily, more if you're active. You can also count herbal teas and water-rich foods like fruits and vegetables. I see you're tracking your water intake - keep it up!";
    }
    
    if (input.includes('motivation') || input.includes('difficult') || input.includes('hard')) {
      return `I understand that staying consistent can be challenging! Remember, you've already earned ${userProgress?.points || 0} points and you're building great habits. Focus on progress, not perfection. What's the biggest challenge you're facing right now?`;
    }
    
    if (input.includes('recipe') || input.includes('cook') || input.includes('preparation')) {
      return "Meal prep can save you time and keep you on track! Try batch cooking proteins, pre-cutting vegetables, and preparing overnight oats or salads in jars. Would you like specific recipe suggestions for any of your planned meals?";
    }
    
    // Default responses for general questions
    const generalResponses = [
      "That's a great question! I'm here to help you with all aspects of your nutrition journey. Could you tell me more about what you're looking for?",
      "I'd love to help you with that! Can you provide a bit more context so I can give you the most relevant advice?",
      "Thanks for asking! Your health and nutrition goals are important. What specific area would you like to focus on today?",
      "I'm here to support your wellness journey! Feel free to ask me about meal planning, nutrition, recipes, or any challenges you're facing."
    ];
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[styles.messageContainer, item.isUser ? styles.userMessage : styles.aiMessage]}>
      <View style={[styles.messageBubble, item.isUser ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.messageText, item.isUser ? styles.userMessageText : styles.aiMessageText]}>
          {item.text}
        </Text>
        <Text style={[styles.timestamp, item.isUser ? styles.userTimestamp : styles.aiTimestamp]}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.quickActionsTitle}>Quick Questions:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActionsScroll}>
        {[
          "How can I meal prep better?",
          "Suggest healthy snacks",
          "Help with portion sizes",
          "Nutrition tips",
          "Recipe ideas"
        ].map((action, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.quickActionButton}
            onPress={() => {
              setInputText(action);
              sendMessage();
            }}
          >
            <Text style={styles.quickActionText}>{action}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Feather name="message-circle" size={24} color={consts.deepGreen} />
          <Text style={styles.headerTitle}>AI Diet Coach</Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Feather name="x" size={24} color={consts.deepGreen} />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={scrollViewRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={consts.deepGreen} />
          <Text style={styles.loadingText}>AI is thinking...</Text>
        </View>
      )}

      {renderQuickActions()}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask me anything about nutrition..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
          onPress={sendMessage}
          disabled={!inputText.trim() || isLoading}
        >
          <Feather name="send" size={20} color={consts.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: consts.lightPeach, // Peachy background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: consts.white, // White component
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: consts.deepGreen,
    marginLeft: 8,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(28, 83, 74, 0.1)',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginVertical: 4,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: consts.deepGreen,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: consts.white, // White component
    borderBottomLeftRadius: 4,
    shadowColor: consts.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: consts.white,
  },
  aiMessageText: {
    color: consts.richGray,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  aiTimestamp: {
    color: '#999',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontStyle: 'italic',
  },
  quickActionsContainer: {
    backgroundColor: consts.white, // White component
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  quickActionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: consts.richGray,
    marginBottom: 8,
  },
  quickActionsScroll: {
    flexGrow: 0,
  },
  quickActionButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  quickActionText: {
    fontSize: 13,
    color: consts.deepGreen,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: consts.white, // White component
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: '#f8fafc',
  },
  sendButton: {
    backgroundColor: consts.deepGreen,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
});

export default ChatScreen;
