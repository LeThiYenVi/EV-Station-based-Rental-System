import { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  StatusBar,
  FlatList,
  ListRenderItem,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/utils";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { Section } from "../../../components/Section";
import { Promo } from "@/types/Promo";
import { Place } from "@/types/Place";
import { usePromo } from "@/hooks/usePromo";
import { placeFetch } from "@/hooks/placeFetch";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { mockAboutUsData, mockInsuranceData } from "../../../mocks/mockData";

export default function DashboardPage() {
  const [searchText, setSearchText] = useState<string>("");
  const [name, setName] = useState("Guest");
  const [numColumns, setNumColumns] = useState(2);
  const [selectedCarType, setSelectedCarType] = useState<"self" | "driver">(
    "self"
  );
  const { user, token } = useAuth();
  const router = useRouter();
  const {
    promos,
    isLoading: isPromoLoading,
    error: PromoError,
    refetch: fetchPromos,
  } = usePromo();
  const { Places, isLoading: isPlaceLoading, error: PlaceError } = placeFetch();
  const PROMO_CARD_WIDTH = 280;
  const PLACE_CARD_WIDTH = 220;
  useEffect(() => {
    if (user) {
      setName(user.userName);
    }
  }, [user]);

  // Using mock data from centralized file
  const aboutUsData = mockAboutUsData;
  const insuranceData = mockInsuranceData;

  // Renderers (memoized) to keep scrolling smooth on Android
  const renderAboutItem = useCallback(({ item }: any) => {
    return (
      <View
        style={{
          width: 240,
          minHeight: 120,
          backgroundColor: theme.colors.muted,
          borderRadius: theme.radius.xl,
          padding: theme.spacing.md,
          marginRight: theme.spacing.sm,
          ...theme.shadows.sm,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name={item.icon} size={20} color={theme.colors.primary} />
          <Text
            style={{
              fontSize: theme.typography.label.fontSize,
              lineHeight: theme.typography.label.lineHeight,
              fontWeight: "700",
              color: theme.colors.foreground,
            }}
          >
            {item.title}
          </Text>
        </View>
        <Text
          style={{
            marginTop: theme.spacing.xs,
            color: theme.colors.mutedForeground,
            fontSize: theme.typography.bodySmall.fontSize,
            lineHeight: theme.typography.bodySmall.lineHeight,
          }}
          numberOfLines={3}
        >
          {item.description}
        </Text>
      </View>
    );
  }, []);

  const renderInsuranceItem = useCallback(({ item }: any) => {
    return (
      <View
        style={{
          width: 260,
          minHeight: 120,
          backgroundColor: theme.colors.background,
          borderRadius: theme.radius.xl,
          padding: theme.spacing.md,
          marginRight: theme.spacing.sm,
          borderWidth: 1,
          borderColor: theme.colors.border,
          ...theme.shadows.xs,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name={item.icon} size={20} color={theme.colors.info} />
          <Text
            style={{
              fontSize: theme.typography.label.fontSize,
              lineHeight: theme.typography.label.lineHeight,
              fontWeight: "700",
              color: theme.colors.foreground,
            }}
          >
            {item.title}
          </Text>
        </View>
        <Text
          style={{
            marginTop: theme.spacing.xs,
            color: theme.colors.mutedForeground,
            fontSize: theme.typography.bodySmall.fontSize,
            lineHeight: theme.typography.bodySmall.lineHeight,
          }}
          numberOfLines={3}
        >
          {item.description}
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            marginTop: theme.spacing.sm,
            alignSelf: "flex-start",
            backgroundColor: theme.colors.primary,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.xs,
            borderRadius: theme.radius.lg,
          }}
        >
          <Text style={{ color: theme.colors.background, fontWeight: "600" }}>
            Tìm hiểu thêm
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, []);

  const sections = [
    {
      key: "promos",
      title: "Khuyến mãi hot",
      data: promos,
      loading: isPromoLoading,
      error: PromoError,
      layout: "horizontal",
      numColumns: 2,
      renderItem: ({ item }: { item: Promo }) => (
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ width: PROMO_CARD_WIDTH }}
          onPress={() => {
            router.push({
              pathname: "/dashboard/promo-detail",
              params: { promo: JSON.stringify(item) },
            });
          }}
        >
          <View
            style={{
              borderRadius: theme.radius.xl,
              overflow: "hidden",
              backgroundColor: theme.colors.background,
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
          >
            <Image
              source={{ uri: item.banner }}
              style={{ width: "100%", height: 140 }}
              resizeMode="cover"
            />
            <View style={{ padding: theme.spacing.sm }}>
              <Text
                style={{ fontWeight: "700", color: theme.colors.foreground }}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text
                style={{ color: theme.colors.mutedForeground }}
                numberOfLines={2}
              >
                {item.description}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ),
      keyExtractor: (p: Promo) => p.id,
      autoScroll: true,
      autoScrollInterval: 5000,
      itemWidth: PROMO_CARD_WIDTH,
    },
    {
      key: "places",
      title: "Địa điểm nổi bật",
      data: Places,
      loading: isPlaceLoading,
      error: PlaceError,
      layout: "horizontal",
      numColumns: 2,
      renderItem: ({ item }: { item: Place }) => (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            router.push({
              pathname: "/dashboard/place-detail",
              params: { place: JSON.stringify(item) },
            });
          }}
        >
          <View
            style={{
              width: PLACE_CARD_WIDTH,
              backgroundColor: theme.colors.background,
              borderRadius: theme.radius.xl,
              borderWidth: 1,
              borderColor: theme.colors.border,
              overflow: "hidden",
            }}
          >
            <Image
              source={{ uri: item.thumbnail }}
              style={{ width: "100%", height: 120 }}
              resizeMode="cover"
            />
            <View style={{ padding: theme.spacing.sm }}>
              <Text
                style={{ fontWeight: "700", color: theme.colors.foreground }}
              >
                {item.cityName}
              </Text>
              <Text
                style={{ color: theme.colors.mutedForeground, marginTop: 2 }}
              >
                {item.carQuantity} xe có sẵn
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ),
      keyExtractor: (pl: Place) => pl.id,
      autoScroll: true,
      autoScrollInterval: 5000,
      itemWidth: PLACE_CARD_WIDTH,
    },
    {
      key: "about",
      title: "Về Chúng tôi",
      data: aboutUsData,
      loading: false,
      error: null,
      layout: "horizontal",
      numColumns: 2,
      renderItem: renderAboutItem,
    },
    {
      key: "insurance",
      title: "Bảo hiểm",
      data: insuranceData,
      loading: false,
      error: null,
      layout: "horizontal",
      numColumns: 2,
      renderItem: renderInsuranceItem,
    },
  ];
  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />

      <View style={styles.contentSection}>
        <FlatList
          data={sections}
          keyExtractor={(item) => item.key}
          renderItem={({ item }: any) => (
            <Section
              title={item.title}
              data={item.data}
              loading={item.loading}
              error={item.error}
              layout={item.layout}
              renderItem={item.renderItem}
              keyExtractor={item.keyExtractor}
              contentPadding={theme.spacing.md}
              ListHeaderComponent={null as any}
              ListFooterComponent={null as any}
              autoScroll={item.autoScroll}
              autoScrollInterval={item.autoScrollInterval}
              itemWidth={item.itemWidth}
            />
          )}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          windowSize={5}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={50}
          initialNumToRender={1}
          ListHeaderComponent={
            <>
              {/* User Header Card */}
              <View style={styles.userHeaderCard}>
                <View style={styles.userHeaderBg}>
                  <Image
                    source={require("@/assets/images/react-logo.png")}
                    style={styles.userHeaderDecoration}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.userHeaderContent}>
                  <View style={styles.userInfoRow}>
                    <View style={styles.userInfo}>
                      <Image
                        source={{ uri: "https://via.placeholder.com/60" }}
                        style={styles.userAvatar}
                      />
                      <View style={styles.userTextInfo}>
                        <Text style={styles.userName}>
                          {user ? user.userName : "Guest"}
                        </Text>
                        <Text style={styles.userIdText}>
                          {user ? user.id : ""}
                        </Text>
                        {user && (
                          <View style={styles.userPointRow}>
                            <Ionicons name="star" size={16} color="#FFA500" />
                            <Text style={styles.userPoint}>Điểm thưởng</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View style={styles.userActions}>
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() =>
                          Alert.alert("Yêu thích", "Chức năng đang phát triển")
                        }
                      >
                        <Ionicons name="heart-outline" size={24} color="#333" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() =>
                          Alert.alert("Quà tặng", "Chức năng đang phát triển")
                        }
                      >
                        <Ionicons name="gift-outline" size={24} color="#333" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Car Type Selection */}
                  <View style={styles.carTypeRow}>
                    <TouchableOpacity
                      style={[
                        styles.carTypeButton,
                        selectedCarType === "self" && styles.carTypeActive,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => setSelectedCarType("self")}
                    >
                      <Ionicons
                        name="car-sport"
                        size={24}
                        color={selectedCarType === "self" ? "#fff" : "#333"}
                      />
                      <Text
                        style={
                          selectedCarType === "self"
                            ? styles.carTypeTextActive
                            : styles.carTypeText
                        }
                      >
                        Xe tự lái
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.carTypeButton,
                        selectedCarType === "driver" && styles.carTypeActive,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => setSelectedCarType("driver")}
                    >
                      <Ionicons
                        name="car"
                        size={24}
                        color={selectedCarType === "driver" ? "#fff" : "#333"}
                      />
                      <Text
                        style={
                          selectedCarType === "driver"
                            ? styles.carTypeTextActive
                            : styles.carTypeText
                        }
                      >
                        Xe có tài xế
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Location Input */}
                  <TouchableOpacity
                    style={styles.inputSection}
                    onPress={() =>
                      Alert.alert("Chọn địa điểm", "Chức năng đang phát triển")
                    }
                  >
                    <Ionicons name="location-outline" size={20} color="#999" />
                    <View style={styles.inputContent}>
                      <Text style={styles.inputLabel}>Địa điểm</Text>
                      <Text style={styles.inputValue}>
                        TP. Hồ Chí Minh, Việt Nam
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Time Input */}
                  <TouchableOpacity
                    style={styles.inputSection}
                    onPress={() =>
                      Alert.alert("Chọn thời gian", "Chức năng đang phát triển")
                    }
                  >
                    <Ionicons name="calendar-outline" size={20} color="#999" />
                    <View style={styles.inputContent}>
                      <Text style={styles.inputLabel}>Thời gian thuê</Text>
                      <Text style={styles.inputValue}>
                        21:00 CN, 19/10 - 20:00 T2, 20/10
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Search Button */}
                  <TouchableOpacity
                    style={styles.searchButton}
                    activeOpacity={0.8}
                    onPress={() => {
                      if (!user) {
                        Alert.alert(
                          "Cần đăng nhập",
                          "Vui lòng đăng nhập để tìm xe",
                          [
                            { text: "Hủy", style: "cancel" },
                            {
                              text: "Đăng nhập",
                              onPress: () => router.push("/login"),
                            },
                          ]
                        );
                      } else {
                        Alert.alert(
                          "Tìm xe",
                          `Đang tìm ${
                            selectedCarType === "self"
                              ? "xe tự lái"
                              : "xe có tài xế"
                          }...`
                        );
                      }
                    }}
                  >
                    <Text style={styles.searchButtonText}>Tìm xe</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentSection: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  // User Header Card Styles
  userHeaderCard: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    backgroundColor: "#D5EDE8",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  userHeaderBg: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "50%",
    height: 200,
  },
  userHeaderDecoration: {
    width: "100%",
    height: "100%",
    opacity: 0.3,
  },
  userHeaderContent: {
    padding: theme.spacing.md,
  },
  userInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ddd",
  },
  userTextInfo: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  userIdText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  userPointRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  userPoint: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  userActions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  carTypeRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  carTypeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: "#fff",
    gap: theme.spacing.xs,
  },
  carTypeActive: {
    backgroundColor: theme.colors.primary,
  },
  carTypeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  carTypeTextActive: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  inputSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContent: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  inputValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  searchButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.lg,
    alignItems: "center",
    marginTop: theme.spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
