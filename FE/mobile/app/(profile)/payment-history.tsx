import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { ChevronRight, Calendar, CreditCard } from "lucide-react-native";
import { Card, EmptyState } from "@/components/common";
import { bookingService } from "@/services";
import { BookingResponse, PaymentStatus } from "@/types";
import Toast from "react-native-toast-message";

export default function PaymentHistoryScreen() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      // Axios interceptor unwraps ApiResponse<T> to T
      const data =
        (await bookingService.getMyBookings()) as any as BookingResponse[];

      // Filter only completed/cancelled bookings that have payment
      const paidBookings = data.filter(
        (booking: BookingResponse) =>
          booking.status === "COMPLETED" || booking.status === "CANCELLED"
      );

      setBookings(paidBookings);
    } catch (error) {
      console.error("Failed to fetch payment history:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể tải lịch sử thanh toán",
      });
    } finally {
      setLoading(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "#10b981";
      case "CANCELLED":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Hoàn Thành";
      case "CANCELLED":
        return "Đã Hủy";
      default:
        return status;
    }
  };

  const renderPaymentItem = (booking: BookingResponse) => (
    <Pressable
      key={booking.id}
      style={styles.paymentItem}
      onPress={() => {
        // Navigate to booking detail or payment detail
        Toast.show({
          type: "info",
          text1: "Chi Tiết Thanh Toán",
          text2: `Booking ID: ${booking.id}`,
        });
      }}
    >
      <View style={styles.paymentHeader}>
        <View style={styles.paymentIconContainer}>
          <CreditCard size={24} color="#10b981" />
        </View>
        <View style={styles.paymentInfo}>
          <Text style={styles.vehicleName}>
            {booking.vehicleName || "Xe điện"}
          </Text>
          <Text style={styles.bookingCode}>{booking.bookingCode}</Text>
        </View>
        <ChevronRight size={20} color="#9ca3af" />
      </View>

      <View style={styles.paymentDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Calendar size={14} color="#6b7280" />
            <Text style={styles.detailText}>
              {formatDate(booking.startTime)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailText}>
              {formatTime(booking.startTime)}
            </Text>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${getStatusColor(booking.status)}15` },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(booking.status) },
              ]}
            >
              {getStatusText(booking.status)}
            </Text>
          </View>
          <Text style={styles.amountText}>
            {booking.totalAmount?.toLocaleString("vi-VN") || "0"}đ
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: "Lịch Sử Thanh Toán",
          headerShown: true,
        }}
      />

      <ScrollView style={styles.scrollView}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#10b981" />
            <Text style={styles.loadingText}>Đang tải...</Text>
          </View>
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="Chưa Có Thanh Toán"
            description="Bạn chưa có giao dịch thanh toán nào"
          />
        ) : (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>
              Tất Cả Giao Dịch ({bookings.length})
            </Text>
            {bookings.map((booking) => renderPaymentItem(booking))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6b7280",
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  paymentItem: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  paymentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  paymentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#d1fae5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  bookingCode: {
    fontSize: 13,
    color: "#6b7280",
  },
  paymentDetails: {
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: "#6b7280",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  amountText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#10b981",
  },
});
