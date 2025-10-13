import apiClient from "@/api/apiClient";
import { PlaceApi } from "@/api/PlaceApi ";
import { Place } from "@/types/Place";
import { useCallback, useEffect, useState } from "react";

export function placeFetch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<String | null>(null);
  const [Places, setPlaces] = useState<Place[]>([]);

  const getPlace = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await PlaceApi.getAll();
      setPlaces(response);
    } catch (err: any) {
      setError(err?.message ?? "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getPlace();
  }, [getPlace]);

  return { isLoading, Places, error, refresh: getPlace };
}
