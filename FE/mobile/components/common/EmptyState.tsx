import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LucideIcon } from "lucide-react-native";

interface EmptyStateProps {
  icon: LucideIcon;
  iconSize?: number;
  iconColor?: string;
  title: string;
  description: string;
  actionText?: string;
  onActionPress?: () => void;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  iconSize = 64,
  iconColor = "#9ca3af",
  title,
  description,
  actionText,
  onActionPress,
  action,
}) => {
  return (
    <View style={styles.container}>
      <Icon size={iconSize} color={iconColor} strokeWidth={1.5} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {action && <View style={styles.actionContainer}>{action}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  actionContainer: {
    width: "100%",
  },
});
