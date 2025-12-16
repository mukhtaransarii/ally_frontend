import { useEffect } from "react";
import * as Location from "expo-location";
import { useUser } from "@/contexts/UserContext";
// import { reverseGeocode } from "@/utils/SearchAddress";

export default function useUserLocation() {
  const { pickup, followUserLocation, setPickup, step } = useUser();

  useEffect(() => {
    let subscriber;

    const startTracking = async () => {
      if (!followUserLocation && step !== 3) return;

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      subscriber = await Location.watchPositionAsync({
          accuracy: Location.Accuracy.High,
          distanceInterval: 1,
          timeInterval: 2000,
        },
        async (loc) => {
          if (!followUserLocation) return;

          const lat = loc.coords.latitude;
          const lng = loc.coords.longitude;

          // Update state
          if(step === 3) {
            setPickup((prev) => ({
              ...prev,
              live: { lat, lng }
            }));
          }
        }
      );
    };

    startTracking();
    return () => subscriber?.remove();
  }, [followUserLocation]);
}
