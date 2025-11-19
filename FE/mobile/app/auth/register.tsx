import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  HelperText,
  ProgressBar,
} from "react-native-paper";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "@/validators/auth.schema";
import { AuthApi } from "@/api/AuthApi";
import { theme } from "@/utils";
import { Ionicons } from "@expo/vector-icons";

interface RegisterFormData {
  email: string;
  fullName: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      await AuthApi.register({
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      Alert.alert(
        "Đăng ký thành công",
        "Vui lòng kiểm tra email để xác thực tài khoản.",
        [
          {
            text: "OK",
            onPress: () => router.push("/login"),
          },
        ]
      );
    } catch (error: any) {
      console.error("Registration error:", error);
      Alert.alert(
        "Lỗi đăng ký",
        error.message || "Không thể tạo tài khoản. Vui lòng thử lại."
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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="car-sport" size={64} color={theme.colors.primary} />
          <Text variant="headlineLarge" style={styles.title}>
            Tạo tài khoản
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Điền thông tin để bắt đầu thuê xe điện
          </Text>
        </View>

        {/* Progress Bar */}
        {isLoading && (
          <ProgressBar indeterminate color={theme.colors.primary} />
        )}

        {/* Form */}
        <View style={styles.form}>
          {/* Full Name */}
          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  label="Họ và tên *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  error={!!errors.fullName}
                  disabled={isLoading}
                  left={<TextInput.Icon icon="account" />}
                  style={styles.input}
                />
                <HelperText type="error" visible={!!errors.fullName}>
                  {errors.fullName?.message}
                </HelperText>
              </>
            )}
          />

          {/* Email */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  label="Email *"
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

          {/* Phone */}
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  label="Số điện thoại *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  keyboardType="phone-pad"
                  error={!!errors.phone}
                  disabled={isLoading}
                  left={<TextInput.Icon icon="phone" />}
                  style={styles.input}
                />
                <HelperText type="error" visible={!!errors.phone}>
                  {errors.phone?.message}
                </HelperText>
              </>
            )}
          />

          {/* Password */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  label="Mật khẩu *"
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

          {/* Register Button */}
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}
            style={styles.registerButton}
            contentStyle={styles.registerButtonContent}
          >
            Đăng ký
          </Button>

          {/* Login Link */}
          <View style={styles.loginLink}>
            <Text variant="bodyMedium">Đã có tài khoản? </Text>
            <Text
              variant="bodyMedium"
              style={styles.loginLinkText}
              onPress={() => router.push("/login")}
            >
              Đăng nhập ngay
            </Text>
          </View>

          {/* Terms */}
          <Text variant="bodySmall" style={styles.terms}>
            Bằng cách đăng ký, bạn đồng ý với{" "}
            <Text style={styles.termsLink}>Điều khoản dịch vụ</Text> và{" "}
            <Text style={styles.termsLink}>Chính sách bảo mật</Text> của chúng
            tôi.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.lg,
  },
  title: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    fontWeight: "bold",
    color: theme.colors.foreground,
  },
  subtitle: {
    color: theme.colors.mutedForeground,
    textAlign: "center",
  },
  form: {
    marginBottom: theme.spacing.xl,
  },
  input: {
    marginBottom: 4,
  },
  registerButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  registerButtonContent: {
    paddingVertical: theme.spacing.xs,
  },
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: theme.spacing.md,
  },
  loginLinkText: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  terms: {
    marginTop: theme.spacing.lg,
    textAlign: "center",
    color: theme.colors.mutedForeground,
    lineHeight: 20,
  },
  termsLink: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
});
