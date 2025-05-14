import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import consts from '../const/consts';
import { Picker } from '@react-native-picker/picker';

const dietaryRestrictionsList = [
  'None',
  'Vegetarian',
  'Vegan',
  'Gluten-free',
  'Dairy-free',
  'Kosher',
  'Halal',
];

const activityLevels = [
  'Sedentary',
  'Lightly Active',
  'Moderately Active',
  'Very Active',
  'Extra Active',
];

export default function SignUpScreen() {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    goal: '',
    activityLevel: 'Sedentary',
    dietaryRestrictions: ['None'],
  });

  const handleSubmit = async () => {
    try {
      await signIn({
        ...formData,
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
      });
    } catch (error) {
      console.error('Error during sign up:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Your Profile</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Enter your name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={formData.age}
            onChangeText={(text) => setFormData({ ...formData, age: text })}
            placeholder="Enter your age"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            value={formData.weight}
            onChangeText={(text) => setFormData({ ...formData, weight: text })}
            placeholder="Enter your weight"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            value={formData.height}
            onChangeText={(text) => setFormData({ ...formData, height: text })}
            placeholder="Enter your height"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Goal</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.goal}
            onChangeText={(text) => setFormData({ ...formData, goal: text })}
            placeholder="What's your fitness goal?"
            multiline
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Activity Level</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.activityLevel}
              onValueChange={(value) => 
                setFormData({ ...formData, activityLevel: value })
              }
              style={styles.picker}
            >
              {activityLevels.map((level) => (
                <Picker.Item key={level} label={level} value={level} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Dietary Restrictions</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.dietaryRestrictions[0]}
              onValueChange={(value) => 
                setFormData({ ...formData, dietaryRestrictions: [value] })
              }
              style={styles.picker}
            >
              {dietaryRestrictionsList.map((restriction) => (
                <Picker.Item key={restriction} label={restriction} value={restriction} />
              ))}
            </Picker>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Create Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: consts.white,
  },
  content: {
    padding: consts.spacing.lg,
  },
  title: {
    fontSize: consts.font.xxlarge,
    color: consts.midnightBlue,
    fontWeight: 'bold',
    marginBottom: consts.spacing.xl,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: consts.spacing.lg,
  },
  label: {
    fontSize: consts.font.medium,
    color: consts.midnightBlue,
    marginBottom: consts.spacing.xs,
  },
  input: {
    backgroundColor: consts.ivory,
    borderRadius: consts.radius,
    padding: consts.spacing.md,
    fontSize: consts.font.medium,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: consts.ivory,
    borderRadius: consts.radius,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    ...Platform.select({
      ios: {
        height: 150,
      },
      android: {
        height: 50,
      },
    }),
  },
  button: {
    backgroundColor: consts.blueGrotto,
    padding: consts.spacing.md,
    borderRadius: consts.radius,
    marginTop: consts.spacing.xl,
  },
  buttonText: {
    color: consts.white,
    fontSize: consts.font.large,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});