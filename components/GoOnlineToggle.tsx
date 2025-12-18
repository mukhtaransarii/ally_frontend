import { useState, useEffect } from "react";
import { View, Alert } from "react-native";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { usePartner } from "@/contexts/PartnerContext";
import { BASE_URL } from "@/env.js";
import Button from "@/components/common/Button";
import { getCurrentLocation } from "@/utils/getCurrentLocation";
import { getUserData } from "@/utils/getUserData";

export default function GoOnlineToggle() {
  const { token } = useAuth();
  const { setPartnerLocation } = usePartner();

  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    (async () => {
      const u = await getUserData(token);
      if (!u) return;
      setIsOnline(u.active);
      setPartnerLocation(
        typeof u.lat === "number" && typeof u.lng === "number"
          ? { lat: u.lat, lng: u.lng }
          : null
      );
    })();
  }, []);


  const toggleOnlineStatus = async () => {
    setLoading(true);
    try {
      const loc = !isOnline ? await getCurrentLocation() : null;
      const { data } = await axios.post(`${BASE_URL}/partner/go-online`,
        { lat: loc?.lat, lng: loc?.lng, active: !isOnline },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPartnerLocation(
        typeof data.lat === "number" && typeof data.lng === "number"
          ? { lat: data.lat, lng: data.lng }
          : null
      );
      setIsOnline(data.active);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="absolute bottom-10 left-0 w-full px-4">
      <Button
        title={loading ? "Please wait..." : isOnline ? "Go Offline" : "Go Online" }
        onPress={toggleOnlineStatus}
        className={isOnline ? "bg-red-500" : "bg-green-500" }
      />
    </View>
  );
}
