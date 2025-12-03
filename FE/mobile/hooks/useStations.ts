import { useState, useEffect } from "react";
import { stationService } from "@/services";
import { StationResponse, StationDetailResponse } from "@/types";
import Toast from "react-native-toast-message";

export const useStations = () => {
  const [stations, setStations] = useState<StationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveStations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await stationService.getActiveStations();
      setStations(data);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Không thể tải danh sách trạm";
      setError(errorMsg);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStationById = async (
    stationId: string
  ): Promise<StationDetailResponse | null> => {
    try {
      return await stationService.getStationById(stationId);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: err.response?.data?.message || "Không thể tải thông tin trạm",
      });
      return null;
    }
  };

  const fetchNearbyStations = async (
    latitude: number,
    longitude: number,
    radius: number = 5000
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await stationService.findNearbyStations({
        latitude,
        longitude,
        radius,
      });
      // NearbyStationResponse extends StationResponse, so can use directly
      setStations(response.stations);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Không thể tìm trạm gần đây";
      setError(errorMsg);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveStations();
  }, []);

  return {
    stations,
    isLoading,
    error,
    fetchActiveStations,
    fetchStationById,
    fetchNearbyStations,
    refetch: fetchActiveStations,
  };
};
