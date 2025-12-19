import { useState, useEffect } from "react";
import polyline from "@mapbox/polyline";
import { getRoute } from "@/utils/getRoute";

export default function usePolyline(pickup, companion) {
  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    if (!pickup || !companion) return setRouteCoords([]);

    const fetchRoute = async () => {
      try {
        const data = await getRoute(pickup.lng, pickup.lat, companion.lng, companion.lat);
        if (!data?.routes?.length) return;

        const decoded = polyline.decode(data.routes[0].geometry);
        const coords = decoded.map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
        
        setRouteCoords(coords);
      } catch (err) {
        console.log("OSRM route error:", err);
      }
    };

    fetchRoute();
  }, [pickup, companion]);

  return { routeCoords };
}
