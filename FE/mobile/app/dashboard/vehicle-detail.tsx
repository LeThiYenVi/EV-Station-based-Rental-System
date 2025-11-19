import { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Appbar,
  Card,
  Button,
  Chip,
  ActivityIndicator,
  Text,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { VehicleApi } from "@/api/VehicleApi";
import { VehicleDetailResponse } from "@/types";
import { theme } from "@/utils";
import { useAuth } from "@/context/authContext";

const { width } = Dimensions.get("window");

export default function VehicleDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const vehicleId = params.vehicleId as string;

  const [vehicle, setVehicle] = useState<VehicleDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    fetchVehicleDetail();
  }, [vehicleId]);

  const fetchVehicleDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const vehicleData = await VehicleApi.getVehicleById(vehicleId);
      setVehicle(vehicleData);
    } catch (err: any) {
      setError(err.message || "Failed to load vehicle details");
      console.error("Error fetching vehicle detail:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookVehicle = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!vehicle) return;

    router.push({
      pathname: "/booking/select-time" as any,
      params: {
        vehicleId: vehicle.id,
        stationId: vehicle.stationId,
      },
    });
  };

  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Ionicons key={i} name="star" size={16} color="#FFA500" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons key={i} name="star-half" size={16} color="#FFA500" />
        );
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={16} color="#FFA500" />
        );
      }
    }
    return <View style={styles.ratingRow}>{stars}</View>;
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading vehicle details...</Text>
      </View>
    );
  }

  if (error || !vehicle) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle" size={64} color={theme.colors.error} />
        <Text style={styles.errorText}>{error || "Vehicle not found"}</Text>
        <Button
          mode="outlined"
          onPress={fetchVehicleDetail}
          style={styles.retryButton}
        >
          Retry
        </Button>
      </View>
    );
  }

  const photos =
    vehicle.photos && vehicle.photos.length > 0
      ? vehicle.photos
      : ["https://via.placeholder.com/400x250"];

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={vehicle.name} />
        <Appbar.Action icon="heart-outline" onPress={() => {}} />
      </Appbar.Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Photo Carousel */}
        <View style={styles.carouselContainer}>
          <FlatList
            data={photos}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width
              );
              setCurrentPhotoIndex(index);
            }}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.vehicleImage}
                resizeMode="cover"
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />

          {/* Photo Indicators */}
          <View style={styles.photoIndicators}>
            {photos.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  currentPhotoIndex === index && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Vehicle Info */}
        <View style={styles.content}>
          {/* Status Badge */}
          <View style={styles.statusRow}>
            <Chip
              mode={vehicle.status === "AVAILABLE" ? "flat" : "outlined"}
              icon={
                vehicle.status === "AVAILABLE" ? "check-circle" : "alert-circle"
              }
              style={
                vehicle.status === "AVAILABLE"
                  ? styles.availableChip
                  : styles.unavailableChip
              }
            >
              {vehicle.status === "AVAILABLE" ? "Xe có sẵn" : "Không có sẵn"}
            </Chip>
          </View>

          {/* Rating and Rent Count */}
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.ratingContainer}>
                {renderStarRating(vehicle.rating)}
                <Text style={styles.ratingText}>
                  {vehicle.rating.toFixed(1)} ({vehicle.rentCount} lượt thuê)
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Vehicle Specifications */}
          <Card style={styles.card}>
            <Card.Title title="Thông tin xe" titleStyle={styles.cardTitle} />
            <Card.Content>
              <View style={styles.specsGrid}>
                <View style={styles.specItem}>
                  <Ionicons
                    name="car-sport"
                    size={24}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.specLabel}>Hãng xe</Text>
                  <Text style={styles.specValue}>{vehicle.brand}</Text>
                </View>

                <View style={styles.specItem}>
                  <Ionicons
                    name="document-text"
                    size={24}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.specLabel}>Biển số</Text>
                  <Text style={styles.specValue}>{vehicle.licensePlate}</Text>
                </View>

                <View style={styles.specItem}>
                  <Ionicons
                    name="flash"
                    size={24}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.specLabel}>Nhiên liệu</Text>
                  <Text style={styles.specValue}>{vehicle.fuelType}</Text>
                </View>

                <View style={styles.specItem}>
                  <Ionicons
                    name="color-palette"
                    size={24}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.specLabel}>Màu sắc</Text>
                  <Text style={styles.specValue}>{vehicle.color}</Text>
                </View>

                <View style={styles.specItem}>
                  <Ionicons
                    name="people"
                    size={24}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.specLabel}>Số chỗ</Text>
                  <Text style={styles.specValue}>{vehicle.capacity} chỗ</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Pricing */}
          <Card style={styles.card}>
            <Card.Title title="Bảng giá" titleStyle={styles.cardTitle} />
            <Card.Content>
              <View style={styles.priceRow}>
                <View style={styles.priceItem}>
                  <Text style={styles.priceLabel}>Giá theo giờ</Text>
                  <Text style={styles.priceValue}>${vehicle.hourlyRate}</Text>
                  <Text style={styles.priceUnit}>/ giờ</Text>
                </View>
                <View style={styles.priceDivider} />
                <View style={styles.priceItem}>
                  <Text style={styles.priceLabel}>Giá theo ngày</Text>
                  <Text style={styles.priceValue}>${vehicle.dailyRate}</Text>
                  <Text style={styles.priceUnit}>/ ngày</Text>
                </View>
              </View>

              <View style={styles.depositRow}>
                <Ionicons
                  name="shield-checkmark"
                  size={20}
                  color={theme.colors.info}
                />
                <Text style={styles.depositLabel}>Tiền cọc:</Text>
                <Text style={styles.depositValue}>
                  ${vehicle.depositAmount}
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Station Info */}
          <Card style={styles.card}>
            <Card.Title
              title="Địa điểm nhận xe"
              titleStyle={styles.cardTitle}
            />
            <Card.Content>
              <View style={styles.stationInfo}>
                <Ionicons
                  name="location"
                  size={24}
                  color={theme.colors.primary}
                />
                <View style={styles.stationText}>
                  <Text style={styles.stationName}>{vehicle.stationName}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      {/* Book Button */}
      <View style={styles.footer}>
        <View style={styles.footerPricing}>
          <Text style={styles.footerPriceLabel}>Từ</Text>
          <Text style={styles.footerPriceValue}>${vehicle.hourlyRate}/giờ</Text>
        </View>
        <Button
          mode="contained"
          onPress={handleBookVehicle}
          disabled={vehicle.status !== "AVAILABLE"}
          style={styles.bookButton}
          contentStyle={styles.bookButtonContent}
        >
          {vehicle.status === "AVAILABLE" ? "Đặt xe ngay" : "Không có sẵn"}
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
  carouselContainer: {
    position: "relative",
  },
  vehicleImage: {
    width: width,
    height: 300,
  },
  photoIndicators: {
    position: "absolute",
    bottom: theme.spacing.md,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.xs,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  activeIndicator: {
    backgroundColor: "#fff",
    width: 24,
  },
  content: {
    padding: theme.spacing.md,
  },
  statusRow: {
    marginBottom: theme.spacing.md,
  },
  availableChip: {
    backgroundColor: theme.colors.success,
  },
  unavailableChip: {
    borderColor: theme.colors.error,
  },
  card: {
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 18,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  ratingRow: {
    flexDirection: "row",
    gap: 2,
  },
  ratingText: {
    color: theme.colors.mutedForeground,
    fontSize: 14,
  },
  specsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
  specItem: {
    width: "30%",
    alignItems: "center",
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radius.lg,
  },
  specLabel: {
    fontSize: 12,
    color: theme.colors.mutedForeground,
    marginTop: theme.spacing.xs,
  },
  specValue: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.foreground,
    marginTop: 2,
    textAlign: "center",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  priceItem: {
    alignItems: "center",
    flex: 1,
  },
  priceDivider: {
    width: 1,
    height: 60,
    backgroundColor: theme.colors.border,
  },
  priceLabel: {
    fontSize: 14,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.xs,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  priceUnit: {
    fontSize: 12,
    color: theme.colors.mutedForeground,
    marginTop: 2,
  },
  depositRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.xs,
  },
  depositLabel: {
    fontSize: 14,
    color: theme.colors.foreground,
  },
  depositValue: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.info,
  },
  stationInfo: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  stationText: {
    flex: 1,
  },
  stationName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  stationAddress: {
    fontSize: 14,
    color: theme.colors.mutedForeground,
    lineHeight: 20,
  },
  description: {
    fontSize: 14,
    color: theme.colors.foreground,
    lineHeight: 22,
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
  footerPricing: {
    flex: 1,
  },
  footerPriceLabel: {
    fontSize: 12,
    color: theme.colors.mutedForeground,
  },
  footerPriceValue: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  bookButton: {
    flex: 2,
  },
  bookButtonContent: {
    paddingVertical: theme.spacing.xs,
  },
});
