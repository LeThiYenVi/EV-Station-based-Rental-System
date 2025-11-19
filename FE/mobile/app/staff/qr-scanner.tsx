import { BookingApi } from "@/api/BookingApi";
import QRScanner from "@/components/QRScanner";
import { SimpleHeader } from "@/components/SimpleHeader";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { theme } from "@/utils";
import { queueOfflineAction } from "@/utils/offlineQueue";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Vibration, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  IconButton,
  Text,
} from "react-native-paper";

export default function QRScannerScreen() {
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingInfo, setBookingInfo] = useState<any>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const network = useNetworkStatus();

  const handleBarCodeScanned = async (code: string) => {
    if (scannedCode === code) return; // Prevent duplicate scans

    setScannedCode(code);
    Vibration.vibrate(100); // Haptic feedback

    await lookupBooking(code);
  };

  const lookupBooking = async (code: string) => {
    setIsLoading(true);
    setBookingInfo(null);

    try {
      const booking = await BookingApi.getBookingByCode(code);
      setBookingInfo(booking);

      Alert.alert(
        "Quét thành công",
        `Đã tìm thấy đơn đặt xe #${booking.bookingCode}`,
        [
          {
            text: "Xem chi tiết",
            onPress: () => {
              router.push({
                pathname: "/trip/booking-detail" as any,
                params: { bookingId: booking.id },
              });
            },
          },
          {
            text: "Quét tiếp",
            onPress: resetScanner,
          },
        ]
      );
    } catch (error: any) {
      console.error("Booking lookup error:", error);
      Alert.alert(
        "Không tìm thấy",
        "Không tìm thấy đơn đặt xe với mã này. Vui lòng kiểm tra lại.",
        [
          {
            text: "Quét lại",
            onPress: resetScanner,
          },
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetScanner = () => {
    setScannedCode(null);
    setBookingInfo(null);
  };

  const handleManualInput = () => {
    Alert.prompt(
      "Nhập mã đặt xe",
      "Nhập mã đặt xe thủ công nếu không thể quét QR",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Tìm kiếm",
          onPress: (code?: string | null) => {
            if (code && code.trim()) {
              lookupBooking(code.trim());
            }
          },
        },
      ],
      "plain-text"
    );
  };

  const performStaffAction = async (
    action: "confirm" | "start" | "complete"
  ) => {
    if (!bookingInfo) return;

    setIsProcessingAction(true);

    const endpointMap: Record<string, string> = {
      confirm: `/api/bookings/${bookingInfo.id}/confirm`,
      start: `/api/bookings/${bookingInfo.id}/start`,
      complete: `/api/bookings/${bookingInfo.id}/complete`,
    };

    try {
      if (!network.isConnected) {
        // queue for later
        await queueOfflineAction({
          type: "OTHER",
          endpoint: endpointMap[action],
          method: "PATCH",
          data: {},
          maxRetries: 5,
        });

        Alert.alert(
          "Đã lưu",
          "Bạn đang ngoại tuyến. Hành động sẽ được thực hiện khi có kết nối.",
          [{ text: "OK", onPress: resetScanner }]
        );
        return;
      }

      // Online - call API
      let updated: any = null;
      if (action === "confirm") {
        updated = await BookingApi.confirmBooking(bookingInfo.id);
      } else if (action === "start") {
        updated = await BookingApi.startBooking(bookingInfo.id);
      } else if (action === "complete") {
        updated = await BookingApi.completeBooking(bookingInfo.id);
      }

      if (updated) {
        setBookingInfo(updated);
        Alert.alert("Thành công", "Cập nhật trạng thái đơn thành công", [
          { text: "OK", onPress: resetScanner },
        ]);
      }
    } catch (err: any) {
      console.error("Staff action error:", err);
      Alert.alert("Lỗi", err.message || "Không thể thực hiện hành động");
    } finally {
      setIsProcessingAction(false);
    }
  };

  return (
    <View style={styles.container}>
      <SimpleHeader title="Quét mã đặt xe" />

      {/* Instructions */}
      <Card style={styles.instructionCard}>
        <Card.Content>
          <View style={styles.instructionRow}>
            <Ionicons
              name="qr-code-outline"
              size={32}
              color={theme.colors.primary}
            />
            <IconButton icon="keyboard" size={24} onPress={handleManualInput} />
            <View style={styles.instructionText}>
              <Text variant="titleMedium" style={styles.instructionTitle}>
                Hướng dẫn
              </Text>
              <Text variant="bodySmall" style={styles.instructionSubtitle}>
                Đưa mã QR vào khung hình để quét tự động
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* QR Scanner */}
      <View style={styles.scannerContainer}>
        <QRScanner
          onScanSuccess={scannedCode ? () => {} : handleBarCodeScanned}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <Card style={styles.loadingCard}>
              <Card.Content style={styles.loadingContent}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>
                  Đang tra cứu đơn đặt xe...
                </Text>
              </Card.Content>
            </Card>
          </View>
        )}

        {/* Scanned Result */}
        {scannedCode && !isLoading && (
          <View style={styles.resultOverlay}>
            <Card style={styles.resultCard}>
              <Card.Content>
                <View style={styles.resultHeader}>
                  <Ionicons
                    name={bookingInfo ? "checkmark-circle" : "close-circle"}
                    size={48}
                    color={bookingInfo ? "#4CAF50" : "#F44336"}
                  />
                  <Text variant="titleLarge" style={styles.resultTitle}>
                    {bookingInfo ? "Đã tìm thấy!" : "Không tìm thấy"}
                  </Text>
                </View>

                {bookingInfo && (
                  <View style={styles.bookingInfo}>
                    <Text variant="bodyMedium">
                      Mã đặt xe:{" "}
                      <Text style={styles.boldText}>
                        {bookingInfo.bookingCode}
                      </Text>
                    </Text>
                    <Text variant="bodyMedium">
                      Khách hàng:{" "}
                      <Text style={styles.boldText}>
                        {bookingInfo.customerName}
                      </Text>
                    </Text>
                    <Text variant="bodyMedium">
                      Xe:{" "}
                      <Text style={styles.boldText}>
                        {bookingInfo.vehicleName}
                      </Text>
                    </Text>
                    <Text variant="bodyMedium">
                      Trạng thái:{" "}
                      <Text style={styles.boldText}>{bookingInfo.status}</Text>
                    </Text>
                  </View>
                )}

                <View style={styles.resultActions}>
                  <Button
                    mode="outlined"
                    onPress={resetScanner}
                    style={styles.actionButton}
                  >
                    Quét lại
                  </Button>

                  {bookingInfo && (
                    <>
                      {/* Staff actions based on current booking status */}
                      {bookingInfo.status === "PENDING" && (
                        <Button
                          mode="contained"
                          onPress={() => performStaffAction("confirm")}
                          loading={isProcessingAction}
                          disabled={isProcessingAction}
                          style={styles.actionButton}
                        >
                          Xác nhận
                        </Button>
                      )}

                      {bookingInfo.status === "CONFIRMED" && (
                        <Button
                          mode="contained"
                          onPress={() => performStaffAction("start")}
                          loading={isProcessingAction}
                          disabled={isProcessingAction}
                          style={styles.actionButton}
                        >
                          Bắt đầu
                        </Button>
                      )}

                      {bookingInfo.status === "STARTED" && (
                        <Button
                          mode="contained"
                          onPress={() => performStaffAction("complete")}
                          loading={isProcessingAction}
                          disabled={isProcessingAction}
                          style={styles.actionButton}
                        >
                          Hoàn tất
                        </Button>
                      )}

                      <Button
                        mode="contained"
                        onPress={() => {
                          router.push({
                            pathname: "/trip/booking-detail" as any,
                            params: { bookingId: bookingInfo.id },
                          });
                        }}
                        style={styles.actionButton}
                      >
                        Xem chi tiết
                      </Button>
                    </>
                  )}
                </View>
              </Card.Content>
            </Card>
          </View>
        )}
      </View>

      {/* Manual Entry Button */}
      <View style={styles.footer}>
        <Button
          mode="outlined"
          icon="keyboard"
          onPress={handleManualInput}
          disabled={isLoading}
          style={styles.manualButton}
        >
          Nhập mã thủ công
        </Button>
      </View>

      {/* Tips */}
      <Card style={styles.tipsCard}>
        <Card.Content>
          <Text variant="titleSmall" style={styles.tipsTitle}>
            💡 Mẹo quét QR hiệu quả
          </Text>
          <View style={styles.tipItem}>
            <Ionicons
              name="bulb-outline"
              size={16}
              color={theme.colors.primary}
            />
            <Text variant="bodySmall" style={styles.tipText}>
              Đảm bảo đủ ánh sáng khi quét
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons
              name="bulb-outline"
              size={16}
              color={theme.colors.primary}
            />
            <Text variant="bodySmall" style={styles.tipText}>
              Giữ camera ổn định và vuông góc với mã QR
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons
              name="bulb-outline"
              size={16}
              color={theme.colors.primary}
            />
            <Text variant="bodySmall" style={styles.tipText}>
              Khoảng cách tối ưu: 10-30cm
            </Text>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  instructionCard: {
    margin: theme.spacing.md,
    backgroundColor: "#E3F2FD",
  },
  instructionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  instructionText: {
    flex: 1,
  },
  instructionTitle: {
    fontWeight: "600",
    color: "#1976D2",
    marginBottom: 4,
  },
  instructionSubtitle: {
    color: "#1976D2",
  },
  scannerContainer: {
    flex: 1,
    position: "relative",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  loadingCard: {
    width: "80%",
  },
  loadingContent: {
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.foreground,
  },
  resultOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
    zIndex: 10,
  },
  resultCard: {
    width: "100%",
  },
  resultHeader: {
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  resultTitle: {
    marginTop: theme.spacing.sm,
    fontWeight: "bold",
  },
  bookingInfo: {
    backgroundColor: theme.colors.muted,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  boldText: {
    fontWeight: "600",
    color: theme.colors.foreground,
  },
  resultActions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  manualButton: {
    width: "100%",
  },
  tipsCard: {
    margin: theme.spacing.md,
    marginTop: 0,
    backgroundColor: "#FFF9C4",
  },
  tipsTitle: {
    fontWeight: "bold",
    marginBottom: theme.spacing.sm,
    color: "#F57C00",
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.xs,
    marginBottom: 4,
  },
  tipText: {
    flex: 1,
    color: "#F57C00",
    lineHeight: 18,
  },
});
