import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Calendar, MapPin, Clock, DollarSign } from "lucide-react-native";

interface TripCardProps {
  vehicleName: string;
  date: string;
  time: string;
  stationName?: string;
  distance?: string;
  duration?: string;
  cost: number;
  status: "ACTIVE" | "PENDING" | "RESERVED" | "COMPLETED" | "CANCELLED";
  onPress?: () => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
}

export default function TripCard({
  vehicleName,
  date,
  time,
  stationName,
  distance,
  duration,
  cost,
  status,
  onPress,
  onCancel,
  showCancelButton = false,
}: TripCardProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "COMPLETED":
        return {
          bgColor: "#d1fae5",
          textColor: "#065f46",
          label: "Hoàn Thành",
        };
      case "ACTIVE":
        return {
          bgColor: "#d1fae5",
          textColor: "#065f46",
          label: "Đang Thuê",
        };
      case "PENDING":
        return {
          bgColor: "#fef3c7",
          textColor: "#92400e",
          label: "Chờ Xử Lý",
        };
      case "RESERVED":
        return {
          bgColor: "#dbeafe",
          textColor: "#1e40af",
          label: "Đã Đặt",
        };
      case "CANCELLED":
        return {
          bgColor: "#fee2e2",
          textColor: "#991b1b",
          label: "Đã Hủy",
        };
      default:
        return {
          bgColor: "#f3f4f6",
          textColor: "#6b7280",
          label: status,
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.tripCard,
        pressed && styles.tripCardPressed,
      ]}
      onPress={onPress}
    >
      {/* Header */}
      <View style={styles.tripHeader}>
        <View style={styles.tripHeaderLeft}>
          <Text style={styles.vehicleType}>{vehicleName}</Text>
          <View style={styles.dateTimeRow}>
            <Calendar size={14} color="#9ca3af" />
            <Text style={styles.dateTime}>
              {date} • {time}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusConfig.bgColor },
          ]}
        >
          <Text style={[styles.statusText, { color: statusConfig.textColor }]}>
            {statusConfig.label}
          </Text>
        </View>
      </View>

      {/* Station Info */}
      {stationName && (
        <View style={styles.stationRow}>
          <MapPin size={14} color="#9ca3af" />
          <Text style={styles.stationText}>{stationName}</Text>
        </View>
      )}

      {/* Stats */}
      <View style={styles.statsRow}>
        {distance && (
          <View style={styles.statItem}>
            <MapPin size={16} color="#6b7280" />
            <Text style={styles.statText}>{distance}</Text>
          </View>
        )}
        {duration && (
          <View style={styles.statItem}>
            <Clock size={16} color="#6b7280" />
            <Text style={styles.statText}>{duration}</Text>
          </View>
        )}
        <View style={styles.statItem}>
          <DollarSign size={16} color="#10b981" />
          <Text style={styles.costText}>{cost.toLocaleString("vi-VN")}đ</Text>
        </View>
      </View>

      {/* Cancel Button */}
      {showCancelButton && (
        <Pressable
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && styles.cancelButtonPressed,
          ]}
          onPress={(e) => {
            e.stopPropagation();
            onCancel?.();
          }}
        >
          <Text style={styles.cancelButtonText}>Hủy Chuyến</Text>
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 12,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  stationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  stationText: {
    fontSize: 13,
    color: "#6b7280",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
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
  cancelButton: {
    marginTop: 12,
    backgroundColor: "#ef4444",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonPressed: {
    backgroundColor: "#dc2626",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
});
