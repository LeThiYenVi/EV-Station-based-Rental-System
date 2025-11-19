import { BookingApi } from "@/api/BookingApi";
import { PaymentMethod } from "@/types";
import { theme } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Linking, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Button, Card, Divider, List, Text } from "react-native-paper";

export default function PaymentScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const bookingId = params.bookingId as string;
  const amount = parseFloat(params.amount as string);
  const bookingCode = params.bookingCode as string;

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    PaymentMethod.MOMO
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    {
      id: PaymentMethod.MOMO,
      name: "MoMo E-Wallet",
      icon: "wallet",
      description: "Pay securely with MoMo",
      enabled: true,
    },
    {
      id: PaymentMethod.CARD,
      name: "Credit/Debit Card",
      icon: "card",
      description: "Visa, Mastercard, JCB",
      enabled: false, // Not implemented yet
    },
    {
      id: PaymentMethod.CASH,
      name: "Cash",
      icon: "cash",
      description: "Pay at station",
      enabled: true,
    },
  ];

  const handlePayment = async () => {
    if (selectedMethod === PaymentMethod.CASH) {
      Alert.alert(
        "Cash Payment",
        "You will pay in cash at the station when picking up the vehicle.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Confirm",
            onPress: () => {
              router.replace({
                pathname: "/payment/success" as any,
                params: { bookingCode, paymentMethod: "CASH" },
              });
            },
          },
        ]
      );
      return;
    }

    if (selectedMethod === PaymentMethod.MOMO) {
      try {
        setIsProcessing(true);

        // TODO: MoMo payment is initiated during booking creation
        // The booking creation API should return payment URL
        // Attempt to initiate payment using booking info (if booking has payment URL)
        if (bookingCode) {
          try {
            const booking = await BookingApi.getBookingByCode(bookingCode);
            // booking may include momoPayment when created recently
            const momo = (booking as any).momoPayment;
            if (momo && momo.payUrl) {
              const canOpen = await Linking.canOpenURL(momo.payUrl);
              if (canOpen) {
                await Linking.openURL(momo.payUrl);
              }

              router.replace({
                pathname: "/payment/pending" as any,
                params: {
                  bookingCode,
                  orderId: momo.orderId,
                  requestId: momo.requestId,
                },
              });
              return;
            }
          } catch (err) {
            console.warn("Error fetching booking payment info:", err);
          }
        }

        // Fallback: notify user and keep them on payment screen
        Alert.alert(
          "Coming Soon",
          "MoMo payment integration will be completed soon. If you already created a booking with a payment link, open it from your banking app or check the booking details.",
          [{ text: "OK", onPress: () => setIsProcessing(false) }]
        );

        /* Future implementation:
        const paymentResponse = await PaymentApi.createMoMoPayment(bookingId);
        const canOpen = await Linking.canOpenURL(paymentResponse.payUrl);
        
        if (canOpen) {
          await Linking.openURL(paymentResponse.payUrl);
          router.push({
            pathname: '/payment/pending',
            params: { 
              bookingCode,
              orderId: paymentResponse.orderId,
              requestId: paymentResponse.requestId,
            },
          });
        }
        */
      } catch (err: any) {
        Alert.alert(
          "Payment Error",
          err.message || "Failed to initiate payment"
        );
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Payment Method" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Payment Summary */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Booking Code</Text>
              <Text style={styles.summaryValue}>{bookingCode}</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>${amount.toFixed(2)}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Payment Methods */}
        <Card style={styles.methodsCard}>
          <Card.Title
            title="Select Payment Method"
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            {paymentMethods.map((method, index) => (
              <View key={method.id}>
                <List.Item
                  title={method.name}
                  description={method.description}
                  disabled={!method.enabled}
                  onPress={() => setSelectedMethod(method.id)}
                  left={(props) => (
                    <View style={styles.methodIcon}>
                      <Ionicons
                        name={method.icon as any}
                        size={28}
                        color={
                          method.enabled
                            ? theme.colors.primary
                            : theme.colors.mutedForeground
                        }
                      />
                    </View>
                  )}
                  right={(props) =>
                    method.enabled && (
                      <View style={styles.radioContainer}>
                        <View
                          style={[
                            styles.radioOuter,
                            selectedMethod === method.id &&
                              styles.radioOuterSelected,
                          ]}
                        >
                          {selectedMethod === method.id && (
                            <View style={styles.radioInner} />
                          )}
                        </View>
                      </View>
                    )
                  }
                  style={[
                    styles.methodItem,
                    !method.enabled && styles.methodItemDisabled,
                  ]}
                />
                {index < paymentMethods.length - 1 && <Divider />}
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Security Info */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <View style={styles.infoRow}>
              <Ionicons
                name="shield-checkmark"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.infoText}>
                Your payment is secured with SSL encryption
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Pay Button */}
      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handlePayment}
          loading={isProcessing}
          disabled={isProcessing}
          icon="lock"
          style={styles.payButton}
        >
          {isProcessing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
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
  },
  summaryCard: {
    margin: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.mutedForeground,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.foreground,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.foreground,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  divider: {
    marginVertical: theme.spacing.sm,
  },
  methodsCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  methodItem: {
    paddingVertical: theme.spacing.xs,
  },
  methodItemDisabled: {
    opacity: 0.5,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.muted,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.sm,
  },
  radioContainer: {
    justifyContent: "center",
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuterSelected: {
    borderColor: theme.colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  infoCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.primary + "10",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.foreground,
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  payButton: {
    paddingVertical: theme.spacing.xs,
  },
});
