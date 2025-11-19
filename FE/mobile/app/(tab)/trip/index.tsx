import apiClient from "@/api/apiClient";
import { BookingApi } from "@/api/BookingApi";
import RequireLoginButton from "@/components/RequireLoginButton";
import { useAuth } from "@/context/authContext";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { BookingResponse, BookingStatus } from "@/types";
import { theme } from "@/utils";
import { getFromCache, saveToCache } from "@/utils/cache";
import { processOfflineQueue } from "@/utils/offlineQueue";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Card,
  Chip,
  FAB,
  Searchbar,
  Text,
} from "react-native-paper";

export default function TripPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingResponse[]>(
    []
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const network = useNetworkStatus();
  const wasOfflineRef = useRef<boolean>(false);

  useEffect(() => {
    // On mount or user change: try to load cached data first, then fetch fresh when online
    let mounted = true;

    const init = async () => {
      if (!user) return;

      // Try cached bookings quickly to show something while online fetch occurs
      try {
        const cached = await getFromCache<BookingResponse[]>("my_bookings");
        if (mounted && cached && cached.length) {
          setBookings(cached);
        }
      } catch (err) {
        // ignore cache errors
      }

      // If online, fetch fresh data
      if (network.isConnected) {
        await fetchBookings();
      } else {
        setIsLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [bookings, selectedStatus, searchQuery]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      setError("");

      // If offline, try to return cached data instead of making network call
      if (!network.isConnected) {
        const cached = await getFromCache<BookingResponse[]>("my_bookings");
        if (cached) {
          setBookings(cached);
          return;
        } else {
          throw new Error("Không có dữ liệu cached và bạn đang offline");
        }
      }

      const myBookings = await BookingApi.getMyBookings();
      setBookings(myBookings);

      // Save fresh bookings to cache (short TTL)
      try {
        await saveToCache("my_bookings", myBookings, { ttl: 5 * 60 * 1000 });
      } catch (err) {
        // ignore caching failures
      }
    } catch (err: any) {
      setError(err.message || "Failed to load bookings");
      console.error("Error fetching bookings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    if (!network.isConnected) {
      setError("Bạn đang ngoại tuyến — sử dụng dữ liệu đã lưu.");
      setIsRefreshing(false);
      return;
    }

    await fetchBookings();
    setIsRefreshing(false);
  }, []);

  // When network status changes, handle reconnects to flush offline queue and refresh
  useEffect(() => {
    const wasOffline = wasOfflineRef.current;
    if (wasOffline && network.isConnected) {
      // regained connection
      fetchBookings();
      processOfflineQueue(apiClient).catch((e) => {
        console.warn("Error processing offline queue:", e);
      });
    }

    wasOfflineRef.current = !network.isConnected;
  }, [network.isConnected]);

  const applyFilters = () => {
    let filtered = [...bookings];

    // Status filter
    if (selectedStatus !== "ALL") {
      filtered = filtered.filter((b) => b.status === selectedStatus);
    }

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (b) =>
          b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.vehicleName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by creation date (newest first)
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setFilteredBookings(filtered);
  };

  const getStatusColor = (status: BookingStatus): string => {
    switch (status) {
      case "PENDING":
        return "#FFA500";
      case "CONFIRMED":
        return "#2196F3";
      case "STARTED":
        return "#9C27B0";
      case "COMPLETED":
        return "#4CAF50";
      case "CANCELLED":
        return "#F44336";
      default:
        return theme.colors.mutedForeground;
    }
  };

  const getStatusLabel = (status: BookingStatus): string => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "STARTED":
        return "Đang thuê";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewBooking = (bookingId: string) => {
    router.push({
      pathname: "/trip/booking-detail" as any,
      params: { bookingId },
    });
  };

  const handleCreateBooking = () => {
    router.push("/(tab)/dashboard");
  };

  const statusFilters = [
    { key: "ALL", label: "Tất cả", count: bookings.length },
    {
      key: "PENDING",
      label: "Chờ xác nhận",
      count: bookings.filter((b) => b.status === "PENDING").length,
    },
    {
      key: "CONFIRMED",
      label: "Đã xác nhận",
      count: bookings.filter((b) => b.status === "CONFIRMED").length,
    },
    {
      key: "STARTED",
      label: "Đang thuê",
      count: bookings.filter((b) => b.status === "STARTED").length,
    },
    {
      key: "COMPLETED",
      label: "Hoàn thành",
      count: bookings.filter((b) => b.status === "COMPLETED").length,
    },
    {
      key: "CANCELLED",
      label: "Đã hủy",
      count: bookings.filter((b) => b.status === "CANCELLED").length,
    },
  ];

  return (
    <RequireLoginButton>
      <View style={styles.container}>
        {/* Offline banner */}
        {!network.isConnected && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>
              Bạn đang ngoại tuyến — hiển thị dữ liệu đã lưu
            </Text>
          </View>
        )}
        {/* Header with Search */}
        <View style={styles.header}>
          <Searchbar
            placeholder="Tìm theo mã đặt xe hoặc tên xe..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchbar}
          />
        </View>

        {/* Status Filters */}
        <View style={styles.filtersContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={statusFilters}
            keyExtractor={(item) => item.key}
            contentContainerStyle={styles.filtersList}
            renderItem={({ item }) => (
              <Chip
                selected={selectedStatus === item.key}
                onPress={() => setSelectedStatus(item.key)}
                style={styles.filterChip}
                mode={selectedStatus === item.key ? "flat" : "outlined"}
              >
                {item.label} ({item.count})
              </Chip>
            )}
          />
        </View>

        {/* Bookings List */}
        {isLoading && !isRefreshing ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Đang tải...</Text>
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Ionicons
              name="alert-circle"
              size={64}
              color={theme.colors.error}
            />
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.retryText} onPress={fetchBookings}>
              Thử lại
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredBookings}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
              />
            }
            renderItem={({ item }) => (
              <Card
                style={styles.bookingCard}
                onPress={() => handleViewBooking(item.id)}
              >
                <Card.Content>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <Text style={styles.bookingCode}>{item.bookingCode}</Text>
                      <Chip
                        mode="flat"
                        style={[
                          styles.statusChip,
                          {
                            backgroundColor: getStatusColor(item.status) + "20",
                          },
                        ]}
                        textStyle={{
                          color: getStatusColor(item.status),
                          fontSize: 12,
                        }}
                        compact
                      >
                        {getStatusLabel(item.status)}
                      </Chip>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={theme.colors.mutedForeground}
                    />
                  </View>

                  <View style={styles.vehicleInfo}>
                    <View style={styles.vehicleDetails}>
                      <Text style={styles.vehicleName}>{item.vehicleName}</Text>
                      <View style={styles.infoRow}>
                        <Ionicons
                          name="car"
                          size={14}
                          color={theme.colors.mutedForeground}
                        />
                        <Text style={styles.infoText}>{item.licensePlate}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Ionicons
                          name="location"
                          size={14}
                          color={theme.colors.mutedForeground}
                        />
                        <Text style={styles.infoText}>{item.stationName}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.timeInfo}>
                    <View style={styles.timeBlock}>
                      <Text style={styles.timeLabel}>Nhận xe</Text>
                      <Text style={styles.timeValue}>
                        {formatDate(item.startTime)}
                      </Text>
                    </View>
                    <Ionicons
                      name="arrow-forward"
                      size={16}
                      color={theme.colors.mutedForeground}
                    />
                    <View style={styles.timeBlock}>
                      <Text style={styles.timeLabel}>Trả xe</Text>
                      <Text style={styles.timeValue}>
                        {formatDate(item.expectedEndTime)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Tổng cộng:</Text>
                    <Text style={styles.priceValue}>
                      ${item.totalAmount.toFixed(2)}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={64}
                  color={theme.colors.mutedForeground}
                />
                <Text style={styles.emptyTitle}>
                  {searchQuery || selectedStatus !== "ALL"
                    ? "Không tìm thấy đặt xe"
                    : "Chưa có đặt xe nào"}
                </Text>
                <Text style={styles.emptySubtitle}>
                  {searchQuery || selectedStatus !== "ALL"
                    ? "Thử thay đổi bộ lọc"
                    : "Bắt đầu đặt xe đầu tiên của bạn!"}
                </Text>
              </View>
            )}
          />
        )}

        {/* FAB for new booking */}
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={handleCreateBooking}
          label="Đặt xe mới"
        />
      </View>
    </RequireLoginButton>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchbar: {
    elevation: 0,
  },
  filtersContainer: {
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  filtersList: {
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  filterChip: {
    marginRight: theme.spacing.xs,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.mutedForeground,
  },
  errorText: {
    marginTop: theme.spacing.md,
    color: theme.colors.error,
    textAlign: "center",
    fontSize: 16,
  },
  retryText: {
    marginTop: theme.spacing.md,
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  listContent: {
    padding: theme.spacing.md,
  },
  bookingCard: {
    marginBottom: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    flex: 1,
  },
  bookingCode: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.foreground,
  },
  statusChip: {
    height: 24,
  },
  vehicleInfo: {
    marginBottom: theme.spacing.md,
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: theme.colors.mutedForeground,
  },
  timeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radius.md,
  },
  timeBlock: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    color: theme.colors.mutedForeground,
    marginBottom: 2,
  },
  timeValue: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.foreground,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  priceLabel: {
    fontSize: 14,
    color: theme.colors.foreground,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  emptyContainer: {
    alignItems: "center",
    padding: theme.spacing.xl,
    marginTop: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.foreground,
    marginTop: theme.spacing.md,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.mutedForeground,
    marginTop: theme.spacing.xs,
    textAlign: "center",
  },
  offlineBanner: {
    backgroundColor: theme.colors.muted,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    alignItems: "center",
  },
  offlineText: {
    color: theme.colors.mutedForeground,
    fontSize: 13,
  },
  fab: {
    position: "absolute",
    right: theme.spacing.md,
    bottom: theme.spacing.md,
  },
});
