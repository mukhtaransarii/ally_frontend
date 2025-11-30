import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from './contexts/AuthContext';

export default function Login() {
  const router = useRouter();
  const { sendOtp, verifyOtp } = useAuth();
  
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    setLoading(true);
    const result = await sendOtp(email);
    setLoading(false);
    
    if (result.success) setStep(2);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    const result = await verifyOtp(email, otp);
    setLoading(false);
    
    if (result.success) router.push(result.profileEmpty ? "/profile" : "/(tabs)");
  };

  return (
    <View className="flex-1 p-6 justify-center bg-white">
      <Text className="text-4xl font-bold text-center mb-12" style={{ color: '#333333' }}>
        Welcome
      </Text>

      {step === 1 ? (
        <View className="space-y-6">
          <View>
            <Text className="text-sm font-medium mb-2" style={{ color: '#333333' }}>Email</Text>
            <TextInput
              className="border-b p-3 text-base"
              placeholder="Enter your email"
              placeholderTextColor="#999999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={{ borderBottomColor: '#CCF630' }}
            />
          </View>
          
          <TouchableOpacity 
            className="p-4 rounded-lg mt-4"
            onPress={handleSendOtp}
            disabled={!email || loading}
            style={{ 
              backgroundColor: email && !loading ? '#CCF630' : '#F0F0F0',
              opacity: email && !loading ? 1 : 0.6
            }}
          >
            <Text className="text-center font-semibold text-base" style={{ color: '#333333' }}>
              {loading ? "Sending..." : "Continue"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="space-y-6">
          <View className="bg-gray-50 p-4 rounded-lg mb-2">
            <Text className="text-xs text-gray-500 mb-1">OTP sent to</Text>
            <Text className="text-base font-medium" style={{ color: '#333333' }}>{email}</Text>
          </View>

          <View>
            <Text className="text-sm font-medium mb-2" style={{ color: '#333333' }}>Verification Code</Text>
            <TextInput
              className="border-b p-3 text-base text-center text-xl font-semibold"
              placeholder="000000"
              placeholderTextColor="#999999"
              keyboardType="numeric"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
              style={{ borderBottomColor: '#CCF630', letterSpacing: 8 }}
            />
          </View>
          
          <TouchableOpacity 
            className="p-4 rounded-lg mt-4"
            onPress={handleVerifyOtp}
            disabled={otp.length < 6 || loading}
            style={{ 
              backgroundColor: otp.length >= 6 && !loading ? '#CCF630' : '#F0F0F0',
              opacity: otp.length >= 6 && !loading ? 1 : 0.6
            }}
          >
            <Text className="text-center font-semibold text-base" style={{ color: '#333333' }}>
              {loading ? "Verifying..." : "Verify & Continue"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setStep(1)} className="mt-4">
            <Text className="text-center text-sm" style={{ color: '#666666' }}>
              Wrong email? <Text style={{ color: '#CCF630' }}>Go back</Text>
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}