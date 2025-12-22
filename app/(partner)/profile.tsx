import React from 'react';
import { View, Text, Alert, ScrollView, TouchableOpacity, Image } from 'react-native';
import Button from '@/components/common/Button.jsx';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Phone, MapPin, Calendar, Edit2, LogOut, Shield, Heart, Navigation, CreditCard, Settings, HelpCircle, Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router'
import Header from '@/components/common/Header.jsx'
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter()
  
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => logout() },
    ]);
  };

  const handleEditProfile = () => {
    router.push('/screens/editProfile')
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-4 border-b border-gray-100">
          {/* Header with Username */}
          <View className="h-14 flex-row items-center justify-between">
            <Text className="text-xl font-semibold">@{user.username}</Text>
            <TouchableOpacity onPress={handleEditProfile}
              className="h-full aspect-square flex justify-center items-end"
            >
             <Ionicons name="create-outline" size={20} color="black" />
            </TouchableOpacity>
          </View>
      
          <View className="flex-row items-center gap-4 mb-4">
            {/* Avatar */}
            <Image source={{ uri: user.avatar }} className="w-20 h-20 rounded-full" />

  
            {/* User Info */}
            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-1">
                <Text className="text-2xl font-bold text-gray-900">{user?.name || 'USER NAME'}</Text>
                {user.gender === "male" ? (
                    <Ionicons name="male" size={16} color="#45B6FE" />
                  ) : user.gender === "female" ? (
                    <Ionicons name="female" size={16} color="#FF69B4" />
                  ) : user.gender === "other" ? (
                    <Ionicons name="transgender" size={16} color="#5BCFFB" />
                  ) : null }
              </View>
              
              <View className="flex-row items-center gap-2 bg-gray-100 rounded-lg px-2 self-start mb-2">
                <Mail size={12} color="#555" />
                <Text className="text-gray-500 text-sm mb-[0.8vw]">{user?.email}</Text>
              </View>
              {user?.phone && (
              <View className="flex-row items-center gap-2 bg-gray-100 rounded-lg px-2 self-start">
                <Phone size={12} color="#555" />
                <Text className="text-gray-500 text-sm mb-[0.8vw]">{user?.phone}</Text>
              </View>
              )}
            </View>
          </View>
          
          {/* Role & Skills */}
          <View className="pb-2">
            <View className="flex-row items-center gap-2">
            <Text className="bg-purple-50 rounded-lg px-2 text-purple-500 self-start text-sm">{user.role}</Text>
            <Text className="text-lg leading-none text-gray-500">|</Text>
              {user?.skills.map((s) => (
               <Text key={s} className="bg-gray-100 rounded-lg px-2 text-gray-500  self-start text-sm">{s}</Text>
              ))}
            </View>
          </View>
          
          {/* Bio */}
          <View className="bg-gray-100 rounded-lg p-2 mb-4">
           <Text className="text-xs mb-1 text-gray-500">Bio</Text>
           <Text>
              {user.bio.match(/(#[^\s#]+|\S+|\s+)/g)?.map((segment, index) => {
                if (segment.startsWith('#')) {
                  return (
                    <Text key={index} style={{ color: '#1DA1F2' }}>
                      {segment}
                    </Text>
                  );
                }
                return segment;
              })}
            </Text>
         </View>
         
        </View>
      </ScrollView>

      {/* Fixed Logout */}
      <View className="absolute bottom-0 left-0 right-0 px-4 py-3">
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="secondary"
        />

        <Text className="text-center text-gray-400 text-xs mt-2">
          Ally • v1.0
        </Text>
      </View>
    </View>

  );
}