import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Alert,
  Animated,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, AlertCircle } from "lucide-react-native";
import { api } from "@/services/api";
import { BookingResponse } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import Toast from "react-native-toast-message";

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { token } = useAuth();

  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    fetchBookingDetail();
  }, [id]);

  useEffect(() => {
    if (!isLoading && booking) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isLoading, booking]);

  const fetchBookingDetail = async () => {
    if (!token || !id) return;

    try {
      setIsLoading(true);
      const response = await api.getBookingById(id, token);
      console.log("📦 Booking Detail:", response);

      const bookingData = (response as any)?.data || response;
      setBooking(bookingData);
    } catch (error: any) {
      console.error("❌ Fetch booking detail error:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: error.message || "Không thể tải chi tiết chuyến đi",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!token || !id) return;

    Alert.alert("Xác nhận hủy", "Bạn có chắc chắn muốn hủy chuyến đi này?", [
      { text: "Không", style: "cancel" },
      {
        text: "Hủy chuyến đi",
        style: "destructive",
        onPress: async () => {
          try {
            setIsCancelling(true);
            await api.cancelBooking(id, token);
            Toast.show({
              type: "success",
              text1: "Thành công",
              text2: "Đã hủy chuyến đi",
            });
            router.back();
          } catch (error: any) {
            Toast.show({
              type: "error",
              text1: "Lỗi",
              text2: error.message || "Không thể hủy chuyến đi",
            });
          } finally {
            setIsCancelling(false);
          }
        },
      },
    ]);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return {
          bg: "#ecfdf5",
          text: "#059669",
          label: "Đang hoạt động",
          gradient: ["#d1fae5", "#a7f3d0"],
        };
      case "PENDING":
        return {
          bg: "#fef9c3",
          text: "#ca8a04",
          label: "Chờ xử lý",
          gradient: ["#fef3c7", "#fde68a"],
        };
      case "RESERVED":
        return {
          bg: "#dbeafe",
          text: "#2563eb",
          label: "Đã đặt",
          gradient: ["#dbeafe", "#bfdbfe"],
        };
      case "COMPLETED":
        return {
          bg: "#ecfdf5",
          text: "#059669",
          label: "Hoàn thành",
          gradient: ["#d1fae5", "#a7f3d0"],
        };
      case "CANCELLED":
        return {
          bg: "#fee2e2",
          text: "#dc2626",
          label: "Đã hủy",
          gradient: ["#fee2e2", "#fecaca"],
        };
      default:
        return {
          bg: "#f5f5f4",
          text: "#78716c",
          label: status,
          gradient: ["#f5f5f4", "#e7e5e4"],
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateTime = (dateString: string) => {
    return `${formatDate(dateString)} lúc ${formatTime(dateString)}`;
  };

  const calculateDuration = (start?: string | null, end?: string | null) => {
    if (!start) return "N/A";

    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const diff = endDate.getTime() - startDate.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);

    if (hours > 0) {
      return `${hours} giờ ${minutes} phút`;
    }
    return `${minutes} phút`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!booking) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <View style={styles.errorIconContainer}>
            <AlertCircle size={56} color="#ef4444" strokeWidth={1.5} />
          </View>
          <Text style={styles.errorTitle}>Không tìm thấy chuyến đi</Text>
          <Text style={styles.errorDescription}>
            Chuyến đi này không tồn tại hoặc đã bị xóa
          </Text>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.errorButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.errorButtonText}>Quay lại</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const statusConfig = getStatusConfig(booking.status);
  const canCancel =
    booking.status === "RESERVED" || booking.status === "PENDING";

  return (
    <SafeAreaView style={styles.container}>
      {/* Modern Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
        >
          <ArrowLeft size={24} color="#1c1917" strokeWidth={2} />
        </Pressable>
        <Text style={styles.headerTitle}>Chi tiết chuyến đi</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Hero Card - Status & Total */}
          <View style={styles.heroCard}>
            <View style={styles.heroTop}>
              <View style={styles.bookingCodeSection}>
                <Text style={styles.label}>Mã đặt xe</Text>
                <Text style={styles.bookingCode}>{booking.bookingCode}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusConfig.bg },
                ]}
              >
                <Text style={[styles.statusText, { color: statusConfig.text }]}>
                  {statusConfig.label}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalSection}>
              <Text style={styles.label}>Tổng chi phí</Text>
              <Text style={styles.totalAmount}>
                {booking.totalAmount.toLocaleString("vi-VN")}đ
              </Text>
            </View>
          </View>

          {/* Vehicle Info Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Thông tin xe</Text>
            <View style={styles.cardContent}>
              <DetailRow label="Tên xe" value={booking.vehicle.name} />
              <DetailRow label="Biển số" value={booking.vehicle.licensePlate} />
              <DetailRow label="Hãng xe" value={booking.vehicle.brand} />
              <DetailRow label="Màu sắc" value={booking.vehicle.color} />
              <DetailRow
                label="Loại nhiên liệu"
                value={
                  booking.vehicle.fuelType === "GASOLINE" ? "Xăng" : "Điện"
                }
              />
              <DetailRow
                label="Đánh giá"
                value={`${booking.vehicle.rating} ⭐`}
                highlight
              />
            </View>
          </View>

          {/* Station Info Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Thông tin trạm</Text>
            <View style={styles.cardContent}>
              <DetailRow label="Tên trạm" value={booking.station.name} />
              <DetailRow label="Địa chỉ" value={booking.station.address} />
              <DetailRow label="Hotline" value={booking.station.hotline} />
              <DetailRow
                label="Giờ hoạt động"
                value={`${formatTime(booking.station.startTime)} - ${formatTime(
                  booking.station.endTime
                )}`}
              />
            </View>
          </View>

          {/* Time Info Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Thời gian</Text>
            <View style={styles.cardContent}>
              <DetailRow
                label="Thời gian đặt"
                value={formatDateTime(booking.createdAt)}
              />
              <DetailRow
                label="Bắt đầu"
                value={formatDateTime(booking.startTime)}
              />
              <DetailRow
                label="Dự kiến kết thúc"
                value={formatDateTime(booking.expectedEndTime)}
              />
              {booking.actualEndTime && (
                <DetailRow
                  label="Kết thúc thực tế"
                  value={formatDateTime(booking.actualEndTime)}
                />
              )}
              <DetailRow
                label="Thời lượng"
                value={calculateDuration(
                  booking.startTime,
                  booking.actualEndTime
                )}
                highlight
              />
            </View>
          </View>

          {/* Payment Info Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Chi tiết thanh toán</Text>
            <View style={styles.cardContent}>
              <DetailRow
                label="Giá cơ bản"
                value={`${booking.basePrice.toLocaleString("vi-VN")}đ`}
              />
              <DetailRow
                label="Đặt cọc"
                value={`${booking.depositPaid.toLocaleString("vi-VN")}đ`}
              />
              {booking.extraFee && booking.extraFee > 0 && (
                <DetailRow
                  label="Phụ phí"
                  value={`${booking.extraFee.toLocaleString("vi-VN")}đ`}
                />
              )}
              <DetailRow
                label="Thời lượng thuê"
                value={`${booking.durationHours} giờ`}
              />
              <View style={styles.paymentDivider} />
              <DetailRow
                label="Trạng thái thanh toán"
                value={
                  booking.paymentStatus === "PAID"
                    ? "Đã thanh toán"
                    : booking.paymentStatus === "PENDING"
                    ? "Chờ thanh toán"
                    : "Chưa thanh toán"
                }
                valueColor={
                  booking.paymentStatus === "PAID" ? "#059669" : "#f59e0b"
                }
                highlight
              />
            </View>
          </View>

          {/* Renter Info Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Thông tin người thuê</Text>
            <View style={styles.cardContent}>
              <DetailRow label="Họ tên" value={booking.renter.fullName} />
              <DetailRow label="Email" value={booking.renter.email} />
              <DetailRow label="Số điện thoại" value={booking.renter.phone} />
              {booking.renter.licenseNumber && (
                <DetailRow
                  label="Số GPLX"
                  value={booking.renter.licenseNumber}
                />
              )}
              <DetailRow
                label="Trạng thái GPLX"
                value={
                  booking.renter.isLicenseVerified
                    ? "Đã xác minh"
                    : "Chưa xác minh"
                }
                valueColor={
                  booking.renter.isLicenseVerified ? "#059669" : "#f59e0b"
                }
              />
            </View>
          </View>

          {/* Notes Card */}
          {(booking.pickupNote || booking.returnNote) && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Ghi chú</Text>
              <View style={styles.cardContent}>
                {booking.pickupNote && (
                  <View style={styles.noteItem}>
                    <Text style={styles.noteLabel}>Ghi chú khi nhận xe</Text>
                    <Text style={styles.noteValue}>{booking.pickupNote}</Text>
                  </View>
                )}
                {booking.returnNote && (
                  <View
                    style={[
                      styles.noteItem,
                      booking.pickupNote && { marginTop: 16 },
                    ]}
                  >
                    <Text style={styles.noteLabel}>Ghi chú khi trả xe</Text>
                    <Text style={styles.noteValue}>{booking.returnNote}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Staff Info Card */}
          {(booking.checkedOutBy || booking.checkedInBy) && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Nhân viên xử lý</Text>
              <View style={styles.cardContent}>
                {booking.checkedOutBy && (
                  <>
                    <DetailRow
                      label="Check-out bởi"
                      value={booking.checkedOutBy.fullName}
                    />
                    <DetailRow
                      label="Email"
                      value={booking.checkedOutBy.email}
                    />
                  </>
                )}
                {booking.checkedInBy && (
                  <>
                    <DetailRow
                      label="Check-in bởi"
                      value={booking.checkedInBy.fullName}
                    />
                    <DetailRow
                      label="Email"
                      value={booking.checkedInBy.email}
                    />
                  </>
                )}
              </View>
            </View>
          )}

          {/* Cancel Button */}
          {canCancel && (
            <Pressable
              onPress={handleCancelBooking}
              disabled={isCancelling}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.cancelButtonPressed,
                isCancelling && styles.cancelButtonDisabled,
              ]}
            >
              {isCancelling ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.cancelButtonText}>Hủy chuyến đi</Text>
              )}
            </Pressable>
          )}

          <View style={{ height: 24 }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper Component - Modern Detail Row
interface DetailRowProps {
  label: string;
  value: string;
  valueColor?: string;
  highlight?: boolean;
}

function DetailRow({ label, value, valueColor, highlight }: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, highlight && styles.detailLabelBold]}>
        {label}
      </Text>
      <Text
        style={[
          styles.detailValue,
          highlight && styles.detailValueBold,
          valueColor && { color: valueColor },
        ]}
        numberOfLines={3}
      >
        {value}
      </Text>
    </View>
  );
}

