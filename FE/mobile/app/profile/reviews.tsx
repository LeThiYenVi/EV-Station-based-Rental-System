import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { theme } from "@/utils";
import { Ionicons } from "@expo/vector-icons";

export default function ReviewsPage() {
  // Mock reviews
  const reviews = [
    {
      id: 1,
      carOwner: "Chủ xe Nguyễn Văn A",
      carName: "Honda City 2023",
      rating: 5,
      comment: "Khách hàng rất lịch sự, giữ xe sạch sẽ. Rất hài lòng!",
      date: "15/10/2023",
    },
    {
      id: 2,
      carOwner: "Chủ xe Trần Thị B",
      carName: "Toyota Vios 2022",
      rating: 4,
      comment: "Khách thuê xe đúng giờ, lái xe cẩn thận.",
      date: "10/10/2023",
    },
    {
      id: 3,
      carOwner: "Chủ xe Lê Văn C",
      carName: "Mazda 3 2021",
      rating: 5,
      comment: "Tuyệt vời! Sẽ cho thuê lại lần sau.",
      date: "05/10/2023",
    },
  ];

  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Đánh giá từ chủ xe",
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: "#fff",
          headerShown: true,
          headerBackVisible: true,
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.summaryCard}>
          <View style={styles.ratingCircle}>
            <Ionicons name="star" size={32} color="#FFD700" />
            <Text style={styles.averageRating}>{averageRating}</Text>
          </View>
          <Text style={styles.totalReviews}>{reviews.length} đánh giá</Text>
          <Text style={styles.summaryText}>Bạn có uy tín tốt với chủ xe</Text>
        </View>

        <View style={styles.reviewsList}>
          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerInfo}>
                  <Text style={styles.carOwnerName}>{review.carOwner}</Text>
                  <Text style={styles.carName}>{review.carName}</Text>
                </View>
                <View style={styles.ratingBox}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{review.rating}.0</Text>
                </View>
              </View>
              <Text style={styles.comment}>{review.comment}</Text>
              <Text style={styles.date}>{review.date}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  summaryCard: {
    backgroundColor: "white",
    margin: theme.spacing.lg,
    padding: theme.spacing.xl,
    borderRadius: 12,
    alignItems: "center",
    ...theme.shadows.sm,
  },
  ratingCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  averageRating: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 4,
  },
  totalReviews: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
    color: "#666",
  },
  reviewsList: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  reviewCard: {
    backgroundColor: "white",
    padding: theme.spacing.lg,
    borderRadius: 12,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  reviewerInfo: {
    flex: 1,
  },
  carOwnerName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  carName: {
    fontSize: 14,
    color: "#666",
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
  },
  comment: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
    marginBottom: theme.spacing.sm,
  },
  date: {
    fontSize: 13,
    color: "#999",
  },
});
