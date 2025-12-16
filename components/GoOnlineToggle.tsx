import React, { useState, useEffect } from "react";
import { View, Alert } from "react-native";
import axios from "axios";
import { useAuth } from "@/contexts/authStore";
import { usePartner } from "@/contexts/PartnerContext";
import { BASE_URL } from "@/env.js";
import Button from '@/components/common/Button'
import { getCurrentLocation } from '@/utils/getCurrentLocation'
import { getUserData } from '@/utils/getUserData';

export default function GoOnlineToggle() {
  const { token } = useAuth();
  const { setParCurLoc } = usePartner();
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false); // reflects backend status

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserData(token);
      if (!user) return;
  
      setIsOnline(user.active);
  
      if (user.lat !== null && user.lng !== null) {
        setParCurLoc({ lat: user.lat, lng: user.lng });
      } else {
        setParCurLoc(null); // <-- FIX
      }
    };
    fetchUser();
  }, []);

  
  const toggleOnlineStatus = async () => {
    setLoading(true);
    try {
      let lat, lng;
      if (!isOnline) {
        const loc = await getCurrentLocation();
        lat = loc.lat;
        lng = loc.lng;
      }

      const { data } = await axios.post(`${BASE_URL}/partner/go-online`,
        { lat, lng, active: !isOnline },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.lat !== null && data.lng !== null) {
        setParCurLoc({ lat: data.lat, lng: data.lng });
      } else {
        setParCurLoc(null);
      }

      setIsOnline(data.active);
      Alert.alert(data.active ? "Online" : "Offline", data.active ? "You are now visible to users!" : "You are now offline");

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="absolute bottom-10 left-0 w-full px-4">
      <Button
        title={loading ? "Please wait..." : isOnline ? "Go Offline" : "Go Online"}
        onPress={toggleOnlineStatus}
        className={`${isOnline ? "bg-red-500" : "bg-green-500" }`}
      />
    </View>
  );
}
