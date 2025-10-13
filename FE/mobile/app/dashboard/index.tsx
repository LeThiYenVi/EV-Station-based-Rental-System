import { useCallback, useMemo, useState } from "react";
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
import { Section } from "./components/Section";
import { Promo } from "@/types/Promo";
import { Place } from "@/types/Place";
import { usePromo } from "@/hooks/usePromo";
import { placeFetch } from "@/hooks/placeFetch";
export default function DashboardPage() {
  const [searchText, setSearchText] = useState<string>("");
  const [name, setName] = useState("Guest");
  const [numColumns, setNumColumns] = useState(2);
  const {
    promos,
    isLoading: isPromoLoading,
    error: PromoError,
    refetch: fetchPromos,
  } = usePromo();
  const { Places, isLoading: isPlaceLoading, error: PlaceError } = placeFetch();
  const PROMO_CARD_WIDTH = 280;
  const PLACE_CARD_WIDTH = 220;
  // Fake data: Về Chúng tôi
  const aboutUsData = useMemo(
    () => [
      {
        id: "mission",
        title: "Sứ mệnh",
        description: "Kết nối người dùng với trạm sạc EV nhanh và tiện lợi.",
        icon: "rocket-outline" as const,
      },
      {
        id: "vision",
        title: "Tầm nhìn",
        description: "Hệ sinh thái thuê xe điện minh bạch, bền vững.",
        icon: "eye-outline" as const,
      },
      {
        id: "team",
        title: "Đội ngũ",
        description: "Năng động, tận tâm và luôn đổi mới.",
        icon: "people-outline" as const,
      },
      {
        id: "values",
        title: "Giá trị",
        description: "An toàn – Tốc độ – Trách nhiệm.",
        icon: "sparkles-outline" as const,
      },
    ],
    []
  );

  // Fake data: Bảo hiểm
  const insuranceData = useMemo(
    () => [
      {
        id: "ins-basic",
        title: "Gói cơ bản",
        description: "Bảo vệ thiệt hại nhẹ và hỗ trợ cơ bản.",
        icon: "shield-checkmark-outline" as const,
      },
      {
        id: "ins-plus",
        title: "Gói Plus",
        description: "Bao gồm mất cắp, va quệt và cứu hộ 24/7.",
        icon: "shield-half-outline" as const,
      },
      {
        id: "ins-premium",
        title: "Gói Premium",
        description: "Bảo vệ toàn diện với quyền lợi tối đa.",
        icon: "medal-outline" as const,
      },
    ],
    []
  );

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
            <Text style={{ fontWeight: "700", color: theme.colors.foreground }}>
              {item.cityName}
            </Text>
            <Text style={{ color: theme.colors.mutedForeground, marginTop: 2 }}>
              {item.carQuantity} xe có sẵn
            </Text>
          </View>
        </View>
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

      {/* Content */}
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
              <View style={styles.BrotherSayHi}>
                <Text>Xin Chào,{name}</Text>
              </View>
              {/* Header*/}
              <View style={styles.header}>
                <View style={styles.searchContainer}>
                  <Ionicons
                    name="search"
                    size={20}
                    color={theme.colors.mutedForeground}
                    style={styles.searchIcon}
                  />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm trạm sạc EV..."
                    placeholderTextColor={theme.colors.mutedForeground}
                    value={searchText}
                    onChangeText={setSearchText}
                  />
                  {searchText.length > 0 && (
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={theme.colors.mutedForeground}
                      onPress={() => setSearchText("")}
                      style={styles.clearIcon}
                    />
                  )}
                </View>
              </View>
              <View>
                <Text>Thuê Xe ....</Text>
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
  header: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingTop: 0,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    height: 48,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.foreground,
  },
  clearIcon: {
    marginLeft: theme.spacing.sm,
  },
  contentSection: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  BrotherSayHi: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 0,
  },
  title: {
    fontSize: theme.typography.h4.fontSize,
    lineHeight: theme.typography.h4.lineHeight,
    fontWeight: "700",
    color: theme.colors.foreground,
    paddingLeft: 12,
  },
});
