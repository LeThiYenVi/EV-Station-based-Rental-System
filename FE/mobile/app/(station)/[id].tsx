import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  MapPin,
  Phone,
  Clock,
  Star,
  ChevronRight,
  Navigation,
  ChevronLeft,
} from "lucide-react-native";
import { Card, EmptyState } from "@/components/common";
import { VehicleCard } from "@/components/common/VehicleCard";
import { stationService, vehicleService } from "@/services";
import { StationDetailResponse, VehicleResponse } from "@/types";
import Toast from "react-native-toast-message";

export default function StationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [station, setStation] = useState<StationDetailResponse | null>(null);
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);

  useEffect(() => {
    if (id) {
      fetchStationDetails();
    }
  }, [id]);

  const fetchStationDetails = async () => {
    try {
      setLoading(true);
      const stationData = (await stationService.getStationById(
        id
      )) as any as StationDetailResponse;

      setStation(stationData);

      // Station detail already includes vehicles array
      setVehicles(stationData.vehicles || []);
    } catch (error) {
      console.error("Failed to fetch station details:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể tải thông tin trạm",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDirections = () => {
    if (!station) return;

    // Open Google Maps with directions
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`;

    Toast.show({
      type: "info",
      text1: "Chỉ Đường",
      text2: "Mở Google Maps...",
    });

    // On web, window.open. On native, use Linking
    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  };

  const handleCallHotline = () => {
    if (!station?.hotline) return;

    Toast.show({
      type: "info",
      text1: "Gọi Hotline",
      text2: station.hotline,
    });

    // On native, use Linking.openURL(`tel:${station.hotline}`)
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <Stack.Screen
          options={{
            title: "Chi Tiết Trạm",
            headerShown: true,
            headerBackTitle: "Quay Lại",
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!station) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <Stack.Screen
          options={{
            title: "Chi Tiết Trạm",
            headerShown: true,
            headerBackTitle: "Quay Lại",
          }}
        />
        <EmptyState
          icon={MapPin}
          title="Không Tìm Thấy Trạm"
          description="Trạm này không tồn tại hoặc đã bị xóa"
        />
      </SafeAreaView>
    );
  }

  const availableVehicles = vehicles.filter((v) => v.status === "AVAILABLE");

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: station.name,
          headerShown: false,
        }}
      />

      {/* Custom Header with Back Button */}
      <View style={styles.customHeader}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#111827" />
          <Text style={styles.backButtonText}>Quay Lại</Text>
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {station.name}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Station Image */}
        {station.photo ? (
          <Image source={{ uri: station.photo }} style={styles.stationImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <MapPin size={64} color="#9ca3af" />
          </View>
        )}

        {/* Station Info Card */}
        <View style={styles.content}>
          <Card>
            <View style={styles.headerRow}>
              <View style={styles.titleContainer}>
                <Text style={styles.stationName}>{station.name}</Text>
                {station.rating && station.rating > 0 && (
                  <View style={styles.ratingContainer}>
                    <Star size={16} color="#f59e0b" fill="#f59e0b" />
                    <Text style={styles.ratingText}>
                      {station.rating.toFixed(1)}
                    </Text>
                  </View>
                )}
              </View>
              <View
                style={[
                  styles.statusBadge,
                  station.status === "ACTIVE"
                    ? styles.statusActive
                    : styles.statusInactive,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    station.status === "ACTIVE"
                      ? styles.statusActiveText
                      : styles.statusInactiveText,
                  ]}
                >
                  {station.status === "ACTIVE" ? "Hoạt Động" : "Đóng Cửa"}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MapPin size={18} color="#6b7280" />
              <Text style={styles.infoText}>{station.address}</Text>
            </View>

            <View style={styles.infoRow}>
              <Clock size={18} color="#6b7280" />
              <Text style={styles.infoText}>
                {formatTime(station.startTime)} - {formatTime(station.endTime)}
              </Text>
            </View>

            {station.hotline && (
              <Pressable style={styles.infoRow} onPress={handleCallHotline}>
                <Phone size={18} color="#10b981" />
                <Text style={[styles.infoText, styles.phoneText]}>
                  {station.hotline}
                </Text>
              </Pressable>
            )}
          </Card>

          {/* Stats Card */}
          <Card>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{station.totalVehicles}</Text>
                <Text style={styles.statLabel}>Tổng Xe</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, styles.availableText]}>
                  {station.availableVehicles}
                </Text>
                <Text style={styles.statLabel}>Xe Khả Dụng</Text>
              </View>
            </View>
          </Card>

          {/* Directions Button */}
          <Pressable style={styles.directionsButton} onPress={handleDirections}>
            <Navigation size={20} color="#ffffff" />
            <Text style={styles.directionsButtonText}>Chỉ Đường</Text>
          </Pressable>

          {/* Available Vehicles */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Xe Khả Dụng ({availableVehicles.length})
            </Text>

            {availableVehicles.length === 0 ? (
              <View style={styles.emptyVehicles}>
                <Text style={styles.emptyText}>Hiện không có xe khả dụng</Text>
              </View>
            ) : (
              availableVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onPress={() => router.push(`/(vehicle)/${vehicle.id}`)}
                />
              ))
            )}
          </View>

          {/* All Vehicles (if needed) */}
          {vehicles.length > availableVehicles.length && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Tất Cả Xe Tại Trạm ({vehicles.length})
              </Text>
              {vehicles
                .filter((v) => v.status !== "AVAILABLE")
                .map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onPress={() => router.push(`/(vehicle)/${vehicle.id}`)}
                  />
                ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginHorizontal: 8,
  },
  headerSpacer: {
    width: 80,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6b7280",
  },
  stationImage: {
    width: "100%",
    height: 240,
    backgroundColor: "#e5e7eb",
  },
  placeholderImage: {
    width: "100%",
    height: 240,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  stationName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f59e0b",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: "#d1fae5",
  },
  statusInactive: {
    backgroundColor: "#fee2e2",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusActiveText: {
    color: "#065f46",
  },
  statusInactiveText: {
    color: "#991b1b",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  phoneText: {
    color: "#10b981",
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  availableText: {
    color: "#10b981",
  },
  statLabel: {
    fontSize: 13,
    color: "#6b7280",
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#e5e7eb",
  },
  directionsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#10b981",
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 24,
  },
  directionsButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  emptyVehicles: {
    padding: 32,
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
  },
});
