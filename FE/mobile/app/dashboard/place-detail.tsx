import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { theme } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Place } from "@/types/Place";
import { SimpleHeader } from "@/components/SimpleHeader";

export default function PlaceDetailPage() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [place, setPlace] = useState<Place | null>(null);

  useEffect(() => {
    // Parse place data from params
    if (params.place) {
      try {
        const placeData = JSON.parse(params.place as string);
        setPlace(placeData);
      } catch (error) {
        console.error("Error parsing place data:", error);
      }
    }
  }, [params]);

  if (!place) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  const attractions = [
    "Các địa điểm du lịch nổi tiếng",
    "Nhà hàng & Quán ăn đặc sản",
    "Khách sạn & Resort",
    "Trung tâm mua sắm",
  ];

  return (
    <View style={{ flex: 1 }}>
      <SimpleHeader title={place.cityName} />
      <ScrollView style={styles.container}>
        <Image
          source={{ uri: place.thumbnail }}
          style={styles.banner}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <Text style={styles.title}>{place.cityName}</Text>

          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Ionicons
                name="car-sport"
                size={32}
                color={theme.colors.primary}
              />
              <Text style={styles.statValue}>{place.carQuantity}</Text>
              <Text style={styles.statLabel}>Xe có sẵn</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons
                name="location"
                size={32}
                color={theme.colors.primary}
              />
              <Text style={styles.statValue}>50+</Text>
              <Text style={styles.statLabel}>Điểm giao xe</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Giới thiệu</Text>
            <Text style={styles.description}>
              {place.cityName} là một trong những điểm đến hấp dẫn nhất với
              nhiều địa điểm du lịch, văn hóa và ẩm thực phong phú. Thuê xe tại
              đây sẽ giúp bạn dễ dàng khám phá mọi ngóc ngách của thành phố một
              cách thuận tiện nhất.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Điểm nổi bật</Text>
            {attractions.map((item, index) => (
              <View key={index} style={styles.attractionItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={styles.attractionText}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lợi ích khi thuê xe tại đây</Text>
            <View style={styles.benefitCard}>
              <Ionicons
                name="shield-checkmark"
                size={24}
                color={theme.colors.primary}
              />
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Xe chất lượng cao</Text>
                <Text style={styles.benefitText}>
                  Đảm bảo xe mới, sạch sẽ và được bảo dưỡng định kỳ
                </Text>
              </View>
            </View>
            <View style={styles.benefitCard}>
              <Ionicons name="time" size={24} color={theme.colors.primary} />
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Giao xe nhanh chóng</Text>
                <Text style={styles.benefitText}>
                  Nhiều điểm giao xe tiện lợi trong thành phố
                </Text>
              </View>
            </View>
            <View style={styles.benefitCard}>
              <Ionicons name="people" size={24} color={theme.colors.primary} />
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Hỗ trợ 24/7</Text>
                <Text style={styles.benefitText}>
                  Đội ngũ chăm sóc khách hàng luôn sẵn sàng
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => {
              // Navigate back to dashboard and trigger search for this location
              router.back();
            }}
          >
            <Ionicons name="search" size={20} color="white" />
            <Text style={styles.searchButtonText}>
              Tìm xe tại {place.cityName}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  banner: {
    width: "100%",
    height: 240,
  },
  content: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: theme.spacing.lg,
  },
  statsCard: {
    backgroundColor: "white",
    flexDirection: "row",
    padding: theme.spacing.lg,
    borderRadius: 12,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#eee",
    marginHorizontal: theme.spacing.md,
  },
  section: {
    backgroundColor: "white",
    padding: theme.spacing.lg,
    borderRadius: 12,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: theme.spacing.md,
    color: "#333",
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: "#666",
  },
  attractionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: theme.spacing.sm,
  },
  attractionText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  benefitCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  searchButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 12,
    marginTop: theme.spacing.md,
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
