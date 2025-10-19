import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Share,
} from "react-native";
import { Stack } from "expo-router";
import { theme } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function ReferralPage() {
  const [referralCode] = useState("EVCAR2023");
  const referralLink = `https://evstation.app/ref/${referralCode}`;

  // Mock referral stats
  const stats = {
    totalReferred: 5,
    totalEarned: 250000,
    pending: 2,
  };

  const referredUsers = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      date: "15/10/2023",
      reward: 50000,
      status: "completed",
    },
    {
      id: 2,
      name: "Trần Thị B",
      date: "10/10/2023",
      reward: 50000,
      status: "completed",
    },
    {
      id: 3,
      name: "Lê Văn C",
      date: "05/10/2023",
      reward: 50000,
      status: "pending",
    },
  ];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Tham gia EV Station và nhận 50K! Dùng mã giới thiệu: ${referralCode}\n${referralLink}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopyCode = () => {
    alert(`Đã sao chép mã: ${referralCode}`);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Giới thiệu bạn bè",
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: "#fff",
          headerShown: true,
          headerBackVisible: true,
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.headerCard}>
          <Ionicons name="people" size={48} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>Mời bạn bè, nhận thưởng</Text>
          <Text style={styles.headerSubtitle}>
            Giới thiệu bạn bè đăng ký và hoàn thành chuyến đầu tiên, cả hai đều
            nhận 50K
          </Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalReferred}</Text>
            <Text style={styles.statLabel}>Bạn đã mời</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {stats.totalEarned.toLocaleString()}đ
            </Text>
            <Text style={styles.statLabel}>Đã nhận</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Đang chờ</Text>
          </View>
        </View>

        <View style={styles.codeSection}>
          <Text style={styles.sectionTitle}>Mã giới thiệu của bạn</Text>
          <View style={styles.codeCard}>
            <TextInput
              style={styles.codeInput}
              value={referralCode}
              editable={false}
            />
            <TouchableOpacity
              style={styles.copyButton}
              onPress={handleCopyCode}
            >
              <Ionicons
                name="copy-outline"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.copyButtonText}>Sao chép</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-social" size={20} color="white" />
            <Text style={styles.shareButtonText}>Chia sẻ ngay</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Lịch sử giới thiệu</Text>
          {referredUsers.map((user) => (
            <View key={user.id} style={styles.historyCard}>
              <View style={styles.historyLeft}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                </View>
              </View>
              <View style={styles.historyMiddle}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userDate}>{user.date}</Text>
              </View>
              <View style={styles.historyRight}>
                <Text style={styles.rewardAmount}>
                  +{user.reward.toLocaleString()}đ
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    user.status === "completed"
                      ? styles.completedBadge
                      : styles.pendingBadge,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {user.status === "completed" ? "Đã nhận" : "Chờ xử lý"}
                  </Text>
                </View>
              </View>
            </View>
          ))}
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
  headerCard: {
    backgroundColor: "white",
    margin: theme.spacing.lg,
    padding: theme.spacing.xl,
    borderRadius: 12,
    alignItems: "center",
    ...theme.shadows.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  statsCard: {
    backgroundColor: "white",
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: 12,
    flexDirection: "row",
    ...theme.shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#666",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#eee",
  },
  codeSection: {
    backgroundColor: "white",
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: 12,
    ...theme.shadows.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: theme.spacing.md,
  },
  codeCard: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  codeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    color: theme.colors.primary,
    backgroundColor: "#f9f9f9",
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 8,
  },
  copyButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  shareButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 8,
  },
  shareButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  historySection: {
    backgroundColor: "white",
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: 12,
    ...theme.shadows.sm,
  },
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  historyLeft: {
    marginRight: theme.spacing.md,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  historyMiddle: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  userDate: {
    fontSize: 13,
    color: "#666",
  },
  historyRight: {
    alignItems: "flex-end",
  },
  rewardAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#10B981",
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  completedBadge: {
    backgroundColor: "#D1FAE5",
  },
  pendingBadge: {
    backgroundColor: "#FEF3C7",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
