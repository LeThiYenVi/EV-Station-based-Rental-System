import { Slot, SplashScreen } from "expo-router";
import { AuthProvider } from "@/hooks/useAuth";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <AuthProvider>
      <Slot />
      <Toast />
    </AuthProvider>
  );
}
