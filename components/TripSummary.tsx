import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTrip } from "@/contexts/TripContext";
import { useUser } from "@/contexts/UserContext";
import { deleteSecure } from "@/hooks/useSecureStore";
import { reverseGeocode } from "@/utils/SearchAddress";

export default function TripSummary() {
  const { companions, setCompanions, setSelectedCompanion } = useTrip();
  const { setPickup, setStep, distance, eta } = useUser();

  const [addresses, setAddresses] = useState({});

  useEffect(() => {
    if (!companions?.length) return;

    companions.forEach(async (c) => {
      if (!c?.lat || !c?.lng) return;

      const addr = await reverseGeocode(c.lat, c.lng);

      setAddresses((prev) => ({
        ...prev,
        [c._id]: addr,
      }));
    });
  }, [companions]);

  const handleBack = async () => {
    await deleteSecure("pickup");
    await deleteSecure("companions");
    await deleteSecure("selectedCompanion");

    setPickup(null);
    setCompanions([]);
    setSelectedCompanion(null);
    setStep(1);
  };

  const handleContinueTrip = () => {
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
          {companions.map((c) => {
            const addr = addresses[c._id];

            return (
              <TouchableOpacity
                key={c._id}
                onPress={() => setSelectedCompanion(c)}
                className="flex-row gap-3 border border-gray-200 rounded-xl p-3"
              >
                <Image source={{ uri: c.avatar }}
                  className="w-11 h-11 rounded-full"
                />

                <View className="flex-1 gap-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-base font-semibold text-gray-900">{c.name}</Text>
                    <Text className="text-[10px] px-1 rounded bg-purple-50 text-purple-700 font-semibold">{c.gender}</Text>
                  </View>
                  {/* <Text className="text-xs text-gray-600">{c.bio}</Text> */}
                  
                  <View>
                    <Text className="text-sm text-gray-700">{addr?.display_name}</Text>
                    <Text className="text-sm text-gray-500">
                      {[
                        addr?.address.road,
                        addr?.address.suburb,
                        addr?.address.city || addr?.address.town || addr?.address.village,
                        addr?.address.state,
                      ].filter(Boolean).join(", ")}
                    </Text>
                  </View>
                    
  
                  <View className="flex-row items-center gap-1 mt-1">
                    <Ionicons name="location-outline" size={12} color="#000" />
                    <Text className="text-[11px] text-gray-700">{distance || "00km"} • {eta || "00m"}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      
      {/* Buttons */}
      <View className="flex-row gap-3 px-6 py-4">
        <TouchableOpacity
          onPress={handleBack}
          className="flex-1 py-3 rounded-xl border border-gray-300"
        >
          <Text className="text-center font-semibold text-gray-900">Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleContinueTrip}
          disabled={!companions.length}
          className={`flex-1 py-3 rounded-xl ${companions.length ? "bg-black" : "bg-gray-300"}`}
        >
          <Text className="text-center font-semibold text-white">Continue Trip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
