import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Stack } from "expo-router";
import { theme } from "@/utils";
import { Ionicons } from "@expo/vector-icons";

export default function FavoritesPage() {
  // Mock data - xe yêu thích
  const favoriteCars = [
    {
      id: 1,
      name: "Honda City 2023",
      image: require("@/assets/images/favicon.png"),
      price: "500K/ngày",
      location: "Quận 1, TP.HCM",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Toyota Vios 2022",
      image: require("@/assets/images/favicon.png"),
      price: "450K/ngày",
      location: "Quận 3, TP.HCM",
      rating: 4.9,
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: "Xe yêu thích",
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: "#fff",
          headerShown: true,
          headerBackVisible: true,
        }}
      />
      <ScrollView style={styles.container}>
        {favoriteCars.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Chưa có xe yêu thích</Text>
          </View>
        ) : (
          favoriteCars.map((car) => (
            <View key={car.id} style={styles.carCard}>
              <Image source={car.image} style={styles.carImage} />
              <View style={styles.carInfo}>
                <Text style={styles.carName}>{car.name}</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location" size={14} color="#666" />
                  <Text style={styles.location}>{car.location}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>{car.price}</Text>
                  <View style={styles.ratingBox}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.rating}>{car.rating}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.heartButton}>
                <Ionicons name="heart" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#999",
  },
  carCard: {
    backgroundColor: "white",
    margin: theme.spacing.md,
    borderRadius: 12,
    flexDirection: "row",
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  carImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  carInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
    justifyContent: "space-between",
  },
  carName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: "#666",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: "500",
  },
  heartButton: {
    padding: 8,
  },
});
