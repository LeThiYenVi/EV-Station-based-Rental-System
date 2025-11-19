import { StationApi } from "@/api/StationApi";
import StationMap from "@/components/StationMap";
import { useLocation } from "@/hooks/useLocation";
import { StationResponse } from "@/types";
import { theme } from "@/utils";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Linking, Platform, StyleSheet, View } from "react-native";
import { ActivityIndicator, Appbar, Snackbar, Text } from "react-native-paper";

export default function StationsMapScreen() {
  const router = useRouter();
  const {
    location,
    isLoading: locationLoading,
    getCurrentLocation,
    hasPermission,
  } = useLocation();

  const [stations, setStations] = useState<StationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchStations();
    if (!hasPermission) {
      getCurrentLocation();
    }
  }, []);

  const fetchStations = async () => {
    try {
      setIsLoading(true);
      setError("");
      const activeStations = await StationApi.getActiveStations();
      setStations(activeStations);
    } catch (err: any) {
      setError(err.message || "Failed to load stations");
      showSnackbar("Failed to load stations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStationPress = (station: StationResponse) => {
    router.push({
      pathname: "/dashboard/station-detail" as any,
      params: { stationId: station.id },
    });
  };

  const handleGetDirections = (station: StationResponse) => {
    const latitude = parseFloat(station.latitude);
    const longitude = parseFloat(station.longitude);
    const label = encodeURIComponent(station.name);

    // Open platform-specific maps app
    const scheme = Platform.select({
      ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${label})`,
    });

    const url =
      scheme ||
      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          // Fallback to Google Maps web
          return Linking.openURL(
            `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
          );
        }
      })
      .catch((err) => {
        showSnackbar("Could not open maps");
      });
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  if (isLoading || locationLoading) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="Stations Map" />
        </Appbar.Header>
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      </View>
    );
  }

  if (error && stations.length === 0) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="Stations Map" />
          <Appbar.Action icon="refresh" onPress={fetchStations} />
        </Appbar.Header>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Stations Map" />
        <Appbar.Action icon="refresh" onPress={fetchStations} />
        {!hasPermission && (
          <Appbar.Action icon="crosshairs-gps" onPress={getCurrentLocation} />
        )}
      </Appbar.Header>

      <StationMap
        stations={stations}
        userLocation={
          location
            ? {
                latitude: location.latitude,
                longitude: location.longitude,
              }
            : undefined
        }
        onStationPress={handleStationPress}
        onGetDirections={handleGetDirections}
        showUserLocation={hasPermission}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.mutedForeground,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: "center",
  },
});
