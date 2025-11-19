import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LucideIcon } from "lucide-react-native";

interface InfoRowProps {
  icon: LucideIcon;
  iconColor?: string;
  iconSize?: number;
  label: string;
  value: string;
}

export const InfoRow: React.FC<InfoRowProps> = ({
  icon: Icon,
  iconColor = "#10b981",
  iconSize = 16,
  label,
  value,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Icon size={iconSize} color={iconColor} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: "#6b7280",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
});
