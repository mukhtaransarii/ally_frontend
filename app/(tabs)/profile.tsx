import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-8 border-b border-gray-200">
        <Text className="text-3xl font-bold text-gray-900">Profile</Text>
        <Text className="text-gray-600 mt-2">Manage your account and settings</Text>
      </View>

      <ScrollView className="flex-1 p-6 space-y-6">
        {/* Personal Info */}
        <View className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <Text className="text-xl font-bold mb-4">Personal Information</Text>
          <Text className="text-gray-600">Name: <Text className="font-semibold text-gray-900">{user?.name}</Text></Text>
          <Text className="text-gray-600">Email: <Text className="font-semibold text-gray-900">{user?.email}</Text></Text>
          <Text className="text-gray-600">Phone: <Text className="font-semibold text-gray-900">{user?.phone}</Text></Text>
        </View>

        {/* Address */}
        <View className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <Text className="text-xl font-bold mb-4">Address</Text>
          <Text className="text-gray-600">Street: <Text className="font-semibold text-gray-900">{user?.address?.street}</Text></Text>
          <Text className="text-gray-600">Area: <Text className="font-semibold text-gray-900">{user?.address?.area}</Text></Text>
          <Text className="text-gray-600">Locality: <Text className="font-semibold text-gray-900">{user?.address?.locality}</Text></Text>
          <Text className="text-gray-600">City: <Text className="font-semibold text-gray-900">{user?.address?.city}</Text></Text>
          <Text className="text-gray-600">State: <Text className="font-semibold text-gray-900">{user?.address?.state}</Text></Text>
          <Text className="text-gray-600">Pincode: <Text className="font-semibold text-gray-900">{user?.address?.pincode}</Text></Text>
        </View>

        {/* Vehicle Info */}
        <View className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <Text className="text-xl font-bold mb-4">Vehicle</Text>
          <Text className="text-gray-600">Brand: <Text className="font-semibold text-gray-900">{user?.vehicle?.brand}</Text></Text>
          <Text className="text-gray-600">Model: <Text className="font-semibold text-gray-900">{user?.vehicle?.model}</Text></Text>
          <Text className="text-gray-600">Color: <Text className="font-semibold text-gray-900">{user?.vehicle?.color}</Text></Text>
          <Text className="text-gray-600">Registration No: <Text className="font-semibold text-gray-900">{user?.vehicle?.registrationNo}</Text></Text>
          <Text className="text-gray-600">Seats: <Text className="font-semibold text-gray-900">{user?.vehicle?.seat}</Text></Text>
          <Text className="text-gray-600">Year: <Text className="font-semibold text-gray-900">{user?.vehicle?.year}</Text></Text>
          <Text className="text-gray-600">Type: <Text className="font-semibold text-gray-900">{user?.vehicle?.vehicleType}</Text></Text>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity
          className="bg-blue-600 rounded-2xl p-4 mt-4"
          onPress={() => router.push("/EditProfile")}
        >
          <Text className="text-white text-center font-bold text-lg">Edit Profile</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          className="bg-red-600 rounded-2xl p-4 mt-4"
          onPress={logout}
        >
          <Text className="text-white text-center font-bold text-lg">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
