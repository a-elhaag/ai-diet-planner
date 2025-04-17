import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import Button from '../components/ui/Button';
const dietOptions = ['balanced', 'low-carb', 'high-protein', 'vegan'];
const allergyOptions = ['gluten', 'peanuts', 'dairy', 'soy'];
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const API_URL = "http://192.168.1.64:3000";
export default function SignUpScreen() {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dietType, setDietType] = useState('balanced');
  const [dailyCalories, setDailyCalories] = useState(2000);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [freeDay, setFreeDay] = useState('Saturday');

  const toggleAllergy = (allergy: string) => {
    setAllergies(prev =>
      prev.includes(allergy) ? prev.filter(a => a !== allergy) : [...prev, allergy]
    );
  };

  const handleSignUp = () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please fill out all required fields.');
      return;
    }
  
    // Collect all the user data
    const userData = {
      name,
      email,
      password,
      preferences: {
        dietType,
        dailyCalories,
        allergies,
        freeDay,
      },
    };
  
    // Print the data to the console (or send to backend)
    console.log('User Data:', userData);
  
    // Example: Send the data to your backend API (replace with your backend URL)
    fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Signup successful:', data);
        Alert.alert('Success', 'Account created!');
        navigation.navigate('MainApp' as never);  // Redirect to main app screen
      })
      .catch((error) => {
        console.error('Error during signup:', error);
        Alert.alert('Error', 'Something went wrong!');
      });
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {/* Spacing the form down */}
      <View style={styles.formContainer}>
        <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
        <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

        {/* Daily Calories Slider */}
        <Text style={styles.label}>Daily Calories: {dailyCalories} kcal</Text>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={1200}
          maximumValue={4000}
          step={100}
          value={dailyCalories}
          onValueChange={setDailyCalories}
          minimumTrackTintColor="#0476D0"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#0476D0"
        />

        {/* Diet Type Picker */}
        <Text style={styles.label}>Diet Type</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={dietType} onValueChange={(itemValue) => setDietType(itemValue)}>
            {dietOptions.map(option => (
              <Picker.Item label={option} value={option} key={option} />
            ))}
          </Picker>
        </View>

        {/* Allergies Checkboxes in two columns with equal spacing */}
        <Text style={styles.label}>Allergies</Text>
        <View style={styles.allergiesContainer}>
          {allergyOptions.map(option => (
            <TouchableOpacity
              key={option}
              onPress={() => toggleAllergy(option)}
              style={styles.checkboxOption}
            >
              <View style={[styles.checkbox, allergies.includes(option) && styles.checkedBox]} />
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Free Day Picker */}
        <Text style={styles.label}>Free Day</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={freeDay} onValueChange={(itemValue) => setFreeDay(itemValue)}>
            {weekdays.map(day => (
              <Picker.Item label={day} value={day} key={day} />
            ))}
          </Picker>
        </View>

        <Button title="Create Account" variant="primary" size="large" onPress={handleSignUp} />

        <TouchableOpacity onPress={() => navigation.navigate('SignIn' as never)}>
          <Text style={styles.switchText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 50, // Pushing form a little down
  },
  label: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  allergiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  checkboxOption: {
    width: '48%', // Making each checkbox take up 48% width of the container
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#0476D0',
    marginRight: 8,
    borderRadius: 4,
  },
  checkedBox: {
    backgroundColor: '#0476D0',
  },
  button: {
    backgroundColor: '#0476D0',
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  switchText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#0476D0',
  },
  formContainer: {
    marginTop: 0, // Pushing form a little down
  },
});
