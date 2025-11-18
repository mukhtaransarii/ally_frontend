import React from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext.tsx'

export default function Profile() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-8 border-b border-gray-200">
        <Text className="text-3xl font-bold text-gray-900">Profile</Text>
        <Text className="text-gray-600 mt-2">Manage your account and settings</Text>
      </View>

      <ScrollView className="flex-1 p-6">
        {/* Personal Information Card */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">Personal Information</Text>
          
          <View className="space-y-3">
            <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
              <Text className="text-gray-600 font-medium">Name</Text>
              <Text className="text-gray-900 font-semibold">
                {user?.personalInfo?.name || 'Not set'}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
              <Text className="text-gray-600 font-medium">Email</Text>
              <Text className="text-gray-900 font-semibold">
                {user?.personalInfo?.email || 'Not set'}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
              <Text className="text-gray-600 font-medium">Phone</Text>
              <Text className="text-gray-900 font-semibold">
                {user?.personalInfo?.phone || 'Not set'}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-3">
              <Text className="text-gray-600 font-medium">Status</Text>
              <View className={`px-3 py-1 rounded-full ${
                user?.verification?.profileVerified 
                  ? 'bg-green-100' 
                  : 'bg-yellow-100'
              }`}>
                <Text className={`text-sm font-medium ${
                  user?.verification?.profileVerified 
                    ? 'text-green-800' 
                    : 'text-yellow-800'
                }`}>
                  {user?.verification?.profileVerified ? 'Verified' : 'Pending'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Work Profile Card */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">Work Profile</Text>
          
          <View className="space-y-3">
            <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
              <Text className="text-gray-600 font-medium">Primary Work</Text>
              <Text className="text-gray-900 font-semibold capitalize">
                {user?.workProfile?.primaryWorkType 
                  ? user.workProfile.primaryWorkType.replace('_', ' ') 
                  : 'Not set'
                }
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-3">
              <Text className="text-gray-600 font-medium">Availability</Text>
              <View className={`px-3 py-1 rounded-full ${
                user?.workProfile?.availability?.isAvailable 
                  ? 'bg-green-100' 
                  : 'bg-gray-100'
              }`}>
                <Text className={`text-sm font-medium ${
                  user?.workProfile?.availability?.isAvailable 
                    ? 'text-green-800' 
                    : 'text-gray-800'
                }`}>
                  {user?.workProfile?.availability?.isAvailable ? 'Online' : 'Offline'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Performance Stats Card */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">Performance</Text>
          
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">
                {user?.performance?.overallRating || 0}
              </Text>
              <Text className="text-gray-600 text-sm">Rating</Text>
            </View>

            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">
                {user?.performance?.completedTrips || 0}
              </Text>
              <Text className="text-gray-600 text-sm">Trips</Text>
            </View>

            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">
                {user?.performance?.cancellationRate || 0}%
              </Text>
              <Text className="text-gray-600 text-sm">Cancel Rate</Text>
            </View>
          </View>
        </View>

        {/* Account Actions Card */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <Text className="text-xl font-bold text-gray-900 mb-4">Account</Text>
          
          <View className="space-y-3">
            <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
              <Text className="text-blue-600 font-medium">Edit Profile</Text>
              <Text className="text-gray-400">→</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
              <Text className="text-blue-600 font-medium">Manage Skills</Text>
              <Text className="text-gray-400">→</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
              <Text className="text-blue-600 font-medium">My Assets</Text>
              <Text className="text-gray-400">→</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
              <Text className="text-blue-600 font-medium">Payment Settings</Text>
              <Text className="text-gray-400">→</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between py-4">
              <Text className="text-blue-600 font-medium">Help & Support</Text>
              <Text className="text-gray-400">→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          className="bg-red-600 rounded-2xl p-4 mt-8 mb-10"
          onPress={handleLogout}
        >
          <Text className="text-white text-center font-bold text-lg">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}