import React, { useEffect, useState } from "react";
import { View, TextInput, Text, Image, Modal, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useRouter } from "expo-router";
import { Camera } from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";
import { BASE_URL } from "@/env";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { Ionicons } from "@expo/vector-icons";

export default function EditProfile() {
  const router = useRouter();
  const { user, token, updateUser } = useAuth();
  const [avatar, setAvatar] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    gender: "",
    username: "",
    phone: "",
    bio: "",
    skills: [],
  });
  const [loading, setLoading] = useState(false);
  const [cropImageUri, setCropImageUri] = useState("");
  const [showCrop, setShowCrop] = useState(false);
  const [message, setMessage] = useState("");
  
  // Checking data...  
  useEffect(() => {
    if (!user) return;
  
    setForm({
      name: user.name || "",
      email: user.email || "",
      gender: user.gender || "",
      username: user.username || "",
      phone: user.phone || "",
      bio: user.bio || "",
      skills: user.skills || [],
    });
    setAvatar(user.avatar || "");
  }, [user]);
  
  // Skills options and toggle
  const SKILL_CATEGORIES = {
    "General": [
      "Driver","Delivery Partner","Helper","Cleaner"
    ],
    "Technical": [
      "Electrician","Plumber","Mechanic","Welder",
      "AC Technician","Refrigerator Technician","RO Technician"
    ],
    "Home Services": [
      "Housekeeping","Cook","Kitchen Helper",
      "Babysitter","Elder Care","Home Nurse","Gardener"
    ],
    "Transport & Travel": [
      "Cab Driver","Auto Driver","Bike Rider",
      "Truck Driver","Tour Guide","Travel Assistant"
    ],
    "Construction": [
      "Construction Worker","Mason","Tile Setter",
      "Carpenter","Painter","Interior Helper","Scaffolding Worker"
    ],
    "Logistics": [
      "Warehouse Worker","Store Helper","Loader",
      "Packager","Inventory Assistant","Security Guard"
    ]
  };

  

  const toggleSkill = (skill) => {
    setForm(p => ({
      ...p,
      skills: p.skills.includes(skill)
        ? p.skills.filter(s => s !== skill)
        : [...p.skills, skill],
    }));
  };

  // ImagePicker & Crop
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

  // handle Submit
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${BASE_URL}/api/user/edit-profile`,
        { ...form, avatar },
        { headers: { Authorization: `Bearer ${token}` } }
      );
     
      updateUser(data.user);
      setMessage("")
      router.back();
    } catch (e) {
      setMessage("Please fill all the fields", e)
    } finally {
      setLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS==="ios"?"padding":"height"}>
     
     {/* Header with Save Icon */}
      <View className="bg-white px-4 h-14 flex-row items-center justify-between">
        <TouchableOpacity
         onPress={() => router.back()}
         className="flex-row items-center gap-2"
        >
         <Ionicons name="chevron-back-outline" size={20} color="black" />
         <Text className="text-xl font-semibold">Edit Profile</Text>
        </TouchableOpacity>
       
        {loading ? <Text>Saving..</Text> : (
          <TouchableOpacity onPress={handleSubmit}
           className="h-full aspect-square flex justify-center items-end"
          >
           <Ionicons name="save-outline" size={20} color="black" />
          </TouchableOpacity>
        )}
      </View>
        
      <ScrollView contentContainerStyle={{ paddingHorizontal:20 }} className="bg-white flex-1">
        <View className="flex gap-2 pb-5">
          {message && (
            <View className="flex-row items-center justify-center gap-2 bg-red-200 rounded-lg">
             <Ionicons name="warning-outline" size={12} color="red" />
             <Text className="text-sm text-red-500">{message}</Text>
            </View>
          )}
          
          {/* 1. Avatar */}
          <View className="items-center mb-8">
            <View className="w-32 h-32 rounded-full">
             <Image source={{ uri: avatar }} className="w-full h-full rounded-full"/> 
            </View>
          
            
            <TouchableOpacity 
              onPress={pickAvatar} 
              className="absolute bottom-2 right-[33%] bg-[#CCF630] w-10 h-10 rounded-full items-center justify-center border-2 border-white">
              <Camera size={18} color="#333"/>
            </TouchableOpacity>
          </View>
        
          
           {/* 2. Full Name */}
          <Input 
            label="Full Name*" 
            placeholder="Enter your name"
            value={form.name} 
            onChangeText={v => setForm(p => ({ ...p, name:v }))}
          />
          
           {/* 3. Email */}
          <Input 
           label="Email" 
           placeholder="example@something.com"
           value={form.email} 
           onChangeText={v => setForm(p => ({ ...p, email:v }))}
          />
          
           {/* 4. Gender */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">Gender</Text>
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
          
          {user.role === "partner" && (
            <View className="flex gap-2">
              {/* 5. Username */}
              <Input 
               label="Username" 
               placeholder="Enter your username"
               value={form.username} 
               onChangeText={v => setForm(p => ({ ...p, username:v }))}
               />
               
              {/* 6. Bio */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">Bio</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3"
                  placeholder="Write something about you."
                  placeholderTextColor="#9CA3AF"
                  value={form.bio}
                  onChangeText={v => setForm(p => ({ ...p, bio: v }))}
                  multiline={true}
                  numberOfLines={10}
                  textAlignVertical="top" // For Android to start from top
                  style={{
                    minHeight: 150,
                    color: 'transparent',
                  }}
                />
              </View>
               
              {/* 7. Skills */}
              <View>
                <Text className="text-sm font-medium text-secondary mb-1">Skills</Text>
                <View className="bg-gray-50 rounded-lg p-2">
                  {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
                    <View key={category} className="mb-4">
                      <Text className="text-xs text-gray-400 mb-2">{category}</Text>
                     
                      {/* Horizontal scroll */}
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex-row gap-2">
                          {skills.map(skill => {
                            const active = form.skills.includes(skill);
                           
                            return (
                              <TouchableOpacity
                                key={skill}
                                onPress={() => toggleSkill(skill)}
                                className={`px-2 py-1 rounded-lg border ${active ? "bg-black border-black" : "border-gray-300" }`}
                              >
                                <Text className={`${active ? "text-white" : "text-gray-700"} text-xs`}>{skill}</Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </ScrollView>
                    </View>
                  ))}
                </View>
              </View>
  
               
              
              {/* 8. Phone */}
              <Input 
               label="Phone" 
               placeholder="ex: 9876543210"
               keyboardType="phone-pad" 
               maxLength={10} value={form.phone} 
               onChangeText={v => setForm(p => ({ ...p, phone:v }))}
               />
             </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
