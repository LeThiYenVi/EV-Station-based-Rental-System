import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Text, Badge as PaperBadge } from "react-native-paper";

interface BadgeProps {
  count?: number;
  maxCount?: number;
  showZero?: boolean;
  dot?: boolean;
  color?: string;
  textColor?: string;
  size?: "small" | "medium" | "large";
  children?: React.ReactNode;
  style?: ViewStyle;
}

export function Badge({
  count = 0,
  maxCount = 99,
  showZero = false,
  dot = false,
  color = "#F44336",
  textColor = "#fff",
  size = "medium",
  children,
  style,
}: BadgeProps) {
  const shouldShow = dot || count > 0 || (count === 0 && showZero);

  if (!shouldShow && !children) {
    return null;
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  const sizeStyles = {
    small: { minWidth: 16, height: 16, borderRadius: 8, fontSize: 10 },
    medium: { minWidth: 20, height: 20, borderRadius: 10, fontSize: 12 },
    large: { minWidth: 24, height: 24, borderRadius: 12, fontSize: 14 },
  };

  const currentSize = sizeStyles[size];

  if (children) {
    return (
      <View style={[styles.container, style]}>
        {children}
        {shouldShow && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: color,
                minWidth: dot ? currentSize.height / 2 : currentSize.minWidth,
                height: dot ? currentSize.height / 2 : currentSize.height,
                borderRadius: currentSize.borderRadius,
              },
              dot && styles.dot,
            ]}
          >
            {!dot && (
              <Text
                style={[
                  styles.text,
                  { color: textColor, fontSize: currentSize.fontSize },
                ]}
              >
                {displayCount}
              </Text>
            )}
          </View>
        )}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.standaloneBadge,
        {
          backgroundColor: color,
          minWidth: dot ? currentSize.height / 2 : currentSize.minWidth,
          height: dot ? currentSize.height / 2 : currentSize.height,
          borderRadius: currentSize.borderRadius,
        },
        dot && styles.dot,
        style,
      ]}
    >
      {!dot && (
        <Text
          style={[
            styles.text,
            { color: textColor, fontSize: currentSize.fontSize },
          ]}
        >
          {displayCount}
        </Text>
      )}
    </View>
  );
}

interface StatusBadgeProps {
  status:
    | "success"
    | "error"
    | "warning"
    | "info"
    | "pending"
    | "confirmed"
    | "started"
    | "completed"
    | "cancelled";
  label?: string;
  size?: "small" | "medium" | "large";
}

export function StatusBadge({
  status,
  label,
  size = "medium",
}: StatusBadgeProps) {
  const statusConfig = {
    success: { color: "#4CAF50", label: "Thành công" },
    error: { color: "#F44336", label: "Lỗi" },
    warning: { color: "#FF9800", label: "Cảnh báo" },
    info: { color: "#2196F3", label: "Thông tin" },
    pending: { color: "#9E9E9E", label: "Chờ xử lý" },
    confirmed: { color: "#2196F3", label: "Đã xác nhận" },
    started: { color: "#FF9800", label: "Đang diễn ra" },
    completed: { color: "#4CAF50", label: "Hoàn thành" },
    cancelled: { color: "#F44336", label: "Đã hủy" },
  };

  const config = statusConfig[status];
  const displayLabel = label || config.label;

  const sizeStyles = {
    small: { paddingHorizontal: 8, paddingVertical: 4, fontSize: 10 },
    medium: { paddingHorizontal: 12, paddingVertical: 6, fontSize: 12 },
    large: { paddingHorizontal: 16, paddingVertical: 8, fontSize: 14 },
  };

  const currentSize = sizeStyles[size];

  return (
    <View
      style={[
        styles.statusBadge,
        {
          backgroundColor: config.color + "20",
          paddingHorizontal: currentSize.paddingHorizontal,
          paddingVertical: currentSize.paddingVertical,
        },
      ]}
    >
      <View
        style={[
          styles.statusDot,
          { backgroundColor: config.color },
          size === "small" && styles.statusDotSmall,
        ]}
      />
      <Text
        style={[
          styles.statusText,
          { color: config.color, fontSize: currentSize.fontSize },
        ]}
      >
        {displayLabel}
      </Text>
    </View>
  );
}

interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  children: React.ReactNode;
}

export function NotificationBadge({
  count,
  maxCount = 99,
  children,
}: NotificationBadgeProps) {
  return (
    <Badge
      count={count}
      maxCount={maxCount}
      color="#F44336"
      size="small"
      children={children}
    />
  );
}

interface OnlineBadgeProps {
  online: boolean;
  children: React.ReactNode;
}

export function OnlineBadge({ online, children }: OnlineBadgeProps) {
  return (
    <Badge
      dot
      color={online ? "#4CAF50" : "#9E9E9E"}
      size="small"
      children={children}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  } as ViewStyle,
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "#fff",
  } as ViewStyle,
  dot: {
    paddingHorizontal: 0,
  } as ViewStyle,
  standaloneBadge: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  } as ViewStyle,
  text: {
    fontWeight: "bold",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    alignSelf: "flex-start",
  } as ViewStyle,
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  } as ViewStyle,
  statusDotSmall: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 4,
  } as ViewStyle,
  statusText: {
    fontWeight: "600",
  },
});
