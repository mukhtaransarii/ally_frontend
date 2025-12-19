import { createContext, useContext } from "react";
import useSecureState from "@/hooks/useSecureState";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [pickup, setPickup] = useSecureState("pickup", null);
  const [rate, setRate] = useSecureState("rate", null); // not in use
  const [eta, setEta] = useSecureState("eta", null); // not in use
  const [distance, setDistance] = useSecureState("distance", null); // not in use

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
