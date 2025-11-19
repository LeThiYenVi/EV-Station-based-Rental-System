import { Link, Stack } from "expo-router";
import { View, Text } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center px-6 bg-white">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          Screen Not Found
        </Text>
        <Link href="/(tabs)" className="text-primary font-semibold">
          Go to Home
        </Link>
      </View>
    </>
  );
}
