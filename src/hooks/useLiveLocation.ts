import { useState, useEffect } from "react";

const LOCATIONIQ_TOKEN = "pk.e06a7c347ba4bd7432c9e15f7cf89366"; // Replace with your key

export function useLiveLocation() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let watcher: number;

    if ("geolocation" in navigator) {
      watcher = navigator.geolocation.watchPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setCoords({ lat: latitude, lon: longitude });

          try {
            const response = await fetch(
              `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_TOKEN}&lat=${latitude}&lon=${longitude}&format=json`
            );
            if (!response.ok) {
              throw new Error(`LocationIQ API error: ${response.statusText}`);
            }
            const data = await response.json();
            if (data.display_name) {
              setAddress(data.display_name);
            } else {
              setAddress("Address not found");
            }
          } catch (err: any) {
            setAddress("Failed to fetch address");
            console.error("Reverse geocoding error:", err);
          }
        },
        (err) => setError(err.message),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
      );
    } else {
      setError("Geolocation not supported");
    }

    return () => {
      if (watcher && navigator.geolocation) {
        navigator.geolocation.clearWatch(watcher);
      }
    };
  }, []);

  return { coords, address, error };
}
