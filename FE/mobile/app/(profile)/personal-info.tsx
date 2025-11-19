import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { Input, Button } from "@/components/common";
import { Camera, User } from "lucide-react-native";
import Toast from "react-native-toast-message";

export default function PersonalInfoScreen() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
  });

  const handleSave = () => {
    Toast.show({
      type: "success",
      text1: "Thành Công",
      text2: "Thông tin đã được cập nhật",
    });
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
            <Pressable style={styles.cameraButton}>
              <Camera size={20} color="#ffffff" />
            </Pressable>
          </View>
          <Text style={styles.avatarHint}>Nhấn để thay đổi ảnh đại diện</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Input
            label="Họ và Tên"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
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
            editable={isEditing}
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
                title="Lưu Thay Đổi"
                onPress={handleSave}
                variant="primary"
              />
              <Button
                title="Hủy"
                onPress={() => setIsEditing(false)}
                variant="outline"
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
