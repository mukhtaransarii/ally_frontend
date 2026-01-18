import { createContext, useContext } from "react";
import useSecureState from "@/hooks/useSecureState";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [pickup, setPickup] = useSecureState("pickup", null);
  const [step, setStep] = useSecureState("step", 1);

  return (
    <UserContext.Provider
      value={{
        pickup, setPickup,
        step, setStep,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
