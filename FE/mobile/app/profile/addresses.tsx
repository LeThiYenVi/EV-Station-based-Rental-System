import { EmptyAddresses } from "@/components/EmptyState";
import { theme } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  Button,
  Dialog,
  IconButton,
  Portal,
  TextInput,
} from "react-native-paper";

const STORAGE_KEY = "@user_addresses";

interface AddressItem {
  id: string;
  label: string;
  address: string;
  isDefault?: boolean;
}

export default function AddressesPage() {
  const router = useRouter();

  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<AddressItem | null>(null);
  const [label, setLabel] = useState("");
  const [addressText, setAddressText] = useState("");

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        setAddresses(JSON.parse(raw));
      }
    } catch (err) {
      console.warn("Failed to load addresses", err);
    } finally {
      setLoading(false);
    }
  };

  const saveAddresses = async (items: AddressItem[]) => {
    setAddresses(items);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const handleAdd = () => {
    setEditing(null);
    setLabel("");
    setAddressText("");
    setShowDialog(true);
  };

  const handleEdit = (item: AddressItem) => {
    setEditing(item);
    setLabel(item.label);
    setAddressText(item.address);
    setShowDialog(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Xác nhận", "Bạn có muốn xóa địa chỉ này không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          const filtered = addresses.filter((a) => a.id !== id);
          await saveAddresses(filtered);
        },
      },
    ]);
  };

  const handleSetDefault = async (id: string) => {
    const updated = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    await saveAddresses(updated);
  };

  const handleSave = async () => {
    if (!label.trim() || !addressText.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nhãn và địa chỉ");
      return;
    }

    if (editing) {
      const updated = addresses.map((a) =>
        a.id === editing.id
          ? { ...a, label: label.trim(), address: addressText.trim() }
          : a
      );
      await saveAddresses(updated);
    } else {
      const newItem: AddressItem = {
        id: Date.now().toString(),
        label: label.trim(),
        address: addressText.trim(),
        isDefault: addresses.length === 0,
      };
      await saveAddresses([newItem, ...addresses]);
    }

    setShowDialog(false);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Địa chỉ của tôi",
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: "#fff",
          headerShown: true,
          headerBackVisible: true,
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {loading ? null : addresses.length === 0 ? (
          <EmptyAddresses onAction={handleAdd} />
        ) : (
          addresses.map((item) => (
            <View key={item.id} style={styles.addressCard}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="location"
                  size={24}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.addressInfo}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>{item.label}</Text>
                  {item.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Mặc định</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.address}>{item.address}</Text>
              </View>

              <View style={styles.actionsRow}>
                {!item.isDefault && (
                  <IconButton
                    icon="check-bold"
                    size={20}
                    onPress={() => handleSetDefault(item.id)}
                    iconColor={theme.colors.primary}
                    accessibilityLabel="Đặt làm mặc định"
                  />
                )}
                <IconButton
                  icon="pencil"
                  size={20}
                  onPress={() => handleEdit(item)}
                  accessibilityLabel="Chỉnh sửa"
                />
                <IconButton
                  icon="trash-can-outline"
                  size={20}
                  onPress={() => handleDelete(item.id)}
                  accessibilityLabel="Xóa"
                />
              </View>
            </View>
          ))
        )}

        <View style={{ padding: theme.spacing.md }}>
          <Button mode="contained" onPress={handleAdd} icon="plus">
            Thêm địa chỉ mới
          </Button>
        </View>
      </ScrollView>

      <Portal>
        <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
          <Dialog.Title>
            {editing ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ"}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Nhãn (ví dụ: Nhà riêng)"
              value={label}
              onChangeText={setLabel}
              style={{ marginBottom: 12 }}
            />
            <TextInput
              label="Địa chỉ"
              value={addressText}
              onChangeText={setAddressText}
              multiline
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDialog(false)}>Hủy</Button>
            <Button onPress={handleSave}>{editing ? "Lưu" : "Tạo"}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  addressCard: {
    backgroundColor: "white",
    margin: theme.spacing.md,
    marginBottom: 0,
    padding: theme.spacing.md,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    ...theme.shadows.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
  },
  addressInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  defaultBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  defaultText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  address: {
    fontSize: 14,
    color: "#666",
  },
  editButton: {
    padding: 8,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    margin: theme.spacing.md,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderStyle: "dashed",
    gap: 8,
  },
  addButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "500",
  },
});
