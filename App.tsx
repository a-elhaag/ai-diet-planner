import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import PlanScreen from './screens/PlanScreen';
import ProfileScreen from './screens/ProfileScreen';
import MealLogScreen from './screens/MealLogScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import Navbar, { TabName } from './components/Navbar';
import consts from './const/consts';
import { UnitProvider } from './contexts/UnitContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AiProvider } from './contexts/AiContext';
import { WaterProvider } from './contexts/WaterContext';

function MainApp() {
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [showSignUp, setShowSignUp] = useState(false);
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading spinner
  }

  if (!user) {
    return showSignUp ? <SignUpScreen /> : <SignInScreen onSignUpPress={() => setShowSignUp(true)} />;
  }

  // Render the current screen based on active tab
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'offplan':
        return <MealLogScreen />;
      case 'plan':
        return <PlanScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.mainContainer}>
      {renderScreen()}
      <Navbar activeTab={activeTab} onTabPress={setActiveTab} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <UnitProvider>
          <WaterProvider>
            <AiProvider>
              <SafeAreaView style={styles.safeArea}>
                <MainApp />
              </SafeAreaView>
            </AiProvider>
          </WaterProvider>
        </UnitProvider>
      </AuthProvider>
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

