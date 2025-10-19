import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Stack } from "expo-router";
import { theme } from "@/utils";
import { Ionicons } from "@expo/vector-icons";

export default function LicensePage() {
  // Mock license data
  const license = {
    number: "012345678",
    fullName: "NGUYỄN VÂN A",
    dob: "01/01/1990",
    class: "B2",
    issueDate: "01/01/2020",
    expiryDate: "01/01/2030",
    verified: true,
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Giấy phép lái xe",
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: "#fff",
          headerShown: true,
          headerBackVisible: true,
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <View style={styles.statusCard}>
            <Ionicons
              name={license.verified ? "checkmark-circle" : "alert-circle"}
              size={48}
              color={license.verified ? "#10B981" : "#EF4444"}
            />
            <Text style={styles.statusTitle}>
              {license.verified ? "Đã xác minh" : "Chưa xác minh"}
            </Text>
            <Text style={styles.statusSubtitle}>
              {license.verified
                ? "Giấy phép lái xe của bạn đã được xác minh"
                : "Vui lòng tải lên giấy phép lái xe"}
            </Text>
          </View>

          {license.verified && (
            <View style={styles.licenseCard}>
              <View style={styles.licenseHeader}>
                <Text style={styles.licenseTitle}>GIẤY PHÉP LÁI XE</Text>
                <Text style={styles.licenseClass}>Hạng {license.class}</Text>
              </View>

              <View style={styles.photoContainer}>
                <Image
                  source={require("@/assets/images/favicon.png")}
                  style={styles.photo}
                />
              </View>

              <View style={styles.infoGrid}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Họ và tên</Text>
                  <Text style={styles.infoValue}>{license.fullName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Ngày sinh</Text>
                  <Text style={styles.infoValue}>{license.dob}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Số GPLX</Text>
                  <Text style={styles.infoValue}>{license.number}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Ngày cấp</Text>
                  <Text style={styles.infoValue}>{license.issueDate}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Ngày hết hạn</Text>
                  <Text style={styles.infoValue}>{license.expiryDate}</Text>
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.uploadButton}>
            <Ionicons name="cloud-upload-outline" size={24} color="white" />
            <Text style={styles.uploadButtonText}>
              {license.verified ? "Cập nhật GPLX" : "Tải lên GPLX"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  section: {
    padding: theme.spacing.lg,
  },
  statusCard: {
    backgroundColor: "white",
    padding: theme.spacing.xl,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: theme.spacing.md,
  },
  statusSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  licenseCard: {
    backgroundColor: "white",
    padding: theme.spacing.lg,
    borderRadius: 12,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  licenseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  licenseTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  licenseClass: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  photoContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  photo: {
    width: 100,
    height: 120,
    borderRadius: 8,
  },
  infoGrid: {
    gap: theme.spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  uploadButton: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  uploadButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
