import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Mail } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { authService } from "@/services";

export default function OtpVerifyScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const router = useRouter();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng nhập đầy đủ 6 số OTP",
      });
      return;
    }

    try {
      setLoading(true);
      await authService.verifyOtp(email, otpCode);

      Toast.show({
        type: "success",
        text1: "Xác Thực Thành Công",
        text2: "Tài khoản của bạn đã được kích hoạt",
      });

      // Navigate to login
      setTimeout(() => {
        router.replace("/(auth)/login");
      }, 1000);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Xác Thực Thất Bại",
        text2: error.message || "Mã OTP không chính xác hoặc đã hết hạn",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    try {
      setResending(true);
      await authService.resendOtp(email);

      Toast.show({
        type: "success",
        text1: "Gửi Lại OTP Thành Công",
        text2: "Vui lòng kiểm tra email của bạn",
      });

      // Reset countdown
      setCountdown(60);
      // Clear OTP inputs
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: error.message || "Không thể gửi lại OTP",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#111827" />
          </Pressable>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Mail size={64} color="#10b981" />
          </View>

          <Text style={styles.title}>Xác Thực Email</Text>
          <Text style={styles.subtitle}>
            Chúng tôi đã gửi mã OTP gồm 6 số đến email
          </Text>
          <Text style={styles.email}>{email}</Text>

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[styles.otpInput, digit && styles.otpInputFilled]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                autoFocus={index === 0}
              />
            ))}
          </View>

          {/* Verify Button */}
          <Pressable
            style={[styles.verifyButton, loading && styles.buttonDisabled]}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.verifyButtonText}>Xác Thực</Text>
            )}
          </Pressable>

          {/* Resend OTP */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Không nhận được mã?</Text>
            {countdown > 0 ? (
              <Text style={styles.countdownText}>Gửi lại sau {countdown}s</Text>
            ) : (
              <Pressable onPress={handleResendOtp} disabled={resending}>
                <Text style={styles.resendButton}>
                  {resending ? "Đang gửi..." : "Gửi lại"}
                </Text>
              </Pressable>
            )}
          </View>

          {/* Help Text */}
          <View style={styles.helpBox}>
            <Text style={styles.helpText}>
              💡 Kiểm tra cả thư mục Spam/Junk nếu không thấy email
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  keyboardView: {
    flex: 1,
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ecfdf5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10b981",
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 32,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111827",
  },
  otpInputFilled: {
    borderColor: "#10b981",
    backgroundColor: "#ecfdf5",
  },
  verifyButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#10b981",
    alignItems: "center",
    marginBottom: 24,
  },
  verifyButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  resendText: {
    fontSize: 14,
    color: "#6b7280",
  },
  resendButton: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10b981",
  },
  countdownText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9ca3af",
  },
  helpBox: {
    backgroundColor: "#fef3c7",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fde68a",
    width: "100%",
  },
  helpText: {
    fontSize: 14,
    color: "#92400e",
    textAlign: "center",
    lineHeight: 20,
  },
});
