import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import {
  Clipboard,
  Calendar,
  DollarSign,
  Clock,
  MapPin,
  Navigation,
  Zap,
} from "lucide-react-native";
import {
  EmptyState,
  Button,
  Tabs,
  Card,
  Badge,
  InfoRow,
  TripCard,
} from "@/components/common";
import { api } from "@/services/api";
import { BookingResponse } from "@/types";
import Toast from "react-native-toast-message";

export default function TripsScreen() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && token) {
      fetchBookings();
    } else {
      setIsLoading(false);
    }
  }, [user, token]);

  const fetchBookings = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      const response = await api.getMyBookings(token);
      console.log("📦 API Response:", response);

      // API returns: { statusCode: 200, message: null, data: [...] }
      const bookingsData =
        (response as any)?.data?.data || (response as any)?.data || [];

      console.log("✅ Bookings loaded:", bookingsData.length);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (error: any) {
      console.error("❌ Fetch bookings error:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: error.message || "Không thể tải danh sách chuyến đi",
      });
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const activeBookings = bookings.filter((b) =>
    ["ACTIVE", "RESERVED", "PENDING"].includes(b.status)
  );
  const completedBookings = bookings.filter((b) =>
    ["COMPLETED", "CANCELLED"].includes(b.status)
  );

  console.log("🔍 Total bookings:", bookings.length);
  console.log(
    "🔍 Active bookings:",
    activeBookings.length,
    activeBookings.map((b) => b.status)
  );
  console.log(
    "🔍 Completed bookings:",
    completedBookings.length,
    completedBookings.map((b) => b.status)
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "short",
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return { variant: "success" as const, text: "Hoàn thành" };
      case "ACTIVE":
        return { variant: "success" as const, text: "Đang thuê" };
      case "RESERVED":
      case "PENDING":
        return { variant: "warning" as const, text: "Chờ xử lý" };
      case "CANCELLED":
        return { variant: "danger" as const, text: "Đã hủy" };
      default:
        return { variant: "default" as const, text: status };
    }
  };

  const calculateDuration = (start?: string | null, end?: string | null) => {
    if (!start) return "N/A";
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const diff = endDate.getTime() - startDate.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} phút`;
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!token) return;

    try {
      await api.cancelBooking(bookingId, token);
      Toast.show({
        type: "success",
        text1: "Đã hủy chuyến đi",
        text2: "Chuyến đi của bạn đã được hủy thành công",
      });
      fetchBookings(); // Reload bookings
    } catch (error: any) {
      console.error("❌ Cancel booking error:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: error.message || "Không thể hủy chuyến đi",
      });
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chuyến Đi</Text>
        </View>
        <EmptyState
          icon={Clipboard}
          title="Chưa có chuyến đi"
          description="Đăng nhập để xem lịch sử thuê xe và theo dõi các chuyến đi của bạn"
          actionText="Đăng nhập ngay"
          onActionPress={() => router.push("/(tabs)/profile")}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chuyến Đi Của Tôi</Text>
      </View>

      {/* Tab Selector */}
      <Tabs
        tabs={[
          { id: "active", label: "Đang Thuê", count: activeBookings.length },
          { id: "history", label: "Lịch Sử", count: completedBookings.length },
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as "active" | "history")}
      />

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {activeTab === "active" ? (
            activeBookings.length > 0 ? (
              activeBookings.map((booking) => (
                <TripCard
                  key={booking.id}
                  vehicleName={booking.vehicle?.name || "Vehicle"}
                  date={formatDate(booking.createdAt)}
                  time={formatTime(booking.createdAt)}
                  stationName={booking.station?.name || "Station"}
                  duration={calculateDuration(
                    booking.startTime,
                    booking.actualEndTime
                  )}
                  cost={booking.totalAmount}
                  status={booking.status as any}
                  onPress={() => {
                    router.push(`/trip-detail/${booking.id}`);
                  }}
                  onCancel={() => handleCancelBooking(booking.id)}
                  showCancelButton={
                    booking.status === "RESERVED" ||
                    booking.status === "PENDING"
                  }
                />
              ))
            ) : (
              <EmptyState
                icon={Zap}
                title="Không Có Chuyến Đi"
                description="Bạn chưa có chuyến đi nào đang hoạt động"
              />
            )
          ) : completedBookings.length > 0 ? (
            completedBookings.map((booking) => (
              <TripCard
                key={booking.id}
                vehicleName={booking.vehicle?.name || "Vehicle"}
                date={formatDate(booking.createdAt)}
                time={formatTime(booking.createdAt)}
                stationName={booking.station?.name || "Station"}
                duration={calculateDuration(
                  booking.startTime,
                  booking.actualEndTime
                )}
                cost={booking.totalAmount}
                status={booking.status as any}
                onPress={() => {
                  router.push(`/trip-detail/${booking.id}`);
                }}
                showCancelButton={false}
              />
            ))
          ) : (
            <EmptyState
              icon={Clipboard}
              title="Chưa có lịch sử"
              description="Bạn chưa có chuyến đi nào đã hoàn thành"
            />
          )}
        </ScrollView>
      )}
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
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6b7280",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
});
