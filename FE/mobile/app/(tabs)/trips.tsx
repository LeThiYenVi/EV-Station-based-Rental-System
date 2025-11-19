import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  StyleSheet,
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

export default function TripsScreen() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");

  // Mock active rental
  const activeRental = {
    id: "active_1",
    vehicleType: "Xe Đạp Điện",
    vehicleNumber: "EV-1234",
    startTime: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    startStation: "Trạm Trung Tâm",
    currentCost: 15000,
    batteryLevel: 85,
  };

  // Mock trip history
  const tripHistory = [
    {
      id: "1",
      date: "18 Th11, 2025",
      time: "14:30",
      from: "Trạm Trung Tâm",
      to: "Trung Tâm Park Avenue",
      distance: "3.2 km",
      duration: "25 phút",
      cost: 45000,
      status: "Hoàn thành",
      vehicleType: "Xe Đạp Điện",
    },
    {
      id: "2",
      date: "17 Th11, 2025",
      time: "09:15",
      from: "Khu Công Nghệ",
      to: "Quảng Trường Trung Tâm",
      distance: "2.1 km",
      duration: "18 phút",
      cost: 32000,
      status: "Hoàn thành",
      vehicleType: "Xe Scooter",
    },
    {
      id: "3",
      date: "16 Th11, 2025",
      time: "16:45",
      from: "Bến Xe Miền Đông",
      to: "Trạm Ga Trung Tâm",
      distance: "4.8 km",
      duration: "32 phút",
      cost: 58000,
      status: "Hoàn thành",
      vehicleType: "Xe Đạp Điện",
    },
  ];

  // Calculate elapsed time for active rental
  const getElapsedTime = () => {
    const now = new Date();
    const diff = now.getTime() - activeRental.startTime.getTime();
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
                  {activeRental.vehicleType}
                </Text>
                <Text style={styles.vehicleNumber}>
                  {activeRental.vehicleNumber}
                </Text>
              </View>

              {/* Time & Cost */}
              <View style={styles.activeStats}>
                <View style={styles.activeStat}>
                  <Clock size={20} color="#6b7280" />
                  <Text style={styles.activeStatLabel}>Thời Gian</Text>
                  <Text style={styles.activeStatValue}>{getElapsedTime()}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.activeStat}>
                  <DollarSign size={20} color="#6b7280" />
                  <Text style={styles.activeStatLabel}>Chi Phí Hiện Tại</Text>
                  <Text style={styles.activeStatValue}>
                    {activeRental.currentCost.toLocaleString("vi-VN")}đ
                  </Text>
                </View>
              </View>

              {/* Location */}
              <InfoRow
                icon={Navigation}
                label="Điểm Xuất Phát:"
                value={activeRental.startStation}
              />

              {/* Battery */}
              <View style={styles.batterySection}>
                <Text style={styles.batteryLabel}>Pin Còn Lại</Text>
                <View style={styles.batteryBar}>
                  <View
                    style={[
                      styles.batteryFill,
                      { width: `${activeRental.batteryLevel}%` },
                    ]}
                  />
                </View>
                <Text style={styles.batteryPercent}>
                  {activeRental.batteryLevel}%
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
        ) : (
          // Trip History Section
          tripHistory.map((trip) => (
            <Card key={trip.id}>
              {/* Trip Header */}
              <View style={styles.tripHeader}>
                <View style={styles.tripHeaderLeft}>
                  <Text style={styles.tripVehicleType}>{trip.vehicleType}</Text>
                  <View style={styles.tripDateTime}>
                    <Calendar size={14} color="#9ca3af" />
                    <Text style={styles.tripDate}>{trip.date}</Text>
                    <Text style={styles.tripTime}>{trip.time}</Text>
                  </View>
                </View>
                <View style={styles.tripCostContainer}>
                  <Text style={styles.tripCost}>
                    {trip.cost.toLocaleString("vi-VN")}đ
                  </Text>
                </View>
              </View>

              {/* Route */}
              <View style={styles.routeContainer}>
                <View style={styles.routePoint}>
                  <View style={styles.routeDotStart} />
                  <Text style={styles.routeLocation}>{trip.from}</Text>
                </View>
                <View style={styles.routeLine} />
                <View style={styles.routePoint}>
                  <View style={styles.routeDotEnd} />
                  <Text style={styles.routeLocation}>{trip.to}</Text>
                </View>
              </View>

              {/* Trip Stats */}
              <View style={styles.tripStats}>
                <View style={styles.tripStatItem}>
                  <MapPin size={14} color="#6b7280" />
                  <Text style={styles.tripStatText}>{trip.distance}</Text>
                </View>
                <Text style={styles.statSeparator}>•</Text>
                <View style={styles.tripStatItem}>
                  <Clock size={14} color="#6b7280" />
                  <Text style={styles.tripStatText}>{trip.duration}</Text>
                </View>
                <Text style={styles.statSeparator}>•</Text>
                <Badge variant="success" text={trip.status} />
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
