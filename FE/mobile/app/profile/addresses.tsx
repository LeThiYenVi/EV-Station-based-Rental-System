import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { theme } from "@/utils";
import { Ionicons } from "@expo/vector-icons";

export default function AddressesPage() {
  const router = useRouter();

  // Mock addresses
  const addresses = [
    {
      id: 1,
      label: "Nhà riêng",
      address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      isDefault: true,
    },
    {
      id: 2,
      label: "Công ty",
      address: "456 Lê Lợi, Quận 3, TP.HCM",
      isDefault: false,
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: "Địa chỉ của tôi",
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: "#fff",
          headerShown: true,
          headerBackVisible: true,
        }}
      />
      <ScrollView style={styles.container}>
        {addresses.map((item) => (
          <View key={item.id} style={styles.addressCard}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="location"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.addressInfo}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>{item.label}</Text>
                {item.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Mặc định</Text>
                  </View>
                )}
              </View>
              <Text style={styles.address}>{item.address}</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="create-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => alert("Thêm địa chỉ mới")}
        >
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={theme.colors.primary}
          />
          <Text style={styles.addButtonText}>Thêm địa chỉ mới</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  addressCard: {
    backgroundColor: "white",
    margin: theme.spacing.md,
    marginBottom: 0,
    padding: theme.spacing.md,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
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
  addressInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  defaultBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  defaultText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  address: {
    fontSize: 14,
    color: "#666",
  },
  editButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    margin: theme.spacing.md,
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
});
