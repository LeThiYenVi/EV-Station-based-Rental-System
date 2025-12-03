import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Clock,
  DollarSign,
  MapPin,
  Navigation,
  CheckCircle,
  Zap,
} from "lucide-react-native";
import { bookingService } from "@/services";
import { BookingResponse } from "@/types";
import { Card, InfoRow } from "@/components/common";
import Toast from "react-native-toast-message";

export default function ActiveTripScreen() {
  const router = useRouter();
  const [activeTrip, setActiveTrip] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    fetchActiveTrip();
  }, []);

  useEffect(() => {
    if (activeTrip) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const start = new Date(activeTrip.startTime).getTime();
        const elapsed = Math.floor((now - start) / 1000); // seconds
        setElapsedTime(elapsed);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [activeTrip]);

  const fetchActiveTrip = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getMyBookings();
      const active = response.data.find(
        (b) =>
          b.status.toUpperCase() === "IN_PROGRESS" ||
          b.status.toUpperCase() === "CONFIRMED"
      );

      if (active) {
        setActiveTrip(active);
      } else {
        Toast.show({
          type: "info",
          text1: "Không Có Chuyến Đi",
          text2: "Bạn chưa có chuyến đi nào đang hoạt động",
        });
        router.replace("/(tabs)/trips");
      }
    } catch (error: any) {
      console.error("Failed to fetch active trip:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể tải thông tin chuyến đi",
      });
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const calculateCurrentCost = () => {
    if (!activeTrip) return 0;
    const hours = elapsedTime / 3600;
    return Math.ceil(hours * (activeTrip.basePrice / 1)); // Estimate
  };

  const handleCompleteTrip = () => {
    Alert.alert(
      "Kết Thúc Chuyến Đi",
      "Bạn có chắc chắn muốn kết thúc chuyến đi này?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xác Nhận",
          style: "destructive",
          onPress: completeTrip,
        },
      ]
    );
  };

  const completeTrip = async () => {
    if (!activeTrip) return;

    try {
      setCompleting(true);
      await bookingService.completeBooking(activeTrip.id);

      Toast.show({
        type: "success",
        text1: "Hoàn Thành",
        text2: "Chuyến đi đã được kết thúc",
      });

      // Navigate to trips screen
      router.replace("/(tabs)/trips");
    } catch (error: any) {
      console.error("Failed to complete trip:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: error.response?.data?.message || "Không thể kết thúc chuyến đi",
      });
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Đang tải chuyến đi...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!activeTrip) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Status Header */}
        <View style={styles.statusHeader}>
          <Zap size={32} color="#10b981" />
          <Text style={styles.statusTitle}>Chuyến Đi Đang Diễn Ra</Text>
          <View style={styles.statusBadge}>
            <View style={styles.pulseIndicator} />
            <Text style={styles.statusText}>ĐANG CHẠY</Text>
          </View>
        </View>

        {/* Timer Card */}
        <Card>
          <View style={styles.timerSection}>
            <Clock size={24} color="#6b7280" />
            <Text style={styles.timerLabel}>Thời Gian Đã Đi</Text>
            <Text style={styles.timerValue}>{formatTime(elapsedTime)}</Text>
          </View>
        </Card>

        {/* Cost Card */}
        <Card>
          <View style={styles.costSection}>
            <DollarSign size={24} color="#10b981" />
            <Text style={styles.costLabel}>Chi Phí Hiện Tại</Text>
            <Text style={styles.costValue}>
              {calculateCurrentCost().toLocaleString("vi-VN")}đ
            </Text>
            <Text style={styles.costNote}>
              (Ước tính - chưa bao gồm phụ phí)
            </Text>
          </View>
        </Card>

        {/* Trip Details */}
        <Card>
          <Text style={styles.cardTitle}>Thông Tin Chuyến Đi</Text>

          <InfoRow icon={Zap} label="Xe:" value={activeTrip.vehicleName} />
          <InfoRow
            icon={MapPin}
            label="Biển số:"
            value={activeTrip.licensePlate}
          />
          <InfoRow
            icon={Navigation}
            label="Trạm:"
            value={activeTrip.stationName}
          />
          <InfoRow
            icon={CheckCircle}
            label="Mã booking:"
            value={activeTrip.bookingCode}
          />
        </Card>

        {/* Instructions */}
        <View style={styles.instructionBox}>
          <Text style={styles.instructionTitle}>📍 Hướng Dẫn Trả Xe</Text>
          <Text style={styles.instructionText}>
            1. Đưa xe về trạm {activeTrip.stationName}
          </Text>
          <Text style={styles.instructionText}>
            2. Đỗ xe vào vị trí quy định
          </Text>
          <Text style={styles.instructionText}>
            3. Nhấn nút "Kết Thúc Chuyến Đi" bên dưới
          </Text>
          <Text style={styles.instructionText}>
            4. Nhân viên sẽ kiểm tra xe và hoàn tất thanh toán
          </Text>
        </View>
      </View>

      {/* Bottom Action */}
      <View style={styles.bottomBar}>
        <Pressable
          style={[styles.completeButton, completing && styles.buttonDisabled]}
          onPress={handleCompleteTrip}
          disabled={completing}
        >
          {completing ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <CheckCircle size={20} color="#ffffff" />
              <Text style={styles.completeButtonText}>Kết Thúc Chuyến Đi</Text>
            </>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
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
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6b7280",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statusHeader: {
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 20,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 12,
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#d1fae5",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pulseIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10b981",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#065f46",
  },
  timerSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  timerLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 12,
    marginBottom: 8,
  },
  timerValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#111827",
    fontVariant: ["tabular-nums"],
  },
  costSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  costLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 12,
    marginBottom: 8,
  },
  costValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#10b981",
    marginBottom: 4,
  },
  costNote: {
    fontSize: 12,
    color: "#9ca3af",
    fontStyle: "italic",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  instructionBox: {
    backgroundColor: "#eff6ff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dbeafe",
    marginTop: 16,
  },
  instructionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e40af",
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: "#1e3a8a",
    lineHeight: 22,
    marginBottom: 6,
  },
  bottomBar: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    padding: 16,
  },
  completeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#ef4444",
    paddingVertical: 16,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: "#d1d5db",
  },
  completeButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
