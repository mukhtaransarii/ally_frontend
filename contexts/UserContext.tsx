import { createContext, useContext } from "react";
import useSecureState from "@/hooks/useSecureState";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [pickup, setPickup] = useSecureState("pickup", null);
  const [rate, setRate] = useSecureState("rate", null);
  const [eta, setEta] = useSecureState("eta", null);
  const [distance, setDistance] = useSecureState("distance", null);

  // UI-only (do NOT persist)
  const [step, setStep] = useSecureState("step", 1); // optional (see note below)

  return (
    <UserContext.Provider
      value={{
        pickup, setPickup,
        rate, setRate,
        eta, setEta,
        distance, setDistance,
        step, setStep,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
