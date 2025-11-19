import { BookingApi } from "@/api/BookingApi";
import { StationApi } from "@/api/StationApi";
import { VehicleApi } from "@/api/VehicleApi";
import { useAuth } from "@/context/authContext";
import { StationResponse, VehicleDetailResponse } from "@/types";
import { theme } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Linking, ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Checkbox,
  Divider,
  Text,
} from "react-native-paper";

export default function ReviewBookingScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const vehicleId = params.vehicleId as string;
  const stationId = params.stationId as string;
  const startDate = params.startDate as string;
  const endDate = params.endDate as string;
  const startTime = params.startTime as string;
  const endTime = params.endTime as string;

  const [vehicle, setVehicle] = useState<VehicleDetailResponse | null>(null);
  const [station, setStation] = useState<StationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [error, setError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError("");

      const [vehicleData, stationData] = await Promise.all([
        VehicleApi.getVehicleById(vehicleId),
        StationApi.getStationById(stationId),
      ]);

      setVehicle(vehicleData);
      setStation(stationData);
    } catch (err: any) {
      setError(err.message || "Failed to load booking details");
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDuration = () => {
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    return { hours: diffHours, days: diffDays };
  };

  const calculateTotalCost = () => {
    if (!vehicle) return { subtotal: 0, deposit: 0, total: 0 };

    const duration = calculateDuration();
    let rentalCost = 0;

    if (duration.days > 0) {
      rentalCost =
        duration.days * vehicle.dailyRate +
        (duration.hours % 24) * vehicle.hourlyRate;
    } else {
      rentalCost = duration.hours * vehicle.hourlyRate;
    }

    return {
      subtotal: rentalCost,
      deposit: vehicle.depositAmount,
      total: rentalCost + vehicle.depositAmount,
    };
  };

  const handleConfirmBooking = async () => {
    if (!agreedToTerms) {
      Alert.alert("Lưu ý", "Vui lòng đồng ý với điều khoản và điều kiện");
      return;
    }

    if (!vehicle || !station || !user) return;

    try {
      setIsCreatingBooking(true);

      const bookingData = {
        stationId: station.id,
        vehicleId: vehicle.id,
        startTime: `${startDate}T${startTime}:00`,
        expectedEndTime: `${endDate}T${endTime}:00`,
      };

      const bookingResponse = await BookingApi.createBooking(bookingData);

      // If booking creation returned a MoMo payment payload, open the
      // payment URL (deeplink) and navigate to the pending screen which
      // will poll for payment status.
      const bookingCode = bookingResponse.bookingCode;

      if (bookingResponse.momoPayment && bookingResponse.momoPayment.payUrl) {
        try {
          const payUrl = bookingResponse.momoPayment.payUrl;
          const canOpen = await Linking.canOpenURL(payUrl);
          if (canOpen) {
            await Linking.openURL(payUrl);
          }
        } catch (err) {
          console.warn("Unable to open payment URL:", err);
        } finally {
          router.replace({
            pathname: "/payment/pending" as any,
            params: {
              bookingCode,
              orderId: bookingResponse.momoPayment.orderId,
              requestId: bookingResponse.momoPayment.requestId,
            },
          });
        }
      } else if (bookingResponse.paymentStatus === "COMPLETED") {
        // Payment already completed server-side
        router.replace({
          pathname: "/payment/success" as any,
          params: { bookingCode },
        });
      } else {
        // No MoMo payload returned — route user to payment selection (cash/card)
        router.replace({
          pathname: "/payment" as any,
          params: {
            bookingId: bookingResponse.id,
            amount: String(bookingResponse.totalAmount),
            bookingCode,
          },
        });
      }
    } catch (err: any) {
      Alert.alert(
        "Lỗi",
        err.message || "Không thể tạo đặt xe. Vui lòng thử lại."
      );
      console.error("Error creating booking:", err);
    } finally {
      setIsCreatingBooking(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  if (error || !vehicle || !station) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle" size={64} color={theme.colors.error} />
        <Text style={styles.errorText}>
          {error || "Không thể tải thông tin"}
        </Text>
        <Button mode="outlined" onPress={fetchData} style={styles.retryButton}>
          Thử lại
        </Button>
      </View>
    );
  }

  const duration = calculateDuration();
  const costs = calculateTotalCost();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
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
            <Text style={styles.vehicleName}>{vehicle.name}</Text>
            <View style={styles.infoRow}>
              <Ionicons
                name="pricetag"
                size={16}
                color={theme.colors.mutedForeground}
              />
              <Text style={styles.infoText}>{vehicle.licensePlate}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons
                name="flash"
                size={16}
                color={theme.colors.mutedForeground}
              />
              <Text style={styles.infoText}>{vehicle.fuelType}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons
                name="people"
                size={16}
                color={theme.colors.mutedForeground}
              />
              <Text style={styles.infoText}>{vehicle.capacity} chỗ ngồi</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Pickup Location */}
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
            <Text style={styles.stationName}>{station.name}</Text>
            <Text style={styles.stationAddress}>{station.address}</Text>
            {station.hotline && (
              <View style={styles.infoRow}>
                <Ionicons
                  name="call"
                  size={16}
                  color={theme.colors.mutedForeground}
                />
                <Text style={styles.infoText}>{station.hotline}</Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Rental Period */}
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
            <View style={styles.dateRow}>
              <View style={styles.dateBlock}>
                <Text style={styles.dateLabel}>Nhận xe</Text>
                <Text style={styles.dateValue}>{startDate}</Text>
                <Text style={styles.timeValue}>{startTime}</Text>
              </View>
              <Ionicons
                name="arrow-forward"
                size={24}
                color={theme.colors.mutedForeground}
              />
              <View style={styles.dateBlock}>
                <Text style={styles.dateLabel}>Trả xe</Text>
                <Text style={styles.dateValue}>{endDate}</Text>
                <Text style={styles.timeValue}>{endTime}</Text>
              </View>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.durationRow}>
              <Text style={styles.durationLabel}>Tổng thời gian:</Text>
              <Text style={styles.durationValue}>
                {duration.days > 0 && `${duration.days} ngày `}
                {duration.hours % 24 > 0 && `${duration.hours % 24} giờ`}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Cost Breakdown */}
        <Card style={styles.card}>
          <Card.Title
            title="Chi tiết chi phí"
            titleStyle={styles.cardTitle}
            left={(props) => (
              <Ionicons name="receipt" size={24} color={theme.colors.primary} />
            )}
          />
          <Card.Content>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Phí thuê xe</Text>
              <Text style={styles.costValue}>${costs.subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Tiền cọc</Text>
              <Text style={styles.costValue}>${costs.deposit.toFixed(2)}</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tổng cộng</Text>
              <Text style={styles.totalValue}>${costs.total.toFixed(2)}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Terms and Conditions */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.termsRow}>
              <Checkbox
                status={agreedToTerms ? "checked" : "unchecked"}
                onPress={() => setAgreedToTerms(!agreedToTerms)}
              />
              <Text style={styles.termsText}>
                Tôi đồng ý với các điều khoản và điều kiện, chính sách hủy đặt
                xe
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerPricing}>
          <Text style={styles.footerLabel}>Tổng thanh toán</Text>
          <Text style={styles.footerPrice}>${costs.total.toFixed(2)}</Text>
        </View>
        <Button
          mode="contained"
          onPress={handleConfirmBooking}
          disabled={!agreedToTerms || isCreatingBooking}
          loading={isCreatingBooking}
          icon="check-circle"
          contentStyle={styles.buttonContent}
        >
          {isCreatingBooking ? "Đang xử lý..." : "Xác nhận đặt xe"}
        </Button>
      </View>
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
    marginBottom: theme.spacing.sm,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateBlock: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: theme.colors.mutedForeground,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.foreground,
  },
  timeValue: {
    fontSize: 14,
    color: theme.colors.mutedForeground,
    marginTop: 2,
  },
  divider: {
    marginVertical: theme.spacing.md,
  },
  durationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  durationLabel: {
    fontSize: 14,
    color: theme.colors.foreground,
  },
  durationValue: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  costLabel: {
    fontSize: 14,
    color: theme.colors.foreground,
  },
  costValue: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.foreground,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.foreground,
    marginLeft: theme.spacing.xs,
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  footerPricing: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  footerLabel: {
    fontSize: 14,
    color: theme.colors.mutedForeground,
  },
  footerPrice: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  buttonContent: {
    paddingVertical: theme.spacing.xs,
  },
});
