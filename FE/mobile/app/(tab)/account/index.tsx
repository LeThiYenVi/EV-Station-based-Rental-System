import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/authContext";
import { View, ActivityIndicator } from "react-native";

export default function AccountGate() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/profile");
    } else {
      // Avoid opening login from here to prevent loops; the tabPress listener handles opening the login modal
      router.replace("/dashboard");
    }
  }, [user]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator />
    </View>
  );
}
