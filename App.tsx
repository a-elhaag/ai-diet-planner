import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import NavBar from './components/ui/NavBar';
import colors from './theme/const';

// Placeholder screens - you can replace these with actual screens later
const StatsScreen = () => <HomeScreen />;
const PlanScreen = () => <HomeScreen />;
const ProfileScreen = () => <HomeScreen />;

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

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
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>
      <NavBar activeTab={activeTab} onTabPress={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ivory,
  },
  content: {
    flex: 1,
  }
});

