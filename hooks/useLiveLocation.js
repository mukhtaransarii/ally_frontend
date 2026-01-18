import * as Location from "expo-location";
import { getSocket } from "@/utils/socket";

export const useLiveLocation = (trip, enabled) => {
  useEffect(() => {
    if (!trip || !enabled) return;

    let sub;
    const socket = getSocket();

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 10,
        },
        ({ coords }) => {
          socket.emit("live_location", {
            tripId: trip._id,
            lat: coords.latitude,
            lng: coords.longitude,
          });
        }
      );
    })();

    return () => sub?.remove();
  }, [trip, enabled]);
};