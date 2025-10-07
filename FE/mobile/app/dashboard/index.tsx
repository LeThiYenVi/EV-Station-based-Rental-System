import { useState } from "react";
import { View, TextInput, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/utils";

export default function DashboardPage() {
  const [searchText, setSearchText] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />

      {/* Header*/}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={theme.colors.mutedForeground}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm trạm sạc EV..."
            placeholderTextColor={theme.colors.mutedForeground}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <Ionicons
              name="close-circle"
              size={20}
              color={theme.colors.mutedForeground}
              onPress={() => setSearchText("")}
              style={styles.clearIcon}
            />
          )}
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>{/* Nội dung của bạn ở đây */}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingTop: 0,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.foreground,
  },
  clearIcon: {
    marginLeft: theme.spacing.sm,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
});
