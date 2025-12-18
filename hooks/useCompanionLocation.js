import { useEffect } from "react";
import { useTrip } from "@/contexts/TripContext";

export default function useCompanionLocation() {
  const { companion, setCompanion } = useTrip();

  useEffect(() => {
    if (!companion) return;

    const interval = setInterval(() => {
      setCompanion(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          lat: prev.lat + (Math.random() - 0.5) * 0.0005,
          lng: prev.lng + (Math.random() - 0.5) * 0.0005,
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [companion, setCompanion]);
}
