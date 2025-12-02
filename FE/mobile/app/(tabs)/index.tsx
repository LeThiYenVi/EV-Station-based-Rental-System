import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Search,
  MapPin,
  Navigation,
  Filter,
  Star,
  Clock,
  Zap,
  User,
  QrCode,
} from "lucide-react-native";
import { useAuth } from "@/hooks/useAuth";
<<<<<<< HEAD
import { api } from "@/services/api";
import type { StationResponse } from "@/types";
import Toast from "react-native-toast-message";
=======
import { useStations } from "@/hooks/useStations";
import { useRouter } from "expo-router";
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5

export default function ExploreScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { stations, isLoading, refetch } = useStations();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [stations, setStations] = useState<StationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  // Fetch stations from API
  useEffect(() => {
    const fetchStations = async () => {
      try {
        setIsLoading(true);
        const response = await api.getStations();

        // API returns paginated response
        if (response.data && Array.isArray(response.data.content)) {
          setStations(response.data.content);
        } else if (Array.isArray(response.data)) {
          setStations(response.data);
        }
      } catch (error: any) {
        console.error("Failed to fetch stations:", error);
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Không thể tải danh sách trạm",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStations();
  }, []);

  // Animate greeting on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Refresh stations list
  const handleUseCurrentLocation = async () => {
    // For now, just refresh the active stations list
    // TODO: Implement geolocation to fetch nearby stations
    await refetch();
  };

  // Categories
  const categories = [
    { id: "all", label: "Tất Cả", icon: <MapPin size={16} color="#ffffff" /> },
    {
      id: "nearest",
      label: "Gần Nhất",
      icon: <Navigation size={16} color="#ffffff" />,
    },
    {
      id: "available",
      label: "Có Sẵn",
      icon: <Zap size={16} color="#ffffff" />,
    },
    {
      id: "popular",
      label: "Phổ Biến",
      icon: <Star size={16} color="#ffffff" />,
    },
  ];

<<<<<<< HEAD
  // Filter stations based on search query
  const filteredStations = stations.filter((station) =>
    station.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

=======
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
  // Recent searches
  const recentSearches = ["Trạm Trung Tâm", "Sân Bay", "Quận 1"];

  // Filter stations based on search query
  const filteredStations = stations.filter((station) =>
    station.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header - Simplified */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Khám Phá</Text>
            <Animated.View
              style={[
                styles.greetingContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={styles.greetingText}>
                Xin chào, {isAuthenticated && user ? user.fullName : "User"}! 👋
              </Text>
            </Animated.View>
          </View>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              {isAuthenticated && user ? (
                <Text style={styles.avatarText}>
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                </Text>
              ) : (
                <User size={22} color="#ffffff" />
              )}
            </View>
            {isAuthenticated && <View style={styles.onlineDot} />}
          </View>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar & Filter - Inside Scroll */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Search size={20} color="#9ca3af" />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm trạm sạc..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <Pressable
            style={styles.qrButton}
            onPress={() => router.push("/(rental)/scan")}
          >
            <QrCode size={22} color="#ffffff" />
          </Pressable>
          <Pressable style={styles.filterIconButton}>
            <Filter size={22} color="#10b981" />
          </Pressable>
        </View>

        {/* Location Button - Prominent */}
        <View style={styles.locationSection}>
          <Pressable
            style={styles.locationButton}
            onPress={handleUseCurrentLocation}
          >
            <Navigation size={20} color="#ffffff" />
            <Text style={styles.locationButtonText}>Dùng Vị Trí Hiện Tại</Text>
          </Pressable>
        </View>
        {/* Categories Filter */}
        <View style={styles.categoriesSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {categories.map((category) => (
              <Pressable
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                {category.icon}
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === category.id &&
                      styles.categoryChipTextActive,
                  ]}
                >
                  {category.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Clock size={18} color="#6b7280" />
              <Text style={styles.sectionTitle}>Tìm Kiếm Gần Đây</Text>
            </View>
            <View style={styles.recentSearches}>
              {recentSearches.map((search, index) => (
                <Pressable key={index} style={styles.recentSearchChip}>
                  <Text style={styles.recentSearchText}>{search}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Map Preview */}
        <View style={styles.mapPreview}>
          <MapPin size={40} color="#10b981" />
          <Text style={styles.mapPreviewText}>Xem Bản Đồ</Text>
        </View>

        {/* Stations List */}
        <View style={styles.stationsSection}>
          <Text style={styles.stationsTitle}>
            Trạm Gần Đây ({filteredStations.length})
          </Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#10b981" />
              <Text style={styles.loadingText}>Đang tải trạm...</Text>
            </View>
          ) : filteredStations.length === 0 ? (
            <View style={styles.emptyContainer}>
<<<<<<< HEAD
              <MapPin size={48} color="#d1d5db" />
=======
              <MapPin size={48} color="#9ca3af" />
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
              <Text style={styles.emptyText}>Không tìm thấy trạm nào</Text>
            </View>
          ) : (
            filteredStations.map((station) => (
              <Pressable
                key={station.id}
                style={({ pressed }) => [
                  styles.stationCard,
                  pressed && styles.stationCardPressed,
                ]}
<<<<<<< HEAD
                onPress={() => router.push(`/station/${station.id}`)}
              >
                <View style={styles.stationCardHeader}>
                  <View style={styles.stationInfo}>
                    <Text style={styles.stationName}>{station.name}</Text>
                    <View style={styles.stationMeta}>
                      <MapPin size={14} color="#9ca3af" />
                      <Text style={styles.distanceText}>{station.address}</Text>
                      <View style={styles.separator} />
                      <Star size={14} color="#fbbf24" fill="#fbbf24" />
                      <Text style={styles.ratingText}>
                        {station.rating?.toFixed(1) || "N/A"}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.availabilityBadge,
                      station.status !== "ACTIVE" &&
                        styles.availabilityBadgeEmpty,
=======
                onPress={() => router.push(`/(station)/${station.id}`)}
              >
                <View style={styles.stationCardContent}>
                  <View style={styles.stationInfo}>
                    <Text style={styles.stationName}>{station.name}</Text>
                    <Text style={styles.stationAddress}>
                      {station.address || "Chưa cập nhật"}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      station.status === "ACTIVE"
                        ? styles.statusBadgeActive
                        : styles.statusBadgeInactive,
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
                    ]}
                  >
                    <Text
                      style={[
<<<<<<< HEAD
                        styles.availabilityText,
                        station.status !== "ACTIVE" &&
                          styles.availabilityTextEmpty,
                      ]}
                    >
                      {station.status === "ACTIVE" ? "Hoạt động" : "Đóng cửa"}
                    </Text>
                  </View>
                </View>
                <Text style={styles.vehiclesText}>
                  {station.hotline || "Không có số điện thoại"}
                </Text>
=======
                        styles.statusBadgeText,
                        station.status === "ACTIVE"
                          ? styles.statusTextActive
                          : styles.statusTextInactive,
                      ]}
                    >
                      {station.status === "ACTIVE" ? "Hoạt Động" : "Đóng"}
                    </Text>
                  </View>
                </View>
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },
  greetingContainer: {
    marginTop: 4,
  },
  greetingText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10b981",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: "#111827",
  },
  qrButton: {
    width: 48,
    height: 48,
    backgroundColor: "#10b981",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  filterIconButton: {
    width: 48,
    height: 48,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginLeft: 8,
  },
  locationSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10b981",
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  locationButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },
  categoriesSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: "#10b981",
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  categoryChipTextActive: {
    color: "#ffffff",
  },
  recentSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },
  recentSearches: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  recentSearchChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  recentSearchText: {
    fontSize: 13,
    color: "#374151",
  },
  mapPreview: {
    height: 180,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
  },
  mapPreviewText: {
    color: "#6b7280",
    marginTop: 8,
    fontWeight: "600",
  },
  stationsSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  stationsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  stationCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  stationCardPressed: {
    backgroundColor: "#f9fafb",
  },
  stationCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  stationInfo: {
    flex: 1,
    marginRight: 12,
  },
  stationName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  stationAddress: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeActive: {
    backgroundColor: "#d1fae5",
  },
  statusBadgeInactive: {
    backgroundColor: "#fee2e2",
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusTextActive: {
    color: "#065f46",
  },
  statusTextInactive: {
    color: "#991b1b",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    color: "#6b7280",
    fontSize: 14,
    marginTop: 12,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#9ca3af",
    fontSize: 16,
    marginTop: 12,
  },
  stationAddress: {
    color: "#6b7280",
    fontSize: 14,
    marginBottom: 6,
  },
<<<<<<< HEAD
  stationMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  distanceText: {
    color: "#6b7280",
    fontSize: 14,
  },
  separator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#d1d5db",
    marginHorizontal: 4,
  },
  ratingText: {
    color: "#6b7280",
    fontSize: 14,
    fontWeight: "600",
  },
  availabilityBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  availabilityBadgeEmpty: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  availabilityText: {
    color: "#10b981",
    fontWeight: "600",
    fontSize: 14,
  },
  availabilityTextEmpty: {
    color: "#ef4444",
  },
  vehiclesText: {
    color: "#6b7280",
    fontSize: 14,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6b7280",
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#9ca3af",
    fontWeight: "500",
  },
=======
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5
});
