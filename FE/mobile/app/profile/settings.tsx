import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Dialog,
  Divider,
  List,
  Portal,
  RadioButton,
  Switch,
  Text,
} from "react-native-paper";
import { useAuth } from "../../context/authContext";

export default function SettingsScreen() {
  const { logout } = useAuth();

  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [bookingReminders, setBookingReminders] = useState(true);
  const [promotions, setPromotions] = useState(true);

  // Dialog states
  const [languageDialogVisible, setLanguageDialogVisible] = useState(false);
  const [themeDialogVisible, setThemeDialogVisible] = useState(false);
  const [clearCacheDialogVisible, setClearCacheDialogVisible] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState("vi");
  const [selectedTheme, setSelectedTheme] = useState("light");

  const handleNotificationsToggle = () => {
    setNotifications(!notifications);
    if (notifications) {
      // If turning off, disable all notification types
      setPushNotifications(false);
      setEmailNotifications(false);
      setBookingReminders(false);
      setPromotions(false);
    }
  };

  const handleClearCache = async () => {
    try {
      // Clear AsyncStorage except for auth tokens
      const keys = await AsyncStorage.getAllKeys();
      const keysToRemove = keys.filter(
        (key: string) => !key.includes("token") && !key.includes("auth")
      );
      await AsyncStorage.multiRemove(keysToRemove);

      Alert.alert("Thành công", "Đã xóa bộ nhớ đệm");
      setClearCacheDialogVisible(false);
    } catch (error) {
      console.error("Error clearing cache:", error);
      Alert.alert("Lỗi", "Không thể xóa bộ nhớ đệm");
    }
  };

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

  const handleChangeLanguage = (lang: string) => {
    setSelectedLanguage(lang);
    setLanguageDialogVisible(false);
    Alert.alert(
      "Thông báo",
      "Tính năng đang phát triển. Hiện tại chỉ hỗ trợ Tiếng Việt."
    );
  };

  const handleChangeTheme = (theme: string) => {
    setSelectedTheme(theme);
    setThemeDialogVisible(false);
    Alert.alert(
      "Thông báo",
      "Tính năng đang phát triển. Chế độ tối sẽ sớm được hỗ trợ."
    );
  };

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Account Section */}
        <Card style={styles.section}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Tài khoản
            </Text>
            <List.Item
              title="Chỉnh sửa hồ sơ"
              description="Cập nhật thông tin cá nhân"
              left={(props) => <List.Icon {...props} icon="account-edit" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => router.push("/profile/edit" as any)}
            />
            <Divider />
            <List.Item
              title="Đổi mật khẩu"
              description="Thay đổi mật khẩu đăng nhập"
              left={(props) => <List.Icon {...props} icon="lock-reset" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() =>
                Alert.alert("Đang phát triển", "Tính năng sắp ra mắt")
              }
            />
            <Divider />
            <List.Item
              title="Quản lý địa chỉ"
              description="Địa chỉ đã lưu"
              left={(props) => <List.Icon {...props} icon="map-marker" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => router.push("/profile/addresses")}
            />
            <Divider />
            <List.Item
              title="Phương thức thanh toán"
              description="Quản lý thẻ và ví điện tử"
              left={(props) => <List.Icon {...props} icon="credit-card" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => router.push("/profile/payment")}
            />
          </Card.Content>
        </Card>

        {/* Notifications Section */}
        <Card style={styles.section}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Thông báo
            </Text>
            <List.Item
              title="Bật thông báo"
              description="Nhận tất cả thông báo"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={() => (
                <Switch
                  value={notifications}
                  onValueChange={handleNotificationsToggle}
                />
              )}
            />
            <Divider />
            <List.Item
              title="Thông báo đẩy"
              description="Nhận thông báo trên thiết bị"
              left={(props) => <List.Icon {...props} icon="cellphone" />}
              right={() => (
                <Switch
                  value={pushNotifications}
                  onValueChange={setPushNotifications}
                  disabled={!notifications}
                />
              )}
            />
            <Divider />
            <List.Item
              title="Email thông báo"
              description="Nhận thông báo qua email"
              left={(props) => <List.Icon {...props} icon="email" />}
              right={() => (
                <Switch
                  value={emailNotifications}
                  onValueChange={setEmailNotifications}
                  disabled={!notifications}
                />
              )}
            />
            <Divider />
            <List.Item
              title="Nhắc nhở đặt xe"
              description="Nhắc nhở về chuyến sắp tới"
              left={(props) => <List.Icon {...props} icon="calendar-clock" />}
              right={() => (
                <Switch
                  value={bookingReminders}
                  onValueChange={setBookingReminders}
                  disabled={!notifications}
                />
              )}
            />
            <Divider />
            <List.Item
              title="Khuyến mãi"
              description="Nhận thông báo về ưu đãi"
              left={(props) => <List.Icon {...props} icon="tag" />}
              right={() => (
                <Switch
                  value={promotions}
                  onValueChange={setPromotions}
                  disabled={!notifications}
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* App Preferences */}
        <Card style={styles.section}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Cài đặt ứng dụng
            </Text>
            <List.Item
              title="Ngôn ngữ"
              description={selectedLanguage === "vi" ? "Tiếng Việt" : "English"}
              left={(props) => <List.Icon {...props} icon="translate" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => setLanguageDialogVisible(true)}
            />
            <Divider />
            <List.Item
              title="Giao diện"
              description={
                selectedTheme === "light"
                  ? "Sáng"
                  : selectedTheme === "dark"
                  ? "Tối"
                  : "Tự động"
              }
              left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => setThemeDialogVisible(true)}
            />
            <Divider />
            <List.Item
              title="Xóa bộ nhớ đệm"
              description="Giải phóng không gian lưu trữ"
              left={(props) => <List.Icon {...props} icon="delete-sweep" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => setClearCacheDialogVisible(true)}
            />
          </Card.Content>
        </Card>

        {/* About & Legal */}
        <Card style={styles.section}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Về ứng dụng
            </Text>
            <List.Item
              title="Điều khoản sử dụng"
              left={(props) => <List.Icon {...props} icon="file-document" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() =>
                Alert.alert("Đang phát triển", "Tính năng sắp ra mắt")
              }
            />
            <Divider />
            <List.Item
              title="Chính sách bảo mật"
              left={(props) => <List.Icon {...props} icon="shield-check" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() =>
                Alert.alert("Đang phát triển", "Tính năng sắp ra mắt")
              }
            />
            <Divider />
            <List.Item
              title="Phiên bản"
              description="1.0.0"
              left={(props) => <List.Icon {...props} icon="information" />}
            />
          </Card.Content>
        </Card>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            mode="outlined"
            onPress={handleLogout}
            icon="logout"
            textColor="#F44336"
            style={styles.logoutButton}
          >
            Đăng xuất
          </Button>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Language Dialog */}
      <Portal>
        <Dialog
          visible={languageDialogVisible}
          onDismiss={() => setLanguageDialogVisible(false)}
        >
          <Dialog.Title>Chọn ngôn ngữ</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={handleChangeLanguage}
              value={selectedLanguage}
            >
              <RadioButton.Item label="Tiếng Việt" value="vi" />
              <RadioButton.Item label="English" value="en" disabled />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setLanguageDialogVisible(false)}>
              Đóng
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Theme Dialog */}
      <Portal>
        <Dialog
          visible={themeDialogVisible}
          onDismiss={() => setThemeDialogVisible(false)}
        >
          <Dialog.Title>Chọn giao diện</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={handleChangeTheme}
              value={selectedTheme}
            >
              <RadioButton.Item label="Sáng" value="light" />
              <RadioButton.Item label="Tối" value="dark" disabled />
              <RadioButton.Item label="Tự động" value="auto" disabled />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setThemeDialogVisible(false)}>Đóng</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Clear Cache Dialog */}
      <Portal>
        <Dialog
          visible={clearCacheDialogVisible}
          onDismiss={() => setClearCacheDialogVisible(false)}
        >
          <Dialog.Title>Xóa bộ nhớ đệm</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Bạn có chắc chắn muốn xóa bộ nhớ đệm? Dữ liệu đăng nhập sẽ được
              giữ nguyên.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setClearCacheDialogVisible(false)}>
              Hủy
            </Button>
            <Button onPress={handleClearCache}>Xóa</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  section: {
    margin: 16,
    marginBottom: 0,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  logoutContainer: {
    padding: 16,
  },
  logoutButton: {
    borderColor: "#F44336",
  },
});
