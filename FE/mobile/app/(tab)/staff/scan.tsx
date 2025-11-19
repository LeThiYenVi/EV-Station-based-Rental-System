import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Card,
  Text,
  Button,
  Divider,
  Chip,
  ActivityIndicator,
  Surface,
  IconButton,
} from "react-native-paper";
import { router } from "expo-router";
import QRScanner from "../../../components/QRScanner";
import { BookingApi } from "../../../api/BookingApi";
import { BookingDetailResponse } from "../../../types/Booking";
import { BookingStatus } from "../../../types/Enums";

export default function StaffScanScreen() {
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<BookingDetailResponse | null>(null);
  const [error, setError] = useState<string>("");

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleScanSuccess = async (bookingCode: string) => {
    setScanning(false);
    setLoading(true);
    setError("");

    try {
      const response = await BookingApi.getBookingByCode(bookingCode);
      setBooking(response);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Không tìm thấy đơn thuê";
      setError(errorMsg);
      Alert.alert("Lỗi", errorMsg, [
        { text: "Quét lại", onPress: () => setScanning(true) },
        { text: "Đóng" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!booking) return;

    Alert.alert(
      "Xác nhận check-in",
      `Xác nhận bắt đầu chuyến thuê cho khách hàng?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận",
          onPress: async () => {
            setLoading(true);
            try {
              await BookingApi.startBooking(booking.id);
              Alert.alert("Thành công", "Đã check-in khách hàng thành công!", [
                {
                  text: "OK",
                  onPress: () => {
                    setBooking(null);
                    setScanning(true);
                  },
                },
              ]);
            } catch (err: any) {
              const errorMsg =
                err.response?.data?.message || "Không thể check-in";
              Alert.alert("Lỗi", errorMsg);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleCheckOut = async () => {
    if (!booking) return;

    Alert.alert(
      "Xác nhận check-out",
      `Xác nhận hoàn tất chuyến thuê cho khách hàng?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận",
          onPress: async () => {
            setLoading(true);
            try {
              await BookingApi.completeBooking(booking.id);
              Alert.alert("Thành công", "Đã check-out khách hàng thành công!", [
                {
                  text: "OK",
                  onPress: () => {
                    setBooking(null);
                    setScanning(true);
                  },
                },
              ]);
            } catch (err: any) {
              const errorMsg =
                err.response?.data?.message || "Không thể check-out";
              Alert.alert("Lỗi", errorMsg);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: BookingStatus): string => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return "#2196F3";
      case BookingStatus.STARTED:
        return "#FF9800";
      case BookingStatus.COMPLETED:
        return "#4CAF50";
      case BookingStatus.CANCELLED:
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  const getStatusText = (status: BookingStatus): string => {
    switch (status) {
      case BookingStatus.PENDING:
        return "Chờ xác nhận";
      case BookingStatus.CONFIRMED:
        return "Đã xác nhận";
      case BookingStatus.STARTED:
        return "Đang thuê";
      case BookingStatus.COMPLETED:
        return "Hoàn thành";
      case BookingStatus.CANCELLED:
        return "Đã hủy";
      default:
        return status;
    }
  };

  const canCheckIn = (status: BookingStatus): boolean => {
    return status === BookingStatus.CONFIRMED;
  };

  const canCheckOut = (status: BookingStatus): boolean => {
    return status === BookingStatus.STARTED;
  };

  if (scanning) {
    return (
      <QRScanner
        title="Quét mã đơn thuê"
        subtitle="Đưa mã QR của đơn thuê vào khung quét"
        onScanSuccess={handleScanSuccess}
        onCancel={() => setScanning(false)}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header} elevation={2}>
        <Text variant="headlineMedium" style={styles.headerTitle}>
          Quản lý Check-in/Check-out
        </Text>
        <Text variant="bodyMedium" style={styles.headerSubtitle}>
          Quét mã QR để bắt đầu hoặc kết thúc chuyến thuê
        </Text>
      </Surface>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Đang tải thông tin...</Text>
        </View>
      ) : booking ? (
        <View style={styles.content}>
          {/* Booking Info Card */}
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text variant="titleLarge" style={styles.bookingCode}>
                  {booking.bookingCode}
                </Text>
                <Chip
                  mode="flat"
                  style={{
                    backgroundColor: getStatusColor(booking.status),
                  }}
                  textStyle={{ color: "#fff" }}
                >
                  {getStatusText(booking.status)}
                </Chip>
              </View>

              <Divider style={styles.divider} />

              {/* Customer Info */}
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Thông tin khách hàng
                </Text>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Họ tên:</Text>
                  <Text style={styles.value}>{booking.renter.fullName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Email:</Text>
                  <Text style={styles.value}>{booking.renter.email}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>SĐT:</Text>
                  <Text style={styles.value}>{booking.renter.phone}</Text>
                </View>
              </View>

              <Divider style={styles.divider} />

              {/* Vehicle Info */}
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Thông tin xe
                </Text>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Tên xe:</Text>
                  <Text style={styles.value}>{booking.vehicle.name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Biển số:</Text>
                  <Text style={styles.value}>
                    {booking.vehicle.licensePlate}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Trạm:</Text>
                  <Text style={styles.value}>{booking.station.name}</Text>
                </View>
              </View>

              <Divider style={styles.divider} />

              {/* Time Info */}
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Thời gian thuê
                </Text>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Bắt đầu:</Text>
                  <Text style={styles.value}>
                    {formatDateTime(booking.startTime)}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Kết thúc:</Text>
                  <Text style={styles.value}>
                    {formatDateTime(booking.expectedEndTime)}
                  </Text>
                </View>
              </View>

              <Divider style={styles.divider} />

              {/* Price Info */}
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Thanh toán
                </Text>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Tổng tiền:</Text>
                  <Text style={[styles.value, styles.price]}>
                    {booking.totalAmount.toLocaleString("vi-VN")} đ
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Trạng thái TT:</Text>
                  <Text style={styles.value}>{booking.paymentStatus}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Action Buttons */}
          <View style={styles.actions}>
            {canCheckIn(booking.status) && (
              <Button
                mode="contained"
                onPress={handleCheckIn}
                style={styles.actionButton}
                icon="login"
                disabled={loading}
              >
                Check-in khách hàng
              </Button>
            )}

            {canCheckOut(booking.status) && (
              <Button
                mode="contained"
                onPress={handleCheckOut}
                style={[styles.actionButton, styles.checkOutButton]}
                icon="logout"
                disabled={loading}
              >
                Check-out khách hàng
              </Button>
            )}

            {!canCheckIn(booking.status) && !canCheckOut(booking.status) && (
              <Card style={styles.warningCard}>
                <Card.Content>
                  <Text style={styles.warningText}>
                    {booking.status === BookingStatus.COMPLETED
                      ? "Đơn thuê đã hoàn thành"
                      : booking.status === BookingStatus.CANCELLED
                      ? "Đơn thuê đã bị hủy"
                      : "Đơn thuê chưa được xác nhận"}
                  </Text>
                </Card.Content>
              </Card>
            )}

            <Button
              mode="outlined"
              onPress={() => {
                setBooking(null);
                setScanning(true);
              }}
              style={styles.scanAgainButton}
              icon="qrcode"
            >
              Quét mã khác
            </Button>
          </View>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <IconButton icon="qrcode-scan" size={64} iconColor="#999" />
          <Text variant="titleMedium" style={styles.emptyTitle}>
            Chưa có đơn thuê nào
          </Text>
          <Text style={styles.emptySubtitle}>
            Nhấn nút bên dưới để quét mã QR của đơn thuê
          </Text>
          <Button
            mode="contained"
            onPress={() => setScanning(true)}
            style={styles.scanButton}
            icon="qrcode-scan"
          >
            Quét mã QR
          </Button>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    color: "#666",
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  bookingCode: {
    fontWeight: "bold",
    color: "#1976D2",
  },
  divider: {
    marginVertical: 12,
  },
  section: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  label: {
    color: "#666",
    flex: 1,
  },
  value: {
    fontWeight: "500",
    flex: 2,
    textAlign: "right",
  },
  price: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    paddingVertical: 6,
  },
  checkOutButton: {
    backgroundColor: "#4CAF50",
  },
  warningCard: {
    backgroundColor: "#FFF3E0",
  },
  warningText: {
    color: "#E65100",
    textAlign: "center",
    fontWeight: "500",
  },
  scanAgainButton: {
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    marginTop: 64,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    color: "#333",
  },
  emptySubtitle: {
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  scanButton: {
    paddingHorizontal: 32,
  },
});
