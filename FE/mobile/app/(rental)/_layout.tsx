import { Stack } from "expo-router";

export default function RentalLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#ffffff",
        },
        headerTintColor: "#111827",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="scan"
        options={{
          title: "Quét Mã QR",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="booking-form"
        options={{
          title: "Đặt Xe",
        }}
      />
      <Stack.Screen
        name="unlock/[vehicleId]"
        options={{
          title: "Xác Nhận Xe",
        }}
      />
      <Stack.Screen
        name="active"
        options={{
          title: "Chuyến Đi Đang Diễn Ra",
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="payment-result"
        options={{
          title: "Kết Quả Thanh Toán",
          headerLeft: () => null,
        }}
      />
    </Stack>
  );
}
