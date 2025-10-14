import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/authContext";
import { View, ActivityIndicator } from "react-native";

export default function IndexPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Delay navigation slightly to ensure Stack is mounted
    const timer = setTimeout(() => {
      if (user) {
        router.replace("/(tab)/dashboard");
      } else {
        router.replace("/login");
      }
    }, 1);

    return () => clearTimeout(timer);
  }, [user]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
