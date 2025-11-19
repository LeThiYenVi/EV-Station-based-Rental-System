import { BookingApi } from "@/api/BookingApi";
import { theme } from "@/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";

export default function PaymentPendingScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const bookingCode = params.bookingCode as string;
  const orderId = params.orderId as string;

  const [isChecking, setIsChecking] = useState(true);
  const [checkCount, setCheckCount] = useState(0);

  useEffect(() => {
    // Poll payment status every 3 seconds for up to 2 minutes
    const interval = setInterval(async () => {
      if (checkCount >= 40) {
        // 40 * 3s = 120s = 2 minutes
        clearInterval(interval);
        router.replace({
          pathname: "/payment/failed" as any,
          params: { bookingCode, reason: "Payment timeout" },
        });
        return;
      }

      try {
        // Check booking payment status
        const booking = await BookingApi.getBookingByCode(bookingCode);

        if (booking.paymentStatus === "COMPLETED") {
          clearInterval(interval);
          router.replace({
            pathname: "/payment/success" as any,
            params: { bookingCode },
          });
        } else if (booking.paymentStatus === "FAILED") {
          clearInterval(interval);
          router.replace({
            pathname: "/payment/failed" as any,
            params: { bookingCode, reason: "Payment failed" },
          });
        }

        setCheckCount((prev) => prev + 1);
      } catch (err) {
        console.error("Error checking payment status:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [checkCount]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size={64} style={styles.spinner} />

        <Text style={styles.title}>Processing Payment...</Text>
        <Text style={styles.subtitle}>
          Please complete the payment in MoMo app
        </Text>

        <Text style={styles.bookingCode}>Booking: {bookingCode}</Text>

        <Text style={styles.hint}>
          This page will automatically update when payment is complete
        </Text>
      </View>

      <View style={styles.footer}>
        <Button mode="text" onPress={() => router.replace("/(tab)/trip")}>
          Cancel and return to bookings
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
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  spinner: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.lg,
    textAlign: "center",
  },
  bookingCode: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  hint: {
    fontSize: 12,
    color: theme.colors.mutedForeground,
    textAlign: "center",
    fontStyle: "italic",
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});
