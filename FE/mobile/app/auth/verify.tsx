import { AuthApi } from "@/api/AuthApi";
import { theme } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  StyleSheet,
  View,
} from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";

export default function VerifyScreen() {
  const params = useLocalSearchParams();
  const email = (params.email as string) || "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const inputRefs = useRef<(RNTextInput | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleCodeChange = (text: string, index: number) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, "");

    if (numericText.length > 1) {
      // Handle paste
      const digits = numericText.slice(0, 6).split("");
      const newCode = [...code];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit;
        }
      });
      setCode(newCode);

      // Focus next empty input or last input
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else {
      // Normal single digit input
      const newCode = [...code];
      newCode[index] = numericText;
      setCode(newCode);
      setError("");

      // Auto focus next input
      if (numericText && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      setError("Vui lòng nhập đủ 6 số");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await AuthApi.confirmAccount({
        email,
        code: verificationCode,
      });

      Alert.alert(
        "Xác thực thành công",
        "Tài khoản của bạn đã được kích hoạt. Vui lòng đăng nhập.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/login"),
          },
        ]
      );
    } catch (error: any) {
      console.error("Verification error:", error);
      setError(error.message || "Mã xác thực không đúng. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    setResendLoading(true);

    try {
      // TODO: Call resend verification code API
      // await AuthApi.resendVerificationCode(email);

      Alert.alert(
        "Thành công",
        "Mã xác thực mới đã được gửi đến email của bạn."
      );
      setResendTimer(60); // 60 seconds cooldown
      setCode(["", "", "", "", "", ""]);
      setError("");
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      console.error("Resend error:", error);
      Alert.alert(
        "Lỗi",
        error.message || "Không thể gửi lại mã. Vui lòng thử lại."
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="mail-open" size={64} color={theme.colors.primary} />
          </View>
          <Text variant="headlineMedium" style={styles.title}>
            Xác thực email
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Nhập mã 6 số đã được gửi đến
          </Text>
          <Text variant="bodyMedium" style={styles.email}>
            {email || "email của bạn"}
          </Text>
        </View>

        {/* Code Input */}
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref: any) => (inputRefs.current[index] = ref)}
              mode="outlined"
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              style={styles.codeInput}
              error={!!error}
              disabled={isLoading}
              selectTextOnFocus
            />
          ))}
        </View>

        <HelperText type="error" visible={!!error} style={styles.errorText}>
          {error}
        </HelperText>

        {/* Verify Button */}
        <Button
          mode="contained"
          onPress={handleVerify}
          loading={isLoading}
          disabled={isLoading || code.join("").length !== 6}
          style={styles.verifyButton}
          contentStyle={styles.verifyButtonContent}
        >
          Xác thực
        </Button>

        {/* Resend Code */}
        <View style={styles.resendContainer}>
          <Text variant="bodyMedium">Không nhận được mã? </Text>
          {resendTimer > 0 ? (
            <Text variant="bodyMedium" style={styles.resendTimer}>
              Gửi lại sau {resendTimer}s
            </Text>
          ) : (
            <Text
              variant="bodyMedium"
              style={styles.resendLink}
              onPress={handleResend}
              disabled={resendLoading}
            >
              {resendLoading ? "Đang gửi..." : "Gửi lại mã"}
            </Text>
          )}
        </View>

        {/* Back to Login */}
        <Button
          mode="text"
          onPress={() => router.push("/login")}
          disabled={isLoading}
          style={styles.backButton}
        >
          Quay lại đăng nhập
        </Button>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Text variant="bodySmall" style={styles.tipsTitle}>
            💡 Lưu ý
          </Text>
          <Text variant="bodySmall" style={styles.tipText}>
            • Mã xác thực có hiệu lực trong 15 phút
          </Text>
          <Text variant="bodySmall" style={styles.tipText}>
            • Kiểm tra thư mục spam nếu không thấy email
          </Text>
          <Text variant="bodySmall" style={styles.tipText}>
            • Bạn có thể gửi lại mã sau 60 giây
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  iconContainer: {
    marginBottom: theme.spacing.md,
  },
  title: {
    marginBottom: theme.spacing.xs,
    fontWeight: "bold",
    color: theme.colors.foreground,
  },
  subtitle: {
    color: theme.colors.mutedForeground,
    textAlign: "center",
    marginTop: theme.spacing.sm,
  },
  email: {
    color: theme.colors.primary,
    fontWeight: "600",
    marginTop: 4,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  codeInput: {
    width: 48,
    height: 56,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  errorText: {
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  verifyButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  verifyButtonContent: {
    paddingVertical: theme.spacing.xs,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  resendLink: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  resendTimer: {
    color: theme.colors.mutedForeground,
  },
  backButton: {
    marginTop: theme.spacing.sm,
  },
  tipsContainer: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radius.lg,
  },
  tipsTitle: {
    fontWeight: "bold",
    marginBottom: theme.spacing.sm,
    color: theme.colors.foreground,
  },
  tipText: {
    color: theme.colors.mutedForeground,
    marginBottom: 4,
  },
});
