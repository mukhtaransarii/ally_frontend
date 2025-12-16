import { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [pickup, setPickup] = useState(null);
  const [step, setStep] = useState(1);
  const [rate, setRate] = useState(null);
  const [eta, setEta] = useState(null);
  const [distance, setDistance] = useState(null);
  const [followUserLocation, setFollowUserLocation] = useState(true);

  // Pretty console log all vars
  useEffect(() => {
    const logState = () => {
      console.log(JSON.stringify({
        id: "UserContextState",
        pickup,
        step,
        rate,
        eta,
        distance
      }, null, 2)); // 2 spaces for pretty print
    };

    logState();
  }, [pickup, step, rate, eta, distance]);

  return (
    <UserContext.Provider
      value={{
        pickup, setPickup,
        step, setStep,
        rate, setRate,
        eta, setEta,
        distance, setDistance,
        followUserLocation, setFollowUserLocation,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
