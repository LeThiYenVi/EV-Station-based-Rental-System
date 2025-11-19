import { UserApi } from "@/api/UserApi";
import { ImagePickerButton } from "@/components/ImagePickerButton";
import { useAuth } from "@/context/authContext";
import { UpdateUserRequest } from "@/types";
import { theme } from "@/utils";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Appbar,
  Button,
  HelperText,
  Text,
  TextInput,
} from "react-native-paper";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    user?.avatarUrl
  );

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const profile = await UserApi.getMyInfo();
      setFullName(profile.fullName || "");
      setPhoneNumber(profile.phone || "");
      setAvatarUrl(profile.avatarUrl);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể tải thông tin");
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ tên";
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = "Họ tên phải có ít nhất 2 ký tự";
    }

    if (phoneNumber && !/^[0-9]{10,11}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ (10-11 số)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    try {
      setIsSaving(true);

      const updateData: UpdateUserRequest = {
        fullName: fullName.trim(),
        phone: phoneNumber || undefined,
      };

      await UserApi.updateMyProfile(updateData);

      // Refresh user info in context
      await refreshUser();

      Alert.alert("Thành công", "Cập nhật thông tin thành công", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể cập nhật thông tin");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="Chỉnh sửa hồ sơ" />
        </Appbar.Header>
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Chỉnh sửa hồ sơ" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          {/* Full Name */}
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder} />
            )}

            <ImagePickerButton
              currentImage={avatarUrl}
              onImageSelected={async (uri) => {
                if (!uri) {
                  // Removal is not implemented server-side yet
                  Alert.alert(
                    "Không hỗ trợ",
                    "Xóa ảnh đại diện hiện chưa được hỗ trợ."
                  );
                  return;
                }

                try {
                  setIsSaving(true);
                  await UserApi.uploadAvatar(uri);
                  await refreshUser();
                  const updated = await UserApi.getMyInfo();
                  setAvatarUrl(updated.avatarUrl);
                  Alert.alert("Thành công", "Cập nhật ảnh đại diện thành công");
                } catch (err: any) {
                  Alert.alert(
                    "Lỗi",
                    err.message || "Không thể tải lên ảnh đại diện"
                  );
                } finally {
                  setIsSaving(false);
                }
              }}
            />
          </View>
          <TextInput
            label="Họ và tên *"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              if (errors.fullName) {
                setErrors({ ...errors, fullName: "" });
              }
            }}
            mode="outlined"
            style={styles.input}
            error={!!errors.fullName}
          />
          {errors.fullName && (
            <HelperText type="error" visible>
              {errors.fullName}
            </HelperText>
          )}

          {/* Phone Number */}
          <TextInput
            label="Số điện thoại"
            value={phoneNumber}
            onChangeText={(text) => {
              setPhoneNumber(text);
              if (errors.phoneNumber) {
                setErrors({ ...errors, phoneNumber: "" });
              }
            }}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
            error={!!errors.phoneNumber}
          />
          {errors.phoneNumber && (
            <HelperText type="error" visible>
              {errors.phoneNumber}
            </HelperText>
          )}

          {/* Email (Read-only) */}
          <TextInput
            label="Email"
            value={user?.email || ""}
            mode="outlined"
            disabled
            editable={false}
            style={styles.input}
            right={<TextInput.Icon icon="lock" />}
          />
          <HelperText type="info" visible>
            Email không thể thay đổi
          </HelperText>

          {/* Save Button */}
          <Button
            mode="contained"
            onPress={handleSave}
            loading={isSaving}
            disabled={isSaving}
            style={styles.saveButton}
          >
            Lưu thay đổi
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  avatarContainer: {
    marginBottom: theme.spacing.md,
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: theme.spacing.sm,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.muted,
    marginBottom: theme.spacing.sm,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.mutedForeground,
  },
  form: {
    padding: theme.spacing.md,
  },
  input: {
    marginBottom: theme.spacing.xs,
  },
  saveButton: {
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.xs,
  },
});
