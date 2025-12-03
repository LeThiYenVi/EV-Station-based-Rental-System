import React from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { Star } from "lucide-react-native";

export default function ReviewsScreen() {
  const reviews = [
    {
      id: "1",
      tripDate: "18 Th11, 2025",
      route: "Trạm Trung Tâm → Park Avenue",
      rating: 5,
      comment: "Xe chạy êm, pin đầy, trải nghiệm tuyệt vời!",
      createdAt: "18 Th11, 2025",
    },
    {
      id: "2",
      tripDate: "17 Th11, 2025",
      route: "Khu Công Nghệ → Quảng Trường",
      rating: 4,
      comment: "Xe tốt nhưng ghế hơi cứng",
      createdAt: "17 Th11, 2025",
    },
  ];

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            color={star <= rating ? "#f59e0b" : "#d1d5db"}
            fill={star <= rating ? "#f59e0b" : "none"}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Stats Header */}
      <View style={styles.statsHeader}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{reviews.length}</Text>
          <Text style={styles.statLabel}>Đánh Giá</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <View style={styles.ratingRow}>
            <Star size={20} color="#f59e0b" fill="#f59e0b" />
            <Text style={styles.statNumber}>
              {(
                reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
              ).toFixed(1)}
            </Text>
          </View>
          <Text style={styles.statLabel}>Trung Bình</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.tripDate}>{review.tripDate}</Text>
              {renderStars(review.rating)}
            </View>
            <Text style={styles.route}>{review.route}</Text>
            <Text style={styles.comment}>{review.comment}</Text>
            <Text style={styles.createdAt}>Đánh giá: {review.createdAt}</Text>
          </View>
        ))}

        {reviews.length === 0 && (
          <View style={styles.emptyState}>
            <Star size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Chưa Có Đánh Giá</Text>
            <Text style={styles.emptyText}>
              Hoàn thành chuyến đi để có thể đánh giá
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  statsHeader: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingVertical: 20,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e5e7eb",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },
  statLabel: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  reviewCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  tripDate: {
    fontSize: 14,
    color: "#6b7280",
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
  },
  route: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  comment: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 8,
  },
  createdAt: {
    fontSize: 12,
    color: "#9ca3af",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
  },
});
