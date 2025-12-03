import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  Phone,
  Navigation,
  Zap,
} from "lucide-react-native";
import { Button } from "@/components/common";
import { api } from "@/services/api";
import type { StationDetailResponse, VehicleResponse } from "@/types";
import Toast from "react-native-toast-message";

export default function StationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [station, setStation] = useState<StationDetailResponse | null>(null);

  // Fetch station details from API
  useEffect(() => {
    const fetchStationDetails = async () => {
      try {
        setIsLoading(true);
        const response = await api.getStationById(id as string);
        setStation(response.data as StationDetailResponse);
      } catch (error: any) {
        console.error("Failed to fetch station:", error);
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Không thể tải thông tin trạm",
        });
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchStationDetails();
    }
  }, [id]);

  const handleBookVehicle = () => {
    if (!selectedVehicle) {
      alert("Vui lòng chọn xe để đặt");
      return;
    }
    // Navigate to booking screen
    router.push({
      pathname: "/booking/create",
      params: { vehicleId: selectedVehicle, stationId: id },
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getBatteryColor = (rating: number) => {
    if (rating >= 4) return "#10b981";
    if (rating >= 3) return "#fbbf24";
    return "#ef4444";
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Đang tải thông tin trạm...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!station) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Không tìm thấy thông tin trạm</Text>
          <Button title="Quay lại" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const vehicles = station.vehicles || [];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Chi Tiết Trạm</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Station Image */}
        <View style={styles.imageContainer}>
          {station.photo ? (
            <Image
              source={{ uri: station.photo }}
              style={styles.stationImage}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <MapPin size={48} color="#9ca3af" />
            </View>
          )}
        </View>

        {/* Station Info */}
        <View style={styles.stationInfo}>
          <View style={styles.stationHeader}>
            <View style={styles.stationHeaderLeft}>
              <Text style={styles.stationName}>{station.name}</Text>
              <View style={styles.ratingRow}>
                <Star size={16} color="#fbbf24" fill="#fbbf24" />
                <Text style={styles.ratingText}>
                  {station.rating.toFixed(1)} đánh giá
                </Text>
              </View>
            </View>
            <View style={styles.availabilityBadge}>
              <Zap size={16} color="#10b981" />
              <Text style={styles.availabilityText}>
                {station.availableVehicles}/{station.totalVehicles}
              </Text>
            </View>
          </View>

          {/* Details */}
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <MapPin size={18} color="#6b7280" />
              <Text style={styles.detailText}>{station.address}</Text>
            </View>
            <View style={styles.detailRow}>
              <Clock size={18} color="#6b7280" />
              <Text style={styles.detailText}>
                {new Date(station.startTime).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -{" "}
                {new Date(station.endTime).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
            {station.hotline && (
              <View style={styles.detailRow}>
                <Phone size={18} color="#6b7280" />
                <Text style={styles.detailText}>{station.hotline}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Available Vehicles */}
        <View style={styles.vehiclesSection}>
          <Text style={styles.sectionTitle}>Xe Có Sẵn ({vehicles.length})</Text>

          {vehicles.map((vehicle) => (
            <Pressable
              key={vehicle.id}
              style={[
                styles.vehicleCard,
                selectedVehicle === vehicle.id && styles.vehicleCardSelected,
              ]}
              onPress={() => setSelectedVehicle(vehicle.id)}
            >
              <View style={styles.vehicleHeader}>
                <View style={styles.vehicleIcon}>
                  <Zap size={24} color="#10b981" />
                </View>
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleName}>{vehicle.name}</Text>
                  <Text style={styles.vehicleType}>
                    {vehicle.brand} - {vehicle.fuelType}
                  </Text>
                  <Text style={styles.licensePlate}>
                    {vehicle.licensePlate}
                  </Text>
                </View>
                <View style={styles.vehicleRight}>
                  {selectedVehicle === vehicle.id && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedText}>✓</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.vehicleDetails}>
                <View style={styles.batteryRow}>
                  <Star size={14} color={getBatteryColor(vehicle.rating)} />
                  <Text
                    style={[
                      styles.batteryText,
                      { color: getBatteryColor(vehicle.rating) },
                    ]}
                  >
                    Đánh giá: {vehicle.rating.toFixed(1)}/5 ⭐
                  </Text>
                </View>
                <View style={styles.priceRow}>
                  <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>Giờ:</Text>
                    <Text style={styles.priceValue}>
                      {formatCurrency(vehicle.hourlyRate)}
                    </Text>
                  </View>
                  <View style={styles.priceDivider} />
                  <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>Ngày:</Text>
                    <Text style={styles.priceValue}>
                      {formatCurrency(vehicle.dailyRate)}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <View style={styles.priceInfo}>
          <Text style={styles.priceInfoLabel}>
            {selectedVehicle ? "Xe đã chọn" : "Chọn xe để tiếp tục"}
          </Text>
          {selectedVehicle && (
            <Text style={styles.priceInfoValue}>
              Từ{" "}
              {formatCurrency(
                vehicles.find((v) => v.id === selectedVehicle)?.hourlyRate || 0
              )}
              /giờ
            </Text>
          )}
        </View>
        <Button
          title="Đặt Xe"
          onPress={handleBookVehicle}
          disabled={!selectedVehicle}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    marginBottom: 16,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    height: 200,
  },
  stationImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  stationInfo: {
    padding: 16,
    borderBottomWidth: 8,
    borderBottomColor: "#f9fafb",
  },
  stationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  stationHeaderLeft: {
    flex: 1,
  },
  stationName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ratingText: {
    fontSize: 14,
    color: "#6b7280",
  },
  availabilityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  availabilityText: {
    color: "#10b981",
    fontWeight: "600",
    fontSize: 14,
  },
  detailsSection: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailText: {
    flex: 1,
    fontSize: 15,
    color: "#374151",
  },
  vehiclesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  vehicleCard: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  vehicleCardSelected: {
    borderColor: "#10b981",
    backgroundColor: "rgba(16, 185, 129, 0.05)",
  },
  vehicleHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  vehicleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  vehicleType: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  licensePlate: {
    fontSize: 13,
    color: "#9ca3af",
    fontWeight: "500",
  },
  vehicleRight: {
    width: 32,
    alignItems: "flex-end",
  },
  selectedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  vehicleDetails: {
    gap: 8,
  },
  batteryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  batteryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  priceItem: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  priceDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#e5e7eb",
  },
  bottomAction: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    backgroundColor: "#ffffff",
    gap: 12,
  },
  priceInfo: {
    alignItems: "center",
  },
  priceInfoLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  priceInfoValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#10b981",
  },
});
