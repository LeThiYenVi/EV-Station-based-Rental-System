import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Text, TextInput, Button, HelperText } from "react-native-paper";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordSchema } from "@/validators/auth.schema";
import { AuthApi } from "@/api/AuthApi";
import { theme } from "@/utils";
import { Ionicons } from "@expo/vector-icons";

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPasswordScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  const email = watch("email");

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      await AuthApi.forgotPassword({ email: data.email });
      setEmailSent(true);
      Alert.alert(
        "Email đã được gửi",
        "Vui lòng kiểm tra email và làm theo hướng dẫn để đặt lại mật khẩu."
      );
    } catch (error: any) {
      console.error("Forgot password error:", error);
      Alert.alert(
        "Lỗi",
        error.message || "Không thể gửi email. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
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
            <Ionicons name="mail" size={64} color={theme.colors.primary} />
          </View>
          <Text variant="headlineMedium" style={styles.title}>
            Quên mật khẩu?
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {emailSent
              ? `Email đã được gửi đến ${email}`
              : "Nhập email của bạn để nhận liên kết đặt lại mật khẩu"}
          </Text>
        </View>

        {!emailSent ? (
          <>
            {/* Email Input */}
            <View style={styles.form}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <TextInput
                      label="Email"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      mode="outlined"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      error={!!errors.email}
                      disabled={isLoading}
                      left={<TextInput.Icon icon="email" />}
                      style={styles.input}
                    />
                    <HelperText type="error" visible={!!errors.email}>
                      {errors.email?.message}
                    </HelperText>
                  </>
                )}
              />

              {/* Submit Button */}
              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                disabled={isLoading}
                style={styles.submitButton}
                contentStyle={styles.submitButtonContent}
              >
                Gửi email đặt lại
              </Button>

              {/* Back to Login */}
              <Button
                mode="text"
                onPress={() => router.back()}
                disabled={isLoading}
                style={styles.backButton}
              >
                Quay lại đăng nhập
              </Button>
            </View>
          </>
        ) : (
          <View style={styles.successContainer}>
            {/* Success Icon */}
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
            </View>

            {/* Instructions */}
            <View style={styles.instructions}>
              <Text variant="bodyMedium" style={styles.instructionText}>
                📧 Kiểm tra hộp thư đến của bạn
              </Text>
              <Text variant="bodyMedium" style={styles.instructionText}>
                🔗 Nhấp vào liên kết trong email
              </Text>
              <Text variant="bodyMedium" style={styles.instructionText}>
                🔒 Tạo mật khẩu mới
              </Text>
            </View>

            {/* Resend Button */}
            <Button
              mode="outlined"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={isLoading}
              style={styles.resendButton}
            >
              Gửi lại email
            </Button>

            {/* Back to Login */}
            <Button
              mode="text"
              onPress={() => router.push("/login")}
              disabled={isLoading}
              style={styles.backButton}
            >
              Quay lại đăng nhập
            </Button>
          </View>
        )}

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text variant="bodySmall" style={styles.helpText}>
            Không nhận được email?
          </Text>
          <Text variant="bodySmall" style={styles.helpText}>
            • Kiểm tra thư mục spam/junk
          </Text>
          <Text variant="bodySmall" style={styles.helpText}>
            • Đảm bảo email chính xác
          </Text>
          <Text variant="bodySmall" style={styles.helpText}>
            • Liên hệ hỗ trợ nếu cần thiết
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
    lineHeight: 22,
  },
  form: {
    marginBottom: theme.spacing.lg,
  },
  input: {
    marginBottom: 4,
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
  submitButtonContent: {
    paddingVertical: theme.spacing.xs,
  },
  backButton: {
    marginTop: theme.spacing.sm,
  },
  successContainer: {
    alignItems: "center",
  },
  successIcon: {
    marginBottom: theme.spacing.lg,
  },
  instructions: {
    width: "100%",
    marginBottom: theme.spacing.xl,
  },
  instructionText: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.foreground,
    textAlign: "center",
  },
  resendButton: {
    marginBottom: theme.spacing.sm,
    width: "100%",
  },
  helpContainer: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radius.lg,
  },
  helpText: {
    color: theme.colors.mutedForeground,
    textAlign: "center",
    marginBottom: 4,
  },
});
