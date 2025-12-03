import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
<<<<<<< HEAD
import { api } from "@/services/api";
import type { ApiResponse, UserResponse } from "@/services/api";
import Toast from "react-native-toast-message";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Camera,
  Upload,
  CheckCircle,
  AlertCircle,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { user: authUser, token } = useAuth();
  const [userInfo, setUserInfo] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    if (!token) {
      console.log("❌ No token found");
      Toast.show({
        type: "error",
        text1: "Lỗi xác thực",
        text2: "Vui lòng đăng nhập lại",
      });
      router.replace("/(auth)/login");
      return;
    }

    try {
      setIsLoading(true);
      console.log("🔄 Fetching user info...");
      const response = (await api.getMyInfo(
        token
      )) as ApiResponse<UserResponse>;
      console.log("✅ User info response:", response);

      if (response.statusCode === 200) {
        console.log("✅ Setting user info:", response.data);
        setUserInfo(response.data);
      }
    } catch (error: any) {
      console.error("❌ Fetch error:", error);

      // Check if token is invalid
      if (
        error.message?.includes("invalid_token") ||
        error.message?.includes("401")
      ) {
        Toast.show({
          type: "error",
          text1: "Phiên đăng nhập hết hạn",
          text2: "Vui lòng đăng nhập lại",
        });
        router.replace("/(auth)/login");
      } else {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: error.message || "Không thể tải thông tin",
        });
      }
    } finally {
      setIsLoading(false);
      console.log("✅ Loading complete");
=======
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
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
    }
  };

  const pickImage = async (type: "avatar" | "licenseFront" | "licenseBack") => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Yêu cầu quyền", "Cần quyền truy cập thư viện ảnh");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === "avatar" ? [1, 1] : [16, 10],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      uploadImage(result.assets[0].uri, type);
    }
  };

  const uploadImage = async (
    uri: string,
    type: "avatar" | "licenseFront" | "licenseBack"
  ) => {
    if (!token || !userInfo) return;

    try {
      setIsUploading(true);
      console.log("📤 Upload image - URI:", uri, "Platform:", Platform.OS);

      const filename = uri.split("/").pop() || "image.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const fileType = match ? `image/${match[1]}` : "image/jpeg";

      let fileToUpload: Blob | { uri: string; name: string; type: string };

      if (Platform.OS === "web") {
        // Web: Fetch blob from URI
        console.log("🌐 Web platform - fetching blob from URI...");
        const response = await fetch(uri);
        const blob = await response.blob();
        console.log("📦 Blob created:", {
          type: blob.type,
          size: blob.size,
          filename: filename,
        });
        fileToUpload = blob;
      } else {
        // Mobile: Use file URI object
        fileToUpload = {
          uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
          name: filename,
          type: fileType,
        };
      }

      console.log("🚀 Uploading type:", type);

      let response;
      if (type === "avatar") {
        response = await api.uploadAvatar(
          userInfo.id,
          fileToUpload as any,
          token
        );
      } else if (type === "licenseFront") {
        response = await api.uploadLicenseFront(
          userInfo.id,
          fileToUpload as any,
          token
        );
      } else {
        response = await api.uploadLicenseBack(
          userInfo.id,
          fileToUpload as any,
          token
        );
      }

      Toast.show({
        type: "success",
        text1: "Thành công",
        text2:
          type === "avatar"
            ? "Cập nhật ảnh thành công"
            : "Upload bằng lái thành công",
      });

      await fetchUserInfo();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: error.message || "Upload thất bại",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading || !userInfo) {
    console.log("⏳ Loading state:", { isLoading, hasUserInfo: !!userInfo });
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={{ marginTop: 12, color: "#6b7280" }}>
            {isLoading ? "Đang tải..." : "Không có dữ liệu"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  console.log("🎨 Rendering UI with user:", userInfo);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Avatar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ảnh Đại Diện</Text>
          <View style={styles.avatarContainer}>
<<<<<<< HEAD
            {userInfo.avatarUrl ? (
              <Image
                source={{ uri: userInfo.avatarUrl }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={48} color="#9ca3af" />
              </View>
            )}
            <Pressable
              style={styles.avatarButton}
              onPress={() => pickImage("avatar")}
              disabled={isUploading}
            >
              <Camera size={18} color="#fff" />
=======
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
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
            </Pressable>
          </View>
        </View>

<<<<<<< HEAD
        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông Tin Cơ Bản</Text>
          <View style={styles.card}>
            <InfoRow icon={<User />} label="Họ tên" value={userInfo.fullName} />
            <InfoRow icon={<Mail />} label="Email" value={userInfo.email} />
            <InfoRow icon={<Phone />} label="SĐT" value={userInfo.phone} />
            <InfoRow
              icon={<MapPin />}
              label="Địa chỉ"
              value={userInfo.address || "Chưa cập nhật"}
=======
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
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
            />
            <InfoRow
              icon={<CreditCard />}
              label="CMND/CCCD"
              value={userInfo.identityNumber || "Chưa cập nhật"}
            />
          </View>
        </View>

        {/* License */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bằng Lái Xe</Text>
            {userInfo.isLicenseVerified ? (
              <View style={styles.verified}>
                <CheckCircle size={16} color="#10b981" />
                <Text style={styles.verifiedText}>Đã xác thực</Text>
              </View>
            ) : (
              <View style={styles.unverified}>
                <AlertCircle size={16} color="#f59e0b" />
                <Text style={styles.unverifiedText}>Chưa xác thực</Text>
              </View>
            )}
          </View>

          {/* License Number */}
          {userInfo.licenseNumber && (
            <View style={styles.card}>
              <InfoRow
                icon={<CreditCard />}
                label="Số bằng lái"
                value={userInfo.licenseNumber}
              />
            </View>
          )}

          {/* License Cards */}
          <View style={styles.licenseCards}>
            <LicenseCard
              title="Mặt trước"
              imageUrl={userInfo.licenseCardFrontImageUrl}
              onUpload={() => pickImage("licenseFront")}
              isUploading={isUploading}
            />
            <LicenseCard
              title="Mặt sau"
              imageUrl={userInfo.licenseCardBackImageUrl}
              onUpload={() => pickImage("licenseBack")}
              isUploading={isUploading}
            />
          </View>

          {!userInfo.isLicenseVerified && (
            <View style={styles.note}>
              <AlertCircle size={16} color="#f59e0b" />
              <Text style={styles.noteText}>
                Upload cả 2 mặt bằng lái để có thể đặt xe
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {isUploading && (
        <View style={styles.overlay}>
          <View style={styles.overlayContent}>
            <ActivityIndicator size="large" color="#10b981" />
            <Text style={styles.overlayText}>Đang upload...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const InfoRow = ({ icon, label, value }: any) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      {React.cloneElement(icon, { size: 20, color: "#6b7280" })}
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const LicenseCard = ({ title, imageUrl, onUpload, isUploading }: any) => (
  <View style={styles.licenseCard}>
    <Text style={styles.licenseTitle}>{title}</Text>
    {imageUrl ? (
      <Image source={{ uri: imageUrl }} style={styles.licenseImage} />
    ) : (
      <View style={styles.licensePlaceholder}>
        <CreditCard size={32} color="#d1d5db" />
        <Text style={styles.placeholderText}>Chưa upload</Text>
      </View>
    )}
    <Pressable
      style={styles.uploadBtn}
      onPress={onUpload}
      disabled={isUploading}
    >
      <Upload size={16} color="#10b981" />
      <Text style={styles.uploadBtnText}>
        {imageUrl ? "Cập nhật" : "Upload"}
      </Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#111827" },
  content: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  section: { padding: 16 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  avatarContainer: { alignItems: "center" },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarButton: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: "#10b981",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, gap: 16 },
  infoRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#f3f4f6",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 13, color: "#6b7280", marginBottom: 4 },
  infoValue: { fontSize: 15, fontWeight: "500", color: "#111827" },
  verified: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#d1fae5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  verifiedText: { fontSize: 12, fontWeight: "600", color: "#10b981" },
  unverified: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fef3c7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  unverifiedText: { fontSize: 12, fontWeight: "600", color: "#f59e0b" },
  licenseCards: { flexDirection: "row", gap: 12 },
  licenseCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
  },
  licenseTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  licenseImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  licensePlaceholder: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: { fontSize: 12, color: "#9ca3af", marginTop: 8 },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#10b981",
    borderRadius: 8,
  },
  uploadBtnText: { color: "#10b981", fontSize: 13, fontWeight: "600" },
  note: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: "#fffbeb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fde68a",
  },
  noteText: { flex: 1, fontSize: 13, color: "#92400e" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  overlayText: { marginTop: 12, fontSize: 15, color: "#111827" },
});
