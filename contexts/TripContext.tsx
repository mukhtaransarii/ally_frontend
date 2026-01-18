import { createContext, useContext, useEffect, useState } from "react";
import useSecureState from "@/hooks/useSecureState";

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [companions, setCompanions] = useSecureState("companions", []); 
  const [trip, setTrip] = useSecureState("trip", null); 
  const [companionLocation, setCompanionLocation] = useState(null);
  
  // init
  useEffect(() => {
    if (trip?.companion?.lat && trip?.companion?.lng) {
      setCompanionLocation({
        lat: trip.companion.lat,
        lng: trip.companion.lng
      });
    }
  }, [trip]);
  
  return (
    <TripContext.Provider value={{ 
       companions, setCompanions,
       trip, setTrip,
       companionLocation, setCompanionLocation,
    }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => useContext(TripContext);
