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
} from "@/components/common";
import { bookingService } from "@/services";
import { BookingResponse } from "@/types";
import Toast from "react-native-toast-message";

export default function TripsScreen() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [trips, setTrips] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTrips();
    }
  }, [isAuthenticated]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getMyBookings();
      setTrips(response.data || []);
    } catch (error: any) {
      console.error("Failed to fetch trips:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: error.response?.data?.message || "Không thể tải chuyến đi",
      });
    } finally {
      setLoading(false);
    }
  };

  const activeRental = trips.find(
    (t) =>
      t.status.toUpperCase() === "IN_PROGRESS" ||
      t.status.toUpperCase() === "CONFIRMED"
  );

  const tripHistory = trips.filter(
    (t) =>
      t.status.toUpperCase() === "COMPLETED" ||
      t.status.toUpperCase() === "CANCELLED"
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

  // Calculate elapsed time for active rental
  const getElapsedTime = (startTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = now.getTime() - start.getTime();
    const minutes = Math.floor(diff / 60000);
    return `${minutes} phút`;
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chuyến Đi Của Tôi</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Đang tải chuyến đi...</Text>
        </View>
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
          { id: "active", label: "Đang Thuê", count: activeRental ? 1 : 0 },
          { id: "history", label: "Lịch Sử", count: tripHistory.length },
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as "active" | "history")}
      />

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === "active" ? (
          // Active Rental Section
          activeRental ? (
            <Card padding={20}>
              {/* Active Rental Header */}
              <View style={styles.activeHeader}>
                <View style={styles.activeHeaderLeft}>
                  <Zap size={24} color="#10b981" />
                  <Text style={styles.activeTitle}>
                    Chuyến Đi Đang Hoạt Động
                  </Text>
                </View>
                <Badge variant="success" text="ĐANG CHẠY" />
              </View>

              {/* Vehicle Info */}
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleType}>
                  {activeRental.vehicleName}
                </Text>
                <Text style={styles.vehicleNumber}>
                  Mã: {activeRental.bookingCode} • {activeRental.licensePlate}
                </Text>
              </View>

              {/* Time & Cost */}
              <View style={styles.activeStats}>
                <View style={styles.activeStat}>
                  <Clock size={20} color="#6b7280" />
                  <Text style={styles.activeStatLabel}>Thời Gian</Text>
                  <Text style={styles.activeStatValue}>
                    {getElapsedTime(activeRental.startTime)}
                  </Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.activeStat}>
                  <DollarSign size={20} color="#6b7280" />
                  <Text style={styles.activeStatLabel}>Chi Phí Hiện Tại</Text>
                  <Text style={styles.activeStatValue}>
                    {activeRental.totalAmount.toLocaleString("vi-VN")}đ
                  </Text>
                </View>
              </View>

              {/* Location */}
              <InfoRow
                icon={Navigation}
                label="Điểm Xuất Phát:"
                value={activeRental.stationName}
              />

              {/* Battery */}
              <View style={styles.batterySection}>
                <Text style={styles.batteryLabel}>Thời Gian Dự Kiến</Text>
                <Text style={styles.batteryPercent}>
                  Bắt đầu: {formatTime(activeRental.startTime)}
                </Text>
                <Text style={styles.batteryPercent}>
                  Kết thúc: {formatTime(activeRental.expectedEndTime)}
                </Text>
              </View>

              {/* End Trip Button */}
              <Button
                title="Kết Thúc Chuyến Đi"
                onPress={() => {}}
                variant="danger"
              />
            </Card>
          ) : (
            <EmptyState
              icon={Zap}
              title="Không Có Chuyến Đi Nào"
              description="Bạn chưa có chuyến đi nào đang hoạt động"
            />
          )
        ) : // Trip History Section
        tripHistory.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="Chưa Có Lịch Sử"
            description="Bạn chưa hoàn thành chuyến đi nào"
          />
        ) : (
          tripHistory.map((trip) => (
            <Card key={trip.id}>
              {/* Trip Header */}
              <View style={styles.tripHeader}>
                <View style={styles.tripHeaderLeft}>
                  <Text style={styles.tripVehicleType}>{trip.vehicleName}</Text>
                  <View style={styles.tripDateTime}>
                    <Calendar size={14} color="#9ca3af" />
                    <Text style={styles.tripDate}>
                      {formatDate(trip.startTime)}
                    </Text>
                    <Text style={styles.tripTime}>
                      {formatTime(trip.startTime)}
                    </Text>
                  </View>
                </View>
                <View style={styles.tripCostContainer}>
                  <Text style={styles.tripCost}>
                    {trip.totalAmount.toLocaleString("vi-VN")}đ
                  </Text>
                </View>
              </View>

              {/* Route */}
              <View style={styles.routeContainer}>
                <View style={styles.routePoint}>
                  <View style={styles.routeDotStart} />
                  <Text style={styles.routeLocation}>{trip.stationName}</Text>
                </View>
                <View style={styles.routeLine} />
                <View style={styles.routePoint}>
                  <View style={styles.routeDotEnd} />
                  <Text style={styles.routeLocation}>{trip.stationName}</Text>
                </View>
              </View>

              {/* Trip Stats */}
              <View style={styles.tripStats}>
                <View style={styles.tripStatItem}>
                  <Clock size={14} color="#6b7280" />
                  <Text style={styles.tripStatText}>
                    {Math.ceil(
                      (new Date(
                        trip.actualEndTime || trip.expectedEndTime
                      ).getTime() -
                        new Date(trip.startTime).getTime()) /
                        (1000 * 60)
                    )}{" "}
                    phút
                  </Text>
                </View>
                <Text style={styles.statSeparator}>•</Text>
                <Badge
                  variant={
                    trip.status.toUpperCase() === "COMPLETED"
                      ? "success"
                      : "danger"
                  }
                  text={
                    trip.status.toUpperCase() === "COMPLETED"
                      ? "Hoàn thành"
                      : "Đã hủy"
                  }
                />
              </View>
            </Card>
          ))
        )}
      </ScrollView>
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
  activeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  activeHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  activeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  vehicleInfo: {
    marginBottom: 20,
  },
  vehicleType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  vehicleNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  activeStats: {
    flexDirection: "row",
    marginBottom: 20,
  },
  activeStat: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 12,
  },
  activeStatLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  activeStatValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  locationSection: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  locationLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  locationValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  batterySection: {
    marginBottom: 20,
  },
  batteryLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  batteryBar: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 6,
  },
  batteryFill: {
    height: "100%",
    backgroundColor: "#10b981",
  },
  batteryPercent: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "right",
  },
  // Trip History Card
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  tripHeaderLeft: {
    flex: 1,
  },
  tripVehicleType: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  tripDateTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tripDate: {
    fontSize: 13,
    color: "#6b7280",
  },
  tripTime: {
    fontSize: 13,
    color: "#9ca3af",
  },
  tripCostContainer: {
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tripCost: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#10b981",
  },
  // Route Visualization
  routeContainer: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  routeDotStart: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#10b981",
  },
  routeDotEnd: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ef4444",
  },
  routeLocation: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: "#d1d5db",
    marginLeft: 4,
    marginVertical: 4,
  },
  // Trip Stats
  tripStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tripStatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  tripStatText: {
    fontSize: 13,
    color: "#6b7280",
  },
  statSeparator: {
    color: "#d1d5db",
    fontSize: 12,
  },
});