// Styles - Modern & Elegant
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafaf9",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e7e5e4",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#f5f5f4",
  },
  backButtonPressed: {
    backgroundColor: "#e7e5e4",
    transform: [{ scale: 0.95 }],
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1c1917",
    letterSpacing: -0.3,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  content: {
    padding: 20,
    gap: 16,
  },

  // Hero Card
  heroCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  bookingCodeSection: {
    flex: 1,
    marginRight: 16,
  },
  bookingCode: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1c1917",
    marginTop: 4,
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  divider: {
    height: 1,
    backgroundColor: "#e7e5e4",
    marginVertical: 20,
  },
  totalSection: {
    alignItems: "flex-start",
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: "700",
    color: "#059669",
    marginTop: 4,
    letterSpacing: -0.5,
  },

  // Card
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1c1917",
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  cardContent: {
    gap: 12,
  },

  // Detail Row
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  detailLabel: {
    flex: 1,
    fontSize: 13,
    color: "#78716c",
    lineHeight: 20,
  },
  detailLabelBold: {
    fontWeight: "600",
    color: "#57534e",
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#292524",
    textAlign: "right",
    lineHeight: 20,
  },
  detailValueBold: {
    fontWeight: "700",
    fontSize: 15,
  },

  // Payment Divider
  paymentDivider: {
    height: 1,
    backgroundColor: "#e7e5e4",
    marginVertical: 8,
  },

  // Note Item
  noteItem: {
    gap: 8,
  },
  noteLabel: {
    fontSize: 12,
    color: "#78716c",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  noteValue: {
    fontSize: 14,
    color: "#292524",
    lineHeight: 22,
  },

  // Cancel Button
  cancelButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  cancelButtonPressed: {
    backgroundColor: "#dc2626",
    transform: [{ scale: 0.98 }],
  },
  cancelButtonDisabled: {
    opacity: 0.5,
  },
  cancelButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: "#78716c",
    fontWeight: "500",
  },

  // Error
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  errorIconContainer: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fee2e2",
    borderRadius: 48,
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1c1917",
    marginBottom: 8,
    textAlign: "center",
  },
  errorDescription: {
    fontSize: 15,
    color: "#78716c",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  errorButton: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  errorButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },

  // Label (reusable)
  label: {
    fontSize: 12,
    color: "#78716c",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
