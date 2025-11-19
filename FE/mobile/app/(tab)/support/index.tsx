import { theme } from "@/utils";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { mockInfoCards, mockInsuranceCompanies } from "../../../mocks/mockData";

export default function Support() {
  const router = useRouter();
  // Using mock data from centralized file
  const insuranceCompanies = mockInsuranceCompanies;
  const infoCards = mockInfoCards;

  const handleInsurancePress = (company: { name: string; hotline: string }) => {
    Alert.alert(`Hotline ${company.name}`, `Gọi ${company.hotline}?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Gọi ngay",
        onPress: () => Linking.openURL(`tel:${company.hotline}`),
      },
    ]);
  };

  const handleGuidePress = () => {
    Alert.alert("Hướng dẫn đặt xe", "Chức năng đang phát triển");
  };

  const handleContactPress = () => {
    router.push("/support/contact" as any);
  };

  const handleInfoCardPress = (title: string) => {
    Alert.alert(title.replace("\n", " "), "Chức năng đang phát triển");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hotline Bảo hiểm</Text>
        <View style={styles.insuranceGrid}>
          {insuranceCompanies.map((company) => (
            <TouchableOpacity
              key={company.id}
              style={styles.insuranceCard}
              activeOpacity={0.7}
              onPress={() => handleInsurancePress(company)}
            >
              <Image
                source={company.logo}
                style={styles.insuranceLogo}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hướng dẫn</Text>
        <TouchableOpacity
          style={{ marginTop: theme.spacing.sm }}
          onPress={handleContactPress}
          activeOpacity={0.8}
        >
          <View
            style={{
              backgroundColor: theme.colors.primary,
              padding: theme.spacing.sm,
              borderRadius: theme.radius.md,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              Liên hệ hỗ trợ
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.guideCard}
          activeOpacity={0.8}
          onPress={handleGuidePress}
        >
          <Image
            source={require("@/assets/images/favicon.png")}
            style={styles.guideImage}
            resizeMode="contain"
          />
          <View style={styles.guideTextContainer}>
            <Text style={styles.guideTitle}>Hướng dẫn{"\n"}đặt xe</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin</Text>
        <View style={styles.infoGrid}>
          {infoCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.infoCard}
              activeOpacity={0.7}
              onPress={() => handleInfoCardPress(card.title)}
            >
              <MaterialCommunityIcons
                name={card.icon as any}
                size={48}
                color={card.color}
              />
              <Text style={styles.infoCardText}>{card.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  section: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: theme.spacing.md,
  },
  insuranceGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  insuranceCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insuranceLogo: {
    width: 80,
    height: 50,
  },
  guideCard: {
    backgroundColor: "#D1F4E0",
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  guideImage: {
    width: 150,
    height: 150,
  },
  guideTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: theme.spacing.md,
  },
  guideTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    textAlign: "right",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  infoCard: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoCardText: {
    marginTop: theme.spacing.sm,
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    lineHeight: 20,
  },
});
