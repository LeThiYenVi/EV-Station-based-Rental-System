import React from "react";
import { Tabs } from "expo-router";
import Foundation from "@expo/vector-icons/Foundation";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import "react-native-reanimated";
import { theme } from "../../utils";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";

function TabsNavigator() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.background,
        tabBarStyle: { backgroundColor: theme.colors.primary },
        headerStyle: { backgroundColor: theme.colors.background },
        headerTitleStyle: { color: theme.colors.foreground },
        headerTitleAlign: "center",
      }}
    >
      <Tabs.Screen name="profile/index" options={{ href: null }} />

      <Tabs.Screen
        name="dashboard/index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color, size }) => (
            <Foundation name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="trip/index"
        options={{
          title: "Chuyến",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="car" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="support/index"
        options={{
          title: "Hỗ trợ",
          tabBarIcon: ({ color, size }) => (
            <SimpleLineIcons name="support" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="messages/index"
        options={{
          title: "Tin nhắn",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="account/index"
        options={{
          title: user ? "Hồ sơ" : "Đăng nhập",
          tabBarIcon: ({ color, size }) => (
            <SimpleLineIcons
              name={user ? "user" : "login"}
              size={size}
              color={color}
            />
          ),
        }}
        listeners={() => ({
          tabPress: (e) => {
            if (!user) {
              e.preventDefault();
              router.push("/login");
            }
          },
        })}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return <TabsNavigator />;
}
