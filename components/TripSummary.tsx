import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, Image } from "react-native";
import { useUser } from "@/contexts/UserContext";
import { usePartner } from "@/contexts/PartnerContext";
import { useAuth } from "@/contexts/authStore";
import { reverseGeocode } from "../utils/SearchAddress";

export default function TripSummary() {
  const { pickup, rate, setStep, eta, distance } = useUser();
  const { companion } = usePartner();
  const { user } = useAuth();

  const [companionAddress, setCompanionAddress] = useState(null);

  useEffect(() => {
    if (!companion?.lat || !companion?.lng) return;

    const getCompanionAddress = async () => {
      try {
        const address = await reverseGeocode(companion.lat, companion.lng);
        if (address) {
          setCompanionAddress({
            display_name: address.display_name,
            address: address.address,
          });
        }
      } catch (err) {
        console.log("error getCompanionAddress", err);
      }
    };

    getCompanionAddress();
  }, [companion?.lat, companion?.lng]);

  const handleContinueTrip = () => {
    Alert.alert("Confirm Trip", "Trip is confirmed", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm & Pay",
        onPress: () => setStep(3),
      },
    ]);
  };

  const formatFullAddress = (location) => {
    if (!location?.address) return "Location not set";

    const addr = location.address;
    const parts = [
      addr.road,
      addr.suburb,
      addr.neighbourhood,
      addr.city || addr.town || addr.village,
      addr.state,
      addr.postcode,
    ].filter(Boolean);

    return parts.join(", ");
  };

  return (
    <View className="absolute bottom-0 w-full bg-white rounded-t-3xl shadow-2xl">
      {/* Header */}
      <View className="p-6 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Trip Summary</Text>
      </View>

      <ScrollView className="max-h-96" showsVerticalScrollIndicator={false}>
        <View className="p-6 flex gap-2">

            {/* Companion Card */}
            <View className="flex-row gap-4 items-start">
              <Image
                source={{ uri: companion?.avatar }}
                className="w-10 h-10 rounded-full"
              />
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className="text-lg font-bold text-gray-900 leading-none">{companion?.name}</Text>
                  <Text className="text-purple-700 bg-purple-50 border border-purple-100 rounded px-1 text-xs font-semibold">{companion?.role}</Text>
                </View>
                <Text className="text-gray-700">{companionAddress?.display_name}</Text>
                <Text className="text-gray-500">{formatFullAddress(companionAddress)}</Text>
              </View>
            </View>

            {/* Connection Line */}
            <View className="flex gap-1">
              <View className="w-1 h-2 ml-5 bg-green-500 rounded"></View>
              <View className="w-1 h-2 ml-5 bg-green-500 rounded"></View>
              <View className="w-1 h-2 ml-5 bg-green-500 rounded"></View>
            </View>

            {/* User Card */}
            <View className="flex-row gap-4 items-start">
              <Image
                source={{ uri: user?.avatar }}
                className="w-10 h-10 rounded-full"
              />
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className="text-lg font-bold text-gray-900 leading-none">{user?.name}</Text>
                  <Text className="text-green-700 bg-green-50 border border-green-100 rounded px-1 text-xs font-semibold">{user?.role}</Text>
                </View>
                <Text className="text-gray-700">{pickup?.humanAddress?.display_name}</Text>
                <Text className="text-gray-500">{formatFullAddress(pickup?.humanAddress)}</Text>
              </View>
            </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="flex-row justify-between gap-3 p-6 border-t border-gray-200">
          <TouchableOpacity
            onPress={() => setStep(1)}
            className="flex-1 bg-white py-3 rounded-xl border border-gray-200"
            activeOpacity={0.7}
          >
            <Text className="text-gray-700 font-bold text-center text-lg">
              Change Pickup
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleContinueTrip}
            disabled={!rate}
            activeOpacity={0.8}
            className="flex-1 bg-green-700 py-3 rounded-xl"
          >
            <Text className="text-white font-bold text-center text-lg">
              Confirm Trip
            </Text>
          </TouchableOpacity>
        </View>
    </View>
  );
}