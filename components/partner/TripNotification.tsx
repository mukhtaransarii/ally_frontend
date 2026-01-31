import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useTrip } from "@/contexts/TripContext";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL } from '@/env.js';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import Toast from "react-native-toast-message";

export default function TripNotification() {
  const { trip, setTrip } = useTrip();
  const { token } = useAuth();
  
  // cancel by partner 
  const handleCancleTrip = async () => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/trip/cancel`,
        { tripId: trip._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      Toast.show({ type: "success", text1: "You cancelled trip." });
      setTrip(null);
    } catch (err) {
      console.log('Error while cancle trip ', err);
      Toast.show({
        type: "error",
        text1: err.response?.data?.message || "Cancel failed"
      });
    }
  };
    
  const handleAcceptTrip = async () => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/trip/accept`,
        { tripId: trip._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!data.success) return;
      
      Toast.show({ type: "success", text1: "trip accepted" });
      setTrip(data.trip);
    } catch (err) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: err.response?.data?.message || "Accept failed"
      });
    }
  };
  
  return (
    <View className="p-4 gap-3 absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-xl">
      <View className='flex gap-3'>
        {/* UPPER */}
        <View className="gap-3">
          <View className="flex-row gap-3">
            <View className="flex-1 bg-white shadow-xl rounded-xl p-3 border border-gray-200">
              <Text className="text-xs font-medium text-gray-500">Trip ID</Text>
              <Text
                className="text-sm font-mono text-gray-900"
                numberOfLines={1}
              >
                {trip._id}
              </Text>
            </View>
            
            <View className="bg-white shadow-xl rounded-xl p-3 border border-gray-200">
              <Text className="text-xs font-medium text-gray-500">Status</Text>
              <View className="flex-row items-center gap-1">
                <View
                  className={`w-2 h-2 ${
                    trip.status === 'accepted'
                      ? 'bg-green-500'
                      : trip.status === 'pending'
                      ? 'bg-yellow-500'
                      : 'bg-gray-500'
                  }`}
                />
                <Text className="text-sm font-medium text-gray-900 capitalize">
                  {trip.status}
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* BOTTOM */}
        <View className="bg-white shadow-xl rounded-xl p-3 border border-gray-200">
          <View className="flex-row items-center gap-2">
            <Image source={{ uri: trip.user.avatar }} className="w-14 h-14 rounded-full"/>
             
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="font-semibold text-gray-900">
                  {trip.user.name}
                </Text>
                {trip.user.gender === "male" ? (
                  <Ionicons name="male" size={12} color="#45B6FE" />
                ) : trip.user.gender === "female" ? (
                  <Ionicons name="female" size={12} color="#FF69B4" />
                ) : trip.user.gender === "other" ? (
                  <Ionicons name="transgender" size={12} color="#A0A0A0" />
                ) : null}
              </View>
               
              <View className="flex-row items-center self-start bg-gray-100 px-2 py-1 rounded-lg">
                <Ionicons name="time-outline" size={12} color="black" />
                <Text className="ml-1 text-xs font-medium text-gray-500">
                  {trip.distance} •{" "}
                </Text>
                <Text className="text-xs font-medium text-gray-500">
                  {trip.duration}
                </Text>
              </View>
            </View>
          </View>
          
          <Text className="text-xs text-gray-400 mt-1">Location</Text>
          <View className="flex-row items-center gap-1 bg-gray-100 rounded-lg p-2">
            <Ionicons name="location" size={12} color="black" />
            <Text
              numberOfLines={3}
              className="flex-1 text-xs text-gray-600 leading-none"
            >
              {trip?.pickup.humanAddress.display_name ||
                "Fetching address..."}
            </Text>
          </View>
        </View>
        
       <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={handleCancleTrip}
            className="flex-1 bg-white border border-gray-200 p-4 rounded-xl"
          >
            <Text className="text-center">Cancel Trip</Text>
          </TouchableOpacity>
           
          <TouchableOpacity
            onPress={handleAcceptTrip}
            className="flex-1 bg-green-700 p-4 rounded-xl"
          >
            <Text className="text-white text-center">Accept Trip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}