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

export default function GiftsPage() {
  // Mock gifts/vouchers
  const gifts = [
    {
      id: 1,
      title: "Giảm 50K",
      description: "Cho chuyến đi đầu tiên",
      code: "FIRST50K",
      expiryDate: "31/12/2023",
      isUsed: false,
    },
    {
      id: 2,
      title: "Giảm 100K",
      description: "Cho đơn từ 500K",
      code: "SAVE100K",
      expiryDate: "31/12/2023",
      isUsed: false,
    },
    {
      id: 3,
      title: "Giảm 30K",
      description: "Đặt xe vào cuối tuần",
      code: "WEEKEND30",
      expiryDate: "20/10/2023",
      isUsed: true,
    },
  ];

  const activeGifts = gifts.filter((g) => !g.isUsed);
  const usedGifts = gifts.filter((g) => g.isUsed);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Quà tặng",
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: "#fff",
          headerShown: true,
          headerBackVisible: true,
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Quà tặng khả dụng ({activeGifts.length})
          </Text>
          {activeGifts.map((gift) => (
            <View key={gift.id} style={styles.giftCard}>
              <View style={styles.giftLeft}>
                <View style={styles.discountCircle}>
                  <Ionicons
                    name="gift"
                    size={32}
                    color={theme.colors.primary}
                  />
                </View>
              </View>
              <View style={styles.giftMiddle}>
                <Text style={styles.giftTitle}>{gift.title}</Text>
                <Text style={styles.giftDescription}>{gift.description}</Text>
                <Text style={styles.giftCode}>Mã: {gift.code}</Text>
                <Text style={styles.expiryDate}>HSD: {gift.expiryDate}</Text>
              </View>
              <TouchableOpacity style={styles.useButton}>
                <Text style={styles.useButtonText}>Dùng ngay</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {usedGifts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Đã sử dụng ({usedGifts.length})
            </Text>
            {usedGifts.map((gift) => (
              <View
                key={gift.id}
                style={[styles.giftCard, styles.usedGiftCard]}
              >
                <View style={styles.giftLeft}>
                  <View style={[styles.discountCircle, styles.usedCircle]}>
                    <Ionicons name="checkmark-circle" size={32} color="#999" />
                  </View>
                </View>
                <View style={styles.giftMiddle}>
                  <Text style={[styles.giftTitle, styles.usedText]}>
                    {gift.title}
                  </Text>
                  <Text style={[styles.giftDescription, styles.usedText]}>
                    {gift.description}
                  </Text>
                  <Text style={[styles.giftCode, styles.usedText]}>
                    Mã: {gift.code}
                  </Text>
                </View>
                <View style={styles.usedBadge}>
                  <Text style={styles.usedBadgeText}>Đã dùng</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.redeemButton}
          onPress={() => alert("Nhập mã quà tặng")}
        >
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={theme.colors.primary}
          />
          <Text style={styles.redeemButtonText}>Nhập mã quà tặng</Text>
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
  section: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: theme.spacing.md,
    color: "#333",
  },
  giftCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    ...theme.shadows.sm,
  },
  usedGiftCard: {
    opacity: 0.6,
  },
  giftLeft: {
    marginRight: theme.spacing.md,
  },
  discountCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
  },
  usedCircle: {
    backgroundColor: "#f5f5f5",
  },
  giftMiddle: {
    flex: 1,
  },
  giftTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  giftDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  giftCode: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  expiryDate: {
    fontSize: 12,
    color: "#999",
  },
  usedText: {
    color: "#999",
  },
  useButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  useButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  usedBadge: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  usedBadgeText: {
    color: "#999",
    fontSize: 12,
    fontWeight: "500",
  },
  redeemButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    margin: theme.spacing.lg,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderStyle: "dashed",
    gap: 8,
  },
  redeemButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "500",
  },
});
