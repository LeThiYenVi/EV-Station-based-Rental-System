import { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, Card, Text, HelperText } from "react-native-paper";
import { Calendar, CalendarUtils } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/utils";
import { useAuth } from "@/context/authContext";

export default function SelectTimeScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const vehicleId = params.vehicleId as string;
  const stationId = params.stationId as string;

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("18:00");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert("Yêu cầu đăng nhập", "Vui lòng đăng nhập để tiếp tục", [
        { text: "Đăng nhập", onPress: () => router.push("/login") },
        { text: "Hủy", onPress: () => router.back() },
      ]);
    }
  }, [isAuthenticated]);

  const calculateDuration = () => {
    if (!startDate || !endDate) return { hours: 0, days: 0 };

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    return { hours: diffHours, days: diffDays };
  };

  const calculateEstimatedPrice = () => {
    const duration = calculateDuration();
    // This is a placeholder - actual pricing would come from vehicle data
    const hourlyRate = 15;
    const dailyRate = 100;

    if (duration.days > 0) {
      return duration.days * dailyRate + (duration.hours % 24) * hourlyRate;
    }
    return duration.hours * hourlyRate;
  };

  const validateDates = (): boolean => {
    if (!startDate || !endDate) {
      setError("Vui lòng chọn ngày bắt đầu và kết thúc");
      return false;
    }

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const now = new Date();

    if (start < now) {
      setError("Thời gian bắt đầu phải sau thời điểm hiện tại");
      return false;
    }

    if (end <= start) {
      setError("Thời gian kết thúc phải sau thời gian bắt đầu");
      return false;
    }

    const duration = calculateDuration();
    if (duration.hours < 1) {
      setError("Thời gian thuê tối thiểu là 1 giờ");
      return false;
    }

    if (duration.days > 30) {
      setError("Thời gian thuê tối đa là 30 ngày");
      return false;
    }

    setError("");
    return true;
  };

  const handleContinue = () => {
    if (!validateDates()) return;

    router.push({
      pathname: "/booking/select-vehicle" as any,
      params: {
        stationId,
        vehicleId: vehicleId || "",
        startDate,
        endDate,
        startTime,
        endTime,
      },
    });
  };

  const today = new Date().toISOString().split("T")[0];
  const duration = calculateDuration();
  const estimatedPrice = calculateEstimatedPrice();

  const markedDates: any = {};
  if (startDate)
    markedDates[startDate] = {
      selected: true,
      startingDay: true,
      color: theme.colors.primary,
    };
  if (endDate)
    markedDates[endDate] = {
      selected: true,
      endingDay: true,
      color: theme.colors.primary,
    };

  // Mark dates in between
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const current = new Date(start);

    while (current < end) {
      current.setDate(current.getDate() + 1);
      const dateStr = current.toISOString().split("T")[0];
      if (dateStr !== endDate) {
        markedDates[dateStr] = {
          selected: true,
          color: theme.colors.primaryLight,
        };
      }
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Title
            title="Chọn thời gian thuê"
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
            <Text style={styles.sectionLabel}>Ngày bắt đầu</Text>
            <Calendar
              minDate={today}
              onDayPress={(day: any) => {
                setStartDate(day.dateString);
                if (!endDate || day.dateString > endDate) {
                  setEndDate("");
                }
              }}
              markedDates={
                startDate
                  ? {
                      [startDate]: {
                        selected: true,
                        selectedColor: theme.colors.primary,
                      },
                    }
                  : {}
              }
              theme={{
                selectedDayBackgroundColor: theme.colors.primary,
                todayTextColor: theme.colors.primary,
                arrowColor: theme.colors.primary,
              }}
            />

            {startDate && (
              <>
                <Text style={[styles.sectionLabel, styles.marginTop]}>
                  Ngày kết thúc
                </Text>
                <Calendar
                  minDate={startDate}
                  onDayPress={(day: any) => setEndDate(day.dateString)}
                  markedDates={
                    endDate
                      ? {
                          [endDate]: {
                            selected: true,
                            selectedColor: theme.colors.primary,
                          },
                        }
                      : {}
                  }
                  theme={{
                    selectedDayBackgroundColor: theme.colors.primary,
                    todayTextColor: theme.colors.primary,
                    arrowColor: theme.colors.primary,
                  }}
                />
              </>
            )}

            {error !== "" && (
              <HelperText type="error" visible={true} style={styles.errorText}>
                {error}
              </HelperText>
            )}

            {startDate && endDate && duration.hours > 0 && (
              <View style={styles.durationCard}>
                <View style={styles.durationRow}>
                  <Ionicons
                    name="time"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.durationLabel}>Thời gian thuê:</Text>
                </View>
                <Text style={styles.durationValue}>
                  {duration.days > 0 && `${duration.days} ngày `}
                  {duration.hours % 24 > 0 && `${duration.hours % 24} giờ`}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {startDate && endDate && duration.hours > 0 && (
          <Card style={styles.card}>
            <Card.Title
              title="Ước tính chi phí"
              titleStyle={styles.cardTitle}
              left={(props) => (
                <Ionicons name="cash" size={24} color={theme.colors.success} />
              )}
            />
            <Card.Content>
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Tổng ước tính</Text>
                <Text style={styles.priceValue}>
                  ${estimatedPrice.toFixed(2)}
                </Text>
              </View>
              <Text style={styles.priceNote}>
                * Giá chính xác sẽ được tính dựa trên xe bạn chọn
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleContinue}
          disabled={!startDate || !endDate || duration.hours < 1}
          icon="arrow-right"
          contentStyle={styles.buttonContent}
        >
          Tiếp tục
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
  card: {
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  marginTop: {
    marginTop: theme.spacing.lg,
  },
  errorText: {
    marginTop: theme.spacing.sm,
  },
  durationCard: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radius.lg,
  },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  durationLabel: {
    fontSize: 14,
    color: theme.colors.foreground,
    fontWeight: "600",
  },
  durationValue: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  priceContainer: {
    alignItems: "center",
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radius.lg,
  },
  priceLabel: {
    fontSize: 14,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.xs,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: "700",
    color: theme.colors.success,
  },
  priceNote: {
    fontSize: 12,
    color: theme.colors.mutedForeground,
    marginTop: theme.spacing.sm,
    fontStyle: "italic",
    textAlign: "center",
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  buttonContent: {
    paddingVertical: theme.spacing.xs,
  },
});
