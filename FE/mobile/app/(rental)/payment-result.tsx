import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  CheckCircle,
  XCircle,
  ExternalLink,
  Home,
  Clock,
} from "lucide-react-native";
import { Card } from "@/components/common";
import Toast from "react-native-toast-message";
import { paymentService } from "@/services";
import { PaymentResponse } from "@/types";

export default function PaymentResultScreen() {
  const { bookingId, payUrl, resultCode } = useLocalSearchParams<{
    bookingId: string;
    payUrl?: string;
    resultCode?: string;
  }>();
  const router = useRouter();
  const [processing, setProcessing] = useState(!!payUrl);
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<PaymentResponse | null>(null);
  const [isSuccess, setIsSuccess] = useState(true);

  useEffect(() => {
    if (payUrl) {
      openMoMoPayment();
    } else if (bookingId) {
      // Fetch payment details after returning from MoMo
      fetchPaymentDetails();
    }
  }, [payUrl, bookingId]);

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      const payments = await paymentService.getPaymentsByBooking(bookingId);

      if (payments && payments.length > 0) {
        const latestPayment = payments[0];
        setPayment(latestPayment);
        setIsSuccess(latestPayment.status === "COMPLETED");
      } else {
        // No payment yet, assume success for now
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Failed to fetch payment:", error);
      // Check resultCode from MoMo callback
      if (resultCode) {
        setIsSuccess(resultCode === "0");
      }
    } finally {
      setLoading(false);
    }
  };

  const openMoMoPayment = async () => {
    try {
      const canOpen = await Linking.canOpenURL(payUrl!);

      if (canOpen) {
        await Linking.openURL(payUrl!);
        Toast.show({
          type: "info",
          text1: "Chuyển Sang MoMo",
          text2: "Vui lòng hoàn tất thanh toán trên ứng dụng MoMo",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Không thể mở liên kết thanh toán",
        });
      }
    } catch (error) {
      console.error("Failed to open MoMo:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể mở ứng dụng MoMo",
      });
    } finally {
      setProcessing(false);
    }
  };

  // This screen can be enhanced to check payment status via API
  // For now, it's a simple result page

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {processing ? (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#10b981" />
            <Text style={styles.processingText}>Đang chuyển sang MoMo...</Text>
          </View>
        ) : loading ? (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#10b981" />
            <Text style={styles.processingText}>
              Đang kiểm tra thanh toán...
            </Text>
          </View>
        ) : (
          <>
            {/* Success/Failure State */}
            <View style={styles.resultContainer}>
              <View style={styles.iconContainer}>
                {isSuccess ? (
                  <CheckCircle size={80} color="#10b981" />
                ) : (
                  <XCircle size={80} color="#ef4444" />
                )}
              </View>

              <Text
                style={[styles.resultTitle, !isSuccess && styles.errorTitle]}
              >
                {isSuccess ? "Thanh Toán Thành Công!" : "Thanh Toán Thất Bại"}
              </Text>
              <Text style={styles.resultMessage}>
                {isSuccess
                  ? "Booking của bạn đã được tạo và thanh toán thành công"
                  : "Đã có lỗi xảy ra trong quá trình thanh toán"}
              </Text>

              <Card>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Mã Booking:</Text>
                  <Text style={styles.infoValue}>{bookingId}</Text>
                </View>
                {payment && (
                  <>
                    <View style={[styles.infoRow, styles.infoRowSpaced]}>
                      <Text style={styles.infoLabel}>Số Tiền:</Text>
                      <Text style={[styles.infoValue, styles.priceText]}>
                        {payment.amount.toLocaleString("vi-VN")}đ
                      </Text>
                    </View>
                    <View style={[styles.infoRow, styles.infoRowSpaced]}>
                      <Text style={styles.infoLabel}>Phương Thức:</Text>
                      <Text style={styles.infoValue}>
                        {payment.paymentMethod === "MOMO"
                          ? "MoMo"
                          : payment.paymentMethod}
                      </Text>
                    </View>
                    <View style={[styles.infoRow, styles.infoRowSpaced]}>
                      <Text style={styles.infoLabel}>Trạng Thái:</Text>
                      <View
                        style={[
                          styles.statusBadge,
                          payment.status === "COMPLETED"
                            ? styles.statusSuccess
                            : styles.statusPending,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            payment.status === "COMPLETED"
                              ? styles.statusSuccessText
                              : styles.statusPendingText,
                          ]}
                        >
                          {payment.status === "COMPLETED"
                            ? "Đã Thanh Toán"
                            : payment.status === "PENDING"
                            ? "Đang Xử Lý"
                            : payment.status}
                        </Text>
                      </View>
                    </View>
                    {payment.transactionId && (
                      <View style={[styles.infoRow, styles.infoRowSpaced]}>
                        <Text style={styles.infoLabel}>Mã Giao Dịch:</Text>
                        <Text
                          style={[styles.infoValue, styles.transactionText]}
                        >
                          {payment.transactionId}
                        </Text>
                      </View>
                    )}
                    {payment.paidAt && (
                      <View style={[styles.infoRow, styles.infoRowSpaced]}>
                        <Text style={styles.infoLabel}>Thời Gian:</Text>
                        <Text style={styles.infoValue}>
                          {new Date(payment.paidAt).toLocaleString("vi-VN")}
                        </Text>
                      </View>
                    )}
                  </>
                )}
              </Card>

              {isSuccess ? (
                <View style={styles.instructionBox}>
                  <Text style={styles.instructionText}>
                    ✅ Bạn có thể xem chi tiết booking trong tab "Chuyến Đi"
                  </Text>
                  <Text style={styles.instructionText}>
                    📍 Hãy đến trạm đúng giờ để nhận xe
                  </Text>
                </View>
              ) : (
                <View style={[styles.instructionBox, styles.errorBox]}>
                  <Text style={styles.errorText}>
                    ⚠️ Vui lòng thử lại hoặc liên hệ hỗ trợ nếu tiền đã bị trừ
                  </Text>
                </View>
              )}
            </View>

            {/* Actions */}
            <View style={styles.actionButtons}>
              {isSuccess ? (
                <>
                  <Pressable
                    style={styles.secondaryButton}
                    onPress={() => router.push("/(tabs)/trips")}
                  >
                    <Text style={styles.secondaryButtonText}>
                      Xem Chuyến Đi
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.primaryButton}
                    onPress={() => router.push("/(tabs)/")}
                  >
                    <Home size={20} color="#ffffff" />
                    <Text style={styles.primaryButtonText}>Về Trang Chủ</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Pressable
                    style={styles.primaryButton}
                    onPress={() => router.push("/(tabs)/support")}
                  >
                    <Text style={styles.primaryButtonText}>Liên Hệ Hỗ Trợ</Text>
                  </Pressable>

                  <Pressable
                    style={styles.secondaryButton}
                    onPress={() => router.back()}
                  >
                    <Text style={styles.secondaryButtonText}>Thử Lại</Text>
                  </Pressable>
                </>
              )}
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  processingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  processingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
  },
  resultContainer: {
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  resultMessage: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  infoRowSpaced: {
    marginTop: 12,
  },
  priceText: {
    color: "#10b981",
    fontSize: 16,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusSuccess: {
    backgroundColor: "#d1fae5",
  },
  statusPending: {
    backgroundColor: "#fef3c7",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  statusSuccessText: {
    color: "#065f46",
  },
  statusPendingText: {
    color: "#92400e",
  },
  transactionText: {
    fontSize: 12,
    color: "#6b7280",
  },
  errorTitle: {
    color: "#ef4444",
  },
  errorBox: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
  },
  errorText: {
    color: "#991b1b",
  },
  instructionBox: {
    backgroundColor: "#ecfdf5",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1fae5",
    marginTop: 24,
    width: "100%",
  },
  instructionText: {
    fontSize: 14,
    color: "#065f46",
    lineHeight: 22,
    marginBottom: 8,
  },
  actionButtons: {
    marginTop: 32,
    gap: 12,
  },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#10b981",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#10b981",
    fontWeight: "600",
    fontSize: 15,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#10b981",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },
});
