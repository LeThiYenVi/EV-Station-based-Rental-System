import React from "react";
import { Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface BadgeProps {
  text: string;
  variant?: "success" | "warning" | "danger" | "info" | "default";
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = "default",
  style,
}) => {
  const getBadgeStyle = (): ViewStyle => {
    switch (variant) {
      case "success":
        return styles.success;
      case "warning":
        return styles.warning;
      case "danger":
        return styles.danger;
      case "info":
        return styles.info;
      default:
        return styles.default;
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case "success":
        return styles.successText;
      case "warning":
        return styles.warningText;
      case "danger":
        return styles.dangerText;
      case "info":
        return styles.infoText;
      default:
        return styles.defaultText;
    }
  };

  return (
    <Text style={[styles.badge, getBadgeStyle(), getTextStyle(), style]}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
  },
  success: {
    backgroundColor: "#d1fae5",
  },
  successText: {
    color: "#065f46",
  },
  warning: {
    backgroundColor: "#fef3c7",
  },
  warningText: {
    color: "#92400e",
  },
  danger: {
    backgroundColor: "#fee2e2",
  },
  dangerText: {
    color: "#991b1b",
  },
  info: {
    backgroundColor: "#dbeafe",
  },
  infoText: {
    color: "#1e3a8a",
  },
  default: {
    backgroundColor: "#f3f4f6",
  },
  defaultText: {
    color: "#374151",
  },
});
