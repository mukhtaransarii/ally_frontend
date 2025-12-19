import React, { useEffect, useState } from "react";
import { View, Text, Image, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useRouter } from "expo-router";
import { Camera } from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";
import { BASE_URL } from "@/env";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

export default function EditProfile() {
  const router = useRouter();
  const { user, token, updateUser } = useAuth();
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    gender: "",
  });
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({ 
      name: user.name || "",
      email: user.email || "", 
      phone: user.phone || "", 
      gender: user.gender || ""
    });
    setAvatar(user.avatar || "");
  }, [user]);

  const pickAvatar = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) return Alert.alert("Permission required");
   
    const res = await ImagePicker.launchImageLibraryAsync({ 
      mediaTypes: ["images"],
      allowsEditing: true, 
      aspect: [1,1], quality: 0.7, 
      base64: true
    });
    
    if (!res.canceled && res.assets?.[0]?.base64) setAvatar(`data:image/jpeg;base64,${res.assets[0].base64}`);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return Alert.alert("Name is required");
    if (form.phone && !/^\d{10}$/.test(form.phone)) return Alert.alert("Invalid phone number");
   
    setLoading(true);
    try {
      const { data } = await axios.post(`${BASE_URL}/api/user/edit-profile`, { ...form, avatar }, 
      { headers: { Authorization: `Bearer ${token}` } });
      
      if (data.success) { 
        updateUser(data.user); 
        router.back();
      }
    } catch (e) { 
      Alert.alert("Error", e.response?.data?.message || "Update failed")
    }
    finally { setLoading(false); }
  };

  const initials = form.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "U";

  return (
    <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS==="ios"?"padding":"height"}>
      <ScrollView contentContainerStyle={{ padding:24 }} className="bg-white flex-1">
        
        {/* Avatar */}
        <View className="items-center mb-8">
          <View className="w-32 h-32 rounded-full bg-[#CCF630] items-center justify-center">
            { avatar ? 
              <Image source={{ uri: avatar }} className="w-full h-full rounded-full"/> 
              : 
              <Text className="text-3xl font-bold">{initials}</Text>}
          </View>
          
          <TouchableOpacity 
            onPress={pickAvatar} 
            className="absolute bottom-2 right-[33%] bg-[#CCF630] w-10 h-10 rounded-full items-center justify-center border-2 border-white">
            <Camera size={18} color="#333"/>
          </TouchableOpacity>
        </View>
        
         {/* Full Name */}
        <Input 
          label="Full Name*" 
          placeholder="Enter your name"
          value={form.name} 
          onChangeText={v => setForm(p => ({ ...p, name:v }))}
        />
        
         {/* Email */}
        <Input 
         label="Email" 
         placeholder="example@something.com"
         value={form.email} 
         onChangeText={v => setForm(p => ({ ...p, email:v }))}
        />
        
         {/* Phone */}
        <Input 
         label="Phone" 
         placeholder="ex: 9876543210"
         keyboardType="phone-pad" 
         maxLength={10} value={form.phone} 
         onChangeText={v => setForm(p => ({ ...p, phone:v }))}
         />
        
         {/* Gender */}
        <View className="mt-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Gender</Text>
          <View className="flex-row gap-3">
            {["male","female","other"].map(g => (
              <TouchableOpacity 
               key={g} 
               onPress={() => setForm(p => ({ ...p, gender:g }))} 
               className={`flex-1 py-3 rounded-lg border ${form.gender===g?"border-[#CCF630] bg-[#CCF630]/10":"border-gray-300"}`}
              >
                <Text className="text-center capitalize">{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
         {/* Avtion Buttons */}
        <View className="mt-8">
          <Button 
           title={loading?"Saving...":"Save"} 
           onPress={handleSubmit} loading={loading}
          />
          
          <TouchableOpacity 
           onPress={() => router.back()} 
           className="py-4"
          >
            <Text className="text-center text-gray-500">Cancel</Text>
          </TouchableOpacity>
        </View>
        
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
