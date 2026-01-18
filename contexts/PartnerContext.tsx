import { createContext, useContext, useState } from "react";
import useSecureState from "@/hooks/useSecureState";

const PartnerContext = createContext();

export const PartnerProvider = ({ children }) => {
  const [partnerLocation, setPartnerLocation] = useSecureState("partnerLocation", null);
  const [partnerStep, setPartnerStep] = useSecureState("partnerStep" ,1); 

  return (
    <PartnerContext.Provider
      value={{
        partnerLocation, setPartnerLocation,
        partnerStep, setPartnerStep,
      }}>
    {children}
    </PartnerContext.Provider>
  );
};

export const usePartner = () => useContext(PartnerContext);
