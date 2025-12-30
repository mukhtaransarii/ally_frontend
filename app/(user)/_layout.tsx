import { useEffect } from 'react'
import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import { getSocket } from "@/utils/socket";
import { useTrip } from "@/contexts/TripContext"
import { useUser } from "@/contexts/UserContext";
import Toast from "react-native-toast-message";

export default function UserLayout() {
  const { user } = useAuth();
  const { trip, setTrip, selectedCompanion, setSelectedCompanion, setCompanions } = useTrip();
  const { setStep, setPickup } = useUser();;

  if (!user || user.role !== "user") {
    return <Redirect href="/auth/login" />;
  }
  
  useEffect(() => {
    const socket = getSocket();
    
    socket.on("trip_cancelled", () => {
      Toast.show({type: "success", text1: "Trip cancelled by companion"});
     
      setTrip(null)
      setSelectedCompanion(null)
      setCompanions([])
      setPickup(null)
      setStep(1)
    });
    
    socket.on("trip_accepted", ({trip}) => {
      Toast.show({type: "success", text1: "Trip accepted, companion on the way"});
      setTrip(trip)
    })
    return () => {
      socket.off("trip_cancelled")
      socket.off("trip_accepted")
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
          borderTopWidth: 0, // no border
          elevation: 0,      // no shadow (Android)
          shadowOpacity: 0,  // no shadow (iOS)
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
