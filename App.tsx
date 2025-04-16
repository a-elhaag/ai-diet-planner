import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import StatsScreen from './screens/StatsScreen';
import PlanScreen from './screens/PlanScreen';
import ProfileScreen from './screens/ProfileScreen';
import Navbar from './components/Navbar';
import consts from './const/consts';
import { UnitProvider } from './contexts/UnitContext';

// Define tab types for better type safety
type TabName = 'home' | 'stats' | 'plan' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('home');

  // Render the current screen based on active tab
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'stats':
        return <StatsScreen />;
      case 'plan':
        return <PlanScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <UnitProvider>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <View style={styles.mainContainer}>
            {renderScreen()}
            <Navbar activeTab={activeTab} onTabPress={(tab: TabName) => setActiveTab(tab)} />
          </View>
        </SafeAreaView>
      </UnitProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: consts.ivory,
  },
  mainContainer: {
    flex: 1,
    position: 'relative',
  }
});

