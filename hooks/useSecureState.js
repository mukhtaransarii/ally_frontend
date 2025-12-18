import { useState, useEffect, useRef } from "react";
import { saveSecure, getSecure } from "./useSecureStore";

export default function useSecureState(key, initialValue) {
  const [state, setState] = useState(initialValue);
  const prevRef = useRef(null);

  // Hydrate from SecureStore on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await getSecure(key);
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

    saveSecure(key, JSON.stringify(state)).catch((err) =>
      console.log(`Error saving ${key} to secure storage:`, err)
    );

    // Pretty log automatically
    console.log("💾 Secure States:", JSON.stringify({ [key]: state }, null, 2));
  }, [key, state]);

  return [state, setState];
}
