import { useState, useEffect } from "react";
import { View, Alert, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { usePartner } from "@/contexts/PartnerContext";
import { BASE_URL } from "@/env.js";
import { getCurrentLocation } from "@/utils/getCurrentLocation";

export default function GoOnlineToggle() {
  const { token, user } = useAuth();
  const { partnerLocation, setPartnerLocation } = usePartner();
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  
  useEffect(() => {
    if (typeof user?.active === "boolean") {
      setIsOnline(user.active);
  
      if (user.active && user.lat && user.lng) {
        setPartnerLocation({ lat: user.lat, lng: user.lng });
      } else {
        setPartnerLocation(null);
      }
    }
  }, [user?.active]);
  
  const toggleOnlineStatus = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const loc = !isOnline ? await getCurrentLocation() : {};
      const { data } = await axios.post(
        `${BASE_URL}/partner/go-online`,
        { active: !isOnline, ...loc },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsOnline(data.active);
      setPartnerLocation((data.lat) ? { lat: data.lat, lng: data.lng } : null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="absolute bottom-10 w-full px-4">
      <View className="flex-row items-center gap-2 bg-white rounded-2xl p-4">
      
        <View className="flex-1">
          <Text className="text-xs text-zinc-500 mb-1">latitude: {partnerLocation?.lat || 'null'}, longitude: {partnerLocation?.lng || 'null'}</Text>
          {loading ? (
            <View className="flex-row items-center gap-2">
              <ActivityIndicator size="small" color="#000" />
              <Text className="text-base text-zinc-700">Loading...</Text>
            </View>
          ) : (
            <View className="flex-row items-center gap-1">
              <View className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></View>
              <Text className="flex-1 text-base text-zinc-900">
               {isOnline ? "You're online,\n Now you can take trip" : "You're offline"}
              </Text>
            </View>
          )}
       
        </View>
        <TouchableOpacity
        disabled={!user || loading}
          onPress={toggleOnlineStatus}
          className={`p-4 px-6 rounded-xl ${isOnline ? "bg-white border border-black" : "bg-black border"}`}
        >
         <Text className={isOnline ? "text-black" : "text-white"}>
          {isOnline ? 'Go Offline' : 'Go Online'}
        </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

