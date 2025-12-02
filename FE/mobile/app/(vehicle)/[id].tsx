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
  ChevronLeft,
  Battery,
  Star,
  Users,
  Zap,
  MapPin,
  FileText,
} from "lucide-react-native";
import { Card, EmptyState, Button } from "@/components/common";
import { vehicleService } from "@/services";
import { VehicleResponse } from "@/types";
import Toast from "react-native-toast-message";

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState<VehicleResponse | null>(null);

  useEffect(() => {
    if (id) {
      fetchVehicleDetails();
    }
  }, [id]);

  const fetchVehicleDetails = async () => {
    try {
      setLoading(true);
      const vehicleData = await vehicleService.getVehicleById(id);
      setVehicle(vehicleData);
    } catch (error) {
      console.error("Failed to fetch vehicle details:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể tải thông tin xe",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    if (!vehicle) return;

    // Navigate to booking form
    router.push({
      pathname: "/(rental)/booking-form",
      params: { vehicleId: vehicle.id },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <Stack.Screen
          options={{
            title: "Chi Tiết Xe",
            headerShown: false,
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!vehicle) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <Stack.Screen
          options={{
            title: "Chi Tiết Xe",
            headerShown: false,
          }}
        />
        <EmptyState
          icon={Zap}
          title="Không Tìm Thấy Xe"
          description="Xe này không tồn tại hoặc đã bị xóa"
        />
      </SafeAreaView>
    );
  }

  const isAvailable = vehicle.status === "AVAILABLE";

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: vehicle.name,
          headerShown: false,
        }}
      />

      {/* Custom Header */}
      <View style={styles.customHeader}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#111827" />
          <Text style={styles.backButtonText}>Quay Lại</Text>
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {vehicle.name}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Vehicle Image */}
        {vehicle.photos && vehicle.photos.length > 0 ? (
          <Image
            source={{ uri: vehicle.photos[0] }}
            style={styles.vehicleImage}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Zap size={64} color="#9ca3af" />
          </View>
        )}

        {/* Vehicle Info */}
        <View style={styles.content}>
          <Card>
            <View style={styles.headerRow}>
              <View style={styles.titleContainer}>
                <Text style={styles.vehicleName}>{vehicle.name}</Text>
                <Text style={styles.brand}>{vehicle.brand}</Text>
                {vehicle.rating && vehicle.rating > 0 && (
                  <View style={styles.ratingContainer}>
                    <Star size={16} color="#f59e0b" fill="#f59e0b" />
                    <Text style={styles.ratingText}>
                      {vehicle.rating.toFixed(1)}
                    </Text>
                    <Text style={styles.rentCount}>
                      ({vehicle.rentCount} lượt thuê)
                    </Text>
                  </View>
                )}
              </View>
              <View
                style={[
                  styles.statusBadge,
                  isAvailable ? styles.statusActive : styles.statusInactive,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    isAvailable
                      ? styles.statusActiveText
                      : styles.statusInactiveText,
                  ]}
                >
                  {isAvailable ? "Có Sẵn" : vehicle.status}
                </Text>
              </View>
            </View>

            {/* Specs Grid */}
            <View style={styles.specsGrid}>
              <View style={styles.specItem}>
                <Battery size={20} color="#10b981" />
                <Text style={styles.specLabel}>Loại nhiên liệu</Text>
                <Text style={styles.specValue}>{vehicle.fuelType}</Text>
              </View>
              <View style={styles.specItem}>
                <Users size={20} color="#10b981" />
                <Text style={styles.specLabel}>Sức chứa</Text>
                <Text style={styles.specValue}>{vehicle.capacity} người</Text>
              </View>
              <View style={styles.specItem}>
                <Zap size={20} color="#10b981" />
                <Text style={styles.specLabel}>Màu xe</Text>
                <Text style={styles.specValue}>{vehicle.color}</Text>
              </View>
              <View style={styles.specItem}>
                <FileText size={20} color="#10b981" />
                <Text style={styles.specLabel}>Biển số</Text>
                <Text style={styles.specValue}>{vehicle.licensePlate}</Text>
              </View>
            </View>
          </Card>

          {/* Pricing Card */}
          <Card>
            <Text style={styles.sectionTitle}>Bảng Giá</Text>
            <View style={styles.pricingGrid}>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Giá thuê/giờ</Text>
                <Text style={styles.priceValue}>
                  {vehicle.hourlyRate.toLocaleString("vi-VN")}₫
                </Text>
              </View>
              {vehicle.dailyRate && (
                <View style={styles.priceItem}>
                  <Text style={styles.priceLabel}>Giá thuê/ngày</Text>
                  <Text style={styles.priceValue}>
                    {vehicle.dailyRate.toLocaleString("vi-VN")}₫
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.depositRow}>
              <Text style={styles.depositLabel}>Tiền đặt cọc</Text>
              <Text style={styles.depositValue}>
                {vehicle.depositAmount.toLocaleString("vi-VN")}₫
              </Text>
            </View>
          </Card>

          {/* Policies */}
          {vehicle.polices && vehicle.polices.length > 0 && (
            <Card>
              <Text style={styles.sectionTitle}>Chính Sách Thuê Xe</Text>
              {vehicle.polices.map((policy, index) => (
                <View key={index} style={styles.policyItem}>
                  <Text style={styles.policyText}>• {policy}</Text>
                </View>
              ))}
            </Card>
          )}

          {/* Location Info */}
          {vehicle.stationId && (
            <Card>
              <Text style={styles.sectionTitle}>Vị Trí</Text>
              <View style={styles.locationRow}>
                <MapPin size={20} color="#6b7280" />
                <Text style={styles.locationText}>
                  Xe hiện tại trạm (ID: {vehicle.stationId})
                </Text>
              </View>
            </Card>
          )}
        </View>
      </ScrollView>

      {/* Bottom Booking Button */}
      <View style={styles.bottomBar}>
        <View style={styles.priceSection}>
          <Text style={styles.bottomPriceLabel}>Từ</Text>
          <Text style={styles.bottomPriceValue}>
            {vehicle.hourlyRate.toLocaleString("vi-VN")}₫/giờ
          </Text>
        </View>
        <Pressable
          style={[styles.bookButton, !isAvailable && styles.bookButtonDisabled]}
          onPress={handleBooking}
          disabled={!isAvailable}
        >
          <Text style={styles.bookButtonText}>
            {isAvailable ? "Đặt Xe Ngay" : "Không Khả Dụng"}
          </Text>
        </Pressable>
      </View>
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
  vehicleImage: {
    width: "100%",
    height: 280,
    backgroundColor: "#e5e7eb",
  },
  placeholderImage: {
    width: "100%",
    height: 280,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
    paddingBottom: 100,
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
  vehicleName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  brand: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 8,
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
  rentCount: {
    fontSize: 13,
    color: "#9ca3af",
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
  specsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  specItem: {
    width: "48%",
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    alignItems: "center",
    gap: 4,
  },
  specLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
  specValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  pricingGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  priceItem: {
    flex: 1,
    padding: 12,
    backgroundColor: "#f0fdf4",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  priceLabel: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#10b981",
  },
  depositRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fef3c7",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fde68a",
  },
  depositLabel: {
    fontSize: 14,
    color: "#92400e",
    fontWeight: "500",
  },
  depositValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#92400e",
  },
  policyItem: {
    marginBottom: 8,
  },
  policyText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: "#6b7280",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  priceSection: {
    flex: 1,
  },
  bottomPriceLabel: {
    fontSize: 12,
    color: "#9ca3af",
  },
  bottomPriceValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#10b981",
  },
  bookButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  bookButtonDisabled: {
    backgroundColor: "#9ca3af",
    shadowOpacity: 0,
  },
  bookButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
