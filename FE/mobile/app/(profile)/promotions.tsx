import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import { Tag, Gift, Copy, Clock } from "lucide-react-native";
import Toast from "react-native-toast-message";

export default function PromotionsScreen() {
  const [activeTab, setActiveTab] = useState<"available" | "used">("available");
  const [promoCode, setPromoCode] = useState("");

  const availablePromotions = [
    {
      id: "1",
      code: "EVRENTAL20",
      title: "Giảm 20% cho chuyến đi đầu tiên",
      description: "Áp dụng cho chuyến đi đầu tiên của bạn",
      discount: "20%",
      expiry: "31/12/2025",
      minAmount: 50000,
    },
    {
      id: "2",
      code: "FREESHIP",
      title: "Miễn phí 5km đầu tiên",
      description: "Không tính phí cho 5km đầu",
      discount: "Miễn phí",
      expiry: "25/11/2025",
      minAmount: 0,
    },
    {
      id: "3",
      code: "WEEKEND50",
      title: "Giảm 50k cuối tuần",
      description: "Áp dụng cho chuyến đi vào thứ 7 và CN",
      discount: "50,000đ",
      expiry: "30/11/2025",
      minAmount: 100000,
    },
  ];

  const usedPromotions = [
    {
      id: "1",
      code: "WELCOME10",
      title: "Chào mừng thành viên mới",
      usedDate: "15/11/2025",
      savedAmount: 15000,
    },
  ];

  const copyCode = (code: string) => {
    Toast.show({
      type: "success",
      text1: "Đã Sao Chép",
      text2: `Mã ${code} đã được sao chép`,
    });
  };

  const applyCode = () => {
    if (promoCode.trim()) {
      Toast.show({
        type: "success",
        text1: "Thành Công",
        text2: "Mã khuyến mãi đã được áp dụng",
      });
      setPromoCode("");
    }
  };

  return (
    <View style={styles.container}>
      {/* Input Section */}
      <View style={styles.inputSection}>
        <View style={styles.inputContainer}>
          <Tag size={20} color="#9ca3af" />
          <TextInput
            style={styles.input}
            placeholder="Nhập mã khuyến mãi"
            value={promoCode}
            onChangeText={setPromoCode}
            autoCapitalize="characters"
          />
        </View>
        <Pressable
          style={[styles.applyButton, !promoCode && styles.applyButtonDisabled]}
          onPress={applyCode}
          disabled={!promoCode}
        >
          <Text style={styles.applyButtonText}>Áp Dụng</Text>
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === "available" && styles.tabActive]}
          onPress={() => setActiveTab("available")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "available" && styles.tabTextActive,
            ]}
          >
            Khả Dụng ({availablePromotions.length})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "used" && styles.tabActive]}
          onPress={() => setActiveTab("used")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "used" && styles.tabTextActive,
            ]}
          >
            Đã Dùng ({usedPromotions.length})
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView}>
        {activeTab === "available" ? (
          <>
            {availablePromotions.map((promo) => (
              <View key={promo.id} style={styles.promoCard}>
                <View style={styles.promoHeader}>
                  <View style={styles.giftIcon}>
                    <Gift size={24} color="#10b981" />
                  </View>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{promo.discount}</Text>
                  </View>
                </View>

                <Text style={styles.promoTitle}>{promo.title}</Text>
                <Text style={styles.promoDescription}>{promo.description}</Text>

                <View style={styles.promoCodeContainer}>
                  <View style={styles.codeBox}>
                    <Text style={styles.codeText}>{promo.code}</Text>
                  </View>
                  <Pressable
                    style={styles.copyButton}
                    onPress={() => copyCode(promo.code)}
                  >
                    <Copy size={16} color="#10b981" />
                    <Text style={styles.copyText}>Sao Chép</Text>
                  </Pressable>
                </View>

                <View style={styles.promoFooter}>
                  <View style={styles.footerItem}>
                    <Clock size={14} color="#9ca3af" />
                    <Text style={styles.footerText}>HSD: {promo.expiry}</Text>
                  </View>
                  {promo.minAmount > 0 && (
                    <Text style={styles.minAmount}>
                      Tối thiểu: {promo.minAmount.toLocaleString("vi-VN")}đ
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </>
        ) : (
          <>
            {usedPromotions.map((promo) => (
              <View key={promo.id} style={styles.usedCard}>
                <View style={styles.usedHeader}>
                  <Text style={styles.usedTitle}>{promo.title}</Text>
                  <Text style={styles.savedAmount}>
                    Tiết kiệm: {promo.savedAmount.toLocaleString("vi-VN")}đ
                  </Text>
                </View>
                <View style={styles.usedInfo}>
                  <Text style={styles.usedCode}>Mã: {promo.code}</Text>
                  <Text style={styles.usedDate}>Sử dụng: {promo.usedDate}</Text>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  inputSection: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#ffffff",
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
  },
  applyButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: "center",
  },
  applyButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
  applyButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#10b981",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  tabTextActive: {
    color: "#10b981",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  promoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  promoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  giftIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#d1fae5",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  discountBadge: {
    backgroundColor: "#10b981",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  discountText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  promoDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
  },
  promoCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  codeBox: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
  },
  codeText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#10b981",
    textAlign: "center",
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  copyText: {
    color: "#10b981",
    fontWeight: "600",
    fontSize: 13,
  },
  promoFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: "#6b7280",
  },
  minAmount: {
    fontSize: 12,
    color: "#9ca3af",
  },
  usedCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    opacity: 0.8,
  },
  usedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  usedTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    flex: 1,
  },
  savedAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10b981",
  },
  usedInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  usedCode: {
    fontSize: 13,
    color: "#6b7280",
  },
  usedDate: {
    fontSize: 13,
    color: "#9ca3af",
  },
});
