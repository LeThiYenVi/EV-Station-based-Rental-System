import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Switch,
  Pressable,
  StyleSheet,
} from "react-native";
import {
  Globe,
  Moon,
  MapPin,
  Download,
  Database,
  Trash2,
} from "lucide-react-native";
import Toast from "react-native-toast-message";

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    darkMode: false,
    autoLocation: true,
    offlineMaps: false,
    dataSaver: false,
  });

  const toggleSetting = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const languages = [
    { code: "vi", name: "Tiếng Việt", active: true },
    { code: "en", name: "English", active: false },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Language */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ngôn Ngữ</Text>
          {languages.map((lang) => (
            <Pressable
              key={lang.code}
              style={({ pressed }) => [
                styles.languageItem,
                pressed && styles.languageItemPressed,
              ]}
            >
              <View style={styles.iconContainer}>
                <Globe size={20} color="#6b7280" />
              </View>
              <Text style={styles.languageText}>{lang.name}</Text>
              {lang.active && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>Đang dùng</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* Display */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hiển Thị</Text>
          <View style={styles.settingItem}>
            <View style={styles.iconContainer}>
              <Moon size={20} color="#6b7280" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Chế độ tối</Text>
              <Text style={styles.settingDescription}>
                Giao diện tối giúp bảo vệ mắt
              </Text>
            </View>
            <Switch
              value={settings.darkMode}
              onValueChange={() => toggleSetting("darkMode")}
              trackColor={{ false: "#d1d5db", true: "#86efac" }}
              thumbColor={settings.darkMode ? "#10b981" : "#f3f4f6"}
            />
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vị Trí</Text>
          <View style={styles.settingItem}>
            <View style={styles.iconContainer}>
              <MapPin size={20} color="#6b7280" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Tự động lấy vị trí</Text>
              <Text style={styles.settingDescription}>
                Tự động phát hiện vị trí hiện tại
              </Text>
            </View>
            <Switch
              value={settings.autoLocation}
              onValueChange={() => toggleSetting("autoLocation")}
              trackColor={{ false: "#d1d5db", true: "#86efac" }}
              thumbColor={settings.autoLocation ? "#10b981" : "#f3f4f6"}
            />
          </View>
        </View>

        {/* Data & Storage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dữ Liệu & Lưu Trữ</Text>

          <View style={styles.settingItem}>
            <View style={styles.iconContainer}>
              <Download size={20} color="#6b7280" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Bản đồ ngoại tuyến</Text>
              <Text style={styles.settingDescription}>
                Tải bản đồ để sử dụng khi không có mạng
              </Text>
            </View>
            <Switch
              value={settings.offlineMaps}
              onValueChange={() => toggleSetting("offlineMaps")}
              trackColor={{ false: "#d1d5db", true: "#86efac" }}
              thumbColor={settings.offlineMaps ? "#10b981" : "#f3f4f6"}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.iconContainer}>
              <Database size={20} color="#6b7280" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Tiết kiệm dữ liệu</Text>
              <Text style={styles.settingDescription}>
                Giảm tải dữ liệu khi sử dụng
              </Text>
            </View>
            <Switch
              value={settings.dataSaver}
              onValueChange={() => toggleSetting("dataSaver")}
              trackColor={{ false: "#d1d5db", true: "#86efac" }}
              thumbColor={settings.dataSaver ? "#10b981" : "#f3f4f6"}
            />
          </View>

          <Pressable
            style={styles.actionItem}
            onPress={() => {
              Toast.show({
                type: "success",
                text1: "Thành Công",
                text2: "Đã xóa cache",
              });
            }}
          >
            <View style={styles.iconContainer}>
              <Trash2 size={20} color="#ef4444" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.actionLabel}>Xóa bộ nhớ cache</Text>
              <Text style={styles.settingDescription}>
                Giải phóng 124 MB dung lượng
              </Text>
            </View>
          </Pressable>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông Tin</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phiên bản</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>2025.11.19</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: "#ffffff",
    marginBottom: 12,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  languageItemPressed: {
    backgroundColor: "#f9fafb",
  },
  languageText: {
    fontSize: 15,
    color: "#111827",
    flex: 1,
  },
  activeBadge: {
    backgroundColor: "#d1fae5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#065f46",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#f3f4f6",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: "#6b7280",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#ef4444",
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  infoLabel: {
    fontSize: 15,
    color: "#6b7280",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
  },
});
