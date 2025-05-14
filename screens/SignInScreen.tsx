import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import consts from '../const/consts';

interface SignInScreenProps {
  onSignUpPress: () => void;
}

export default function SignInScreen({ onSignUpPress }: SignInScreenProps) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={consts.blueGrotto} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to AI Diet Planner</Text>
      <Text style={styles.subtitle}>Your personalized nutrition companion</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={onSignUpPress}
      >
        <Text style={styles.buttonText}>Create Your Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: consts.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: consts.spacing.lg,
  },
  title: {
    fontSize: consts.font.xxlarge,
    color: consts.midnightBlue,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: consts.spacing.md,
  },
  subtitle: {
    fontSize: consts.font.large,
    color: consts.blueGrotto,
    textAlign: 'center',
    marginBottom: consts.spacing.xl,
  },
  button: {
    backgroundColor: consts.blueGrotto,
    padding: consts.spacing.md,
    borderRadius: consts.radius,
    width: '100%',
    maxWidth: 300,
  },
  buttonText: {
    color: consts.white,
    fontSize: consts.font.large,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});