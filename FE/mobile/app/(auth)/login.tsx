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
import { Mail, Lock, Chrome, ArrowLeft } from "lucide-react-native";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng điền đầy đủ thông tin",
      });
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Đăng nhập thành công",
      });
      router.replace("/(tabs)");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Thông tin đăng nhập không đúng",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={24} color="#111827" />
      </Pressable>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>EV</Text>
          </View>
          <Text style={styles.title}>Chào Mừng Trở Lại</Text>
          <Text style={styles.subtitle}>Đăng nhập để tiếp tục</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
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
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon={<Lock size={20} color="#9ca3af" />}
          />

          <Pressable style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
          </Pressable>
        </View>

        {/* Login Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Đăng Nhập"
            onPress={handleLogin}
            isLoading={isLoading}
          />
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Hoặc tiếp tục với</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Login */}
        <Pressable style={styles.googleButton}>
          <Chrome size={20} color="#4285f4" />
          <Text style={styles.googleButtonText}>Đăng nhập với Google</Text>
        </Pressable>

        {/* Register Link */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Chưa có tài khoản? </Text>
          <Pressable onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.registerLink}>Đăng ký</Text>
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
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
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
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 16,
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
    color: "#6b7280",
    fontSize: 16,
    marginTop: 8,
  },
  formSection: {
    gap: 16,
    marginBottom: 24,
  },
  forgotPassword: {
    alignSelf: "flex-end",
  },
  forgotPasswordText: {
    color: "#10b981",
    fontWeight: "500",
    fontSize: 14,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#d1d5db",
  },
  dividerText: {
    color: "#6b7280",
    paddingHorizontal: 16,
    fontSize: 14,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 24,
  },
  googleButtonText: {
    color: "#111827",
    fontWeight: "600",
    marginLeft: 8,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  registerText: {
    color: "#6b7280",
  },
  registerLink: {
    color: "#10b981",
    fontWeight: "600",
  },
});
