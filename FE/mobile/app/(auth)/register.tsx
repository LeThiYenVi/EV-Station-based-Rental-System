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
import { Mail, Lock, User, Phone, ArrowLeft } from "lucide-react-native";
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
    // Validate required fields (phone is now required)
    if (!name || !email || !phone || !password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng điền đầy đủ thông tin bắt buộc",
      });
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Mật khẩu không khớp",
      });
      return;
    }

    // Validate password length
    if (password.length < 8 || password.length > 20) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Mật khẩu phải có từ 8-20 ký tự",
      });
      return;
    }

    // Validate password strength (Cognito requirements)
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!hasUppercase) {
      Toast.show({
        type: "error",
        text1: "Mật khẩu yếu",
        text2: "Phải có ít nhất 1 chữ HOA (A-Z)",
      });
      return;
    }

    if (!hasLowercase) {
      Toast.show({
        type: "error",
        text1: "Mật khẩu yếu",
        text2: "Phải có ít nhất 1 chữ thường (a-z)",
      });
      return;
    }

    if (!hasNumber) {
      Toast.show({
        type: "error",
        text1: "Mật khẩu yếu",
        text2: "Phải có ít nhất 1 chữ số (0-9)",
      });
      return;
    }

    if (!hasSymbol) {
      Toast.show({
        type: "error",
        text1: "Mật khẩu yếu",
        text2: "Phải có ít nhất 1 ký tự đặc biệt (!@#$%...)",
      });
      return;
    }

    try {
      setIsLoading(true);
      // Call real API
      await register(email, password, name, phone);

      // Show success message
      Toast.show({
        type: "success",
        text1: "Đăng Ký Thành Công",
        text2: "Vui lòng kiểm tra email để xác thực tài khoản",
      });

      // Navigate to OTP verification
      router.push({
        pathname: "/(auth)/otp-verify",
        params: { email },
      });
    } catch (error: any) {
      // Error toast is handled by useAuth
      console.error("Register failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.replace("/(tabs)/profile")}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#111827" />
        </Pressable>
      </View>

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
            label="Số Điện Thoại *"
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

          {/* Password Requirements */}
          <View style={styles.passwordHint}>
            <Text style={styles.hintTitle}>Yêu cầu mật khẩu:</Text>
            <Text style={styles.hintText}>• 8-20 ký tự</Text>
            <Text style={styles.hintText}>• Ít nhất 1 chữ HOA (A-Z)</Text>
            <Text style={styles.hintText}>• Ít nhất 1 chữ thường (a-z)</Text>
            <Text style={styles.hintText}>• Ít nhất 1 chữ số (0-9)</Text>
            <Text style={styles.hintText}>
              • Ít nhất 1 ký tự đặc biệt (!@#$%...)
            </Text>
          </View>

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
          <Pressable
            onPress={() => router.push("/(auth)/login")}
            style={styles.loginButton}
          >
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
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
  passwordHint: {
    backgroundColor: "#eff6ff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dbeafe",
    marginTop: -8,
  },
  hintTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1e40af",
    marginBottom: 6,
  },
  hintText: {
    fontSize: 12,
    color: "#3b82f6",
    lineHeight: 18,
  },
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  loginText: {
    fontSize: 16,
    color: "#6b7280",
  },
  loginButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  loginLinkText: {
    fontSize: 16,
    color: "#10b981",
    fontWeight: "600",
  },
});
