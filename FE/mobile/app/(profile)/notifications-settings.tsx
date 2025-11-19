import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Switch,
  StyleSheet,
  Pressable,
} from "react-native";
import {
  Bell,
  Mail,
  MessageCircle,
  Volume2,
  ArrowLeft,
} from "lucide-react-native";
import { useRouter } from "expo-router";

export default function NotificationsSettingsScreen() {
  const [settings, setSettings] = useState({
    tripUpdates: true,
    promotions: true,
    tripReminders: true,
    paymentAlerts: true,
    emailNotifications: false,
    smsNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
  });

  const toggleSetting = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const notificationTypes = [
    {
      title: "Thông Báo Chuyến Đi",
      items: [
        {
          key: "tripUpdates",
          label: "Cập nhật trạng thái chuyến đi",
          description: "Nhận thông báo khi chuyến đi bắt đầu, kết thúc",
          icon: <Bell size={20} color="#6b7280" />,
        },
        {
          key: "tripReminders",
          label: "Nhắc nhở chuyến đi",
          description: "Nhắc nhở khi xe cần được trả",
          icon: <Bell size={20} color="#6b7280" />,
        },
      ],
    },
    {
      title: "Thông Báo Khuyến Mãi",
      items: [
        {
          key: "promotions",
          label: "Ưu đãi và khuyến mãi",
          description: "Nhận thông báo về các chương trình khuyến mãi",
          icon: <Bell size={20} color="#6b7280" />,
        },
      ],
    },
    {
      title: "Thông Báo Thanh Toán",
      items: [
        {
          key: "paymentAlerts",
          label: "Cảnh báo thanh toán",
          description: "Thông báo về giao dịch và hóa đơn",
          icon: <Bell size={20} color="#6b7280" />,
        },
      ],
    },
  ];

  const channels = [
    {
      title: "Kênh Thông Báo",
      items: [
        {
          key: "pushNotifications",
          label: "Thông báo đẩy",
          description: "Nhận thông báo trên thiết bị",
          icon: <Bell size={20} color="#6b7280" />,
        },
        {
          key: "emailNotifications",
          label: "Email",
          description: "Nhận thông báo qua email",
          icon: <Mail size={20} color="#6b7280" />,
        },
        {
          key: "smsNotifications",
          label: "SMS",
          description: "Nhận thông báo qua tin nhắn",
          icon: <MessageCircle size={20} color="#6b7280" />,
        },
        {
          key: "soundEnabled",
          label: "Âm thanh",
          description: "Bật âm thanh cho thông báo",
          icon: <Volume2 size={20} color="#6b7280" />,
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Notification Types */}
        {notificationTypes.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item) => (
              <View key={item.key} style={styles.settingItem}>
                <View style={styles.iconContainer}>{item.icon}</View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>{item.label}</Text>
                  <Text style={styles.settingDescription}>
                    {item.description}
                  </Text>
                </View>
                <Switch
                  value={settings[item.key as keyof typeof settings] as boolean}
                  onValueChange={() => toggleSetting(item.key)}
                  trackColor={{ false: "#d1d5db", true: "#86efac" }}
                  thumbColor={
                    settings[item.key as keyof typeof settings]
                      ? "#10b981"
                      : "#f3f4f6"
                  }
                />
              </View>
            ))}
          </View>
        ))}

        {/* Channels */}
        {channels.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item) => (
              <View key={item.key} style={styles.settingItem}>
                <View style={styles.iconContainer}>{item.icon}</View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>{item.label}</Text>
                  <Text style={styles.settingDescription}>
                    {item.description}
                  </Text>
                </View>
                <Switch
                  value={settings[item.key as keyof typeof settings] as boolean}
                  onValueChange={() => toggleSetting(item.key)}
                  trackColor={{ false: "#d1d5db", true: "#86efac" }}
                  thumbColor={
                    settings[item.key as keyof typeof settings]
                      ? "#10b981"
                      : "#f3f4f6"
                  }
                />
              </View>
            ))}
          </View>
        ))}

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Bạn có thể bật/tắt thông báo bất cứ lúc nào. Một số thông báo quan
            trọng không thể tắt để đảm bảo trải nghiệm sử dụng dịch vụ.
          </Text>
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
  infoBox: {
    backgroundColor: "#eff6ff",
    padding: 16,
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  infoText: {
    fontSize: 13,
    color: "#1e3a8a",
    lineHeight: 20,
  },
});
