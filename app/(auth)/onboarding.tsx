import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Keyboard, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { onboardingData, updateOnboarding, completeOnboarding } = useAuth();

  const handleNext = () => {
    Keyboard.dismiss();
    
    // Validation
    if (step === 1 && (!onboardingData.name || !onboardingData.phone || !onboardingData.password)) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    
    if (step === 2 && !onboardingData.workType) {
      Alert.alert('Error', 'Please enter work type');
      return;
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    Keyboard.dismiss();
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = async () => {
    Keyboard.dismiss();
    
    if (onboardingData.skills.length === 0 || onboardingData.assets.length === 0) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    const result = await completeOnboarding();
    setLoading(false);

    if (!result.success) {
      Alert.alert('Error', result.message);
    }
  };

  const Step1 = () => (
    <View className="flex-1">
      <Text className="text-2xl font-bold mb-6">Personal Information</Text>
      
      <TextInput
        className="border border-gray-300 rounded-lg p-4 mb-4 text-base"
        placeholder="Full Name"
        value={onboardingData.name}
        onChangeText={(text) => updateOnboarding({ name: text })}
      />
      
      <TextInput
        className="border border-gray-300 rounded-lg p-4 mb-4 text-base"
        placeholder="Phone Number"
        value={onboardingData.phone}
        onChangeText={(text) => updateOnboarding({ phone: text })}
        keyboardType="phone-pad"
      />
      
      <TextInput
        className="border border-gray-300 rounded-lg p-4 mb-6 text-base"
        placeholder="Password"
        value={onboardingData.password}
        onChangeText={(text) => updateOnboarding({ password: text })}
        secureTextEntry
      />

      <TouchableOpacity 
        className="bg-blue-500 rounded-lg p-4"
        onPress={handleNext}
      >
        <Text className="text-white text-center font-semibold text-base">Next</Text>
      </TouchableOpacity>
    </View>
  );

  const Step2 = () => (
    <View className="flex-1">
      <Text className="text-2xl font-bold mb-6">Work Profile</Text>
      
      <TextInput
        className="border border-gray-300 rounded-lg p-4 mb-6 text-base"
        placeholder="Work Type (e.g., Driver, Handyman)"
        value={onboardingData.workType}
        onChangeText={(text) => updateOnboarding({ workType: text })}
      />

      <View className="flex-row space-x-3">
        <TouchableOpacity 
          className="flex-1 bg-gray-300 rounded-lg p-4"
          onPress={handleBack}
        >
          <Text className="text-center font-semibold text-base">Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-1 bg-blue-500 rounded-lg p-4"
          onPress={handleNext}
        >
          <Text className="text-white text-center font-semibold text-base">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const Step3 = () => (
    <View className="flex-1">
      <Text className="text-2xl font-bold mb-6">Skills & Assets</Text>
      
      <TextInput
        className="border border-gray-300 rounded-lg p-4 mb-4 text-base"
        placeholder="Skills (comma separated)"
        value={onboardingData.skills.join(', ')}
        onChangeText={(text) => updateOnboarding({ skills: text.split(', ').filter(s => s) })}
      />
      
      <TextInput
        className="border border-gray-300 rounded-lg p-4 mb-6 text-base"
        placeholder="Assets (comma separated)"
        value={onboardingData.assets.join(', ')}
        onChangeText={(text) => updateOnboarding({ assets: text.split(', ').filter(s => s) })}
      />

      <View className="flex-row space-x-3">
        <TouchableOpacity 
          className="flex-1 bg-gray-300 rounded-lg p-4"
          onPress={handleBack}
        >
          <Text className="text-center font-semibold text-base">Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-1 bg-green-500 rounded-lg p-4"
          onPress={handleComplete}
          disabled={loading}
        >
          <Text className="text-white text-center font-semibold text-base">
            {loading ? 'Completing...' : 'Complete'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 p-6 bg-white">
        <Text className="text-lg text-gray-600 mb-2">Step {step} of 3</Text>
        
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}
      </View>
    </ScrollView>
  );
}