import { useState, useEffect } from "react";
import polyline from "@mapbox/polyline";
import { getRoute } from "@/utils/getRoute";

export default function usePolyline(pickup, companion, setDistance, setEta) {
  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    if (!pickup || !companion) {
      setRouteCoords([]);
      setDistance(null);
      setEta(null);
      return;
    }

    const fetchRoute = async () => {
      try {
        const data = await getRoute(pickup.lng, pickup.lat, companion.lng, companion.lat);
        if (!data?.routes?.length) return;

        const decoded = polyline.decode(data.routes[0].geometry);
        const coords = decoded.map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
        setRouteCoords(coords);
       
       const formatDist = data.routes[0].distance >= 1000 
        ? `${(data.routes[0].distance/1000).toFixed(1)}km` 
        : `${Math.round(data.routes[0].distance)}m`;
      
      const formatEta = data.routes[0].duration >= 3600 
        ? `${Math.floor(data.routes[0].duration/3600)}h ${Math.floor((data.routes[0].duration%3600)/60)}m`
        : `${Math.floor(data.routes[0].duration/60)}m`;
      
      setDistance(formatDist) 
      setEta(formatEta)
        
      } catch (err) {
        console.log("OSRM route error:", err);
      }
    };

    fetchRoute();
  }, [pickup, companion]);

  return { routeCoords };
}
