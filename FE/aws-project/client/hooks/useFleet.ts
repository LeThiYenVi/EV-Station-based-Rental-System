import { useState, useCallback } from 'react';
import { fleetService } from '@/service';
import type {
  VehicleResponse,
  VehicleStatusSummary,
  VehicleHistoryItemResponse,
  DispatchableVehiclesParams,
} from '@/service';

interface UseFleetReturn {
  // State
  loading: boolean;
  error: string | null;

  // Methods
  getVehiclesAtStation: (stationId: string) => Promise<VehicleResponse[] | null>;
  getStatusSummary: (stationId: string) => Promise<VehicleStatusSummary | null>;
  getVehicleHistory: (vehicleId: string) => Promise<VehicleHistoryItemResponse[] | null>;
  getDispatchableVehicles: (params: DispatchableVehiclesParams) => Promise<VehicleResponse[] | null>;

  // Helpers
  clearError: () => void;
}

/**
 * Custom hook for fleet management operations
 * 
 * Usage:
 * ```tsx
 * const { getVehiclesAtStation, getStatusSummary, loading } = useFleet();
 * 
 * const vehicles = await getVehiclesAtStation(stationId);
 * const summary = await getStatusSummary(stationId);
 * ```
 */
export const useFleet = (): UseFleetReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getVehiclesAtStation = useCallback(
    async (stationId: string): Promise<VehicleResponse[] | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fleetService.getVehiclesAtStation(stationId);
        return response;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to get vehicles';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getStatusSummary = useCallback(
    async (stationId: string): Promise<VehicleStatusSummary | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fleetService.getStatusSummary(stationId);
        return response;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to get status summary';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getVehicleHistory = useCallback(
    async (vehicleId: string): Promise<VehicleHistoryItemResponse[] | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fleetService.getVehicleHistory(vehicleId);
        return response;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to get vehicle history';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getDispatchableVehicles = useCallback(
    async (params: DispatchableVehiclesParams): Promise<VehicleResponse[] | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fleetService.getDispatchableVehicles(params);
        return response;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to get dispatchable vehicles';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    getVehiclesAtStation,
    getStatusSummary,
    getVehicleHistory,
    getDispatchableVehicles,
    clearError,
  };
};

export default useFleet;
