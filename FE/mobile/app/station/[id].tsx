import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  StyleSheet,
  Image,
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

export default function StationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  // Mock data - sẽ thay bằng API call sau
  const station = {
    id,
    name: "Trạm Trung Tâm",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    rating: 4.8,
    totalReviews: 234,
    distance: "0.5 km",
    phone: "0901234567",
    openTime: "06:00",
    closeTime: "22:00",
    photo: null,
    latitude: 10.7769,
    longitude: 106.7009,
    totalSlots: 20,
    availableVehicles: 12,
  };

  // Mock vehicles
  const vehicles = [
    {
      id: "v1",
      name: "Honda Vision 2024",
      type: "Xe Máy Điện",
      battery: 85,
      licensePlate: "59A-12345",
      hourlyRate: 25000,
      dailyRate: 150000,
      status: "available",
      photo: null,
    },
    {
      id: "v2",
      name: "VinFast Klara S",
      type: "Xe Máy Điện",
      battery: 92,
      licensePlate: "59B-67890",
      hourlyRate: 30000,
      dailyRate: 180000,
      status: "available",
      photo: null,
    },
    {
      id: "v3",
      name: "Honda Air Blade",
      type: "Xe Máy Điện",
      battery: 78,
      licensePlate: "59C-11223",
      hourlyRate: 28000,
      dailyRate: 160000,
      status: "available",
      photo: null,
    },
    {
      id: "v4",
      name: "Yamaha Janus",
      type: "Xe Máy Điện",
      battery: 65,
      licensePlate: "59D-44556",
      hourlyRate: 22000,
      dailyRate: 130000,
      status: "available",
      photo: null,
    },
  ];

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

  const getBatteryColor = (battery: number) => {
    if (battery >= 80) return "#10b981";
    if (battery >= 50) return "#fbbf24";
    return "#ef4444";
  };

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
                  {station.rating} ({station.totalReviews} đánh giá)
                </Text>
              </View>
            </View>
            <View style={styles.availabilityBadge}>
              <Zap size={16} color="#10b981" />
              <Text style={styles.availabilityText}>
                {station.availableVehicles}/{station.totalSlots}
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
              <Navigation size={18} color="#6b7280" />
              <Text style={styles.detailText}>{station.distance} từ bạn</Text>
            </View>
            <View style={styles.detailRow}>
              <Clock size={18} color="#6b7280" />
              <Text style={styles.detailText}>
                {station.openTime} - {station.closeTime}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Phone size={18} color="#6b7280" />
              <Text style={styles.detailText}>{station.phone}</Text>
            </View>
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
                  <Text style={styles.vehicleType}>{vehicle.type}</Text>
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
                  <Zap size={14} color={getBatteryColor(vehicle.battery)} />
                  <Text
                    style={[
                      styles.batteryText,
                      { color: getBatteryColor(vehicle.battery) },
                    ]}
                  >
                    Pin: {vehicle.battery}%
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
