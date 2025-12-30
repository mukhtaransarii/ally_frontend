import { createContext, useContext } from "react";
import useSecureState from "@/hooks/useSecureState";

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [companions, setCompanions] = useSecureState("companions", []); 
  const [selectedCompanion, setSelectedCompanion] = useSecureState("selectedCompanion", null); 
  const [trip, setTrip] = useSecureState("trip", null); 
  
  const [userCreatedTrip, setUserCreatedTrip] = useSecureState("userCreatedTrip", null); 

  return (
    <TripContext.Provider value={{ 
       companions, setCompanions,
       selectedCompanion, setSelectedCompanion,
       trip, setTrip,
       userCreatedTrip, setUserCreatedTrip,
    }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => useContext(TripContext);
