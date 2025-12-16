// utils/getCurrentLocation.ts
import * as Location from 'expo-location';

export const getCurrentLocation = async () => {
  const defaultLocation = { lat: 28.6139, lng: 77.2090 }; // Delhi

  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return defaultLocation;

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
      timeout: 8000,
    });

    if (location) {
      return {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };
    }

    return defaultLocation;
  } catch (err) {
    console.log('Location error:', err);
    return defaultLocation;
  }
};
