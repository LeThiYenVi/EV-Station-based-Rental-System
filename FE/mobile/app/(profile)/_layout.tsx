import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { ChevronLeft } from "lucide-react-native";

export default function ProfileLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTintColor: "#10b981",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerLeft: () => (
          <Pressable
            onPress={() => router.back()}
            style={{ marginLeft: 8, padding: 4 }}
          >
            <ChevronLeft size={28} color="#10b981" />
          </Pressable>
        ),
      }}
    >
      <Stack.Screen
        name="personal-info"
        options={{
          title: "Thông Tin Cá Nhân",
        }}
      />
      <Stack.Screen
        name="trip-history"
        options={{
          title: "Lịch Sử Chuyến Đi",
        }}
      />
      <Stack.Screen
        name="payment-methods"
        options={{
          title: "Phương Thức Thanh Toán",
        }}
      />
      <Stack.Screen
        name="promotions"
        options={{
          title: "Ưu Đãi & Khuyến Mãi",
        }}
      />
      <Stack.Screen
        name="reviews"
        options={{
          title: "Đánh Giá Của Tôi",
        }}
      />
      <Stack.Screen
        name="notifications-settings"
        options={{
          title: "Cài Đặt Thông Báo",
        }}
      />
      <Stack.Screen
        name="security"
        options={{
          title: "Bảo Mật",
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "Cài Đặt",
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          title: "Trợ Giúp & Hỗ Trợ",
        }}
      />
    </Stack>
  );
}
