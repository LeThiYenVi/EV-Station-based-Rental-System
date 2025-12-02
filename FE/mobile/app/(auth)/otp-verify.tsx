import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
<<<<<<< HEAD
  SafeAreaView,
  Pressable,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/common";
import { ArrowLeft } from "lucide-react-native";
import Toast from "react-native-toast-message";

export default function OTPVerifyScreen() {
  const router = useRouter();
  const { email, name, password } = useLocalSearchParams<{
    email: string;
    name: string;
    password: string;
  }>();
  const { verifyOTP, resendOTP } = useAuth();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
=======
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
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
  const [countdown, setCountdown] = useState(60);

  const inputRefs = useRef<(TextInput | null)[]>([]);

<<<<<<< HEAD
  // Countdown timer for resend button
=======
  // Countdown timer
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
<<<<<<< HEAD
    } else {
      setCanResend(true);
=======
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
    }
  }, [countdown]);

  const handleOtpChange = (value: string, index: number) => {
<<<<<<< HEAD
    // Only accept numbers
=======
    // Only allow numbers
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

<<<<<<< HEAD
    // Auto-focus next input
=======
    // Auto focus next input
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

<<<<<<< HEAD
  const handleKeyPress = (key: string, index: number) => {
    // Handle backspace
    if (key === "Backspace" && !otp[index] && index > 0) {
=======
  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
      inputRefs.current[index - 1]?.focus();
    }
  };

<<<<<<< HEAD
  const handleVerifyOTP = async () => {
=======
  const handleVerify = async () => {
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
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
<<<<<<< HEAD
      setIsLoading(true);
      await verifyOTP(email, otpCode, name, password);
      Toast.show({
        type: "success",
        text1: "Thành Công",
        text2: "Xác thực tài khoản thành công",
      });
      router.replace("/(tabs)");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Mã OTP không đúng hoặc đã hết hạn",
      });
      // Clear OTP inputs
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      setIsLoading(true);
      await resendOTP(email);
      Toast.show({
        type: "success",
        text1: "Thành Công",
        text2: "Đã gửi lại mã OTP mới",
      });
      setCountdown(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể gửi lại mã OTP",
      });
    } finally {
      setIsLoading(false);
=======
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
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
    }
  };

  return (
    <SafeAreaView style={styles.container}>
<<<<<<< HEAD
      {/* Back Button */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={24} color="#111827" />
      </Pressable>

      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>📧</Text>
          </View>
          <Text style={styles.title}>Xác Thực OTP</Text>
          <Text style={styles.subtitle}>
            Mã xác thực đã được gửi đến{"\n"}
            <Text style={styles.email}>{email}</Text>
          </Text>
        </View>

        {/* OTP Input Section */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, index)
              }
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              autoFocus={index === 0}
            />
          ))}
        </View>

        {/* Verify Button */}
        <Button
          title="Xác Nhận"
          onPress={handleVerifyOTP}
          isLoading={isLoading}
          disabled={otp.join("").length !== 6}
        />

        {/* Resend Section */}
        <View style={styles.resendSection}>
          <Text style={styles.resendText}>Không nhận được mã? </Text>
          {canResend ? (
            <Pressable onPress={handleResendOTP} disabled={isLoading}>
              <Text style={styles.resendLink}>Gửi lại</Text>
            </Pressable>
          ) : (
            <Text style={styles.countdown}>Gửi lại sau {countdown}s</Text>
          )}
        </View>

        {/* Help Text */}
        <Text style={styles.helpText}>💡 Mã OTP có hiệu lực trong 5 phút</Text>
      </View>
=======
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
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
<<<<<<< HEAD
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
=======
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
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
<<<<<<< HEAD
    paddingVertical: 32,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
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
    fontSize: 40,
=======
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
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
<<<<<<< HEAD
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
  },
  email: {
    color: "#10b981",
    fontWeight: "600",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    paddingHorizontal: 0,
=======
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
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
<<<<<<< HEAD
    borderColor: "#d1d5db",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    backgroundColor: "#f9fafb",
    marginHorizontal: 4,
  },
  otpInputFilled: {
    borderColor: "#10b981",
    backgroundColor: "#ffffff",
  },
  resendSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  resendText: {
    fontSize: 16,
    color: "#6b7280",
  },
  resendLink: {
    fontSize: 16,
    color: "#10b981",
    fontWeight: "600",
  },
  countdown: {
    fontSize: 16,
    color: "#9ca3af",
  },
  helpText: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 16,
=======
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
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
  },
});
