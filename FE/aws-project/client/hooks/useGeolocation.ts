import { useState, useEffect } from "react";

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    address: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        loading: false,
        error: "Trình duyệt không hỗ trợ định vị",
      }));
      return;
    }

    // Get current position
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Try to get address from reverse geocoding (optional)
          // You can integrate with Google Maps API or other geocoding services
          // For now, we'll just store the coordinates
          setLocation({
            latitude,
            longitude,
            address: null, // Can be enhanced with reverse geocoding
            loading: false,
            error: null,
          });
        } catch (error) {
          setLocation({
            latitude,
            longitude,
            address: null,
            loading: false,
            error: null,
          });
        }
      },
      (error) => {
        let errorMessage = "Không thể lấy vị trí";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Người dùng từ chối chia sẻ vị trí";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Thông tin vị trí không khả dụng";
            break;
          case error.TIMEOUT:
            errorMessage = "Yêu cầu lấy vị trí hết thời gian";
            break;
        }
        setLocation({
          latitude: null,
          longitude: null,
          address: null,
          loading: false,
          error: errorMessage,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  const requestLocation = () => {
    setLocation((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          latitude,
          longitude,
          address: null,
          loading: false,
          error: null,
        });
      },
      (error) => {
        setLocation((prev) => ({
          ...prev,
          loading: false,
          error: "Không thể lấy vị trí",
        }));
      }
    );
  };

  return { ...location, requestLocation };
};
