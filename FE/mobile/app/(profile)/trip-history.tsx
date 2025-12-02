import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Calendar, MapPin, Clock, DollarSign } from "lucide-react-native";
import { bookingService } from "@/services";
import { BookingResponse } from "@/types";
import Toast from "react-native-toast-message";
import { EmptyState } from "@/components/common";

export default function TripHistoryScreen() {
  const [filter, setFilter] = useState<"all" | "completed" | "cancelled">(
    "all"
  );
  const [trips, setTrips] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

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
        text2:
          error.response?.data?.message || "Không thể tải lịch sử chuyến đi",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTrips = trips.filter((trip) => {
    if (filter === "all") return true;
    return trip.status.toLowerCase() === filter;
  });

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

  const getStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return "Hoàn Thành";
      case "CANCELLED":
        return "Đã Hủy";
      case "PENDING":
        return "Chờ Xác Nhận";
      case "CONFIRMED":
        return "Đã Xác Nhận";
      case "IN_PROGRESS":
        return "Đang Diễn Ra";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Đang tải lịch sử...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <Pressable
          style={[styles.filterButton, filter === "all" && styles.filterActive]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "all" && styles.filterTextActive,
            ]}
          >
            Tất Cả ({trips.length})
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.filterButton,
            filter === "completed" && styles.filterActive,
          ]}
          onPress={() => setFilter("completed")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "completed" && styles.filterTextActive,
            ]}
          >
            Hoàn Thành (
            {trips.filter((t) => t.status.toUpperCase() === "COMPLETED").length}
            )
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.filterButton,
            filter === "cancelled" && styles.filterActive,
          ]}
          onPress={() => setFilter("cancelled")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "cancelled" && styles.filterTextActive,
            ]}
          >
            Đã Hủy (
            {trips.filter((t) => t.status.toUpperCase() === "CANCELLED").length}
            )
          </Text>
        </Pressable>
      </View>

      {filteredTrips.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="Chưa Có Chuyến Đi"
          description={
            filter === "all"
              ? "Bạn chưa có chuyến đi nào. Hãy đặt xe để bắt đầu!"
              : `Không có chuyến đi ${
                  filter === "completed" ? "hoàn thành" : "đã hủy"
                }`
          }
        />
      ) : (
        <ScrollView style={styles.scrollView}>
          {filteredTrips.map((trip) => (
            <Pressable
              key={trip.id}
              style={({ pressed }) => [
                styles.tripCard,
                pressed && styles.tripCardPressed,
              ]}
            >
              {/* Header */}
              <View style={styles.tripHeader}>
                <View style={styles.tripHeaderLeft}>
                  <Text style={styles.vehicleType}>{trip.vehicleName}</Text>
                  <View style={styles.dateTimeRow}>
                    <Calendar size={14} color="#9ca3af" />
                    <Text style={styles.dateTime}>
                      {formatDate(trip.startTime)} •{" "}
                      {formatTime(trip.startTime)}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    trip.status.toUpperCase() === "CANCELLED" &&
                      styles.statusCancelled,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {getStatusLabel(trip.status)}
                  </Text>
                </View>
              </View>

              {/* Route */}
              <View style={styles.routeContainer}>
                <View style={styles.routePoint}>
                  <View style={styles.dotStart} />
                  <Text style={styles.routeText}>{trip.stationName}</Text>
                </View>
                <View style={styles.routeLine} />
                <View style={styles.routePoint}>
                  <View style={styles.dotEnd} />
                  <Text style={styles.routeText}>{trip.stationName}</Text>
                </View>
              </View>

              {/* Stats */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Clock size={16} color="#6b7280" />
                  <Text style={styles.statText}>
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
                <View style={styles.statItem}>
                  <DollarSign size={16} color="#10b981" />
                  <Text style={styles.costText}>
                    {trip.totalAmount.toLocaleString("vi-VN")}đ
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
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
    backgroundColor: "#f9fafb",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6b7280",
  },
  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  filterActive: {
    backgroundColor: "#10b981",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
  },
  filterTextActive: {
    color: "#ffffff",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  tripCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  tripCardPressed: {
    backgroundColor: "#f9fafb",
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  tripHeaderLeft: {
    flex: 1,
  },
  vehicleType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateTime: {
    fontSize: 13,
    color: "#6b7280",
  },
  statusBadge: {
    backgroundColor: "#d1fae5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusCancelled: {
    backgroundColor: "#fee2e2",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#065f46",
  },
  routeContainer: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dotStart: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#10b981",
  },
  dotEnd: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ef4444",
  },
  routeText: {
    fontSize: 14,
    color: "#374151",
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: "#d1d5db",
    marginLeft: 4,
    marginVertical: 4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: "#6b7280",
  },
  costText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10b981",
  },
});
