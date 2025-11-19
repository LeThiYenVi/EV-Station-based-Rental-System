import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";

interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

interface UseLocationReturn {
  location: LocationCoords | null;
  isLoading: boolean;
  error: string | null;
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<void>;
  hasPermission: boolean;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setHasPermission(status === "granted");
    } catch (err) {
      console.error("Error checking location permission:", err);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("Location permission denied");
        Alert.alert(
          "Permission Required",
          "Please enable location permissions to find nearby stations.",
          [{ text: "OK" }]
        );
        return false;
      }

      setHasPermission(true);
      setError(null);
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to request permission");
      return false;
    }
  };

  const getCurrentLocation = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if we have permission
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          setIsLoading(false);
          return;
        }
      }

      // Get current location
      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
        accuracy: locationData.coords.accuracy,
      });

      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to get location");
      Alert.alert("Error", "Could not get your current location");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    location,
    isLoading,
    error,
    requestPermission,
    getCurrentLocation,
    hasPermission,
  };
};

// Helper function to calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

const toRad = (value: number): number => {
  return (value * Math.PI) / 180;
};
