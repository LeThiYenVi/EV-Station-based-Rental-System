import { View, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, Button, Card } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/utils";

export default function PaymentSuccessScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const bookingCode = params.bookingCode as string;
  const paymentMethod = (params.paymentMethod as string) || "MOMO";

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={120} color="#4CAF50" />
        </View>

        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.subtitle}>Your booking has been confirmed</Text>

        <Card style={styles.infoCard}>
          <Card.Content>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Booking Code</Text>
              <Text style={styles.infoValue}>{bookingCode}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Payment Method</Text>
              <Text style={styles.infoValue}>{paymentMethod}</Text>
            </View>
          </Card.Content>
        </Card>

        <Text style={styles.message}>
          A confirmation email has been sent to your registered email address
        </Text>
      </View>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={() => router.replace("/(tab)/trip")}
          icon="calendar-check"
          style={styles.button}
        >
          View My Bookings
        </Button>

        <Button
          mode="outlined"
          onPress={() => router.replace("/(tab)/dashboard")}
          style={styles.button}
        >
          Back to Home
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
  iconContainer: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.xl,
    textAlign: "center",
  },
  infoCard: {
    width: "100%",
    marginBottom: theme.spacing.lg,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  infoLabel: {
    fontSize: 14,
    color: theme.colors.mutedForeground,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.foreground,
  },
  message: {
    fontSize: 13,
    color: theme.colors.mutedForeground,
    textAlign: "center",
    fontStyle: "italic",
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  button: {
    marginBottom: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
});
