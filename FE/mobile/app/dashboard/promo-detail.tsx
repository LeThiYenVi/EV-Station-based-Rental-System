import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import { PromoApi } from "@/api/PromoApi";
import { SimpleHeader } from "@/components/SimpleHeader";
import { Promo } from "@/types/Promo";
import { theme } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function PromoDetailPage() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [promo, setPromo] = useState<Promo | null>(null);

  useEffect(() => {
    // Parse promo data from params
    const init = async () => {
      if (params.promo) {
        try {
          const promoData = JSON.parse(params.promo as string);
          setPromo(promoData);
          return;
        } catch (error) {
          console.error("Error parsing promo data:", error);
        }
      }

      // If a promoId was provided instead, fetch from API
      if (params.promoId) {
        try {
          const fetched = await PromoApi.getById(params.promoId as string);
          setPromo(fetched);
          return;
        } catch (err) {
          console.error("Error fetching promo by id:", err);
        }
      }

      // If nothing found, navigate back
      router.back();
    };

    init();
  }, [params]);

  if (!promo) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <SimpleHeader title="Chi tiết khuyến mãi" />
      <ScrollView style={styles.container}>
        <Image
          source={{ uri: promo.banner }}
          style={styles.banner}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Text style={styles.title}>{promo.title}</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>Giảm giá</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons
                name="pricetag-outline"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.infoLabel}>Mã khuyến mãi:</Text>
            </View>
            <Text style={styles.infoValue}>{promo.id}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả chi tiết</Text>
            <Text style={styles.description}>{promo.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Điều kiện áp dụng</Text>
            <View style={styles.conditionItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={styles.conditionText}>
                Áp dụng cho tất cả loại xe
              </Text>
            </View>
            <View style={styles.conditionItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={styles.conditionText}>
                Không giới hạn số lần sử dụng
              </Text>
            </View>
            <View style={styles.conditionItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={styles.conditionText}>
                Áp dụng cho cả xe tự lái và có tài xế
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lưu ý</Text>
            <View style={styles.noteBox}>
              <Ionicons name="information-circle" size={20} color="#0369A1" />
              <Text style={styles.noteText}>
                Ưu đãi có thể thay đổi mà không cần báo trước. Vui lòng liên hệ
                để biết thêm chi tiết.
              </Text>
            </View>
          </View>
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
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.lg,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginRight: theme.spacing.md,
  },
  discountBadge: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  infoCard: {
    backgroundColor: "white",
    padding: theme.spacing.md,
    borderRadius: 12,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    marginLeft: 28,
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
  conditionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: theme.spacing.sm,
  },
  conditionText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  noteBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#E0F2FE",
    padding: theme.spacing.md,
    borderRadius: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: "#0369A1",
    lineHeight: 20,
  },
});
