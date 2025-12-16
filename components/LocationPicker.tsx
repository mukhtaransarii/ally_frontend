import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, Keyboard, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { getCurrentLocation } from "@/utils/getCurrentLocation";
import { reverseGeocode } from "@/utils/SearchAddress";
import useAddressSearch from "@/hooks/useAddressSearch";
import { useUser } from "@/contexts/UserContext";
import { usePartner } from "@/contexts/PartnerContext";
import { BASE_URL } from "@/env.js";
import Input from "@/components/common/Input";

export default function LocationPicker() {
  const { pickup, setPickup, setStep, setRate, setFollowUserLocation } = useUser();
  const { setCompanion } = usePartner();
  const [active, setActive] = useState(false);
  const { query, setQuery, results, clearResults } = useAddressSearch();
  const [loadingPickup, setLoadingPickup] = useState(true);
  const [message, setMessage] = useState("");
  const [loadingCurrent, setLoadingCurrent] = useState(false)
  
  // Fetch GPS location and reverse geocode on mount
  useEffect(() => {
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

  const handleSelect = (item: any) => {
    setFollowUserLocation(false);
    setPickup({ lat: parseFloat(item.lat), lng: parseFloat(item.lng), humanAddress: item });
    setQuery("");
    setActive(false);
    clearResults();
    Keyboard.dismiss();
  };

  const handleInputFocus = () => {
    setActive(true);
    setQuery(pickup?.humanAddress?.display_name || "");
  };

  const handleInputChange = (text: string) => {
    setQuery(text);
    if (!text) setPickup(null);
  };

  const handleBlur = () => setTimeout(() => { setActive(false); clearResults(); }, 200);

  const handleUseCurrentLocation = async () => {
    setLoadingCurrent(true);
    try {
      setFollowUserLocation(true);
      const loc = await getCurrentLocation();
      const address = await reverseGeocode(loc.lat, loc.lng);
      setPickup({ lat: loc.lat, lng: loc.lng, humanAddress: address });
      setQuery(address.display_name);
    } catch (err) {
      console.log("Error getting current location:", err);
    } finally {
      setLoadingCurrent(false);
    }
  };
  

  const handleContinue = async () => {
    if (!pickup) return Alert.alert("Pickup location not set");
    try {
      const { data } = await axios.post(`${BASE_URL}/companion/nearest`, { lat: pickup.lat, lng: pickup.lng });
      
      if (!data.success) return setMessage(data.message); 
      if (!data.companion) return setMessage(data.message);

      setMessage("");
      setCompanion(data.companion);
      setRate(data.companion.ratePerHour);
      setStep(2);
      
      console.log("companion,", data.companion)
    } catch (err) {
      console.log("Error finding companion:", err);
    }
  };

  return (
    <View className="absolute w-full px-4 mt-3 top-10 z-10">
      <View className="bg-white rounded-2xl p-4 ">

        {/* Header */}
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <Ionicons name="location" size={16} color="green" />
            <Text className="text-sm">Pickup</Text>
          </View>
          <TouchableOpacity className="flex-row items-center" 
             onPress={handleUseCurrentLocation}
             disabled={loadingCurrent}
             >
            <Ionicons name="navigate" size={15} color="#3E84F6" />
            <Text className="text-sm text-blue-500 underline">
              {loadingCurrent ? "Getting..." : "Use Current Location"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input */}
        <Input
          leftIcon={<Ionicons name="location" size={16} color="green" />}
          value={active ? query : (loadingPickup ? "Getting location..." : pickup?.humanAddress?.display_name || "")}
          onChangeText={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleBlur}
        />
        
        {message && <Text className="text-red-500 text-sm mt-1">{message}</Text>}

        {/* Suggestions */}
        {results.length > 0 && active && (
          <View className="bg-white rounded-xl shadow-lg border border-gray-200 my-2">
            {results.map((item, i) => (
              <TouchableOpacity key={i} onPress={() => handleSelect(item)} className="py-3 px-4 border-b border-gray-100 last:border-b-0">
                <Text className="text-black font-semibold text-base">{item.display_name}</Text>
                <Text className="text-gray-500 text-sm mt-1">
                  {[item.address?.road, item.address?.suburb, item.address?.city_district, item.address?.city || item.address?.town || item.address?.village, item.address?.state, item.address?.country, item.address?.postcode].filter(Boolean).join(", ")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Continue */}
        <TouchableOpacity
          className={`${pickup ? "bg-green-700 border-green-700" : "bg-gray-300 border-gray-300"} rounded-lg p-3 mt-4 border`}
          onPress={handleContinue}
        >

          <Text className="text-white text-center">Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}