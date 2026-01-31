import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useTrip } from "@/contexts/TripContext";
import { useUser } from "@/contexts/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL } from '@/env.js'
import { useAuth } from '@/contexts/AuthContext'
import axios from 'axios'
import Toast from "react-native-toast-message";

export default function TripPending() {
  const { trip, setTrip, setCompanions } = useTrip();
  const { setStep } = useUser();
  const { token } = useAuth();

  const handleCancleTrip = async () => {
    // try {
    //   const { data } = await axios.post(
    //     `${BASE_URL}/api/trip/cancel`,
    //     { tripId: trip._id },
    //     { headers: { Authorization: `Bearer ${token}` } }
    //   );
    //   Toast.show({type: "success", text1: "You cancelled trip."});
      
    //   setTrip(null)
    //   setStep(1)
    // } catch (err) {
    //   Toast.show({type: "error", text1: err.response?.data?.message || "Cancel failed"});
    // }
  };
  
  return (
    <View className="p-4 absolute bottom-0 top-0 left-0 right-0 flex justify-between">
      <View className="p-4 bg-white gap-3 rounded-lg">
        <View className="flex-row gap-3">
          <View className="flex-1 bg-white shadow-xl rounded-xl p-3 border border-gray-200">
            <Text className="text-xs font-medium text-gray-500">Trip ID</Text>
            <Text className="text-sm font-mono text-gray-900" numberOfLines={1}>{trip._id}</Text>
          </View>
          
          <View className="bg-white shadow-xl rounded-xl p-3 border border-gray-200">
            <Text className="text-xs font-medium text-gray-500">Status</Text>
            <View className="flex-row items-center gap-1">
              <View className={`w-2 h-2 ${
                trip.status === 'accepted' ? 'bg-green-500' : 
                trip.status === 'pending' ? 'bg-yellow-500' : 
                'bg-gray-500'
              }`} />
              <Text className="text-sm font-medium text-gray-900 capitalize">{trip.status}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="gap-3 bg-white p-4 rounded-lg">
        <View className='gap-4 bg-white shadow-xl rounded-xl p-4 border border-gray-200'>
          <View className='flex-row gap-2'>
              <Image source={{ uri: trip.companion.avatar }} className="w-14 h-14 rounded-full"/>
              
              <View className="flex-1 gap-1">
                  <View className="flex-row items-center gap-2">
                      <Text className="font-semibold text-gray-900">{trip.companion.name}</Text>
                      {/* Gender icon */}
                      {trip.companion.gender === "male" ? (
                          <Ionicons name="male" size={12} color="#45B6FE" />
                          ) : trip.companion.gender === "female" ? (
                          <Ionicons name="female" size={12} color="#FF69B4" />
                          ) : trip.companion.gender === "other" ? (
                          <Ionicons name="transgender" size={12} color="#A0A0A0" />
                      ) : null }
                  </View>
                  
                  <Text className="text-xs text-gray-400">Location</Text>
                  <View className="flex-row items-center gap-1 bg-gray-100 rounded-lg p-2">
                      <Ionicons name="location" size={12} color="black" />
                      <Text numberOfLines={3} className="flex-1 text-xs text-gray-600 leading-none">{trip.companionAddress.display_name ||"Fetching address..."}</Text>
                  </View>
              </View>
            </View>

            <View className="flex-row flex-wrap gap-2">
              {trip.companion.skills.map((s) => (
                  <Text key={s} className="bg-black rounded-lg p-2 text-white  self-start text-xs">{s}</Text>
              ))}
            </View>

            <View className="bg-gray-100 rounded-lg p-2">
              <Text className="text-xs mb-1 text-gray-500">Bio</Text>
              <Text className="text-sm">
                  {trip.companion.bio.trim('').match(/(#[^\s#]+|\S+|\s+)/g)?.map((segment, index) => {
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
         
         <View className='absolute -top-[56px] bg-black shadow-xl rounded-xl p-2 border border-gray-200'>
          <Text className='text-2xl text-white font-bold tracking-[2vw] text-center'>{trip.otp}</Text>
        </View>

         <TouchableOpacity
            onPress={handleCancleTrip}
            className='bg-white shadow-xl rounded-xl p-4 border border-gray-200'
            >
            <Text className="text-center">Cancel Trip</Text>
         </TouchableOpacity>    
      </View>
    </View>
  );
}



         

          
  


