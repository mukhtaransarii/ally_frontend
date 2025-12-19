import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTrip } from "@/contexts/TripContext";
import { useUser } from "@/contexts/UserContext";
import { deleteSecure } from "@/hooks/useSecureStore";
import { reverseGeocode } from "@/utils/SearchAddress";
import { getRoute } from "@/utils/getRoute";


export default function TripSummary() {
  const { pickup, setPickup, setStep } = useUser();
  const { companions, setCompanions, selectedCompanion, setSelectedCompanion } = useTrip();
  
  // Cal Address, Distance & Duration
  useEffect(() => {
    if (!companions.length) return;
  
    const loadData = async () => {
      const result = await Promise.all(
        companions.map(async (c) => {
          const addr = await reverseGeocode(c.lat, c.lng);
          const data = await getRoute(pickup.lng, pickup.lat, c.lng, c.lat);
          const r = data.routes[0];
  
          return {
            ...c,
            address: addr,
            distance: r.distance >= 1000 ? `${(r.distance / 1000).toFixed(1)}km` : `${Math.round(r.distance)}m`,
            duration: r.duration >= 3600 ? `${Math.floor(r.duration/3600)}h ${Math.floor((r.duration%3600)/60)}m` : `${Math.floor(r.duration/60)}m`
          };
        })
      );
      setCompanions(result);
    };
    loadData();
  }, [pickup]);
  
  
  
  // Handle Back
  const handleBack = async () => {
    await deleteSecure("pickup");
    await deleteSecure("companions");
    await deleteSecure("selectedCompanion");

    setPickup(null);
    setCompanions([]);
    setSelectedCompanion(null);
    setStep(1);
  };
  
  // Handle Continue
  const handleContinueTrip = () => {
    if (!selectedCompanion) {
      Alert.alert("Select Companion", "Please select a companion");
      return;
    }

    Alert.alert("Confirm Trip", "Trip is confirmed");
  };

  return (
    <View className="absolute bottom-0 w-full bg-white rounded-t-3xl shadow-2xl">
      <View className="px-6 py-4">
        <Text className="text-xl font-bold text-gray-900">Trip Summary</Text>
        <Text className="text-sm text-gray-500">Select a companion</Text>
      </View>

      <ScrollView className="max-h-[360px]">
        <View className="px-6 gap-4">
          {companions.map((c) => (
              <TouchableOpacity
                key={c._id}
                onPress={() => setSelectedCompanion(c)}
                className={`flex-row items-center gap-2 rounded-xl p-3 border ${ selectedCompanion?._id == c._id ? "border-black bg-gray-50" : "border-gray-200" }`}
              >
                {/* Avatar */}
                <Image
                  source={{ uri: c.avatar }}
                  className="w-11 h-11 rounded-full"
                />
                
                {/* Rigth Container */}
                <View className="flex-1 gap-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-base font-semibold text-gray-900 leading-none">{c.name}</Text>
                    {/* Gender icon */}
                    {c.gender === "male" ? (
                        <Ionicons name="male" size={12} color="#45B6FE" />
                      ) : c.gender === "female" ? (
                        <Ionicons name="female" size={12} color="#FF69B4" />
                      ) : (
                        <Ionicons name="transgender" size={12} color="#A0A0A0" />
                    )}
                  </View>
                  
                  <Text numberOfLines={1} className="text-sm text-gray-600 leading-none">{c.address?.display_name ||"Fetching address..."}</Text>
      
                  <View className="flex-row items-center gap-1 mt-1">
                    <Ionicons name="location-outline" size={12} color="#000" />
                    <Text className="text-[11px] text-gray-700">{c?.distance || "--km"} • {c?.duration || "--m"}</Text>
                  </View>
                </View>
                
                 { selectedCompanion?._id == c._id && (
                  <View className="px-2 flex justify-center">
                    <Ionicons name="checkmark-circle" size={16} color="#000" />
                  </View>
                 )}
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
      
      {/* Action Button */}
      <View className="flex-row gap-3 px-6 py-4">
        <TouchableOpacity
          onPress={handleBack}
          className="flex-1 py-3 rounded-xl border border-gray-300"
        >
          <Text className="text-center font-semibold text-gray-900">Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleContinueTrip}
          disabled={!selectedCompanion}
          className={`flex-1 py-3 rounded-xl ${selectedCompanion ? "bg-black" : "bg-gray-300"}`}
        >
          <Text className="text-center font-semibold text-white">Continue Trip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
