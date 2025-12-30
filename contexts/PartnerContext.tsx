import { createContext, useContext, useState } from "react";
import useSecureState from "@/hooks/useSecureState";

const PartnerContext = createContext();

export const PartnerProvider = ({ children }) => {
  const [partnerLocation, setPartnerLocation] = useSecureState("partnerLocation", null);
  const [isOnline, setIsOnline] = useSecureState("isOnline", false);
 
  const [partnerStep, setPartnerStep] = useSecureState("partnerStep" ,1);   // UI / flow only

  return (
    <PartnerContext.Provider
      value={{
        partnerLocation, setPartnerLocation,
        partnerStep, setPartnerStep,
        isOnline, setIsOnline,
      }}>
    {children}
    </PartnerContext.Provider>
  );
};

export const usePartner = () => useContext(PartnerContext);
