import React, { useState } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import StatsScreen from './screens/StatsScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import Navbar from './components/Navbar';
import consts from './const/consts';
import { UnitProvider } from './contexts/UnitContext';
import { MealPlanProvider } from './contexts/MealPlanContext';

// Define tab types for better type safety
type TabName = 'home' | 'stats' | 'plan' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [showingChat, setShowingChat] = useState(false);
  const navbarOpacity = React.useRef(new Animated.Value(1)).current;

  const handleTabPress = (tab: TabName) => {
    if (tab === 'plan') {
      // Show chat screen and hide navbar
      setShowingChat(true);
      Animated.timing(navbarOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setActiveTab(tab);
      if (showingChat) {
        setShowingChat(false);
        Animated.timing(navbarOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const handleCloseChat = () => {
    setShowingChat(false);
    Animated.timing(navbarOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Render the current screen based on active tab
  const renderScreen = () => {
    if (showingChat) {
      return <ChatScreen onClose={handleCloseChat} />;
    }

    switch (activeTab) {
      case 'home':
        return <HomeScreen onTabPress={handleTabPress} />;
      case 'stats':
        return <StatsScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen onTabPress={handleTabPress} />;
    }
  };

  return (
    <SafeAreaProvider>
      <UnitProvider>
        <MealPlanProvider>
          <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <View style={styles.mainContainer}>
              {renderScreen()}
              <Animated.View style={[styles.navbarContainer, { opacity: navbarOpacity }]} pointerEvents={showingChat ? 'none' : 'auto'}>
                <Navbar activeTab={activeTab} onTabPress={handleTabPress} />
              </Animated.View>
            </View>
          </SafeAreaView>
        </MealPlanProvider>
      </UnitProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: consts.lightPeach,
  },
  mainContainer: {
    flex: 1,
    position: 'relative',
  },
  navbarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }
});

