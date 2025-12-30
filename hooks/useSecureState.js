import { useState, useEffect, useRef } from "react";
import * as SecureStore from "expo-secure-store";

export default function useSecureState(key, initialValue) {
  const [state, setState] = useState(initialValue);
  const prevRef = useRef(null);

  // Hydrate from SecureStore on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(key);
        if (stored !== null) setState(JSON.parse(stored));
      } catch (err) {
        console.log(`Error reading ${key} from secure storage:`, err);
      }
    })();
  }, [key]);

  // Persist whenever state changes
  useEffect(() => {
    const prev = prevRef.current;
    if (JSON.stringify(prev) === JSON.stringify(state)) return; // avoid duplicate writes

    prevRef.current = state;

    SecureStore.setItemAsync(key, JSON.stringify(state)).catch((err) =>
      console.log(`Error saving ${key} to secure storage:`, err)
    );

    // Pretty log automatically
    console.log("💾 Secure States:", JSON.stringify({ [key]: state }, null, 2));
  }, [key, state]);

  return [state, setState];
}
