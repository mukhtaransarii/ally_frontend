// Geocoding API with proper headers
export const searchLocation = async (query) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in&addressdetails=1`;
    
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'YourAppName/1.0' // Required by Nominatim
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Geocoding API Error:", error);
    throw error;
  }
};


export const reverseGeocode = async (lat: number, lng: number) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "YourAppName/1.0",
      },
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    return {
     display_name: data.display_name,
     address: data.address,
    };
  } catch (error) {
    console.error("Reverse Geocoding Error:", error);
    throw error;
  }
};



// Improved search with debouncing and better filtering// Improved search with debouncing and better filtering
export const enhancedSearchLocation = async (query: string) => {
  if (query.length < 2) return [];

  try {
    const results = await searchLocation(query);

    // Map each result to only display_name and address
    return results.slice(0, 8).map((item: any) => ({
      display_name: item.display_name,
      address: item.address,
      lat: item.lat,
      lng: item.lon
    }));
  } catch (error) {
    console.error("Enhanced search error:", error);
    return [];
  }
};

