import { createContext, useContext, useState } from "react";
import useSecureState from "@/hooks/useSecureState";

const PartnerContext = createContext();

export const PartnerProvider = ({ children }) => {
  const [partnerLocation, setPartnerLocation] = useSecureState("partnerLocation", null);
  const [step, setStep] = useState(1);   // UI / flow only

  return (
    <PartnerContext.Provider
      value={{
        partnerLocation, setPartnerLocation,
        step, setStep,
        
      }}>
    {children}
    </PartnerContext.Provider>
  );
};

export const usePartner = () => useContext(PartnerContext);
