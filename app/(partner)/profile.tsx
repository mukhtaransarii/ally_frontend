import React from 'react';
import { View, Text, Alert, ScrollView, TouchableOpacity, Image } from 'react-native';
import Button from '@/components/common/Button.jsx';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Phone, MapPin, Calendar, Edit2, LogOut, Shield, Heart, Navigation,
  CreditCard, Settings, HelpCircle, Bell
} from 'lucide-react-native';
import { useRouter } from 'expo-router'

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

  // Get user initials for avatar
  const getInitials = () => {
    if (user?.name) {
      return user?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user?.email?.slice(0, 2).toUpperCase() || 'TC';
  };

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
     
      {/* Header with Profile Info */}
      <View className="pt-14 px-6 pb-6 bg-white border-b border-gray-100">
        <View className="flex-row items-start mb-4">
          {/* Avatar */}
          <View className="mr-4">
            <View className="w-20 h-20 rounded-full bg-[#CCF630] items-center justify-center">
              {user?.avatar ? (
                <Image 
                  source={{ uri: user.avatar }}
                  className="w-20 h-20 rounded-full"
                />
              ) : (
                <Text className="text-2xl font-bold text-gray-900">
                  {getInitials()}
                </Text>
              )}
            </View>
          </View>

          {/* User Info */}
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900 mb-1">
              {user?.name || 'USER NAME'}
            </Text>
            <View className="flex-row items-center gap-2 mb-1">
              <Mail size={16} color="#666" />
              <Text className="text-gray-600">{user?.email}</Text>
            </View>
            {user?.phone && (
              <View className="flex-row items-center gap-2">
                <Phone size={16} color="#666" />
                <Text className="text-gray-600">{user.phone}</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Bio & Role */}
        <View className="pb-2">
          <Text className="bg-purple-50 rounded-lg p-1 text-purple-500 self-start text-sm">{user.role}</Text>
          <Text className="text-sm p-1">{user.bio || "user dont have bio"}</Text>
        </View>
        
        {/* Edit Button */}
        <Button 
          onPress={handleEditProfile}
          title="Edit Profile"
          variant="primary"
        />
      </View>


        {/* Logout Button */}
        <View className="mt-10 mb-8 px-6">
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="secondary"
            className="border border-gray-300"
          />
          
          <Text className="text-center text-gray-400 text-xs mt-6">
            Travel Companions • v1.0
          </Text>
        </View>
    </ScrollView>
  );
}