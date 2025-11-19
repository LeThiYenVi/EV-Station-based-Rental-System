import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Text, TextInput, Button, HelperText } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "@/validators/auth.schema";
import { AuthApi } from "@/api/AuthApi";
import { theme } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import * as yup from "yup";

// Custom schema for this screen (without code field)
const resetPasswordFormSchema = yup.object().shape({
  password: yup
    .string()
    .required("Mật khẩu mới là bắt buộc")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(20, "Mật khẩu không được quá 20 ký tự")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Mật khẩu phải có chữ hoa, chữ thường và số"
    ),
  confirmPassword: yup
    .string()
    .required("Xác nhận mật khẩu là bắt buộc")
    .oneOf([yup.ref("password")], "Mật khẩu không khớp"),
});

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams();
  const token = params.token as string; // This is the code from email
  const email = params.email as string; // This is the user's email

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordFormSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token || !email) {
      Alert.alert(
        "Lỗi",
        "Thông tin không hợp lệ. Vui lòng yêu cầu đặt lại mật khẩu mới."
      );
      return;
    }

    setIsLoading(true);

    try {
      await AuthApi.resetPassword({
        email,
        code: token,
        newPassword: data.password,
      });

      Alert.alert(
        "Thành công",
        "Mật khẩu đã được đặt lại. Vui lòng đăng nhập với mật khẩu mới.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/login"),
          },
        ]
      );
    } catch (error: any) {
      console.error("Reset password error:", error);
      Alert.alert(
        "Lỗi",
        error.message || "Không thể đặt lại mật khẩu. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color={theme.colors.error} />
        <Text variant="headlineSmall" style={styles.errorTitle}>
          Liên kết không hợp lệ
        </Text>
        <Text variant="bodyMedium" style={styles.errorMessage}>
          Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
        </Text>
        <Button
          mode="contained"
          onPress={() => router.back()}
          style={styles.errorButton}
        >
          Quay lại
        </Button>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="lock-closed"
              size={64}
              color={theme.colors.primary}
            />
          </View>
          <Text variant="headlineMedium" style={styles.title}>
            Đặt lại mật khẩu
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Nhập mật khẩu mới của bạn
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Password */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  label="Mật khẩu mới *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  error={!!errors.password}
                  disabled={isLoading}
                  left={<TextInput.Icon icon="lock" />}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? "eye-off" : "eye"}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                  style={styles.input}
                />
                <HelperText type="error" visible={!!errors.password}>
                  {errors.password?.message}
                </HelperText>
                <HelperText type="info" visible={!errors.password}>
                  Mật khẩu phải có 8-20 ký tự, bao gồm chữ hoa, chữ thường và số
                </HelperText>
              </>
            )}
          />

          {/* Confirm Password */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  label="Xác nhận mật khẩu *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  secureTextEntry={!showConfirmPassword}
                  error={!!errors.confirmPassword}
                  disabled={isLoading}
                  left={<TextInput.Icon icon="lock-check" />}
                  right={
                    <TextInput.Icon
                      icon={showConfirmPassword ? "eye-off" : "eye"}
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    />
                  }
                  style={styles.input}
                />
                <HelperText type="error" visible={!!errors.confirmPassword}>
                  {errors.confirmPassword?.message}
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
            Đặt lại mật khẩu
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

        {/* Security Tips */}
        <View style={styles.tipsContainer}>
          <Text variant="titleSmall" style={styles.tipsTitle}>
            💡 Mẹo bảo mật
          </Text>
          <Text variant="bodySmall" style={styles.tipText}>
            • Sử dụng mật khẩu mạnh và duy nhất
          </Text>
          <Text variant="bodySmall" style={styles.tipText}>
            • Không chia sẻ mật khẩu với bất kỳ ai
          </Text>
          <Text variant="bodySmall" style={styles.tipText}>
            • Thay đổi mật khẩu định kỳ
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
  tipsContainer: {
    marginTop: theme.spacing.lg,
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  errorTitle: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    fontWeight: "bold",
    color: theme.colors.error,
    textAlign: "center",
  },
  errorMessage: {
    color: theme.colors.mutedForeground,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  errorButton: {
    marginTop: theme.spacing.md,
  },
});
