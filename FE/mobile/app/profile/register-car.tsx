import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { theme } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function RegisterCarPage() {
  const router = useRouter();
  const [carModel, setCarModel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [year, setYear] = useState("");
  const [seats, setSeats] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = () => {
    // TODO: Implement car registration logic
    alert("Đăng ký xe thành công!");
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Đăng ký cho thuê xe",
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: "#fff",
          headerShown: true,
          headerBackVisible: true,
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin xe</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hãng xe & Model</Text>
            <TextInput
              style={styles.input}
              placeholder="VD: Honda City 2023"
              value={carModel}
              onChangeText={setCarModel}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Biển số xe</Text>
            <TextInput
              style={styles.input}
              placeholder="VD: 30A-12345"
              value={licensePlate}
              onChangeText={setLicensePlate}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Năm sản xuất</Text>
              <TextInput
                style={styles.input}
                placeholder="2023"
                keyboardType="numeric"
                value={year}
                onChangeText={setYear}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Số chỗ ngồi</Text>
              <TextInput
                style={styles.input}
                placeholder="4"
                keyboardType="numeric"
                value={seats}
                onChangeText={setSeats}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Giá thuê (đ/ngày)</Text>
            <TextInput
              style={styles.input}
              placeholder="500,000"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>
        </View>

        <View style={styles.noteBox}>
          <Ionicons
            name="information-circle"
            size={20}
            color={theme.colors.primary}
          />
          <Text style={styles.noteText}>
            Sau khi đăng ký, xe của bạn sẽ được xét duyệt trong vòng 24h
          </Text>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Đăng ký</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  section: {
    backgroundColor: "white",
    padding: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: theme.spacing.md,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
  },
  noteBox: {
    flexDirection: "row",
    backgroundColor: "#E0F2FE",
    padding: theme.spacing.md,
    margin: theme.spacing.lg,
    borderRadius: 8,
    alignItems: "center",
    gap: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: "#0369A1",
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    margin: theme.spacing.lg,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
