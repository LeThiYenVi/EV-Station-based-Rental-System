import { BookingApi } from "@/api/BookingApi";
import BookingTimeline from "@/components/BookingTimeline";
import { useAuth } from "@/context/authContext";
import { useNotifications } from "@/hooks/useNotifications";
import { BookingDetailResponse, BookingStatus } from "@/types";
import { theme } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Linking, ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Appbar,
  Button,
  Card,
  Chip,
  Dialog,
  Divider,
  Portal,
  Text,
} from "react-native-paper";

export default function BookingDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const bookingId = params.bookingId as string;

  const [booking, setBooking] = useState<BookingDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [error, setError] = useState("");

  const prevStatusRef = useRef<BookingStatus | null>(null);

  const { requestPermissions, schedulePushNotification } = useNotifications();

  useEffect(() => {
    // Request notification permissions (will be a no-op if already granted)
    requestPermissions().catch(() => {});

    fetchBookingDetail();
  }, [bookingId]);

  const fetchBookingDetail = async () => {
    try {
      setIsLoading(true);
      setError("");
      const bookingData = await BookingApi.getBookingById(bookingId);
      // If status changed since last fetch, send a local notification
      const prev = prevStatusRef.current;
      if (prev && prev !== bookingData.status) {
        const title = `Cập nhật đơn ${bookingData.bookingCode}`;
        const body = `Trạng thái: ${getStatusLabel(bookingData.status)}`;
        schedulePushNotification(title, body, {
          bookingId: bookingData.id,
          bookingCode: bookingData.bookingCode,
        }).catch((err) => console.warn("Notify error:", err));
      }

      prevStatusRef.current = bookingData.status;

      setBooking(bookingData);
    } catch (err: any) {
      setError(err.message || "Failed to load booking details");
      console.error("Error fetching booking:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;

    try {
      setIsCancelling(true);
      await BookingApi.cancelBooking(booking.id);

      Alert.alert("Thành công", "Đã hủy đặt xe", [
        {
          text: "OK",
          onPress: () => {
            setShowCancelDialog(false);
            fetchBookingDetail(); // Refresh to show updated status
          },
        },
      ]);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể hủy đặt xe");
      setShowCancelDialog(false);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCallHotline = () => {
    if (booking?.station.hotline) {
      Linking.openURL(`tel:${booking.station.hotline}`);
    }
  };

  const canCancelBooking = (): boolean => {
    if (!booking) return false;
    return booking.status === "PENDING" || booking.status === "CONFIRMED";
  };

  const getStatusColor = (status: BookingStatus): string => {
    switch (status) {
      case "PENDING":
        return "#FFA500";
      case "CONFIRMED":
        return "#2196F3";
      case "STARTED":
        return "#9C27B0";
      case "COMPLETED":
        return "#4CAF50";
      case "CANCELLED":
        return "#F44336";
      default:
        return theme.colors.mutedForeground;
    }
  };

  const getStatusLabel = (status: BookingStatus): string => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "STARTED":
        return "Đang thuê";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (error || !booking) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="Chi tiết đặt xe" />
        </Appbar.Header>
        <View style={styles.centered}>
          <Ionicons name="alert-circle" size={64} color={theme.colors.error} />
          <Text style={styles.errorText}>
            {error || "Không tìm thấy đặt xe"}
          </Text>
          <Button
            mode="outlined"
            onPress={fetchBookingDetail}
            style={styles.retryButton}
          >
            Thử lại
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={booking.bookingCode} />
        <Appbar.Action icon="refresh" onPress={fetchBookingDetail} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Status Card with Timeline */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.statusContainer}>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Trạng thái</Text>
                <Chip
                  mode="flat"
                  style={[
                    styles.statusChip,
                    { backgroundColor: getStatusColor(booking.status) + "20" },
                  ]}
                  textStyle={{
                    color: getStatusColor(booking.status),
                    fontWeight: "600",
                  }}
                >
                  {getStatusLabel(booking.status)}
                </Chip>
              </View>
              <Text style={styles.bookingCode}>
                Mã đặt xe: {booking.bookingCode}
              </Text>
            </View>

            <Divider style={styles.divider} />

            {/* Timeline */}
            <BookingTimeline
              currentStatus={booking.status}
              createdAt={booking.createdAt}
              confirmedAt={
                booking.status !== BookingStatus.PENDING &&
                booking.status !== BookingStatus.CANCELLED
                  ? booking.createdAt
                  : undefined
              }
              startedAt={
                booking.status === BookingStatus.STARTED ||
                booking.status === BookingStatus.COMPLETED
                  ? booking.startTime
                  : undefined
              }
              completedAt={
                booking.status === BookingStatus.COMPLETED
                  ? booking.actualEndTime
                  : undefined
              }
              cancelledAt={
                booking.status === BookingStatus.CANCELLED
                  ? booking.updatedAt
                  : undefined
              }
            />
          </Card.Content>
        </Card>

        {/* Vehicle Info */}
        <Card style={styles.card}>
          <Card.Title
            title="Thông tin xe"
            titleStyle={styles.cardTitle}
            left={(props) => (
              <Ionicons name="car" size={24} color={theme.colors.primary} />
            )}
          />
          <Card.Content>
            <Text style={styles.vehicleName}>{booking.vehicle.name}</Text>
            <View style={styles.infoRow}>
              <Ionicons
                name="pricetag"
                size={16}
                color={theme.colors.mutedForeground}
              />
              <Text style={styles.infoText}>
                {booking.vehicle.licensePlate}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons
                name="business"
                size={16}
                color={theme.colors.mutedForeground}
              />
              <Text style={styles.infoText}>{booking.vehicle.brand}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons
                name="flash"
                size={16}
                color={theme.colors.mutedForeground}
              />
              <Text style={styles.infoText}>{booking.vehicle.fuelType}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons
                name="people"
                size={16}
                color={theme.colors.mutedForeground}
              />
              <Text style={styles.infoText}>
                {booking.vehicle.capacity} chỗ
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Station Info */}
        <Card style={styles.card}>
          <Card.Title
            title="Địa điểm nhận xe"
            titleStyle={styles.cardTitle}
            left={(props) => (
              <Ionicons
                name="location"
                size={24}
                color={theme.colors.primary}
              />
            )}
          />
          <Card.Content>
            <Text style={styles.stationName}>{booking.station.name}</Text>
            <Text style={styles.stationAddress}>{booking.station.address}</Text>
            {booking.station.hotline && (
              <Button
                mode="outlined"
                icon="phone"
                onPress={handleCallHotline}
                style={styles.callButton}
              >
                Gọi {booking.station.hotline}
              </Button>
            )}
          </Card.Content>
        </Card>

        {/* Time Info */}
        <Card style={styles.card}>
          <Card.Title
            title="Thời gian thuê"
            titleStyle={styles.cardTitle}
            left={(props) => (
              <Ionicons
                name="calendar"
                size={24}
                color={theme.colors.primary}
              />
            )}
          />
          <Card.Content>
            <View style={styles.timeBlock}>
              <Text style={styles.timeLabel}>Nhận xe</Text>
              <Text style={styles.timeValue}>
                {formatDate(booking.startTime)}
              </Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.timeBlock}>
              <Text style={styles.timeLabel}>Trả xe dự kiến</Text>
              <Text style={styles.timeValue}>
                {formatDate(booking.expectedEndTime)}
              </Text>
            </View>
            {booking.actualEndTime && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.timeBlock}>
                  <Text style={styles.timeLabel}>Trả xe thực tế</Text>
                  <Text style={styles.timeValue}>
                    {formatDate(booking.actualEndTime)}
                  </Text>
                </View>
              </>
            )}
          </Card.Content>
        </Card>

        {/* Payment Info */}
        <Card style={styles.card}>
          <Card.Title
            title="Chi tiết thanh toán"
            titleStyle={styles.cardTitle}
            left={(props) => (
              <Ionicons name="receipt" size={24} color={theme.colors.primary} />
            )}
          />
          <Card.Content>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Phí thuê xe</Text>
              <Text style={styles.priceValue}>
                ${booking.basePrice.toFixed(2)}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Tiền cọc</Text>
              <Text style={styles.priceValue}>
                ${booking.depositPaid.toFixed(2)}
              </Text>
            </View>
            {booking.extraFee > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Phí phát sinh</Text>
                <Text
                  style={[styles.priceValue, { color: theme.colors.error }]}
                >
                  ${booking.extraFee.toFixed(2)}
                </Text>
              </View>
            )}
            <Divider style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tổng cộng</Text>
              <Text style={styles.totalValue}>
                ${booking.totalAmount.toFixed(2)}
              </Text>
            </View>
            <View style={styles.paymentStatusRow}>
              <Text style={styles.paymentLabel}>Trạng thái thanh toán:</Text>
              <Chip mode="outlined" compact>
                {booking.paymentStatus}
              </Chip>
            </View>
          </Card.Content>
        </Card>

        {/* Staff Info (if available) */}
        {(booking.checkedOutBy || booking.checkedInBy) && (
          <Card style={styles.card}>
            <Card.Title
              title="Thông tin nhân viên"
              titleStyle={styles.cardTitle}
              left={(props) => (
                <Ionicons
                  name="person"
                  size={24}
                  color={theme.colors.primary}
                />
              )}
            />
            <Card.Content>
              {booking.checkedOutBy && (
                <View style={styles.staffBlock}>
                  <Text style={styles.staffLabel}>Nhân viên bàn giao:</Text>
                  <Text style={styles.staffName}>
                    {booking.checkedOutBy.fullName}
                  </Text>
                </View>
              )}
              {booking.checkedInBy && (
                <View style={styles.staffBlock}>
                  <Text style={styles.staffLabel}>Nhân viên nhận xe:</Text>
                  <Text style={styles.staffName}>
                    {booking.checkedInBy.fullName}
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>
        )}

        {/* Notes */}
        {(booking.pickupNote || booking.returnNote) && (
          <Card style={styles.card}>
            <Card.Title
              title="Ghi chú"
              titleStyle={styles.cardTitle}
              left={(props) => (
                <Ionicons
                  name="document-text"
                  size={24}
                  color={theme.colors.primary}
                />
              )}
            />
            <Card.Content>
              {booking.pickupNote && (
                <View style={styles.noteBlock}>
                  <Text style={styles.noteLabel}>Ghi chú nhận xe:</Text>
                  <Text style={styles.noteText}>{booking.pickupNote}</Text>
                </View>
              )}
              {booking.returnNote && (
                <View style={styles.noteBlock}>
                  <Text style={styles.noteLabel}>Ghi chú trả xe:</Text>
                  <Text style={styles.noteText}>{booking.returnNote}</Text>
                </View>
              )}
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Cancel Button */}
      {canCancelBooking() && (
        <View style={styles.footer}>
          <Button
            mode="outlined"
            onPress={() => setShowCancelDialog(true)}
            textColor={theme.colors.error}
            style={styles.cancelButton}
          >
            Hủy đặt xe
          </Button>
        </View>
      )}

      {/* Cancel Confirmation Dialog */}
      <Portal>
        <Dialog
          visible={showCancelDialog}
          onDismiss={() => setShowCancelDialog(false)}
        >
          <Dialog.Title>Xác nhận hủy</Dialog.Title>
          <Dialog.Content>
            <Text>Bạn có chắc chắn muốn hủy đặt xe này không?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowCancelDialog(false)}>Không</Button>
            <Button
              onPress={handleCancelBooking}
              loading={isCancelling}
              disabled={isCancelling}
              textColor={theme.colors.error}
            >
              Hủy đặt xe
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.mutedForeground,
  },
  errorText: {
    marginTop: theme.spacing.md,
    color: theme.colors.error,
    textAlign: "center",
  },
  retryButton: {
    marginTop: theme.spacing.md,
  },
  card: {
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  statusContainer: {
    alignItems: "center",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.foreground,
  },
  statusChip: {
    paddingHorizontal: theme.spacing.sm,
  },
  bookingCode: {
    fontSize: 14,
    color: theme.colors.mutedForeground,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.mutedForeground,
  },
  stationName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  stationAddress: {
    fontSize: 14,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.md,
  },
  callButton: {
    marginTop: theme.spacing.sm,
  },
  timeBlock: {
    marginVertical: theme.spacing.xs,
  },
  timeLabel: {
    fontSize: 12,
    color: theme.colors.mutedForeground,
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.foreground,
  },
  divider: {
    marginVertical: theme.spacing.md,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  priceLabel: {
    fontSize: 14,
    color: theme.colors.foreground,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.foreground,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: theme.spacing.sm,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.foreground,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  paymentStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  paymentLabel: {
    fontSize: 14,
    color: theme.colors.foreground,
  },
  staffBlock: {
    marginBottom: theme.spacing.sm,
  },
  staffLabel: {
    fontSize: 12,
    color: theme.colors.mutedForeground,
    marginBottom: 2,
  },
  staffName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.foreground,
  },
  noteBlock: {
    marginBottom: theme.spacing.sm,
  },
  noteLabel: {
    fontSize: 12,
    color: theme.colors.mutedForeground,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 14,
    color: theme.colors.foreground,
    lineHeight: 20,
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  cancelButton: {
    borderColor: theme.colors.error,
  },
});
