import { StationApi } from "@/api/StationApi";
import { VehicleApi } from "@/api/VehicleApi";
import { StationDetailResponse, VehicleResponse } from "@/types";
import { theme } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Appbar,
  Button,
  Card,
  Chip,
  Divider,
  List,
  Text,
} from "react-native-paper";

export default function StationDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const stationId = params.stationId as string;

  const [station, setStation] = useState<StationDetailResponse | null>(null);
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStationDetail();
  }, [stationId]);

  const fetchStationDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [stationData, vehiclesData] = await Promise.all([
        StationApi.getStationDetail(stationId),
        VehicleApi.getVehiclesByStation(stationId),
      ]);

      setStation(stationData);
      setVehicles(vehiclesData);
    } catch (err: any) {
      setError(err.message || "Failed to load station details");
      console.error("Error fetching station detail:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallHotline = () => {
    if (station?.hotline) {
      Linking.openURL(`tel:${station.hotline}`);
    }
  };

  const handleViewVehicle = (vehicleId: string) => {
    router.push({
      pathname: "/dashboard/vehicle-detail" as any,
      params: { vehicleId },
    });
  };

  const handleStartBooking = () => {
    if (!station) return;
    router.push({
      pathname: "/booking/select-time" as any,
      params: { stationId: station.id },
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading station details...</Text>
      </View>
    );
  }

  if (error || !station) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle" size={64} color={theme.colors.error} />
        <Text style={styles.errorText}>{error || "Station not found"}</Text>
        <Button
          mode="outlined"
          onPress={fetchStationDetail}
          style={styles.retryButton}
        >
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={station.name} />
        <Appbar.Action
          icon="share-variant"
          onPress={() =>
            Alert.alert("Share", "Share functionality coming soon")
          }
        />
      </Appbar.Header>

      <ScrollView>
        {/* Station Image */}
        <Image
          source={{
            uri: station.photo || "https://via.placeholder.com/400x250",
          }}
          style={styles.stationImage}
          resizeMode="cover"
        />

        {/* Station Info Card */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <View style={styles.headerRow}>
              <Chip mode="flat" icon="ev-station">
                {station.status}
              </Chip>
            </View>

            <List.Item
              title="Địa chỉ"
              description={station.address}
              left={(props) => <List.Icon {...props} icon="map-marker" />}
              titleStyle={styles.listTitle}
            />
            <Divider />

            <List.Item
              title="Giờ hoạt động"
              description={`${station.startTime} - ${station.endTime}`}
              left={(props) => <List.Icon {...props} icon="clock-outline" />}
              titleStyle={styles.listTitle}
            />
            <Divider />

            {station.hotline && (
              <>
                <List.Item
                  title="Hotline"
                  description={station.hotline}
                  left={(props) => <List.Icon {...props} icon="phone" />}
                  right={(props) => (
                    <Button mode="text" onPress={handleCallHotline} compact>
                      Call
                    </Button>
                  )}
                  titleStyle={styles.listTitle}
                />
                <Divider />
              </>
            )}

            <List.Item
              title="Xe có sẵn"
              description={`${
                vehicles.filter((v) => v.status === "AVAILABLE").length
              } vehicles`}
              left={(props) => <List.Icon {...props} icon="car-multiple" />}
              titleStyle={styles.listTitle}
            />
          </Card.Content>
        </Card>

        {/* Available Vehicles Section */}
        <View style={styles.vehiclesSection}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Xe có sẵn ({vehicles.length})
          </Text>

          {vehicles.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <View style={styles.emptyState}>
                  <Ionicons
                    name="car-outline"
                    size={48}
                    color={theme.colors.mutedForeground}
                  />
                  <Text style={styles.emptyText}>Không có xe nào</Text>
                </View>
              </Card.Content>
            </Card>
          ) : (
            vehicles.map((vehicle) => (
              <Card
                key={vehicle.id}
                style={styles.vehicleCard}
                onPress={() => handleViewVehicle(vehicle.id)}
              >
                <Card.Cover
                  source={{
                    uri:
                      vehicle.photos?.[0] ||
                      "https://via.placeholder.com/400x200",
                  }}
                />
                <Card.Content style={styles.vehicleContent}>
                  <View style={styles.vehicleHeader}>
                    <Text variant="titleMedium" style={styles.vehicleName}>
                      {vehicle.name}
                    </Text>
                    <Chip
                      mode={
                        vehicle.status === "AVAILABLE" ? "flat" : "outlined"
                      }
                      compact
                    >
                      {vehicle.status}
                    </Chip>
                  </View>

                  <View style={styles.vehicleSpecs}>
                    <Chip
                      icon="gas-station"
                      mode="outlined"
                      compact
                      style={styles.specChip}
                    >
                      {vehicle.fuelType}
                    </Chip>
                    <Chip
                      icon="palette"
                      mode="outlined"
                      compact
                      style={styles.specChip}
                    >
                      {vehicle.color}
                    </Chip>
                    <Chip
                      icon="account-group"
                      mode="outlined"
                      compact
                      style={styles.specChip}
                    >
                      {vehicle.capacity} seats
                    </Chip>
                  </View>

                  <View style={styles.priceRow}>
                    <View>
                      <Text variant="labelSmall" style={styles.priceLabel}>
                        Giá theo giờ
                      </Text>
                      <Text variant="titleMedium" style={styles.priceValue}>
                        ${vehicle.hourlyRate}/hr
                      </Text>
                    </View>
                    <View>
                      <Text variant="labelSmall" style={styles.priceLabel}>
                        Giá theo ngày
                      </Text>
                      <Text variant="titleMedium" style={styles.priceValue}>
                        ${vehicle.dailyRate}/day
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </View>
      </ScrollView>

      {/* Book Button */}
      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleStartBooking}
          disabled={
            vehicles.filter((v) => v.status === "AVAILABLE").length === 0
          }
          icon="calendar-check"
        >
          Đặt xe ngay
        </Button>
      </View>
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
    padding: theme.spacing.lg,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.mutedForeground,
  },
  errorText: {
    marginTop: theme.spacing.md,
    color: theme.colors.error,
    textAlign: "center",
  },
  retryButton: {
    marginTop: theme.spacing.md,
  },
  stationImage: {
    width: "100%",
    height: 250,
  },
  infoCard: {
    margin: theme.spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: theme.spacing.sm,
  },
  listTitle: {
    fontWeight: "600",
  },
  vehiclesSection: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
    fontWeight: "700",
  },
  emptyCard: {
    marginTop: theme.spacing.md,
  },
  emptyState: {
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  emptyText: {
    marginTop: theme.spacing.sm,
    color: theme.colors.mutedForeground,
  },
  vehicleCard: {
    marginBottom: theme.spacing.md,
  },
  vehicleContent: {
    paddingTop: theme.spacing.md,
  },
  vehicleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  vehicleName: {
    flex: 1,
    fontWeight: "700",
  },
  vehicleSpecs: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  specChip: {
    marginRight: theme.spacing.xs,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  priceLabel: {
    color: theme.colors.mutedForeground,
  },
  priceValue: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
});
