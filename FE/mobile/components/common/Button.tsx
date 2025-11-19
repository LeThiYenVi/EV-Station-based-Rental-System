import React from "react";
import {
  Pressable,
  Text,
  ActivityIndicator,
  PressableProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

interface ButtonProps extends Omit<PressableProps, "style"> {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  ...props
}) => {
  const buttonStyles: ViewStyle[] = [
    styles.base,
    styles[`variant_${variant}`],
    styles[`size_${size}`],
  ];

  if (disabled || isLoading) {
    buttonStyles.push(styles.disabled);
  }

  const textStyles: TextStyle[] = [
    styles[`text_${variant}`],
    styles[`textSize_${size}`],
  ];

  return (
    <Pressable
      style={({ pressed }) => [...buttonStyles, pressed && styles.pressed]}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === "outline" ? "#10b981" : "#ffffff"}
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  variant_primary: {
    backgroundColor: "#10b981",
  },
  variant_secondary: {
    backgroundColor: "#3b82f6",
  },
  variant_outline: {
    borderWidth: 2,
    borderColor: "#10b981",
    backgroundColor: "transparent",
  },
  variant_danger: {
    backgroundColor: "#ef4444",
  },
  size_sm: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  size_md: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  size_lg: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  text_primary: {
    color: "#ffffff",
    fontWeight: "600",
  },
  text_secondary: {
    color: "#ffffff",
    fontWeight: "600",
  },
  text_outline: {
    color: "#10b981",
    fontWeight: "600",
  },
  text_danger: {
    color: "#ffffff",
    fontWeight: "600",
  },
  textSize_sm: {
    fontSize: 14,
  },
  textSize_md: {
    fontSize: 16,
  },
  textSize_lg: {
    fontSize: 18,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
});
