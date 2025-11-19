import { useState, useEffect } from "react";
import { StationApi } from "@/api/StationApi";
import { StationResponse } from "@/types";

export const useStations = () => {
  const [stations, setStations] = useState<StationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await StationApi.getActiveStations();
      setStations(response);
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching stations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  return {
    stations,
    isLoading,
    error,
    refetch: fetchStations,
  };
};
