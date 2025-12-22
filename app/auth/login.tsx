import Logo from '../../components/logo/Logo';
import { useState } from "react";
import { View, Text, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import OTPInput from '@/components/common/OTPInput';
import { BASE_URL } from '@/env.js'
import axios from 'axios'
import { User, Users } from 'lucide-react-native';

export default function Login() {
  const router = useRouter();
  const { login, user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpMsg, setOtpMsg] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [exists, setExists] = useState(null);
  const [agree, setAgree] = useState(false);
  
  async function handleSendOtp() {
    setLoading(true);
    try {
      const { data } = await axios.post(`${BASE_URL}/api/user/send-otp`, { email, role });
      if (data.success) { setExists(data.exists); setStep(2); }
    } catch {
      Alert.alert('Send OTP Error', 'something went wrong in server');
    } finally { setLoading(false); }
  }

  async function handleVerifyOtp() {
    setLoading(true);
    try {
      const { data } = await axios.post(`${BASE_URL}/api/user/verify-otp`, { email, otp, role });
      
      if(!data.success) return setOtpMsg(data.message);
      
      setOtpMsg(""); 
      await login(data.user, data.token);
      router.replace("/");
    } catch {
      Alert.alert('Verify OTP Error', 'something went wrong in server');
    } finally { setLoading(false); }
  }

  const RoleCard = ({ label, icon: Icon, value, desc }) => (
    <TouchableOpacity onPress={()=>setRole(value)} activeOpacity={0.7}
      className={`flex-row items-center p-4 mb-3 rounded-xl border-2 ${role===value?"border-[#CCF630] bg-[#CCF630]/10":"border-gray-200"}`}>
      
      <View className={`w-10 h-10 mr-4 rounded-full items-center justify-center ${role===value?"bg-[#CCF630]":"bg-gray-200"}`}>
        <Icon size={20} color={role===value?"#333":"#666"} />
      </View>
  
      <View className="flex-1">
        <Text className={`text-lg font-semibold ${role===value?"text-gray-800":"text-gray-700"}`}>{label}</Text>
        <Text className="text-gray-500 text-xs">{desc}</Text>
      </View>
  
      {role===value && <View className="w-4 h-4 bg-[#CCF630] border-2 border-white rounded-full" />}
    </TouchableOpacity>
  );
  
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "android" ? 25 : 0}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        
          <View className="flex-1 p-6 pt-10 justify-center bg-white">
            <View className="mb-8"><Logo /></View>

            {step === 1 ? (
              <View className="space-y-6">

                <View className="mb-4">
                  <Text className="text-5xl font-bold text-gray-800 mb-1">Login or signup with email</Text>
                  <Text className="text-gray-500">Select your role to continue</Text>
                </View>

                {/* SHORT CLEAN ROLE SELECT */}
                <View>
                  <RoleCard 
                    label="User" 
                    value="user" 
                    icon={User}
                    desc="Find & book travel partners" 
                  />
                  <RoleCard 
                    label="Partner" 
                    value="partner" 
                    icon={Users}
                    desc="Offer travel services" 
                  />
                </View>

                <View className="mb-4">
                  <Text className="text-gray-700 mb-2">
                    Enter your email to continue as <Text className="font-semibold">{role}</Text>
                  </Text>
                  <Input
                    placeholder="you@example.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                {/* Terms */}
                <TouchableOpacity onPress={() => setAgree(!agree)} className="flex-row items-center mb-4">
                  <View className={`w-5 h-5 rounded border-2 border-[#333] mr-2 ${agree && 'bg-[#CCF630]'}`} />
                  <Text>I agree </Text>
                  <TouchableOpacity onPress={() => router.push("/screens/terms")}>
                    <Text className="text-blue-500 underline">terms & conditions</Text>
                  </TouchableOpacity>
                </TouchableOpacity>

                <Button
                  title={loading ? "Sending..." : "Send OTP"}
                  onPress={handleSendOtp}
                  loading={loading}
                  disabled={!email || !agree || loading}
                  variant="primary"
                />
              </View>
            ) : (
              <View className="space-y-6">
                <View>
                  <Text className="text-5xl font-bold mb-2 text-gray-800">
                    Verify OTP and {exists ? "Login Account" : "Create Account"} as {role}
                  </Text>
                  <Text className="text-gray-600 mb-2">Enter the 6-digit code sent to</Text>

                  <View className="bg-gray-100 p-4 rounded-lg mb-4">
                    <Text className="text-gray-500 text-sm">Email</Text>
                    <Text className="text-lg font-semibold text-gray-800">{email}</Text>
                  </View>
                </View>

                <View className="mb-4">
                  <Text className="text-sm font-medium mb-3 text-gray-700">Verification Code</Text>
                  <OTPInput onComplete={setOtp} />
                  <Text className="text-red-500 text-xs mt-2">{otpMsg}</Text>
                </View>

                <Button
                  title={loading ? "Verifying..." : exists ? "Login" : "Create Account"}
                  onPress={handleVerifyOtp}
                  loading={loading}
                  disabled={!otp || otp.length < 4 || loading}
                  variant="primary"
                />

                <View className="flex-row justify-between items-center mt-2">
                  <TouchableOpacity onPress={() => setStep(1)}>
                    <Text className="text-[#CCF630] font-bold">Change Email</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleSendOtp}>
                    <Text className="text-[#CCF630] font-bold">Resend OTP</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
