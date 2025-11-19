import apiClient from "@/api/apiClient";
import { AuthProvider } from "@/context/authContext";
import { useNotifications } from "@/hooks/useNotifications";
import { theme } from "@/utils";
import { startOfflineQueueProcessor } from "@/utils/offlineQueue";
import { useNavigation } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";

export default function RootLayout() {
  // Initialize notifications
  const { expoPushToken, permissions } = useNotifications();

  useEffect(() => {
    // Start offline queue processor when app launches
    const stop = startOfflineQueueProcessor(apiClient, (info) => {
      console.log(`Queue action ${info.actionId}: ${info.status}`, info.error);
    });

    // Cleanup on unmount
    return () => {
      stop();
    };
  }, []);

  useEffect(() => {
    if (expoPushToken) {
      console.log("Push token:", expoPushToken);
      // TODO: Send token to backend to register for push notifications
    }
  }, [expoPushToken]);

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tab)" />
        <Stack.Screen
          name="login/index"
          options={{
            presentation: "modal",
            headerShown: true,
            title: "Đăng nhập",
            headerTitleAlign: "center",
            headerTitleStyle: { fontWeight: "700" },
            headerRight: () => <SkipButton />,
          }}
        />
      </Stack>
    </AuthProvider>
  );
}

function SkipButton() {
  const nav = useNavigation();
  const handleSkip = () => {
    // Skip login and go to Dashboard tab
    if ((nav as any)?.canGoBack?.()) {
      (nav as any).goBack();
    } else {
      (nav as any)?.navigate?.("(tab)", { screen: "dashboard/index" });
    }
  };
  return (
    <TouchableOpacity onPress={handleSkip} style={{ paddingHorizontal: 16 }}>
      <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>
        Bỏ qua
      </Text>
    </TouchableOpacity>
  );
}
