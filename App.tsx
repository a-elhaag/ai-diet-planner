import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

// Define your new color palette here
const colors = {
  midnightBlue: "#265B8B",
  ivory: "#ECECEB",
  babyBlue: "#84C7F2",
  blueGrotto: "#1181C8",
};

// Reusable custom button component
interface CustomButtonProps {
  title: string;
  backgroundColor: string;
  textColor: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, backgroundColor, textColor }) => (
  <TouchableOpacity style={[styles.button, { backgroundColor }]}>
    <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
  </TouchableOpacity>
);

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.midnightBlue }]}>
        <Text style={styles.headerText}>AI Diet Planner</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <CustomButton
          title="View Meal Plan"
          backgroundColor={colors.babyBlue}
          textColor="#FFFFFF"
        />
        <CustomButton
          title="Profile"
          backgroundColor={colors.blueGrotto}
          textColor="#FFFFFF"
        />
        <CustomButton
          title="Settings"
          backgroundColor={colors.midnightBlue}
          textColor="#FFFFFF"
        />
      </View>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: colors.midnightBlue }]}>
        <Text style={styles.footerText}>Powered by AI</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ivory,
  },
  header: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '80%',
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});