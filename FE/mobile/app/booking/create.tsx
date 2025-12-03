import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  StyleSheet,
  Switch,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Zap,
  MapPin,
  CreditCard,
  AlertCircle,
  CheckCircle,
  ChevronRight,
} from "lucide-react-native";
import { Button } from "@/components/common";
import Toast from "react-native-toast-message";
import { api } from "@/services/api";
import type { ApiResponse } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import type {
  VehicleResponse,
  StationDetailResponse,
  BookingWithPaymentResponse,
} from "@/types";

export default function CreateBookingScreen() {
  const router = useRouter();
  const { user, token } = useAuth();
  const { vehicleId, stationId } = useLocalSearchParams<{
    vehicleId: string;
    stationId: string;
  }>();

  // States - Thuê theo NGÀY
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [startDate, setStartDate] = useState(tomorrow);
  const [pickupHour, setPickupHour] = useState(9); // Giờ nhận xe (9:00 mặc định)
  const [returnHour, setReturnHour] = useState(9); // Giờ trả xe = giờ nhận (auto 24h)
  const [duration, setDuration] = useState(1); // Số ngày thuê
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPickupTimePicker, setShowPickupTimePicker] = useState(false);
  const [showReturnTimePicker, setShowReturnTimePicker] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // API Data
  const [vehicle, setVehicle] = useState<VehicleResponse | null>(null);
  const [station, setStation] = useState<StationDetailResponse | null>(null);

  // Fetch vehicle and station data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        const [vehicleRes, stationRes] = await Promise.all([
          api.getVehicleById(vehicleId as string),
          api.getStationById(stationId as string),
        ]);
        setVehicle(vehicleRes.data as VehicleResponse);
        setStation(stationRes.data as StationDetailResponse);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Không thể tải thông tin xe và trạm",
        });
        router.back();
      } finally {
        setIsLoadingData(false);
      }
    };

    if (vehicleId && stationId) {
      fetchData();
    }
  }, [vehicleId, stationId]);

  // Auto-update return hour when pickup hour or duration changes
  useEffect(() => {
    // Return hour = pickup hour (after 24h * duration)
    setReturnHour(pickupHour);
  }, [pickupHour, duration]);

  // Calculations - Thuê theo NGÀY
  const basePrice = vehicle ? vehicle.dailyRate * duration : 0;
  const deposit = vehicle ? vehicle.depositAmount : 0;
  const serviceFee = basePrice * 0.05;
  const totalAmount = basePrice + serviceFee;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const formatTime = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  const getStartDateTime = () => {
    const dt = new Date(startDate);
    dt.setHours(pickupHour, 0, 0, 0);
    return dt;
  };

  const getEndDateTime = () => {
    const end = new Date(startDate);
    end.setDate(end.getDate() + duration);
    end.setHours(returnHour, 0, 0, 0);
    return end;
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleCreateBooking = async () => {
    if (!acceptTerms) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng đồng ý với điều khoản",
      });
      return;
    }

    if (!user || !token) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng đăng nhập để đặt xe",
      });
      router.push("/(auth)/login");
      return;
    }

    if (!vehicle || !station) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không tìm thấy thông tin xe hoặc trạm",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Format datetime for API (ISO 8601)
      const startDateTime = getStartDateTime().toISOString();
      const endDateTime = getEndDateTime().toISOString();

      const response = (await api.createBooking(
        vehicle.id,
        startDateTime,
        endDateTime,
        `Thuê ${duration} ngày - Nhận ${formatTime(
          pickupHour
        )}, trả ${formatTime(returnHour)}`,
        token,
        stationId as string
      )) as ApiResponse<BookingWithPaymentResponse>;

      if (response.statusCode === 200 || response.statusCode === 201) {
        const booking = response.data;

        Toast.show({
          type: "success",
          text1: "Thành Công",
          text2: `Đặt xe thành công! Mã: ${booking.bookingCode}`,
        });

        // Open MoMo payment URL
        if (booking.momoPayment?.payUrl) {
          const canOpen = await Linking.canOpenURL(booking.momoPayment.payUrl);
          if (canOpen) {
            await Linking.openURL(booking.momoPayment.payUrl);
          }
        }

        // Navigate to trips screen
        setTimeout(() => {
          router.replace("/(tabs)/trips");
        }, 1000);
      } else {
        throw new Error(response.message || "Đặt xe thất bại");
      }
    } catch (error: any) {
      console.error("Booking error:", error);

      // Parse errors from backend
      let errorMessage = "Đặt xe thất bại. Vui lòng thử lại.";
      let errorTitle = "Lỗi Đặt Xe";

      if (error.message) {
        errorMessage = error.message;

        // Special handling for driver's license requirement
        if (
          error.message.includes("driver's license") ||
          error.message.includes("license")
        ) {
          errorTitle = "Yêu Cầu Bằng Lái";
          errorMessage = "Bạn cần upload bằng lái xe (2 mặt) trước khi đặt xe";
        }
        // Check if error contains validation details
        else if (error.message.includes("Validation")) {
          errorTitle = "Thông Tin Không Hợp Lệ";
          errorMessage = "Vui lòng kiểm tra lại thông tin đặt xe";
        }
      }

      Toast.show({
        type: "error",
        text1: errorTitle,
        text2: errorMessage,
        visibilityTime: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Đang tải thông tin...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!vehicle || !station) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Không tìm thấy thông tin</Text>
          <Button title="Quay lại" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Đặt Xe</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Vehicle Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Zap size={20} color="#10b981" />
            <Text style={styles.cardTitle}>Thông Tin Xe</Text>
          </View>
          <View style={styles.vehicleInfo}>
            <View style={styles.vehicleIcon}>
              <Zap size={32} color="#10b981" />
            </View>
            <View style={styles.vehicleDetails}>
              <Text style={styles.vehicleName}>{vehicle.name}</Text>
              <Text style={styles.vehicleType}>
                {vehicle.brand} - {vehicle.fuelType}
              </Text>
              <Text style={styles.licensePlate}>{vehicle.licensePlate}</Text>
              <View style={styles.batteryRow}>
                <Zap size={14} color="#10b981" />
                <Text style={styles.batteryText}>
                  Đánh giá: {vehicle.rating}/5 ⭐
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Station Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MapPin size={20} color="#10b981" />
            <Text style={styles.cardTitle}>Trạm Lấy Xe</Text>
          </View>
          <View style={styles.stationInfo}>
            <Text style={styles.stationName}>{station.name}</Text>
            <Text style={styles.stationAddress}>{station.address}</Text>
          </View>
        </View>

        {/* Pickup Date & Time */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Calendar size={20} color="#10b981" />
            <Text style={styles.cardTitle}>Thời Gian Nhận Xe</Text>
          </View>

          {/* Date Picker */}
          <Pressable
            style={styles.pickerRow}
            onPress={() => setShowDatePicker(!showDatePicker)}
          >
            <View style={styles.pickerLeft}>
              <Calendar size={18} color="#6b7280" />
              <View>
                <Text style={styles.pickerLabel}>Ngày nhận xe</Text>
                <Text style={styles.pickerValue}>{formatDate(startDate)}</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9ca3af" />
          </Pressable>

          {/* Date Picker Dropdown */}
          {showDatePicker && (
            <View style={styles.timePickerContainer}>
              <Text style={styles.timePickerTitle}>Chọn ngày nhận xe</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.timeScroll}
              >
                {Array.from({ length: 14 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() + i + 1); // From tomorrow
                  return date;
                }).map((date, index) => {
                  const isSelected =
                    date.toDateString() === startDate.toDateString();
                  return (
                    <Pressable
                      key={index}
                      style={[
                        styles.dateChip,
                        isSelected && styles.hourChipActive,
                      ]}
                      onPress={() => {
                        setStartDate(date);
                        setShowDatePicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dateText,
                          isSelected && styles.hourTextActive,
                        ]}
                      >
                        {new Intl.DateTimeFormat("vi-VN", {
                          weekday: "short",
                        }).format(date)}
                      </Text>
                      <Text
                        style={[
                          styles.dateDayText,
                          isSelected && styles.hourTextActive,
                        ]}
                      >
                        {date.getDate()}/{date.getMonth() + 1}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Time Picker */}
          <Pressable
            style={styles.pickerRow}
            onPress={() => setShowPickupTimePicker(!showPickupTimePicker)}
          >
            <View style={styles.pickerLeft}>
              <Clock size={18} color="#6b7280" />
              <View>
                <Text style={styles.pickerLabel}>Giờ nhận xe</Text>
                <Text style={styles.pickerValue}>{formatTime(pickupHour)}</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9ca3af" />
          </Pressable>

          {/* Time Picker Dropdown */}
          {showPickupTimePicker && (
            <View style={styles.timePickerContainer}>
              <Text style={styles.timePickerTitle}>Chọn giờ nhận xe</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.timeScroll}
              >
                {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(
                  (hour) => (
                    <Pressable
                      key={hour}
                      style={[
                        styles.hourChip,
                        pickupHour === hour && styles.hourChipActive,
                      ]}
                      onPress={() => {
                        setPickupHour(hour);
                        setShowPickupTimePicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.hourText,
                          pickupHour === hour && styles.hourTextActive,
                        ]}
                      >
                        {formatTime(hour)}
                      </Text>
                    </Pressable>
                  )
                )}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Return Time Picker - Giờ trả xe */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Clock size={20} color="#ef4444" />
            <Text style={styles.cardTitle}>Giờ Trả Xe</Text>
          </View>
          <View style={styles.returnTimeNote}>
            <AlertCircle size={14} color="#10b981" />
            <Text style={styles.returnTimeNoteText}>
              Mặc định trả xe sau {duration} ngày, cùng giờ nhận xe
            </Text>
          </View>
          <Pressable
            style={styles.pickerButton}
            onPress={() => setShowReturnTimePicker(!showReturnTimePicker)}
          >
            <View style={styles.pickerLeft}>
              <View>
                <Text style={styles.pickerLabel}>
                  Giờ trả xe (có thể tuỳ chỉnh)
                </Text>
                <Text style={styles.pickerValue}>{formatTime(returnHour)}</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9ca3af" />
          </Pressable>
          {showReturnTimePicker && (
            <View style={styles.timePickerContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hourPickerScroll}
              >
                {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                  <Pressable
                    key={hour}
                    style={[
                      styles.hourChip,
                      returnHour === hour && styles.hourChipActive,
                    ]}
                    onPress={() => {
                      setReturnHour(hour);
                      setShowReturnTimePicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.hourText,
                        returnHour === hour && styles.hourTextActive,
                      ]}
                    >
                      {formatTime(hour)}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Duration Picker - Số ngày thuê */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Clock size={20} color="#10b981" />
            <Text style={styles.cardTitle}>Số Ngày Thuê</Text>
          </View>
          <View style={styles.durationContainer}>
            {[1, 2, 3, 5, 7, 14, 30].map((days) => (
              <Pressable
                key={days}
                style={[
                  styles.durationChip,
                  duration === days && styles.durationChipActive,
                ]}
                onPress={() => setDuration(days)}
              >
                <Text
                  style={[
                    styles.durationText,
                    duration === days && styles.durationTextActive,
                  ]}
                >
                  {days} ngày
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.durationNote}>
            <AlertCircle size={14} color="#6b7280" />
            <Text style={styles.durationNoteText}>
              Giá: {formatCurrency(vehicle?.dailyRate || 0)}/ngày
            </Text>
          </View>
        </View>

        {/* Time Summary */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Clock size={20} color="#10b981" />
            <Text style={styles.cardTitle}>Tóm Tắt Thời Gian</Text>
          </View>
          <View style={styles.timeSummary}>
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>Nhận xe:</Text>
              <Text style={styles.timeValue}>
                {formatDateTime(getStartDateTime())}
              </Text>
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>Trả xe (dự kiến):</Text>
              <Text style={styles.timeValue}>
                {formatDateTime(getEndDateTime())}
              </Text>
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>Tổng thời gian:</Text>
              <Text style={styles.timeDuration}>{duration} ngày</Text>
            </View>
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <CreditCard size={20} color="#10b981" />
            <Text style={styles.cardTitle}>Chi Tiết Giá</Text>
          </View>
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Giá thuê ({duration} ngày):</Text>
              <Text style={styles.priceValue}>{formatCurrency(basePrice)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Phí dịch vụ (5%):</Text>
              <Text style={styles.priceValue}>
                {formatCurrency(serviceFee)}
              </Text>
            </View>
            <View style={styles.priceDivider} />
            <View style={styles.priceRow}>
              <Text style={styles.priceLabelBold}>Tổng cộng:</Text>
              <Text style={styles.priceTotalValue}>
                {formatCurrency(totalAmount)}
              </Text>
            </View>
            <View style={styles.depositRow}>
              <AlertCircle size={16} color="#f59e0b" />
              <Text style={styles.depositText}>
                Đặt cọc: {formatCurrency(deposit)}
              </Text>
            </View>
          </View>
        </View>

        {/* Terms & Conditions */}
        <View style={styles.termsCard}>
          <View style={styles.termsHeader}>
            <Switch
              value={acceptTerms}
              onValueChange={setAcceptTerms}
              trackColor={{ false: "#d1d5db", true: "#86efac" }}
              thumbColor={acceptTerms ? "#10b981" : "#f3f4f6"}
            />
            <Text style={styles.termsText}>
              Tôi đồng ý với{" "}
              <Text style={styles.termsLink}>Điều khoản & Chính sách</Text>
            </Text>
          </View>
          <View style={styles.termsNote}>
            <CheckCircle size={14} color="#6b7280" />
            <Text style={styles.termsNoteText}>
              Bạn sẽ được hoàn cọc sau khi trả xe
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <View style={styles.bottomLeft}>
          <Text style={styles.bottomLabel}>Tổng thanh toán</Text>
          <Text style={styles.bottomTotal}>
            {formatCurrency(totalAmount + deposit)}
          </Text>
        </View>
        <View style={styles.bottomRight}>
          <Button
            title={isLoading ? "Đang xử lý..." : "Xác Nhận Đặt Xe"}
            onPress={handleCreateBooking}
            isLoading={isLoading}
            disabled={!acceptTerms}
          />
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
    backgroundColor: "#ffffff",
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
  card: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  vehicleInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  vehicleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  vehicleDetails: {
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
    marginBottom: 4,
  },
  batteryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  batteryText: {
    fontSize: 13,
    color: "#10b981",
    fontWeight: "600",
  },
  stationInfo: {
    gap: 4,
  },
  stationName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  stationAddress: {
    fontSize: 14,
    color: "#6b7280",
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  pickerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pickerLabel: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 4,
  },
  pickerValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  hourPickerScroll: {
    paddingVertical: 4,
  },
  timePickerContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  timePickerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  timeScroll: {
    flexDirection: "row",
  },
  hourChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    marginRight: 8,
  },
  hourChipActive: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  hourText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  hourTextActive: {
    color: "#ffffff",
  },
  dateChip: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    marginRight: 8,
    minWidth: 70,
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "capitalize",
  },
  dateDayText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    marginTop: 4,
  },
  durationContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  durationChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  durationChipActive: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  durationText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  durationTextActive: {
    color: "#ffffff",
  },
  durationNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  durationNoteText: {
    fontSize: 13,
    color: "#6b7280",
  },
  returnTimeNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#f0fdf4",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  returnTimeNoteText: {
    fontSize: 13,
    color: "#16a34a",
    flex: 1,
  },
  timeSummary: {
    gap: 12,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  timeValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  timeDuration: {
    fontSize: 14,
    fontWeight: "700",
    color: "#10b981",
  },
  priceBreakdown: {
    gap: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  priceLabelBold: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  priceTotalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#10b981",
  },
  priceDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 4,
  },
  depositRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fffbeb",
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  depositText: {
    fontSize: 14,
    color: "#92400e",
    fontWeight: "600",
  },
  termsCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  termsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
  },
  termsLink: {
    color: "#10b981",
    fontWeight: "600",
  },
  termsNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  termsNoteText: {
    fontSize: 13,
    color: "#6b7280",
  },
  bottomAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    gap: 16,
  },
  bottomLeft: {
    flex: 1,
  },
  bottomLabel: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 4,
  },
  bottomTotal: {
    fontSize: 20,
    fontWeight: "700",
    color: "#10b981",
  },
  bottomRight: {
    flex: 1,
  },
});
