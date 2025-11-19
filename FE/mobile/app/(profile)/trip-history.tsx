import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { Calendar, MapPin, Clock, DollarSign } from "lucide-react-native";

export default function TripHistoryScreen() {
  const [filter, setFilter] = useState<"all" | "completed" | "cancelled">(
    "all"
  );

  const trips = [
    {
      id: "1",
      date: "18 Th11, 2025",
      time: "14:30",
      from: "Trạm Trung Tâm",
      to: "Trung Tâm Park Avenue",
      distance: "3.2 km",
      duration: "25 phút",
      cost: 45000,
      status: "completed",
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
      status: "completed",
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
      status: "completed",
      vehicleType: "Xe Đạp Điện",
    },
    {
      id: "4",
      date: "15 Th11, 2025",
      time: "11:20",
      from: "Công Viên Thành Phố",
      to: "Trung Tâm Thương Mại",
      distance: "1.5 km",
      duration: "12 phút",
      cost: 20000,
      status: "cancelled",
      vehicleType: "Xe Đạp",
    },
  ];

  const filteredTrips = trips.filter((trip) => {
    if (filter === "all") return true;
    return trip.status === filter;
  });

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
            Hoàn Thành ({trips.filter((t) => t.status === "completed").length})
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
            Đã Hủy ({trips.filter((t) => t.status === "cancelled").length})
          </Text>
        </Pressable>
      </View>

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
                <Text style={styles.vehicleType}>{trip.vehicleType}</Text>
                <View style={styles.dateTimeRow}>
                  <Calendar size={14} color="#9ca3af" />
                  <Text style={styles.dateTime}>
                    {trip.date} • {trip.time}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  trip.status === "cancelled" && styles.statusCancelled,
                ]}
              >
                <Text style={styles.statusText}>
                  {trip.status === "completed" ? "Hoàn Thành" : "Đã Hủy"}
                </Text>
              </View>
            </View>

            {/* Route */}
            <View style={styles.routeContainer}>
              <View style={styles.routePoint}>
                <View style={styles.dotStart} />
                <Text style={styles.routeText}>{trip.from}</Text>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.routePoint}>
                <View style={styles.dotEnd} />
                <Text style={styles.routeText}>{trip.to}</Text>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <MapPin size={16} color="#6b7280" />
                <Text style={styles.statText}>{trip.distance}</Text>
              </View>
              <View style={styles.statItem}>
                <Clock size={16} color="#6b7280" />
                <Text style={styles.statText}>{trip.duration}</Text>
              </View>
              <View style={styles.statItem}>
                <DollarSign size={16} color="#10b981" />
                <Text style={styles.costText}>
                  {trip.cost.toLocaleString("vi-VN")}đ
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
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
