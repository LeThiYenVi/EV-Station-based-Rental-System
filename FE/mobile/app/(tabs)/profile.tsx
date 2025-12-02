import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { Button } from "@/components/common";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  History,
  Bell,
  Shield,
  HelpCircle,
  Star,
  Gift,
} from "lucide-react-native";

export default function ProfileScreen() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  // Guest View - Login Prompt
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hồ Sơ</Text>
        </View>

        <View style={styles.guestContainer}>
          <View style={styles.guestAvatar}>
            <User size={48} color="#9ca3af" />
          </View>
          <Text style={styles.guestTitle}>Chào Mừng Đến EV Rental</Text>
          <Text style={styles.guestSubtitle}>
            Đăng nhập để truy cập hồ sơ, lịch sử chuyến đi và các tính năng cá
            nhân hóa
          </Text>

          <View style={styles.guestButtons}>
            <Button
              title="Đăng Nhập"
              onPress={() => router.push("/(auth)/login")}
            />
          </View>

          <Pressable onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.registerLink}>Tạo Tài Khoản</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Authenticated User View - Menu Items
  const menuItems = [
    {
      id: "1",
      icon: <User size={22} color="#6b7280" />,
      title: "Thông Tin Cá Nhân",
      subtitle: "Cập nhật thông tin của bạn",
      screen: "/personal-info" as any,
    },
    {
      id: "2",
      icon: <History size={22} color="#6b7280" />,
      title: "Lịch Sử Chuyến Đi",
      subtitle: "Xem các chuyến đi đã hoàn thành",
      screen: "/(profile)/trip-history",
    },
    {
      id: "3",
      icon: <CreditCard size={22} color="#6b7280" />,
      title: "Phương Thức Thanh Toán",
      subtitle: "Quản lý thẻ và ví điện tử",
      screen: "/(profile)/payment-methods",
    },
    {
      id: "4",
      icon: <Gift size={22} color="#6b7280" />,
      title: "Ưu Đãi & Khuyến Mãi",
      subtitle: "Mã giảm giá và phần thưởng",
      screen: "/(profile)/promotions",
    },
    {
      id: "5",
      icon: <Star size={22} color="#6b7280" />,
      title: "Đánh Giá Của Tôi",
      subtitle: "Đánh giá và phản hồi",
      screen: "/(profile)/reviews",
    },
    {
      id: "6",
      icon: <Bell size={22} color="#6b7280" />,
      title: "Thông Báo",
      subtitle: "Cài đặt thông báo",
      screen: "/(profile)/notifications-settings",
    },
    {
      id: "7",
      icon: <Shield size={22} color="#6b7280" />,
      title: "Bảo Mật",
      subtitle: "Mật khẩu và xác thực",
      screen: "/(profile)/security",
    },
    {
      id: "8",
      icon: <Settings size={22} color="#6b7280" />,
      title: "Cài Đặt",
      subtitle: "Tùy chỉnh ứng dụng",
      screen: "/(profile)/settings",
    },
    {
      id: "9",
      icon: <HelpCircle size={22} color="#6b7280" />,
      title: "Trợ Giúp & Hỗ Trợ",
      subtitle: "Câu hỏi thường gặp",
      screen: "/(profile)/help",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hồ Sơ</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <View style={styles.userContact}>
            <Mail size={16} color="#6b7280" />
            <Text style={styles.contactText}>{user?.email}</Text>
          </View>
          {user?.phone && (
            <View style={styles.userContact}>
              <Phone size={16} color="#6b7280" />
              <Text style={styles.contactText}>{user.phone}</Text>
            </View>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={() => router.push(item.screen as any)}
            >
              <View style={styles.menuIconContainer}>{item.icon}</View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <ChevronRight size={20} color="#9ca3af" />
            </Pressable>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.logoutButtonPressed,
            ]}
            onPress={handleLogout}
          >
            <LogOut size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Đăng Xuất</Text>
          </Pressable>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  guestContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#ffffff",
  },
  guestAvatar: {
    width: 96,
    height: 96,
    backgroundColor: "#e5e7eb",
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  guestTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  guestSubtitle: {
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 32,
  },
  guestButtons: {
    width: "100%",
    marginBottom: 12,
  },
  registerLink: {
    color: "#10b981",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  // User Card
  userCard: {
    backgroundColor: "#ffffff",
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  avatar: {
    width: 88,
    height: 88,
    backgroundColor: "#10b981",
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "bold",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  userContact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  contactText: {
    color: "#6b7280",
    fontSize: 14,
  },
  // Menu Section
  menuSection: {
    backgroundColor: "#ffffff",
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  menuItemPressed: {
    backgroundColor: "#f9fafb",
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#f3f4f6",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: "#9ca3af",
  },
  // Logout Section
  logoutSection: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#ef4444",
    borderRadius: 8,
  },
  logoutButtonPressed: {
    backgroundColor: "rgba(239, 68, 68, 0.05)",
  },
  logoutText: {
    color: "#ef4444",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 15,
  },
  appInfo: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: "center",
  },
  appVersion: {
    color: "#9ca3af",
    fontSize: 12,
  },
});
