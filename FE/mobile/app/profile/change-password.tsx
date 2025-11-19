import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Text, TextInput, Button, HelperText } from "react-native-paper";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { changePasswordSchema } from "@/validators/profile.schema";
import { AuthApi } from "@/api/AuthApi";
import { SimpleHeader } from "@/components/SimpleHeader";
import { theme } from "@/utils";
import { Ionicons } from "@expo/vector-icons";

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePasswordScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(changePasswordSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);

    try {
      await AuthApi.changePassword({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      Alert.alert("Thành công", "Mật khẩu đã được thay đổi.", [
        {
          text: "OK",
          onPress: () => {
            reset();
            router.back();
          },
        },
      ]);
    } catch (error: any) {
      console.error("Change password error:", error);
      Alert.alert(
        "Lỗi",
        error.message ||
          "Không thể thay đổi mật khẩu. Vui lòng kiểm tra mật khẩu hiện tại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SimpleHeader title="Đổi mật khẩu" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Security Notice */}
          <View style={styles.noticeCard}>
            <Ionicons
              name="shield-checkmark"
              size={48}
              color={theme.colors.primary}
            />
            <Text variant="bodyMedium" style={styles.noticeText}>
              Đảm bảo mật khẩu mới mạnh và khác với mật khẩu cũ để bảo vệ tài
              khoản của bạn.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Current Password */}
            <Controller
              control={control}
              name="currentPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    label="Mật khẩu hiện tại *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    mode="outlined"
                    secureTextEntry={!showCurrentPassword}
                    error={!!errors.currentPassword}
                    disabled={isLoading}
                    left={<TextInput.Icon icon="lock" />}
                    right={
                      <TextInput.Icon
                        icon={showCurrentPassword ? "eye-off" : "eye"}
                        onPress={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      />
                    }
                    style={styles.input}
                  />
                  <HelperText type="error" visible={!!errors.currentPassword}>
                    {errors.currentPassword?.message}
                  </HelperText>
                </>
              )}
            />

            {/* New Password */}
            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    label="Mật khẩu mới *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    mode="outlined"
                    secureTextEntry={!showNewPassword}
                    error={!!errors.newPassword}
                    disabled={isLoading}
                    left={<TextInput.Icon icon="lock-plus" />}
                    right={
                      <TextInput.Icon
                        icon={showNewPassword ? "eye-off" : "eye"}
                        onPress={() => setShowNewPassword(!showNewPassword)}
                      />
                    }
                    style={styles.input}
                  />
                  <HelperText type="error" visible={!!errors.newPassword}>
                    {errors.newPassword?.message}
                  </HelperText>
                  <HelperText type="info" visible={!errors.newPassword}>
                    Mật khẩu phải có 8-20 ký tự, bao gồm chữ hoa, chữ thường và
                    số
                  </HelperText>
                </>
              )}
            />

            {/* Confirm New Password */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    label="Xác nhận mật khẩu mới *"
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
              Đổi mật khẩu
            </Button>

            {/* Cancel Button */}
            <Button
              mode="outlined"
              onPress={() => router.back()}
              disabled={isLoading}
              style={styles.cancelButton}
            >
              Hủy
            </Button>
          </View>

          {/* Password Tips */}
          <View style={styles.tipsContainer}>
            <Text variant="titleSmall" style={styles.tipsTitle}>
              💡 Mẹo tạo mật khẩu mạnh
            </Text>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text variant="bodySmall" style={styles.tipText}>
                Sử dụng ít nhất 8 ký tự
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text variant="bodySmall" style={styles.tipText}>
                Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text variant="bodySmall" style={styles.tipText}>
                Tránh sử dụng thông tin cá nhân dễ đoán
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text variant="bodySmall" style={styles.tipText}>
                Không sử dụng lại mật khẩu từ các tài khoản khác
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  noticeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: "#E3F2FD",
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.lg,
  },
  noticeText: {
    flex: 1,
    color: "#1976D2",
    lineHeight: 20,
  },
  form: {
    marginBottom: theme.spacing.lg,
  },
  input: {
    marginBottom: 4,
  },
  submitButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  submitButtonContent: {
    paddingVertical: theme.spacing.xs,
  },
  cancelButton: {
    marginBottom: theme.spacing.md,
  },
  tipsContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radius.lg,
  },
  tipsTitle: {
    fontWeight: "bold",
    marginBottom: theme.spacing.sm,
    color: theme.colors.foreground,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  tipText: {
    flex: 1,
    color: theme.colors.mutedForeground,
    lineHeight: 18,
  },
});
