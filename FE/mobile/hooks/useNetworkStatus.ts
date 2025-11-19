import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
}

/**
 * Hook to monitor network connectivity status
 * @returns NetworkState object with connection info
 */
export function useNetworkStatus(): NetworkState {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: true,
    isInternetReachable: null,
    type: null,
  });

  useEffect(() => {
    // Get initial network state
    NetInfo.fetch().then((state) => {
      setNetworkState({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      });
    });

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkState({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return networkState;
}

/**
 * Simple hook that returns true if device is online
 * @returns boolean indicating connection status
 */
export function useIsOnline(): boolean {
  const { isConnected } = useNetworkStatus();
  return isConnected;
}

/**
 * Check if the device has internet access (not just WiFi/cellular)
 * @returns Promise<boolean> true if internet is reachable
 */
export async function checkInternetAccess(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.isInternetReachable ?? false;
}

/**
 * Get current network type (wifi, cellular, none, etc.)
 * @returns Promise<string> network type
 */
export async function getNetworkType(): Promise<string> {
  const state = await NetInfo.fetch();
  return state.type;
}
