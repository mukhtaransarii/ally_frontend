import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, Keyboard, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import axios from "axios";
import { getCurrentLocation } from "@/utils/getCurrentLocation";
import { reverseGeocode } from "@/utils/SearchAddress";
import { useUser } from "@/contexts/UserContext";
import { useTrip } from "@/contexts/TripContext";
import { BASE_URL } from "@/env.js";


export default function LocationPicker() {
  const { pickup, setPickup, setStep } = useUser();
  const { setCompanions } = useTrip();
  const [loadingPickup, setLoadingPickup] = useState(true);
  const [message, setMessage] = useState("");
  
  // Fetch GPS location and reverse geocode on mount
  useEffect(() => {
    if (pickup) {
      setLoadingPickup(false);
      return;
    }
    
    const fetchPickup = async () => {
      setLoadingPickup(true);
      try {
        const loc = await getCurrentLocation();
        const address = await reverseGeocode(loc.lat, loc.lng);
        setPickup({ lat: loc.lat, lng: loc.lng, humanAddress: address});
      } catch (err) {
        console.log("Error fetching address:", err);
      } finally {
        setLoadingPickup(false);
      }
    };
    fetchPickup();
  }, []);


  const handleContinue = async () => {
    if (!pickup) return Alert.alert("Pickup location not set");
    try {
      const { data } = await axios.post(`${BASE_URL}/companion/nearest`, { lat: pickup.lat, lng: pickup.lng });
      
      if (!data.success) return setMessage(data.message); 
      if (data.companions.length === 0) return setMessage(data.message);

      setMessage("");
      setCompanions(data.companions);
      setStep(2);
    } catch (err) {
      console.log("Error finding companions:", err);
    }
  };

  return (
    <View className="absolute w-full px-4 mt-3 bottom-10 z-10">
    
      <View className="bg-white rounded-2xl p-4 ">
        <View className="flex-row items-center gap-2">
        
          {/* Label & Location */}
          <View className="flex-1">
            <Text className="text-xs text-zinc-500 mb-1">Continue with your current location</Text>
            {loadingPickup ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator size="small" color="#000" />
                <Text className="text-base text-zinc-700">Getting your location</Text>
              </View>
            ) : (
              <Text className="text-base text-zinc-900" numberOfLines={2}>{pickup?.humanAddress?.display_name}</Text>
            )}
          </View>

          {/* Handle Continue */}
          <TouchableOpacity
            onPress={handleContinue}
            disabled={loadingPickup}
            className={`p-4 px-6 rounded-xl ${loadingPickup ? "bg-gray-200" : "bg-black"}`}
          >
            <Text className={`text-center ${loadingPickup ? "text-zinc-600" : "text-white"}`}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Error Message */}
        {message && <Text className="text-red-500 text-sm mt-1">{message}</Text>}
      </View>
      
    </View>
  );
}