import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, TextInput, Button, Portal, Modal } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

interface RatingModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (rating: number, comment: string) => void;
  title?: string;
  submitLabel?: string;
}

export function RatingModal({
  visible,
  onDismiss,
  onSubmit,
  title = "Đánh giá",
  submitLabel = "Gửi đánh giá",
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = () => {
    if (rating === 0) {
      return;
    }
    onSubmit(rating, comment);
    // Reset form
    setRating(0);
    setComment("");
    onDismiss();
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            onPressIn={() => setHoveredStar(star)}
            onPressOut={() => setHoveredStar(0)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={star <= (hoveredStar || rating) ? "star" : "star-outline"}
              size={40}
              color={star <= (hoveredStar || rating) ? "#FFA000" : "#E0E0E0"}
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <Text variant="headlineSmall" style={styles.title}>
          {title}
        </Text>

        {renderStars()}

        {rating > 0 && (
          <Text variant="bodyMedium" style={styles.ratingText}>
            {rating === 1 && "Rất tệ"}
            {rating === 2 && "Tệ"}
            {rating === 3 && "Bình thường"}
            {rating === 4 && "Tốt"}
            {rating === 5 && "Tuyệt vời"}
          </Text>
        )}

        <TextInput
          mode="outlined"
          label="Nhận xét của bạn"
          placeholder="Chia sẻ trải nghiệm của bạn..."
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={4}
          style={styles.input}
        />

        <View style={styles.buttons}>
          <Button mode="outlined" onPress={onDismiss} style={styles.button}>
            Hủy
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={rating === 0}
            style={styles.button}
          >
            {submitLabel}
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
  showText?: boolean;
}

export function StarRating({
  rating,
  onRatingChange,
  size = 20,
  readonly = false,
  showText = false,
}: StarRatingProps) {
  const [hoveredStar, setHoveredStar] = useState(0);

  const renderStars = () => {
    return (
      <View style={styles.inlineStars}>
        {[1, 2, 3, 4, 5].map((star) => {
          if (readonly) {
            return (
              <Ionicons
                key={star}
                name={star <= rating ? "star" : "star-outline"}
                size={size}
                color={star <= rating ? "#FFA000" : "#E0E0E0"}
                style={{ marginRight: 2 }}
              />
            );
          }

          return (
            <TouchableOpacity
              key={star}
              onPress={() => onRatingChange?.(star)}
              onPressIn={() => setHoveredStar(star)}
              onPressOut={() => setHoveredStar(0)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={star <= (hoveredStar || rating) ? "star" : "star-outline"}
                size={size}
                color={star <= (hoveredStar || rating) ? "#FFA000" : "#E0E0E0"}
                style={{ marginRight: 2 }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.starRatingContainer}>
      {renderStars()}
      {showText && (
        <Text variant="bodyMedium" style={styles.ratingValue}>
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
}

interface ReviewCardProps {
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpful?: number;
  onHelpful?: () => void;
}

export function ReviewCard({
  userName,
  rating,
  comment,
  date,
  helpful = 0,
  onHelpful,
}: ReviewCardProps) {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.reviewHeaderContent}>
          <Text variant="titleSmall" style={styles.userName}>
            {userName}
          </Text>
          <View style={styles.reviewMeta}>
            <StarRating rating={rating} readonly size={16} />
            <Text style={styles.reviewDate}>• {date}</Text>
          </View>
        </View>
      </View>

      {comment && (
        <Text variant="bodyMedium" style={styles.reviewComment}>
          {comment}
        </Text>
      )}

      {onHelpful && (
        <View style={styles.reviewActions}>
          <TouchableOpacity style={styles.helpfulButton} onPress={onHelpful}>
            <Ionicons name="thumbs-up-outline" size={16} color="#757575" />
            <Text style={styles.helpfulText}>Hữu ích ({helpful})</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#fff",
    padding: 24,
    margin: 20,
    borderRadius: 12,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  star: {
    marginHorizontal: 4,
  },
  ratingText: {
    textAlign: "center",
    color: "#FFA000",
    fontWeight: "600",
    marginBottom: 24,
  },
  input: {
    marginBottom: 24,
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
  },
  inlineStars: {
    flexDirection: "row",
    alignItems: "center",
  },
  starRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratingValue: {
    fontWeight: "600",
    color: "#424242",
  },
  reviewCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  reviewHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  reviewHeaderContent: {
    flex: 1,
  },
  userName: {
    fontWeight: "600",
    marginBottom: 4,
  },
  reviewMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: "#757575",
  },
  reviewComment: {
    lineHeight: 22,
    color: "#424242",
    marginBottom: 12,
  },
  reviewActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 12,
  },
  helpfulButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  helpfulText: {
    fontSize: 14,
    color: "#757575",
  },
});
