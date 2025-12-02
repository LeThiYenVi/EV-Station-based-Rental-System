import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { X, Star, Gauge, Zap, Users, MapPin } from "lucide-react-native";
import { VehicleDetailResponse } from "@/types";

const { width } = Dimensions.get("window");

interface VehicleDetailModalProps {
  visible: boolean;
  vehicle: VehicleDetailResponse | null;
  onClose: () => void;
  onBook?: () => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  visible,
  vehicle,
  onClose,
  onBook,
}) => {
  if (!vehicle) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "#10b981";
      case "IN_USE":
        return "#f59e0b";
      case "MAINTENANCE":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "Sẵn Sàng";
      case "IN_USE":
        return "Đang Sử Dụng";
      case "MAINTENANCE":
        return "Bảo Trì";
      default:
        return status;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chi Tiết Xe</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#6b7280" />
            </Pressable>
          </View>

          <ScrollView style={styles.scrollView}>
            {/* Vehicle Photos */}
            {vehicle.photos && vehicle.photos.length > 0 ? (
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={styles.photosContainer}
              >
                {vehicle.photos.map((photo, index) => (
                  <Image
                    key={index}
                    source={{ uri: photo }}
                    style={styles.photo}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            ) : (
              <View style={styles.placeholderPhoto}>
                <Gauge size={64} color="#9ca3af" />
              </View>
            )}

            {/* Basic Info */}
            <View style={styles.section}>
              <View style={styles.nameRow}>
                <View style={styles.nameContainer}>
                  <Text style={styles.vehicleName}>{vehicle.name}</Text>
                  <Text style={styles.vehicleBrand}>{vehicle.brand}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: `${getStatusColor(vehicle.status)}15` },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(vehicle.status) },
                    ]}
                  >
                    {getStatusText(vehicle.status)}
                  </Text>
                </View>
              </View>

              {vehicle.rating > 0 && (
                <View style={styles.ratingRow}>
                  <Star size={18} color="#f59e0b" fill="#f59e0b" />
                  <Text style={styles.ratingText}>
                    {vehicle.rating.toFixed(1)}
                  </Text>
                  <Text style={styles.ratingCount}>
                    ({vehicle.rentCount} chuyến)
                  </Text>
                </View>
              )}
            </View>

            {/* Specs */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Thông Số Kỹ Thuật</Text>

              <View style={styles.specsGrid}>
                <View style={styles.specItem}>
                  <View style={styles.specIconContainer}>
                    <Zap size={20} color="#10b981" />
                  </View>
                  <Text style={styles.specLabel}>Nhiên liệu</Text>
                  <Text style={styles.specValue}>{vehicle.fuelType}</Text>
                </View>

                <View style={styles.specItem}>
                  <View style={styles.specIconContainer}>
                    <Users size={20} color="#10b981" />
                  </View>
                  <Text style={styles.specLabel}>Số chỗ</Text>
                  <Text style={styles.specValue}>{vehicle.capacity}</Text>
                </View>

                <View style={styles.specItem}>
                  <View style={styles.specIconContainer}>
                    <Gauge size={20} color="#10b981" />
                  </View>
                  <Text style={styles.specLabel}>Biển số</Text>
                  <Text style={styles.specValue}>{vehicle.licensePlate}</Text>
                </View>

                <View style={styles.specItem}>
                  <View style={styles.specIconContainer}>
                    <MapPin size={20} color="#10b981" />
                  </View>
                  <Text style={styles.specLabel}>Trạm</Text>
                  <Text style={styles.specValue} numberOfLines={2}>
                    {vehicle.stationName}
                  </Text>
                </View>
              </View>
            </View>

            {/* Pricing */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Giá Thuê</Text>

              <View style={styles.pricingCard}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Theo giờ:</Text>
                  <Text style={styles.priceValue}>
                    {vehicle.hourlyRate.toLocaleString("vi-VN")}đ
                  </Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Theo ngày:</Text>
                  <Text style={styles.priceValue}>
                    {vehicle.dailyRate.toLocaleString("vi-VN")}đ
                  </Text>
                </View>
                <View style={[styles.priceRow, styles.depositRow]}>
                  <Text style={styles.priceLabel}>Đặt cọc:</Text>
                  <Text style={[styles.priceValue, styles.depositText]}>
                    {vehicle.depositAmount.toLocaleString("vi-VN")}đ
                  </Text>
                </View>
              </View>
            </View>

            {/* Policies */}
            {vehicle.polices && vehicle.polices.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Chính Sách</Text>
                <View style={styles.policiesContainer}>
                  {vehicle.polices.map((policy, index) => (
                    <Text key={index} style={styles.policyItem}>
                      • {policy}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {/* Additional Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Thông Tin Khác</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Màu sắc:</Text>
                <Text style={styles.infoValue}>{vehicle.color}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Trạng thái:</Text>
                <Text style={styles.infoValue}>
                  {vehicle.isAvailable ? "✅ Có thể đặt" : "❌ Không khả dụng"}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Book Button */}
          {vehicle.isAvailable && onBook && (
            <View style={styles.footer}>
              <Pressable style={styles.bookButton} onPress={onBook}>
                <Text style={styles.bookButtonText}>Đặt Xe Ngay</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  photosContainer: {
    height: 240,
  },
  photo: {
    width: width,
    height: 240,
    backgroundColor: "#e5e7eb",
  },
  placeholderPhoto: {
    width: width,
    height: 240,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  nameContainer: {
    flex: 1,
    marginRight: 12,
  },
  vehicleName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  vehicleBrand: {
    fontSize: 15,
    color: "#6b7280",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f59e0b",
  },
  ratingCount: {
    fontSize: 13,
    color: "#6b7280",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  specsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  specItem: {
    width: "48%",
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  specIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#d1fae5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  specLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  specValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  pricingCard: {
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  depositRow: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 12,
    marginBottom: 0,
  },
  priceLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  depositText: {
    color: "#10b981",
  },
  policiesContainer: {
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 8,
  },
  policyItem: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  bookButton: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
