import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  Text,
  ActivityIndicator,
  FAB,
  Chip,
  Searchbar,
} from "react-native-paper";
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StationApi } from "@/api/StationApi";
import { SimpleHeader } from "@/components/SimpleHeader";
import { StationResponse, NearbyStationResponse } from "@/types";

const INITIAL_REGION = {
  latitude: 10.8231, // Ho Chi Minh City
  longitude: 106.6297,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const RADIUS_OPTIONS = [
  { label: "1km", value: 1000 },
  { label: "3km", value: 3000 },
  { label: "5km", value: 5000 },
  { label: "10km", value: 10000 },
];

export default function MapScreen() {
  const [stations, setStations] = useState<
    (StationResponse | NearbyStationResponse)[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [searchRadius, setSearchRadius] = useState(5000); // 5km default
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStation, setSelectedStation] = useState<
    StationResponse | NearbyStationResponse | null
  >(null);
  const mapRef = useRef<MapView>(null);

  // Request location permission and get user location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Quyền truy cập vị trí",
            "Ứng dụng cần quyền truy cập vị trí để hiển thị các trạm gần bạn.",
            [{ text: "OK" }]
          );
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);

        // Center map on user location
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }
      } catch (error) {
        console.error("Error getting location:", error);
        Alert.alert("Lỗi", "Không thể lấy vị trí của bạn");
      }
    })();
  }, []);

  // Fetch stations near user location
  useEffect(() => {
    if (userLocation) {
      fetchNearbyStations();
    }
  }, [userLocation, searchRadius]);

  const fetchNearbyStations = async () => {
    try {
      setLoading(true);

      if (userLocation) {
        // Use nearby stations API with user location
        const response = await StationApi.getNearbyStations({
          latitude: userLocation.coords.latitude.toString(),
          longitude: userLocation.coords.longitude.toString(),
          radiusKm: searchRadius / 1000, // Convert meters to km
          limit: 50,
        });
        setStations(response.stations);
      } else {
        // Fallback to all active stations if no location
        const allStations = await StationApi.getActiveStations();
        setStations(allStations);
      }
    } catch (error) {
      console.error("Error fetching stations:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách trạm");
    } finally {
      setLoading(false);
    }
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // Filter stations by search query
  const filteredStations = searchQuery
    ? stations.filter((station) =>
        station.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : stations;

  // Center map on user location
  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        500
      );
    }
  };

  // Handle marker press
  const handleMarkerPress = (
    station: StationResponse | NearbyStationResponse
  ) => {
    setSelectedStation(station);

    // Animate to marker location
    if (mapRef.current) {
      const stationLat = parseFloat(station.latitude);
      const stationLng = parseFloat(station.longitude);

      mapRef.current.animateToRegion(
        {
          latitude: stationLat,
          longitude: stationLng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );
    }
  };

  // Navigate to station detail
  const viewStationDetail = () => {
    if (selectedStation) {
      router.push(`/dashboard/place-detail?id=${selectedStation.id}`);
    }
  };

  // Open directions in native maps app
  const openDirections = () => {
    if (selectedStation && userLocation) {
      const stationLat = parseFloat(selectedStation.latitude);
      const stationLng = parseFloat(selectedStation.longitude);

      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.coords.latitude},${userLocation.coords.longitude}&destination=${stationLat},${stationLng}`;

      Alert.alert("Chỉ đường", "Mở Google Maps để xem đường đi?", [
        { text: "Hủy", style: "cancel" },
        {
          text: "Mở",
          onPress: () => {
            // In a real app, use Linking.openURL(url)
            console.log("Opening maps URL:", url);
          },
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <SimpleHeader title="Bản đồ trạm" />

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Tìm trạm..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchBar}
        />
      </View>

      {/* Radius filter chips */}
      <View style={styles.chipContainer}>
        {RADIUS_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            selected={searchRadius === option.value}
            onPress={() => setSearchRadius(option.value)}
            style={styles.chip}
            mode={searchRadius === option.value ? "flat" : "outlined"}
          >
            {option.label}
          </Chip>
        ))}
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass
        showsScale
      >
        {/* User location circle */}
        {userLocation && (
          <Circle
            center={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            radius={searchRadius}
            fillColor="rgba(66, 165, 245, 0.2)"
            strokeColor="rgba(66, 165, 245, 0.5)"
            strokeWidth={2}
          />
        )}

        {/* Station markers */}
        {filteredStations.map((station) => {
          const stationLat = parseFloat(station.latitude);
          const stationLng = parseFloat(station.longitude);

          if (!stationLat || !stationLng) return null;

          return (
            <Marker
              key={station.id}
              coordinate={{
                latitude: stationLat,
                longitude: stationLng,
              }}
              title={station.name}
              description={station.address}
              onPress={() => handleMarkerPress(station)}
            >
              <View style={styles.markerContainer}>
                <MaterialCommunityIcons
                  name="ev-station"
                  size={32}
                  color="#4CAF50"
                />
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* Center on user button */}
      {userLocation && (
        <FAB
          icon="crosshairs-gps"
          style={styles.fabCenter}
          onPress={centerOnUser}
          small
        />
      )}

      {/* Station info card (shown when marker selected) */}
      {selectedStation && (
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Text variant="titleMedium" style={styles.stationName}>
              {selectedStation.name}
            </Text>
            <TouchableOpacity onPress={() => setSelectedStation(null)}>
              <MaterialCommunityIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <Text variant="bodySmall" style={styles.stationAddress}>
            <MaterialCommunityIcons name="map-marker" size={16} />{" "}
            {selectedStation.address}
          </Text>

          {/* Show distance if available (from NearbyStationResponse) */}
          {"distanceKm" in selectedStation && (
            <Text variant="bodySmall" style={styles.stationDistance}>
              <MaterialCommunityIcons name="map-marker-distance" size={16} />{" "}
              {selectedStation.distanceKm.toFixed(1)} km
            </Text>
          )}

          <View style={styles.infoActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={openDirections}
            >
              <MaterialCommunityIcons
                name="directions"
                size={20}
                color="#2196F3"
              />
              <Text style={styles.actionText}>Chỉ đường</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonPrimary]}
              onPress={viewStationDetail}
            >
              <MaterialCommunityIcons
                name="information"
                size={20}
                color="#fff"
              />
              <Text style={[styles.actionText, styles.actionTextPrimary]}>
                Chi tiết
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Loading overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Đang tải bản đồ...</Text>
        </View>
      )}

      {/* Station count badge */}
      {!loading && (
        <View style={styles.countBadge}>
          <MaterialCommunityIcons
            name="map-marker-multiple"
            size={16}
            color="#fff"
          />
          <Text style={styles.countText}>{filteredStations.length} trạm</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    padding: 12,
    backgroundColor: "#fff",
    elevation: 4,
    zIndex: 2,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: "#f5f5f5",
  },
  chipContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    elevation: 4,
    zIndex: 2,
    gap: 8,
  },
  chip: {
    marginRight: 0,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 4,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabCenter: {
    position: "absolute",
    right: 16,
    bottom: 200,
    backgroundColor: "#fff",
  },
  infoCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxHeight: Dimensions.get("window").height * 0.3,
  },
  infoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  stationName: {
    flex: 1,
    fontWeight: "600",
  },
  stationAddress: {
    color: "#666",
    marginBottom: 4,
  },
  stationDistance: {
    color: "#4CAF50",
    marginTop: 4,
    marginBottom: 12,
    fontWeight: "600",
  },
  infoActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2196F3",
    gap: 6,
  },
  actionButtonPrimary: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  actionText: {
    color: "#2196F3",
    fontWeight: "600",
  },
  actionTextPrimary: {
    color: "#fff",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
  },
  countBadge: {
    position: "absolute",
    top: 80,
    right: 16,
    backgroundColor: "#4CAF50",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  countText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
});
