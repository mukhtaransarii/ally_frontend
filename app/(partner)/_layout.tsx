import { useEffect } from 'react'
import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import { useTrip } from "@/contexts/TripContext";
import { usePartner } from "@/contexts/PartnerContext";
import { getSocket } from "@/utils/socket";
import Toast from "react-native-toast-message";

export default function PartnerLayout() {
  const { user } = useAuth();
  const { setTrip } = useTrip();

  if (!user || user.role !== "partner") {
    return <Redirect href="/auth/login" />;
  }
  
  // backend/controller/tripController 
  useEffect(() => {
    const socket = getSocket();
    
    socket.on("trip_notification", ({trip}) => {
      Toast.show({type: "success", text1: "New trip for you"});
      setTrip(trip);
    });
    
    socket.on("trip_cancelled", () => {
      Toast.show({type: "success", text1: "Trip cancelled by user"});
      setTrip(null);
    });
  
    return () => {
      socket.off("trip_notification");
      socket.off("trip_cancelled")
    }
  }, []);
  
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="grid-outline" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person-circle-outline" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
