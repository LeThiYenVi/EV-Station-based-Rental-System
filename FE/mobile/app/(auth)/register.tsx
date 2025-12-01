import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { Button, Input } from "@/components/common";
import { Mail, Lock, User, Phone } from "lucide-react-native";
import Toast from "react-native-toast-message";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng điền đầy đủ thông tin bắt buộc",
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Mật khẩu không khớp",
      });
      return;
    }

    try {
      setIsLoading(true);
      await register(email, password, name, phone);
      Toast.show({
        type: "success",
        text1: "Thành Công",
        text2: "Mã OTP đã được gửi đến email của bạn",
      });
      // Navigate to OTP verification screen with email and credentials
      router.push({
        pathname: "/(auth)/otp-verify",
        params: { email, name, password },
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: error.message || "Đăng ký thất bại",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>EV</Text>
          </View>
          <Text style={styles.title}>Tạo Tài Khoản</Text>
          <Text style={styles.subtitle}>Đăng ký để bắt đầu</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Input
            label="Họ Tên"
            placeholder="Nhập họ tên của bạn"
            value={name}
            onChangeText={setName}
            leftIcon={<User size={20} color="#9ca3af" />}
          />

          <Input
            label="Email"
            placeholder="Nhập email của bạn"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={20} color="#9ca3af" />}
          />

          <Input
            label="Số Điện Thoại (Tùy chọn)"
            placeholder="Nhập số điện thoại"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            leftIcon={<Phone size={20} color="#9ca3af" />}
          />

          <Input
            label="Mật Khẩu"
            placeholder="Tạo mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon={<Lock size={20} color="#9ca3af" />}
          />

          <Input
            label="Xác Nhận Mật Khẩu"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            leftIcon={<Lock size={20} color="#9ca3af" />}
          />
        </View>

        {/* Register Button */}
        <Button
          title="Đăng Ký"
          onPress={handleRegister}
          isLoading={isLoading}
        />

        {/* Login Link */}
        <View style={styles.loginLink}>
          <Text style={styles.loginText}>Đã có tài khoản? </Text>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.loginLinkText}>Đăng Nhập</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    backgroundColor: "#10b981",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoText: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 8,
  },
  formSection: {
    gap: 16,
    marginBottom: 24,
  },
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    fontSize: 16,
    color: "#6b7280",
  },
  loginLinkText: {
    fontSize: 16,
    color: "#10b981",
    fontWeight: "600",
  },
});
