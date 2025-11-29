import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Platform,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  AlertCircle,
  ChevronLeft,
} from "lucide-react-native";
import { vehicleService, bookingService, stationService } from "@/services";
import { VehicleDetailResponse, StationResponse } from "@/types";
import { Button, Card } from "@/components/common";
import { useAuth } from "@/hooks/useAuth";
import Toast from "react-native-toast-message";

export default function BookingFormScreen() {
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [vehicle, setVehicle] = useState<VehicleDetailResponse | null>(null);
  const [station, setStation] = useState<StationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Set default start time to 30 minutes from now to avoid past time error
  const [startTime, setStartTime] = useState(new Date(Date.now() + 30 * 60000)); // +30 minutes
  const [endTime, setEndTime] = useState(new Date(Date.now() + 90 * 60000)); // +1.5 hours
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"MOMO" | "CASH">("MOMO");

  useEffect(() => {
    fetchVehicleAndStation();
  }, [vehicleId]);

  const fetchVehicleAndStation = async () => {
    try {
      setLoading(true);
      const vehicleResponse = await vehicleService.getVehicleById(vehicleId);
      setVehicle(vehicleResponse);

      if (vehicleResponse.stationId) {
        const stationResponse = await stationService.getStationById(
          vehicleResponse.stationId
        );
        setStation(stationResponse);
      }
    } catch (error: any) {
      console.error("Failed to fetch data:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể tải thông tin xe",
      });
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = () => {
    const diff = endTime.getTime() - startTime.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60))); // hours
  };

  const calculateTotalPrice = () => {
    if (!vehicle) return 0;
    const hours = calculateDuration();
    return hours * vehicle.hourlyRate;
  };

  const handleCreateBooking = async () => {
    // Check authentication
    if (!isAuthenticated) {
      Toast.show({
        type: "error",
        text1: "Cần Đăng Nhập",
        text2: "Vui lòng đăng nhập để đặt xe",
      });
      router.replace("/(tabs)/profile");
      return;
    }

    // Validation
    if (startTime >= endTime) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Thời gian kết thúc phải sau thời gian bắt đầu",
      });
      return;
    }

    if (startTime < new Date()) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Thời gian bắt đầu không thể là quá khứ",
      });
      return;
    }

    try {
      setSubmitting(true);

      const response = await bookingService.createBooking({
        vehicleId: vehicleId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        pickupNote: note || undefined,
        paymentMethod: paymentMethod,
      });

      Toast.show({
        type: "success",
        text1: "Đặt Xe Thành Công",
        text2: `Mã booking: ${response.bookingCode}`,
      });

      // Check if payment is required
      if (response.momoPayment?.payUrl) {
        router.push({
          pathname: "/(rental)/payment-result",
          params: {
            bookingId: response.id,
            payUrl: response.momoPayment.payUrl,
          },
        });
      } else {
        // Navigate to trips screen
        router.replace("/(tabs)/trips");
      }
    } catch (error: any) {
      console.error("Failed to create booking:", error);
      console.error("Error response:", error.response?.data);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể tạo booking";

      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: errorMessage,
        visibilityTime: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!vehicle) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#111827" />
          <Text style={styles.backButtonText}>Quay Lại</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Đặt Xe</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Vehicle Summary */}
        <Card>
          <Text style={styles.cardTitle}>Thông Tin Xe</Text>
          <View style={styles.vehicleRow}>
            <Text style={styles.vehicleName}>{vehicle.brand}</Text>
            <Text style={styles.licensePlate}>{vehicle.licensePlate}</Text>
          </View>
          {station && (
            <View style={styles.infoRow}>
              <MapPin size={16} color="#6b7280" />
              <Text style={styles.infoText}>{station.name}</Text>
            </View>
          )}
        </Card>

        {/* Time Selection */}
        <Card>
          <Text style={styles.cardTitle}>Thời Gian Thuê</Text>

          {/* Start Time */}
          <View style={styles.timeSection}>
            <Text style={styles.timeLabel}>Thời gian bắt đầu</Text>
            <View style={styles.dateTimeRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ngày</Text>
                <input
                  type="date"
                  value={startTime.toISOString().split("T")[0]}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    const currentTime = startTime;
                    newDate.setHours(currentTime.getHours());
                    newDate.setMinutes(currentTime.getMinutes());
                    setStartTime(newDate);
                  }}
                  style={{
                    padding: 12,
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 8,
                    backgroundColor: "#ffffff",
                  }}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Giờ</Text>
                <input
                  type="time"
                  value={`${String(startTime.getHours()).padStart(
                    2,
                    "0"
                  )}:${String(startTime.getMinutes()).padStart(2, "0")}`}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(":");
                    const newTime = new Date(startTime);
                    newTime.setHours(parseInt(hours));
                    newTime.setMinutes(parseInt(minutes));
                    setStartTime(newTime);
                  }}
                  style={{
                    padding: 12,
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 8,
                    backgroundColor: "#ffffff",
                  }}
                />
              </View>
            </View>
          </View>

          {/* End Time */}
          <View style={styles.timeSection}>
            <Text style={styles.timeLabel}>Thời gian kết thúc</Text>
            <View style={styles.dateTimeRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ngày</Text>
                <input
                  type="date"
                  value={endTime.toISOString().split("T")[0]}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    const currentTime = endTime;
                    newDate.setHours(currentTime.getHours());
                    newDate.setMinutes(currentTime.getMinutes());
                    setEndTime(newDate);
                  }}
                  style={{
                    padding: 12,
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 8,
                    backgroundColor: "#ffffff",
                  }}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Giờ</Text>
                <input
                  type="time"
                  value={`${String(endTime.getHours()).padStart(
                    2,
                    "0"
                  )}:${String(endTime.getMinutes()).padStart(2, "0")}`}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(":");
                    const newTime = new Date(endTime);
                    newTime.setHours(parseInt(hours));
                    newTime.setMinutes(parseInt(minutes));
                    setEndTime(newTime);
                  }}
                  style={{
                    padding: 12,
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 8,
                    backgroundColor: "#ffffff",
                  }}
                />
              </View>
            </View>
          </View>

          {/* Duration */}
          <View style={styles.durationBox}>
            <Text style={styles.durationLabel}>Thời lượng:</Text>
            <Text style={styles.durationValue}>{calculateDuration()} giờ</Text>
          </View>
        </Card>

        {/* Note */}
        <Card>
          <Text style={styles.cardTitle}>Ghi Chú (Tùy Chọn)</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Thêm ghi chú cho chuyến đi..."
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </Card>

        {/* Payment Method Selection */}
        <Card>
          <Text style={styles.cardTitle}>Phương Thức Thanh Toán</Text>

          <View style={styles.paymentOptions}>
            {/* MOMO Option */}
            <Pressable
              style={[
                styles.paymentOption,
                paymentMethod === "MOMO" && styles.paymentOptionSelected,
              ]}
              onPress={() => setPaymentMethod("MOMO")}
            >
              <View style={styles.paymentOptionLeft}>
                <View
                  style={[
                    styles.radioCircle,
                    paymentMethod === "MOMO" && styles.radioCircleSelected,
                  ]}
                >
                  {paymentMethod === "MOMO" && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentMethodName}>MoMo</Text>
                  <Text style={styles.paymentMethodDesc}>
                    Thanh toán qua ví điện tử MoMo
                  </Text>
                </View>
              </View>
              <View style={styles.momoLogo}>
                <Text style={styles.momoLogoText}>M</Text>
              </View>
            </Pressable>

            {/* CASH Option */}
            <Pressable
              style={[
                styles.paymentOption,
                paymentMethod === "CASH" && styles.paymentOptionSelected,
              ]}
              onPress={() => setPaymentMethod("CASH")}
            >
              <View style={styles.paymentOptionLeft}>
                <View
                  style={[
                    styles.radioCircle,
                    paymentMethod === "CASH" && styles.radioCircleSelected,
                  ]}
                >
                  {paymentMethod === "CASH" && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentMethodName}>Tiền Mặt</Text>
                  <Text style={styles.paymentMethodDesc}>
                    Thanh toán trực tiếp khi nhận xe
                  </Text>
                </View>
              </View>
              <DollarSign size={24} color="#6b7280" />
            </Pressable>
          </View>
        </Card>

        {/* Price Breakdown */}
        <Card>
          <Text style={styles.cardTitle}>Chi Tiết Giá</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              Giá thuê ({calculateDuration()} giờ)
            </Text>
            <Text style={styles.priceValue}>
              {calculateTotalPrice().toLocaleString("vi-VN")}đ
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Tổng Cộng</Text>
            <Text style={styles.totalValue}>
              {calculateTotalPrice().toLocaleString("vi-VN")}đ
            </Text>
          </View>
        </Card>

        {/* Warning */}
        <View style={styles.warningBox}>
          <AlertCircle size={20} color="#f59e0b" />
          <Text style={styles.warningText}>
            {paymentMethod === "MOMO"
              ? "Bạn sẽ được chuyển đến trang thanh toán MoMo để hoàn tất đặt xe"
              : "Vui lòng thanh toán bằng tiền mặt khi nhận xe tại trạm"}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPrice}>
          <Text style={styles.bottomPriceLabel}>Tổng Thanh Toán</Text>
          <Text style={styles.bottomPriceValue}>
            {calculateTotalPrice().toLocaleString("vi-VN")}đ
          </Text>
        </View>
        <Button
          title={submitting ? "Đang Xử Lý..." : "Xác Nhận Đặt Xe"}
          onPress={handleCreateBooking}
          disabled={submitting}
        />
      </View>

      {/* Date Time Pickers */}
      {showStartPicker && (
        <DateTimePicker
          value={startTime}
          mode="datetime"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, date) => {
            setShowStartPicker(Platform.OS === "ios");
            if (date) setStartTime(date);
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endTime}
          mode="datetime"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, date) => {
            setShowEndPicker(Platform.OS === "ios");
            if (date) setEndTime(date);
          }}
        />
      )}
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
  scrollView: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  vehicleRow: {
    marginBottom: 12,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  licensePlate: {
    fontSize: 14,
    color: "#6b7280",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#6b7280",
  },
  timeSection: {
    marginBottom: 16,
  },
  timeLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  dateTimeRow: {
    flexDirection: "row",
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 6,
    fontWeight: "500",
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  timeText: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "500",
  },
  durationBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#ecfdf5",
    borderRadius: 8,
  },
  durationLabel: {
    fontSize: 15,
    color: "#065f46",
    fontWeight: "500",
  },
  durationValue: {
    fontSize: 18,
    color: "#10b981",
    fontWeight: "bold",
  },
  noteInput: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    fontSize: 15,
    color: "#111827",
    minHeight: 80,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 15,
    color: "#6b7280",
  },
  priceValue: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 20,
    color: "#10b981",
    fontWeight: "bold",
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
    fontSize: 13,
    color: "#92400e",
    lineHeight: 18,
  },
  bottomBar: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    padding: 16,
  },
  bottomPrice: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  bottomPriceLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  bottomPriceValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#10b981",
  },
  paymentOptions: {
    gap: 12,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  paymentOptionSelected: {
    backgroundColor: "#ecfdf5",
    borderColor: "#10b981",
  },
  paymentOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleSelected: {
    borderColor: "#10b981",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10b981",
  },
  paymentInfo: {
    gap: 2,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  paymentMethodDesc: {
    fontSize: 13,
    color: "#6b7280",
  },
  momoLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#b0006d",
    alignItems: "center",
    justifyContent: "center",
  },
  momoLogoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
