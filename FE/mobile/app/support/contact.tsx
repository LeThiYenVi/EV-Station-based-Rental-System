import SupportApi from "@/api/SupportApi";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { theme } from "@/utils";
import { queueOfflineAction } from "@/utils/offlineQueue";
import {
  SupportContactFormData,
  supportContactSchema,
} from "@/validators/support.schema";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Appbar,
  Button,
  HelperText,
  Text,
  TextInput,
} from "react-native-paper";

const categories = [
  { key: "booking", label: "Đặt xe" },
  { key: "payment", label: "Thanh toán" },
  { key: "vehicle", label: "Xe" },
  { key: "account", label: "Tài khoản" },
  { key: "other", label: "Khác" },
];

export default function ContactSupportScreen() {
  const router = useRouter();
  const network = useNetworkStatus();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndBuild = async (): Promise<SupportContactFormData | null> => {
    try {
      const payload = {
        subject: subject.trim(),
        message: message.trim(),
        category: category || "other",
        contactEmail: contactEmail ? contactEmail.trim() : undefined,
        contactPhone: contactPhone ? contactPhone.trim() : undefined,
      } as SupportContactFormData;

      await supportContactSchema.validate(payload, { abortEarly: false });
      setErrors({});
      return payload;
    } catch (err: any) {
      const newErrors: Record<string, string> = {};
      if (err.inner && Array.isArray(err.inner)) {
        err.inner.forEach((e: any) => {
          if (e.path) newErrors[e.path] = e.message;
        });
      } else if (err.path) {
        newErrors[err.path] = err.message;
      }
      setErrors(newErrors);
      return null;
    }
  };

  const handleSubmit = async () => {
    const payload = await validateAndBuild();
    if (!payload) return;

    setIsSubmitting(true);

    try {
      if (!network.isConnected) {
        // Queue the action for later retry
        await queueOfflineAction({
          type: "OTHER",
          endpoint: "/api/support/contact",
          method: "POST",
          data: payload,
          maxRetries: 5,
        });

        Alert.alert(
          "Đã lưu",
          "Bạn đang ngoại tuyến. Yêu cầu của bạn sẽ được gửi khi có kết nối.",
          [{ text: "OK", onPress: () => router.back() }]
        );
        return;
      }

      await SupportApi.sendContact(payload);

      Alert.alert("Gửi thành công", "Chúng tôi đã nhận được yêu cầu của bạn.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể gửi yêu cầu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Liên hệ hỗ trợ" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Danh mục</Text>
        <View style={styles.categoryRow}>
          {categories.map((c) => (
            <TouchableOpacity
              key={c.key}
              style={[
                styles.categoryButton,
                category === c.key && styles.categoryButtonActive,
              ]}
              onPress={() => setCategory(c.key)}
            >
              <Text
                style={
                  category === c.key
                    ? styles.categoryTextActive
                    : styles.categoryText
                }
              >
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.category && (
          <HelperText type="error">{errors.category}</HelperText>
        )}

        <TextInput
          label="Tiêu đề"
          mode="outlined"
          value={subject}
          onChangeText={(t) => setSubject(t)}
          style={styles.input}
          error={!!errors.subject}
        />
        {errors.subject && (
          <HelperText type="error">{errors.subject}</HelperText>
        )}

        <TextInput
          label="Nội dung"
          mode="outlined"
          value={message}
          onChangeText={(t) => setMessage(t)}
          multiline
          numberOfLines={6}
          style={[styles.input, { minHeight: 140 }]}
          error={!!errors.message}
        />
        {errors.message && (
          <HelperText type="error">{errors.message}</HelperText>
        )}

        <TextInput
          label="Email liên hệ (tùy chọn)"
          mode="outlined"
          value={contactEmail}
          onChangeText={(t) => setContactEmail(t)}
          keyboardType="email-address"
          style={styles.input}
          error={!!errors.contactEmail}
        />
        {errors.contactEmail && (
          <HelperText type="error">{errors.contactEmail}</HelperText>
        )}

        <TextInput
          label="Số điện thoại liên hệ (tùy chọn)"
          mode="outlined"
          value={contactPhone}
          onChangeText={(t) => setContactPhone(t)}
          keyboardType="phone-pad"
          style={styles.input}
          error={!!errors.contactPhone}
        />
        {errors.contactPhone && (
          <HelperText type="error">{errors.contactPhone}</HelperText>
        )}

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.submit}
        >
          Gửi yêu cầu
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.md },
  label: { marginBottom: theme.spacing.sm, fontWeight: "700", fontSize: 14 },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  categoryButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#EEE",
    marginRight: theme.spacing.sm,
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  categoryText: { color: "#000" },
  categoryTextActive: { color: "#fff" },
  input: { marginBottom: theme.spacing.sm },
  submit: { marginTop: theme.spacing.lg, paddingVertical: theme.spacing.xs },
});
