import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ChevronRight, LucideIcon } from "lucide-react-native";

interface ListItemProps {
  icon?: LucideIcon;
  iconSize?: number;
  iconColor?: string;
  iconBackgroundColor?: string;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  rightContent?: React.ReactNode;
  showChevron?: boolean;
  onPress?: () => void;
}

export const ListItem: React.FC<ListItemProps> = ({
  icon: Icon,
  iconSize = 24,
  iconColor = "#10b981",
  iconBackgroundColor = "#f3f4f6",
  title,
  subtitle,
  badge,
  rightContent,
  showChevron = true,
  onPress,
}) => {
  const content = (
    <>
      {Icon && (
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: iconBackgroundColor },
          ]}
        >
          <Icon size={iconSize} color={iconColor} />
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {badge && <View style={styles.badge}>{badge}</View>}
        </View>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {rightContent && <View style={styles.rightContent}>{rightContent}</View>}
      {showChevron && !rightContent && (
        <ChevronRight size={20} color="#9ca3af" />
      )}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [styles.container, pressed && styles.pressed]}
        onPress={onPress}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={styles.container}>{content}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  pressed: {
    backgroundColor: "#f9fafb",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  badge: {
    marginLeft: 4,
  },
  rightContent: {
    marginLeft: 12,
  },
});
