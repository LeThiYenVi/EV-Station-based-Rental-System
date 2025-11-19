import { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, FlatList, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Button,
  Card,
  Chip,
  RadioButton,
  Searchbar,
  ActivityIndicator,
  Text,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { VehicleApi } from "@/api/VehicleApi";
import { VehicleResponse, FuelType } from "@/types";
import { theme } from "@/utils";

export default function SelectVehicleScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const stationId = params.stationId as string;
  const preselectedVehicleId = params.vehicleId as string;
  const startDate = params.startDate as string;
  const endDate = params.endDate as string;
  const startTime = params.startTime as string;
  const endTime = params.endTime as string;

  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleResponse[]>(
    []
  );
  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [fuelFilter, setFuelFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAvailableVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [vehicles, searchQuery, fuelFilter]);

  const fetchAvailableVehicles = async () => {
    try {
      setIsLoading(true);
      setError("");

      const startDateTime = `${startDate}T${startTime}:00`;
      const endDateTime = `${endDate}T${endTime}:00`;

      const availableVehicles = await VehicleApi.getAvailableVehiclesForBooking(
        {
          stationId,
          startTime: startDateTime,
          endTime: endDateTime,
        }
      );

      setVehicles(availableVehicles);

      // Pre-select vehicle if provided
      if (preselectedVehicleId) {
        const preselected = availableVehicles.find(
          (v) => v.id === preselectedVehicleId
        );
        if (preselected) {
          setSelectedVehicle(preselected);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load available vehicles");
      console.error("Error fetching vehicles:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...vehicles];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Fuel type filter
    if (fuelFilter !== "all") {
      filtered = filtered.filter((v) => v.fuelType === fuelFilter);
    }

    setFilteredVehicles(filtered);
  };

  const handleContinue = () => {
    if (!selectedVehicle) return;

    router.push({
      pathname: "/booking/review" as any,
      params: {
        vehicleId: selectedVehicle.id,
        stationId,
        startDate,
        endDate,
        startTime,
        endTime,
      },
    });
  };

  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Ionicons key={i} name="star" size={14} color="#FFA500" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons key={i} name="star-half" size={14} color="#FFA500" />
        );
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={14} color="#FFA500" />
        );
      }
    }
    return <View style={styles.ratingRow}>{stars}</View>;
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Đang tìm xe có sẵn...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle" size={64} color={theme.colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <Button
          mode="outlined"
          onPress={fetchAvailableVehicles}
          style={styles.retryButton}
        >
          Thử lại
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search and Filters */}
      <View style={styles.filtersContainer}>
        <Searchbar
          placeholder="Tìm xe theo tên hoặc hãng..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchbar}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterChips}
          contentContainerStyle={styles.filterChipsContent}
        >
          <Chip
            selected={fuelFilter === "all"}
            onPress={() => setFuelFilter("all")}
            style={styles.chip}
          >
            Tất cả
          </Chip>
          <Chip
            selected={fuelFilter === "ELECTRIC"}
            onPress={() => setFuelFilter("ELECTRIC")}
            style={styles.chip}
            icon="flash"
          >
            Điện
          </Chip>
          <Chip
            selected={fuelFilter === "HYBRID"}
            onPress={() => setFuelFilter("HYBRID")}
            style={styles.chip}
            icon="leaf"
          >
            Hybrid
          </Chip>
          <Chip
            selected={fuelFilter === "GASOLINE"}
            onPress={() => setFuelFilter("GASOLINE")}
            style={styles.chip}
            icon="gas-station"
          >
            Xăng
          </Chip>
        </ScrollView>
      </View>

      {/* Vehicle List */}
      {filteredVehicles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="car-outline"
            size={64}
            color={theme.colors.mutedForeground}
          />
          <Text style={styles.emptyText}>
            {vehicles.length === 0
              ? "Không có xe nào trong khoảng thời gian này"
              : "Không tìm thấy xe phù hợp"}
          </Text>
          {searchQuery || fuelFilter !== "all" ? (
            <Button
              mode="text"
              onPress={() => {
                setSearchQuery("");
                setFuelFilter("all");
              }}
            >
              Xóa bộ lọc
            </Button>
          ) : null}
        </View>
      ) : (
        <FlatList
          data={filteredVehicles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Card
              style={[
                styles.vehicleCard,
                selectedVehicle?.id === item.id && styles.selectedCard,
              ]}
              onPress={() => setSelectedVehicle(item)}
            >
              <View style={styles.cardContent}>
                <Image
                  source={{
                    uri:
                      item.photos?.[0] || "https://via.placeholder.com/120x80",
                  }}
                  style={styles.vehicleImage}
                  resizeMode="cover"
                />

                <View style={styles.vehicleInfo}>
                  <View style={styles.vehicleHeader}>
                    <Text style={styles.vehicleName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <RadioButton
                      value={item.id}
                      status={
                        selectedVehicle?.id === item.id
                          ? "checked"
                          : "unchecked"
                      }
                      onPress={() => setSelectedVehicle(item)}
                    />
                  </View>

                  <View style={styles.ratingContainer}>
                    {renderStarRating(item.rating)}
                    <Text style={styles.ratingText}>
                      {item.rating.toFixed(1)} ({item.rentCount} lượt)
                    </Text>
                  </View>

                  <View style={styles.specsRow}>
                    <View style={styles.specItem}>
                      <Ionicons
                        name="flash"
                        size={14}
                        color={theme.colors.mutedForeground}
                      />
                      <Text style={styles.specText}>{item.fuelType}</Text>
                    </View>
                    <View style={styles.specItem}>
                      <Ionicons
                        name="people"
                        size={14}
                        color={theme.colors.mutedForeground}
                      />
                      <Text style={styles.specText}>{item.capacity} chỗ</Text>
                    </View>
                  </View>

                  <View style={styles.priceContainer}>
                    <Text style={styles.priceValue}>${item.hourlyRate}/h</Text>
                    <Text style={styles.priceSeparator}>•</Text>
                    <Text style={styles.priceValue}>
                      ${item.dailyRate}/ngày
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          )}
        />
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerLabel}>
            {selectedVehicle ? "Đã chọn:" : "Chưa chọn xe"}
          </Text>
          {selectedVehicle && (
            <Text style={styles.footerVehicleName} numberOfLines={1}>
              {selectedVehicle.name}
            </Text>
          )}
        </View>
        <Button
          mode="contained"
          onPress={handleContinue}
          disabled={!selectedVehicle}
          icon="arrow-right"
          contentStyle={styles.buttonContent}
        >
          Tiếp tục
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.mutedForeground,
  },
  errorText: {
    marginTop: theme.spacing.md,
    color: theme.colors.error,
    textAlign: "center",
  },
  retryButton: {
    marginTop: theme.spacing.md,
  },
  filtersContainer: {
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchbar: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  filterChips: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  filterChipsContent: {
    gap: theme.spacing.xs,
  },
  chip: {
    marginRight: theme.spacing.xs,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  vehicleCard: {
    marginBottom: theme.spacing.md,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  cardContent: {
    flexDirection: "row",
    padding: theme.spacing.md,
  },
  vehicleImage: {
    width: 120,
    height: 80,
    borderRadius: theme.radius.md,
    marginRight: theme.spacing.md,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.foreground,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  ratingRow: {
    flexDirection: "row",
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: theme.colors.mutedForeground,
  },
  specsRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  specItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  specText: {
    fontSize: 12,
    color: theme.colors.mutedForeground,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  priceSeparator: {
    color: theme.colors.mutedForeground,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  emptyText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.mutedForeground,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    gap: theme.spacing.md,
  },
  footerInfo: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 12,
    color: theme.colors.mutedForeground,
  },
  footerVehicleName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.foreground,
  },
  buttonContent: {
    paddingVertical: theme.spacing.xs,
  },
});
