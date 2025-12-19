import { createContext, useContext } from "react";
import useSecureState from "@/hooks/useSecureState";

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [companions, setCompanions] = useSecureState("companions", []); 
  const [selectedCompanion, setSelectedCompanion] = useSecureState("selectedCompanion", null); 

  return (
    <TripContext.Provider value={{ 
       companions, setCompanions,
       selectedCompanion, setSelectedCompanion,
    }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => useContext(TripContext);
