import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services";
import { Input, Button } from "@/components/common";
import { Camera, User } from "lucide-react-native";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";

export default function PersonalInfoScreen() {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const handleSave = async () => {
    if (!user?.id) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không tìm thấy thông tin người dùng",
      });
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await userService.updateUser(user.id, formData);
      setUser(updatedUser);
      Toast.show({
        type: "success",
        text1: "Thành Công",
        text2: "Thông tin đã được cập nhật",
      });
      setIsEditing(false);
    } catch (error: any) {
      console.error("Update user error:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: error.response?.data?.message || "Không thể cập nhật thông tin",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadAvatar = async () => {
    if (!user?.id) return;

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Cần cấp quyền truy cập thư viện ảnh",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setIsLoading(true);
      try {
        // Convert URI to Blob
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();

        const updatedUser = await userService.uploadAvatar(user.id, blob);
        setUser(updatedUser);
        Toast.show({
          type: "success",
          text1: "Thành Công",
          text2: "Ảnh đại diện đã được cập nhật",
        });
      } catch (error: any) {
        console.error("Upload avatar error:", error);
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: error.response?.data?.message || "Không thể tải ảnh lên",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.fullName?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
            <Pressable
              style={styles.cameraButton}
              onPress={handleUploadAvatar}
              disabled={isLoading}
            >
              <Camera size={20} color="#ffffff" />
            </Pressable>
          </View>
          <Text style={styles.avatarHint}>Nhấn để thay đổi ảnh đại diện</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Input
            label="Họ và Tên"
            value={formData.fullName}
            onChangeText={(text) =>
              setFormData({ ...formData, fullName: text })
            }
            placeholder="Nhập họ và tên"
            leftIcon={<User size={20} color="#9ca3af" />}
            editable={isEditing}
          />

          <Input
            label="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="Nhập email"
            keyboardType="email-address"
            editable={false} // Email không thể chỉnh sửa
          />

          <Input
            label="Số Điện Thoại"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
            editable={isEditing}
          />

          <Input
            label="Địa Chỉ"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            placeholder="Nhập địa chỉ"
            editable={isEditing}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonSection}>
          {isEditing ? (
            <>
              <Button
                title={isLoading ? "Đang lưu..." : "Lưu Thay Đổi"}
                onPress={handleSave}
                variant="primary"
                disabled={isLoading}
              />
              <Button
                title="Hủy"
                onPress={() => {
                  setIsEditing(false);
                  setFormData({
                    fullName: user?.fullName || "",
                    email: user?.email || "",
                    phone: user?.phone || "",
                    address: user?.address || "",
                  });
                }}
                variant="outline"
                disabled={isLoading}
              />
            </>
          ) : (
            <Button
              title="Chỉnh Sửa Thông Tin"
              onPress={() => setIsEditing(true)}
              variant="primary"
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    backgroundColor: "#10b981",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 36,
    fontWeight: "bold",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    backgroundColor: "#3b82f6",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  avatarHint: {
    fontSize: 14,
    color: "#6b7280",
  },
  formSection: {
    padding: 16,
    gap: 16,
  },
  buttonSection: {
    padding: 16,
    gap: 12,
  },
});
