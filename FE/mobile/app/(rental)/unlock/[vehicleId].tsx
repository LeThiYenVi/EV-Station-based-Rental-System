import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  CheckCircle,
  XCircle,
  Battery,
  Zap,
  MapPin,
  DollarSign,
} from "lucide-react-native";
import { vehicleService, bookingService } from "@/services";
import { VehicleDetailResponse } from "@/types";
import { Button, Card, InfoRow } from "@/components/common";
import Toast from "react-native-toast-message";
import { useAuth } from "@/hooks/useAuth";

export default function UnlockVehicleScreen() {
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState<VehicleDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    if (vehicleId) {
      fetchVehicleDetails();
    }
  }, [vehicleId]);

  const fetchVehicleDetails = async () => {
    try {
      setLoading(true);
      const response = await vehicleService.getVehicleById(vehicleId);
      setVehicle(response);
    } catch (error: any) {
      console.error("Failed to fetch vehicle:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: error.response?.data?.message || "Không thể tải thông tin xe",
      });
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = () => {
    // Navigate to booking form with this vehicle pre-selected
    router.push({
      pathname: "/(rental)/booking-form",
      params: { vehicleId: vehicleId },
    });
  };

  const handleQuickRent = async () => {
    try {
      setUnlocking(true);

      // Create booking with 1 hour duration
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // +1 hour

      const response = await bookingService.createBooking({
        vehicleId: vehicleId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        pickupNote: "Quick rent from QR scan",
      });

      Toast.show({
        type: "success",
        text1: "Tạo Booking Thành Công",
        text2: `Mã: ${response.bookingCode}`,
      });

      // Check if MoMo payment is required
      if (response.momoPayment?.payUrl) {
        // Navigate to payment
        router.push({
          pathname: "/(rental)/payment-result",
          params: {
            bookingId: response.id,
            payUrl: response.momoPayment.payUrl,
          },
        });
      } else {
        // Navigate to active trip
        router.replace("/(rental)/active");
      }
    } catch (error: any) {
      console.error("Failed to create booking:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: error.response?.data?.message || "Không thể tạo booking",
      });
    } finally {
      setUnlocking(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Đang tải thông tin xe...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!vehicle) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <XCircle size={64} color="#ef4444" />
          <Text style={styles.errorTitle}>Không Tìm Thấy Xe</Text>
          <Text style={styles.errorText}>
            Xe này không tồn tại hoặc đã bị xóa
          </Text>
          <Button title="Quay Lại" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const isAvailable = vehicle.status === "AVAILABLE";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Vehicle Image */}
        {vehicle.photos && vehicle.photos.length > 0 ? (
          <Image
            source={{ uri: vehicle.photos[0] }}
            style={styles.vehicleImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Zap size={64} color="#9ca3af" />
          </View>
        )}

        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              isAvailable ? styles.statusAvailable : styles.statusUnavailable,
            ]}
          >
            {isAvailable ? (
              <CheckCircle size={16} color="#ffffff" />
            ) : (
              <XCircle size={16} color="#ffffff" />
            )}
            <Text style={styles.statusText}>
              {isAvailable ? "Có Sẵn" : "Không Khả Dụng"}
            </Text>
          </View>
        </View>

        {/* Vehicle Info */}
        <View style={styles.infoSection}>
          <Text style={styles.vehicleName}>{vehicle.brand}</Text>
          <Text style={styles.licensePlate}>{vehicle.licensePlate}</Text>
        </View>

        {/* Specs Card */}
        <Card>
          <Text style={styles.cardTitle}>Thông Số Xe</Text>

          <InfoRow
            icon={Battery}
            label="Loại Nhiên Liệu"
            value={vehicle.fuelType}
          />
          <InfoRow
            icon={Zap}
            label="Trạng Thái"
            value={vehicle.status === "AVAILABLE" ? "Sẵn Sàng" : "Bận"}
          />
          <InfoRow icon={MapPin} label="Trạm" value={vehicle.stationName} />
          <View style={styles.divider} />
          <InfoRow
            icon={DollarSign}
            label="Giá Thuê"
            value={`${vehicle.hourlyRate.toLocaleString("vi-VN")}đ/giờ`}
          />
        </Card>

        {/* Ratings */}
        {vehicle.rating && vehicle.rating > 0 && (
          <Card>
            <Text style={styles.cardTitle}>Đánh Giá</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.ratingValue}>
                ⭐ {vehicle.rating.toFixed(1)}
              </Text>
              <Text style={styles.ratingCount}>
                ({vehicle.rentCount || 0} lượt thuê)
              </Text>
            </View>
          </Card>
        )}

        {/* Warning for unavailable */}
        {!isAvailable && (
          <View style={styles.warningBox}>
            <XCircle size={20} color="#f59e0b" />
            <Text style={styles.warningText}>
              Xe này hiện không khả dụng. Vui lòng chọn xe khác.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Giá Thuê</Text>
          <Text style={styles.priceValue}>
            {vehicle.hourlyRate.toLocaleString("vi-VN")}đ/giờ
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <Pressable
            style={styles.secondaryButton}
            onPress={handleUnlock}
            disabled={!isAvailable}
          >
            <Text style={styles.secondaryButtonText}>Đặt Trước</Text>
          </Pressable>

          <Pressable
            style={[
              styles.primaryButton,
              !isAvailable && styles.buttonDisabled,
            ]}
            onPress={handleQuickRent}
            disabled={!isAvailable || unlocking}
          >
            {unlocking ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.primaryButtonText}>Thuê Ngay (1h)</Text>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  vehicleImage: {
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
  statusContainer: {
    position: "absolute",
    top: 200,
    right: 16,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusAvailable: {
    backgroundColor: "#10b981",
  },
  statusUnavailable: {
    backgroundColor: "#ef4444",
  },
  statusText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  infoSection: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  vehicleName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 6,
  },
  licensePlate: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 12,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratingValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  ratingCount: {
    fontSize: 14,
    color: "#6b7280",
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fffbeb",
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fef3c7",
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: "#92400e",
    lineHeight: 20,
  },
  bottomBar: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    padding: 16,
  },
  priceContainer: {
    marginBottom: 12,
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
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#10b981",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#10b981",
    fontWeight: "600",
    fontSize: 15,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#10b981",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#d1d5db",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },
});
