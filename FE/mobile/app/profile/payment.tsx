import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Stack } from "expo-router";
import { theme } from "@/utils";
import { Ionicons } from "@expo/vector-icons";

export default function PaymentPage() {
  // Mock payment methods
  const paymentMethods = [
    {
      id: 1,
      type: "card",
      number: "**** **** **** 1234",
      name: "VISA",
      isDefault: true,
    },
    {
      id: 2,
      type: "momo",
      number: "098****567",
      name: "MoMo",
      isDefault: false,
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: "Thẻ thanh toán",
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: "#fff",
          headerShown: true,
          headerBackVisible: true,
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          {paymentMethods.map((method) => (
            <View key={method.id} style={styles.paymentCard}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={method.type === "card" ? "card" : "wallet"}
                  size={24}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>{method.name}</Text>
                <Text style={styles.paymentNumber}>{method.number}</Text>
                {method.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Mặc định</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity style={styles.moreButton}>
                <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => alert("Thêm phương thức thanh toán")}
          >
            <Ionicons
              name="add-circle-outline"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.addButtonText}>Thêm thẻ thanh toán</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.noteSection}>
          <Ionicons name="information-circle" size={20} color="#666" />
          <Text style={styles.noteText}>
            Thông tin thẻ của bạn được bảo mật và mã hóa an toàn
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  section: {
    padding: theme.spacing.lg,
  },
  paymentCard: {
    backgroundColor: "white",
    padding: theme.spacing.lg,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
  },
  paymentInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  paymentNumber: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  defaultBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  defaultText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  moreButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderStyle: "dashed",
    gap: 8,
  },
  addButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  noteSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: theme.spacing.lg,
    backgroundColor: "#FEF3C7",
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    borderRadius: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: "#92400E",
  },
});
