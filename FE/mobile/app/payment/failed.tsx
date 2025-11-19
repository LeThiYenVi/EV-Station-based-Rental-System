import { View, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, Button, Card } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/utils";

export default function PaymentFailedScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const bookingCode = params.bookingCode as string;
  const reason = (params.reason as string) || "Payment was not completed";

  const handleRetry = () => {
    router.back();
  };

  const handleCancel = () => {
    router.replace("/(tab)/trip");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="close-circle" size={120} color="#F44336" />
        </View>

        <Text style={styles.title}>Payment Failed</Text>
        <Text style={styles.subtitle}>Your payment could not be processed</Text>

        <Card style={styles.infoCard}>
          <Card.Content>
            <View style={styles.infoRow}>
              <Ionicons
                name="information-circle"
                size={20}
                color={theme.colors.error}
              />
              <Text style={styles.reasonText}>{reason}</Text>
            </View>
          </Card.Content>
        </Card>

        {bookingCode && (
          <Card style={styles.bookingCard}>
            <Card.Content>
              <Text style={styles.bookingLabel}>Booking Code</Text>
              <Text style={styles.bookingValue}>{bookingCode}</Text>
              <Text style={styles.bookingHint}>
                Your booking is still pending. You can complete payment later
                from your bookings list.
              </Text>
            </Card.Content>
          </Card>
        )}
      </View>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleRetry}
          icon="refresh"
          style={styles.button}
        >
          Try Again
        </Button>

        <Button mode="outlined" onPress={handleCancel} style={styles.button}>
          View My Bookings
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
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.error + "10",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  reasonText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.foreground,
    lineHeight: 20,
  },
  bookingCard: {
    width: "100%",
  },
  bookingLabel: {
    fontSize: 12,
    color: theme.colors.mutedForeground,
    marginBottom: 4,
  },
  bookingValue: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  bookingHint: {
    fontSize: 12,
    color: theme.colors.mutedForeground,
    lineHeight: 18,
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
