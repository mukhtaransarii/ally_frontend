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
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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
          <Text className="text-sm p-1">{user.bio}</Text>
        </View>
       
        {/* Edit Button */}
        <Button 
          onPress={handleEditProfile}
          title="Edit Profile"
          variant="primary"
        />
      </View>

      {/* Main Content */}
      <View className="p-6 flex gap-1">
        {/* My Bookings */}
        <TouchableOpacity className="flex-row items-center justify-between bg-gray-50 p-4 rounded-xl active:bg-gray-100">
          <View className="flex-row items-center gap-2">
            <Heart size={22} color="#666" className="mr-4" />
            <View>
              <Text className="font-medium text-gray-800">My Bookings</Text>
              <Text className="text-gray-500 text-sm">View all your trips</Text>
            </View>
          </View>
          <Text className="text-gray-400 text-2xl">›</Text>
        </TouchableOpacity>

        {/* Saved Locations */}
        <TouchableOpacity className="flex-row items-center justify-between bg-gray-50 p-4 rounded-xl active:bg-gray-100">
          <View className="flex-row items-center gap-2">
            <MapPin size={22} color="#666" className="mr-4" />
            <View>
              <Text className="font-medium text-gray-800">Saved Places</Text>
              <Text className="text-gray-500 text-sm">Your frequent destinations</Text>
            </View>
          </View>
          <Text className="text-gray-400 text-2xl">›</Text>
        </TouchableOpacity>

        {/* Payment Methods */}
        <TouchableOpacity className="flex-row items-center justify-between bg-gray-50 p-4 rounded-xl active:bg-gray-100">
          <View className="flex-row items-center gap-2">
            <CreditCard size={22} color="#666" className="mr-4" />
            <View>
              <Text className="font-medium text-gray-800">Payment Methods</Text>
              <Text className="text-gray-500 text-sm">Cards, UPI, Wallet</Text>
            </View>
          </View>
          <Text className="text-gray-400 text-2xl">›</Text>
        </TouchableOpacity>

        {/* Settings Section */}
        <View className="mt-6 p-4 bg-gray-50 rounded-xl">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Settings</Text>
          
          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center gap-2">
              <Bell size={20} color="#666" className="mr-4 w-6" />
              <Text className="text-gray-800">Notifications</Text>
            </View>
            <Text className="text-gray-400 text-2xl">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center gap-2">
              <Shield size={20} color="#666" className="mr-4 w-6" />
              <Text className="text-gray-800">Privacy & Security</Text>
            </View>
            <Text className="text-gray-400 text-2xl">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center gap-2">
              <HelpCircle size={20} color="#666" className="mr-4 w-6" />
              <Text className="text-gray-800">Help & Support</Text>
            </View>
            <Text className="text-gray-400 text-2xl">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center gap-2">
              <Settings size={20} color="#666" className="mr-4 w-6" />
              <Text className="text-gray-800">App Settings</Text>
            </View>
            <Text className="text-gray-400 text-2xl">›</Text>
          </TouchableOpacity>
        </View>

        {/* Emergency Contact (if exists) */}
        {user?.emergencyContact?.name && (
          <View className="mt-6 p-4 bg-blue-50 rounded-xl">
            <View className="flex-row items-center gap-2 mb-3">
              <Shield size={18} color="#3B82F6" className="mr-2" />
              <Text className="font-medium text-blue-800">Emergency Contact</Text>
            </View>
            <View className="space-y-1">
              <Text className="text-blue-700 font-medium">Name: {user.emergencyContact.name}</Text>
              <Text className="text-blue-600">Contact: {user.emergencyContact.phone}</Text>
              {user.emergencyContact.relation && (
                <Text className="text-blue-500 text-sm">Relation: {user.emergencyContact.relation}</Text>
              )}
            </View>
          </View>
        )}

        {/* Logout Button */}
        <View className="mt-10 mb-8">
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
      </View>
    </ScrollView>
  );
}