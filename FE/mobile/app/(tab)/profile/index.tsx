import RerquiredLoginButton from "@/components/RequireLoginButton";
import { useAuth } from "@/context/authContext";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { theme } from "@/utils";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function Profile() {
  const { logout, user } = useAuth();

  const menuSections = [
    {
      items: [
        {
          id: 1,
          icon: "file-document-outline",
          label: "Đăng ký cho thuê xe",
          iconLib: "MaterialCommunityIcons",
        },
        {
          id: 2,
          icon: "heart-outline",
          label: "Xe yêu thích",
          iconLib: "MaterialCommunityIcons",
        },
        {
          id: 3,
          icon: "map-marker-outline",
          label: "Địa chỉ của tôi",
          iconLib: "MaterialCommunityIcons",
        },
        {
          id: 4,
          icon: "file-document-outline",
          label: "Giấy phép lái xe",
          iconLib: "MaterialCommunityIcons",
        },
        {
          id: 5,
          icon: "credit-card-outline",
          label: "Thẻ thanh toán",
          iconLib: "MaterialCommunityIcons",
        },
        {
          id: 6,
          icon: "star-outline",
          label: "Đánh giá từ chủ xe",
          iconLib: "MaterialCommunityIcons",
        },
      ],
    },
    {
      items: [
        { id: 7, icon: "gift", label: "Quà tặng", iconLib: "AntDesign" },
        {
          id: 8,
          icon: "sharealt",
          label: "Giới thiệu bạn mới",
          iconLib: "AntDesign",
        },
      ],
    },
  ];

  return (
    <RerquiredLoginButton>
      <ScrollView style={styles.container}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: "https://via.placeholder.com/80" }}
              style={styles.avatar}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>
                {user?.userName || "Khang Lê Duy"}
              </Text>
              <Text style={styles.userId}>{user?.id || "SE183186"}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#333" />
          </View>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            {section.items.map((item, index) => (
              <View key={item.id}>
                <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                  <View style={styles.menuItemLeft}>
                    {item.iconLib === "MaterialCommunityIcons" && (
                      <MaterialCommunityIcons
                        name={item.icon as any}
                        size={24}
                        color="#333"
                      />
                    )}
                    {item.iconLib === "AntDesign" && (
                      <AntDesign
                        name={item.icon as any}
                        size={24}
                        color="#333"
                      />
                    )}
                    {item.iconLib === "FontAwesome" && (
                      <FontAwesome
                        name={item.icon as any}
                        size={24}
                        color="#333"
                      />
                    )}
                    <Text style={styles.menuLabel}>{item.label}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
                {index < section.items.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </View>
        ))}

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={logout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </RerquiredLoginButton>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F4F1",
  },
  userCard: {
    backgroundColor: "#fff",
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ddd",
  },
  userDetails: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  userId: {
    fontSize: 14,
    color: "#666",
  },
  menuSection: {
    backgroundColor: "#fff",
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xs,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    color: "#000",
    marginLeft: theme.spacing.md,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginLeft: theme.spacing.xl + theme.spacing.md,
  },
  logoutContainer: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
