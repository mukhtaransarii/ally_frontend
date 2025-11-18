import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { sendOtp, verifyOtp } = useAuth();

  const handleSendOtp = async () => {
    Keyboard.dismiss();
    if (!email) {
      Alert.alert('Error', 'Please enter email');
      return;
    }

    setLoading(true);
    const result = await sendOtp(email);
    setLoading(false);

    if (result.success) {
      setStep(2);
      Alert.alert('Success', 'OTP sent to your email');
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleVerifyOtp = async () => {
    Keyboard.dismiss();
    if (!otp) {
      Alert.alert('Error', 'Please enter OTP');
      return;
    }

    setLoading(true);
    const result = await verifyOtp(email, otp);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Error', result.message);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-2xl font-bold text-center mb-8">AllySeek Login</Text>

      {step === 1 ? (
        <>
          <TextInput
            className="border border-gray-300 rounded-lg p-4 mb-4 text-base"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity 
            className="bg-blue-500 rounded-lg p-4"
            onPress={handleSendOtp}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold text-base">
              {loading ? 'Sending...' : 'Send OTP'}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            className="border border-gray-300 rounded-lg p-4 mb-4 text-base"
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
          />
          <TouchableOpacity 
            className="bg-blue-500 rounded-lg p-4"
            onPress={handleVerifyOtp}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold text-base">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}