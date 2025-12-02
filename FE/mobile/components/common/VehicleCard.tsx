import React from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { Battery, Star, Zap } from "lucide-react-native";
import { VehicleResponse } from "@/types";

interface VehicleCardProps {
  vehicle: VehicleResponse;
  onPress?: () => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onPress,
}) => {
  const isAvailable = vehicle.status === "AVAILABLE";

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
        !isAvailable && styles.cardDisabled,
      ]}
      onPress={onPress}
      disabled={!isAvailable}
    >
      {/* Vehicle Image */}
      <View style={styles.imageContainer}>
        {vehicle.photos && vehicle.photos.length > 0 ? (
          <Image
            source={{ uri: vehicle.photos[0] }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Zap size={40} color="#9ca3af" />
          </View>
        )}
        {/* Status Badge */}
        <View
          style={[
            styles.statusBadge,
            isAvailable ? styles.statusAvailable : styles.statusUnavailable,
          ]}
        >
          <Text style={styles.statusText}>
            {isAvailable ? "Có sẵn" : "Không khả dụng"}
          </Text>
        </View>
      </View>

      {/* Vehicle Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {vehicle.name}
        </Text>
        <Text style={styles.brand}>{vehicle.brand}</Text>

        {/* Specs Row */}
        <View style={styles.specsRow}>
          <View style={styles.spec}>
            <Battery size={14} color="#6b7280" />
            <Text style={styles.specText}>{vehicle.fuelType}</Text>
          </View>
          <View style={styles.spec}>
            <Star size={14} color="#fbbf24" fill="#fbbf24" />
            <Text style={styles.specText}>{vehicle.rating.toFixed(1)}</Text>
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.pricingRow}>
          <View>
            <Text style={styles.priceLabel}>Giá thuê/giờ</Text>
            <Text style={styles.price}>
              {vehicle.hourlyRate.toLocaleString("vi-VN")}₫
            </Text>
          </View>
          {vehicle.dailyRate && (
            <View>
              <Text style={styles.priceLabel}>Giá thuê/ngày</Text>
              <Text style={styles.price}>
                {vehicle.dailyRate.toLocaleString("vi-VN")}₫
              </Text>
            </View>
          )}
        </View>

        {/* Rent Count */}
        <Text style={styles.rentCount}>
          Đã cho thuê {vehicle.rentCount} lần
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardPressed: {
    backgroundColor: "#f9fafb",
  },
  cardDisabled: {
    opacity: 0.6,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 180,
    backgroundColor: "#f3f4f6",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
  },
  statusBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusAvailable: {
    backgroundColor: "rgba(16, 185, 129, 0.9)",
  },
  statusUnavailable: {
    backgroundColor: "rgba(239, 68, 68, 0.9)",
  },
  statusText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  info: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  brand: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
  },
  specsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  spec: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  specText: {
    fontSize: 13,
    color: "#6b7280",
  },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10b981",
  },
  rentCount: {
    fontSize: 12,
    color: "#9ca3af",
  },
});
