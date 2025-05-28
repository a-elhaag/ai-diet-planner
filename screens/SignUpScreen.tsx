import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Modal,
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

const predefinedGoals = [
  'Weight Loss',
  'Weight Gain',
  'Muscle Building',
  'Maintenance',
  'Improve Overall Health',
  'Athletic Performance',
  'Better Sleep',
  'Increase Energy',
  'Lower Blood Pressure',
  'Lower Cholesterol',
  'Custom Goal'
];

export default function SignUpScreen() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    goal: 'Weight Loss',
    customGoal: '',
    showCustomGoal: false,
    activityLevel: 'Sedentary',
    dietaryRestrictions: ['None'],
  });

  const loadingSteps = [
    "Creating your profile...",
    "Analyzing your health data...",
    "Calculating nutrition requirements...",
    "Preparing personalized meal plans...",
    "Setting up water tracking...",
    "Almost there..."
  ];

  const handleSubmit = async () => {
    setIsLoading(true);
    setLoadingStep(0);

    // Simulate a multi-step loading process
    const processSteps = () => {
      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        
        if (currentStep >= loadingSteps.length) {
          clearInterval(interval);
          
          // Final signin after loading sequence completes
          try {
            // Prepare data for sign-in, using the custom goal if specified
            const finalGoal = formData.goal === 'Custom Goal' ? formData.customGoal : formData.goal;
            
            signIn({
              ...formData,
              goal: finalGoal,
              age: parseInt(formData.age),
              weight: parseFloat(formData.weight),
              height: parseFloat(formData.height),
            });
          } catch (error) {
            console.error('Error during sign up:', error);
            setIsLoading(false);
          }
        } else {
          setLoadingStep(currentStep);
        }
      }, 800); // Update every 800ms
    };

    processSteps();
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
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.goal}
              onValueChange={(value) => {
                const isCustom = value === 'Custom Goal';
                setFormData({ 
                  ...formData, 
                  goal: value,
                  showCustomGoal: isCustom
                });
              }}
              style={styles.picker}
            >
              {predefinedGoals.map((goal) => (
                <Picker.Item key={goal} label={goal} value={goal} />
              ))}
            </Picker>
          </View>
        </View>
        
        {formData.showCustomGoal && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Custom Goal</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.customGoal}
              onChangeText={(text) => setFormData({ ...formData, customGoal: text })}
              placeholder="Describe your custom fitness goal"
              multiline
            />
          </View>
        )}

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
      
      {/* Loading Modal */}
      <Modal visible={isLoading} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={consts.blueGrotto} />
            <Text style={styles.loadingText}>{loadingSteps[loadingStep]}</Text>
          </View>
        </View>
      </Modal>
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
    marginBottom: 8,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingCard: {
    backgroundColor: consts.white,
    borderRadius: consts.radius,
    padding: consts.spacing.xl,
    alignItems: 'center',
    width: '80%',
    shadowColor: consts.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingText: {
    marginTop: consts.spacing.md,
    fontSize: consts.font.medium,
    color: consts.midnightBlue,
    textAlign: 'center',
  },
});