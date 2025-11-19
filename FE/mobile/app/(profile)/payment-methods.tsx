import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { CreditCard, Plus, MoreVertical, Wallet } from "lucide-react-native";
import { Button } from "@/components/common";

export default function PaymentMethodsScreen() {
  const [cards, setCards] = useState([
    {
      id: "1",
      type: "visa",
      last4: "4242",
      expiry: "12/25",
      isDefault: true,
      holderName: "NGUYEN VAN A",
    },
    {
      id: "2",
      type: "mastercard",
      last4: "8888",
      expiry: "08/26",
      isDefault: false,
      holderName: "NGUYEN VAN A",
    },
  ]);

  const wallets = [
    { id: "1", name: "Momo", balance: 500000, connected: true },
    { id: "2", name: "ZaloPay", balance: 0, connected: false },
    { id: "3", name: "VNPay", balance: 250000, connected: true },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Cards Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Thẻ Ngân Hàng</Text>
            <Pressable style={styles.addButton}>
              <Plus size={20} color="#10b981" />
              <Text style={styles.addButtonText}>Thêm Thẻ</Text>
            </Pressable>
          </View>

          {cards.map((card) => (
            <View key={card.id} style={styles.cardItem}>
              <View style={styles.cardIconContainer}>
                <CreditCard size={24} color="#6b7280" />
              </View>
              <View style={styles.cardInfo}>
                <View style={styles.cardRow}>
                  <Text style={styles.cardType}>
                    {card.type.toUpperCase()} •••• {card.last4}
                  </Text>
                  {card.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Mặc Định</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.cardDetails}>
                  {card.holderName} • Hết hạn {card.expiry}
                </Text>
              </View>
              <Pressable style={styles.menuButton}>
                <MoreVertical size={20} color="#9ca3af" />
              </Pressable>
            </View>
          ))}
        </View>

        {/* E-Wallets Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ví Điện Tử</Text>
          {wallets.map((wallet) => (
            <View key={wallet.id} style={styles.walletItem}>
              <View style={styles.walletIconContainer}>
                <Wallet size={24} color="#6b7280" />
              </View>
              <View style={styles.walletInfo}>
                <Text style={styles.walletName}>{wallet.name}</Text>
                {wallet.connected ? (
                  <Text style={styles.walletBalance}>
                    Số dư: {wallet.balance.toLocaleString("vi-VN")}đ
                  </Text>
                ) : (
                  <Text style={styles.walletNotConnected}>Chưa liên kết</Text>
                )}
              </View>
              {wallet.connected ? (
                <Pressable style={styles.manageButton}>
                  <Text style={styles.manageButtonText}>Quản Lý</Text>
                </Pressable>
              ) : (
                <Pressable style={styles.connectButton}>
                  <Text style={styles.connectButtonText}>Liên Kết</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💳 Thanh Toán An Toàn</Text>
          <Text style={styles.infoText}>
            Thông tin thẻ của bạn được mã hóa và bảo mật. Chúng tôi không lưu
            trữ thông tin thẻ trên máy chủ của mình.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addButtonText: {
    color: "#10b981",
    fontWeight: "600",
    fontSize: 14,
  },
  cardItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  cardType: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  defaultBadge: {
    backgroundColor: "#d1fae5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#065f46",
  },
  cardDetails: {
    fontSize: 13,
    color: "#6b7280",
  },
  menuButton: {
    padding: 4,
  },
  walletItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  walletIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  walletInfo: {
    flex: 1,
  },
  walletName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  walletBalance: {
    fontSize: 13,
    color: "#10b981",
    fontWeight: "500",
  },
  walletNotConnected: {
    fontSize: 13,
    color: "#9ca3af",
  },
  manageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  manageButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  connectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "#10b981",
  },
  connectButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ffffff",
  },
  infoBox: {
    backgroundColor: "#eff6ff",
    padding: 16,
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e40af",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: "#1e3a8a",
    lineHeight: 20,
  },
});
