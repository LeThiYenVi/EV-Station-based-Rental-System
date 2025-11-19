import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: any;
}

export function EmptyState({
  icon = "folder-open-outline",
  title,
  message,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name={icon} size={64} color="#BDBDBD" style={styles.icon} />
      <Text variant="titleMedium" style={styles.title}>
        {title}
      </Text>
      <Text variant="bodyMedium" style={styles.message}>
        {message}
      </Text>
      {actionLabel && onAction && (
        <Button mode="contained" onPress={onAction} style={styles.button}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
}

// Predefined empty states for common scenarios
export function EmptyBookings({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon="calendar-outline"
      title="Chưa có chuyến đi"
      message="Bạn chưa có chuyến đi nào. Tìm kiếm và đặt xe ngay!"
      actionLabel="Tìm kiếm xe"
      onAction={onAction}
    />
  );
}

export function EmptyFavorites({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon="heart-outline"
      title="Chưa có yêu thích"
      message="Lưu các trạm hoặc xe yêu thích để dễ dàng truy cập sau này."
      actionLabel="Khám phá ngay"
      onAction={onAction}
    />
  );
}

export function EmptyNotifications() {
  return (
    <EmptyState
      icon="notifications-outline"
      title="Không có thông báo"
      message="Bạn đã xem hết tất cả thông báo."
    />
  );
}

export function EmptyAddresses({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon="location-outline"
      title="Chưa có địa chỉ"
      message="Thêm địa chỉ để nhận xe nhanh chóng hơn."
      actionLabel="Thêm địa chỉ"
      onAction={onAction}
    />
  );
}

export function EmptyPaymentMethods({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon="card-outline"
      title="Chưa có phương thức thanh toán"
      message="Thêm thẻ thanh toán để đặt xe nhanh chóng."
      actionLabel="Thêm thẻ"
      onAction={onAction}
    />
  );
}

export function EmptySearchResults() {
  return (
    <EmptyState
      icon="search-outline"
      title="Không tìm thấy kết quả"
      message="Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc."
    />
  );
}

export function NoInternetConnection({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon="cloud-offline-outline"
      title="Không có kết nối mạng"
      message="Vui lòng kiểm tra kết nối Internet và thử lại."
      actionLabel="Thử lại"
      onAction={onAction}
    />
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon="alert-circle-outline"
      title="Đã xảy ra lỗi"
      message="Không thể tải dữ liệu. Vui lòng thử lại sau."
      actionLabel="Thử lại"
      onAction={onRetry}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    minHeight: 300,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#424242",
  },
  message: {
    textAlign: "center",
    color: "#757575",
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    minWidth: 150,
  },
});
