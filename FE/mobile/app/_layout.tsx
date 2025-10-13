import React from "react";
import { Stack } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "@/utils";
import { AuthProvider } from "@/context/authContext";

export default function RootLayout() {
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
