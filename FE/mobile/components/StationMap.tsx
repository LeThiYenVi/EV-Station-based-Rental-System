import { useState, useRef } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker, Region, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { FAB, Card, Text } from "react-native-paper";
import { theme } from "@/utils";
import { StationResponse } from "@/types";

interface StationMapProps {
  stations: StationResponse[];
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  onStationPress?: (station: StationResponse) => void;
  onGetDirections?: (station: StationResponse) => void;
  showUserLocation?: boolean;
}

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function StationMap({
  stations,
  userLocation,
  onStationPress,
  onGetDirections,
  showUserLocation = true,
}: StationMapProps) {
  const mapRef = useRef<MapView>(null);
  const [selectedStation, setSelectedStation] =
    useState<StationResponse | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: userLocation?.latitude || 10.762622, // Default to Ho Chi Minh City
    longitude: userLocation?.longitude || 106.660172,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const handleMarkerPress = (station: StationResponse) => {
    setSelectedStation(station);

    // Animate to station location
    mapRef.current?.animateToRegion({
      latitude: parseFloat(station.latitude),
      longitude: parseFloat(station.longitude),
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });

    onStationPress?.(station);
  };

  const handleCenterOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  const handleFitAllMarkers = () => {
    if (stations.length > 0 && mapRef.current) {
      const markers = stations.map((s) => ({
        latitude: parseFloat(s.latitude),
        longitude: parseFloat(s.longitude),
      }));

      if (userLocation && showUserLocation) {
        markers.push(userLocation);
      }

      mapRef.current.fitToCoordinates(markers, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  const getMarkerColor = (station: StationResponse): string => {
    switch (station.status) {
      case "ACTIVE":
        return "#4CAF50"; // Green
      case "MAINTENANCE":
        return "#FFA500"; // Orange
      case "INACTIVE":
        return "#F44336"; // Red
      default:
        return theme.colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
      >
        {/* Station Markers */}
        {stations.map((station) => (
          <Marker
            key={station.id}
            coordinate={{
              latitude: parseFloat(station.latitude),
              longitude: parseFloat(station.longitude),
            }}
            title={station.name}
            description={`Available vehicles at this station`}
            onPress={() => handleMarkerPress(station)}
            pinColor={getMarkerColor(station)}
          >
            <View
              style={[
                styles.markerContainer,
                { backgroundColor: getMarkerColor(station) },
              ]}
            >
              <Ionicons name="business" size={20} color="#fff" />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Center on User FAB */}
      {userLocation && showUserLocation && (
        <FAB
          icon="my-location"
          style={styles.myLocationFab}
          onPress={handleCenterOnUser}
          size="small"
        />
      )}

      {/* Fit All Markers FAB */}
      <FAB
        icon="fit-to-page-outline"
        style={styles.fitAllFab}
        onPress={handleFitAllMarkers}
        size="small"
      />

      {/* Selected Station Card */}
      {selectedStation && (
        <Card style={styles.stationCard}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <View style={styles.cardInfo}>
                <Text style={styles.stationName}>{selectedStation.name}</Text>
                <Text style={styles.stationAddress}>
                  {selectedStation.address}
                </Text>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Ionicons
                      name="car"
                      size={16}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.statText}>Available</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="star" size={16} color="#FFA500" />
                    <Text style={styles.statText}>
                      {selectedStation.rating || "N/A"}
                    </Text>
                  </View>
                </View>
              </View>
              <Ionicons
                name="close-circle"
                size={24}
                color={theme.colors.mutedForeground}
                onPress={() => setSelectedStation(null)}
              />
            </View>
          </Card.Content>
          <Card.Actions>
            {onGetDirections && (
              <FAB
                icon="directions"
                label="Directions"
                style={styles.directionsFab}
                onPress={() => onGetDirections(selectedStation)}
                size="small"
              />
            )}
          </Card.Actions>
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  myLocationFab: {
    position: "absolute",
    right: 16,
    top: 16,
    backgroundColor: "#fff",
  },
  fitAllFab: {
    position: "absolute",
    right: 16,
    top: 72,
    backgroundColor: "#fff",
  },
  stationCard: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  stationName: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  stationAddress: {
    fontSize: 13,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.sm,
  },
  statsRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: theme.colors.foreground,
  },
  directionsFab: {
    backgroundColor: theme.colors.primary,
  },
});
