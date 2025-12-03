import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { Input, Button } from "@/components/common";
import { Lock, Key, Smartphone, Shield } from "lucide-react-native";
import Toast from "react-native-toast-message";

export default function SecurityScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng điền đầy đủ thông tin",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Mật khẩu mới không khớp",
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Thành Công",
      text2: "Mật khẩu đã được thay đổi",
    });

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Change Password Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Lock size={20} color="#111827" />
            <Text style={styles.sectionTitle}>Đổi Mật Khẩu</Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              label="Mật khẩu hiện tại"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Nhập mật khẩu hiện tại"
              secureTextEntry
              leftIcon={<Key size={20} color="#9ca3af" />}
            />

            <Input
              label="Mật khẩu mới"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nhập mật khẩu mới"
              secureTextEntry
              leftIcon={<Key size={20} color="#9ca3af" />}
            />

            <Input
              label="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Nhập lại mật khẩu mới"
              secureTextEntry
              leftIcon={<Key size={20} color="#9ca3af" />}
            />

            <Button
              title="Đổi Mật Khẩu"
              onPress={handleChangePassword}
              variant="primary"
            />
          </View>
        </View>

        {/* Two-Factor Authentication */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={20} color="#111827" />
            <Text style={styles.sectionTitle}>Xác Thực Hai Yếu Tố</Text>
          </View>

          <View style={styles.twoFactorContainer}>
            <View style={styles.twoFactorInfo}>
              <Smartphone size={24} color="#6b7280" />
              <View style={styles.twoFactorText}>
                <Text style={styles.twoFactorTitle}>
                  {twoFactorEnabled ? "Đã Bật" : "Chưa Bật"}
                </Text>
                <Text style={styles.twoFactorDescription}>
                  Tăng cường bảo mật tài khoản với mã OTP
                </Text>
              </View>
            </View>

            <Pressable
              style={[
                styles.toggleButton,
                twoFactorEnabled && styles.toggleButtonActive,
              ]}
              onPress={() => {
                setTwoFactorEnabled(!twoFactorEnabled);
                Toast.show({
                  type: "success",
                  text1: twoFactorEnabled ? "Đã Tắt" : "Đã Bật",
                  text2: `Xác thực hai yếu tố ${
                    twoFactorEnabled ? "đã được tắt" : "đã được bật"
                  }`,
                });
              }}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  twoFactorEnabled && styles.toggleButtonTextActive,
                ]}
              >
                {twoFactorEnabled ? "Tắt" : "Bật"}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Security Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Mẹo Bảo Mật</Text>
          <View style={styles.tipsContainer}>
            <Text style={styles.tipItem}>
              • Sử dụng mật khẩu mạnh với ít nhất 8 ký tự
            </Text>
            <Text style={styles.tipItem}>
              • Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt
            </Text>
            <Text style={styles.tipItem}>
              • Không sử dụng mật khẩu giống nhau cho nhiều tài khoản
            </Text>
            <Text style={styles.tipItem}>
              • Bật xác thực hai yếu tố để tăng cường bảo mật
            </Text>
            <Text style={styles.tipItem}>
              • Thay đổi mật khẩu định kỳ mỗi 3-6 tháng
            </Text>
          </View>
        </View>

        {/* Active Sessions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phiên Đăng Nhập</Text>
          <View style={styles.sessionItem}>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionDevice}>iPhone 14 Pro</Text>
              <Text style={styles.sessionTime}>Đang hoạt động</Text>
            </View>
            <View style={styles.currentBadge}>
              <Text style={styles.currentBadgeText}>Thiết bị này</Text>
            </View>
          </View>
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
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  formContainer: {
    gap: 16,
  },
  twoFactorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  twoFactorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  twoFactorText: {
    flex: 1,
  },
  twoFactorTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  twoFactorDescription: {
    fontSize: 13,
    color: "#6b7280",
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#10b981",
  },
  toggleButtonActive: {
    backgroundColor: "#10b981",
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10b981",
  },
  toggleButtonTextActive: {
    color: "#ffffff",
  },
  tipsContainer: {
    gap: 12,
    paddingTop: 8,
  },
  tipItem: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  sessionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionDevice: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  sessionTime: {
    fontSize: 13,
    color: "#6b7280",
  },
  currentBadge: {
    backgroundColor: "#d1fae5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#065f46",
  },
});
