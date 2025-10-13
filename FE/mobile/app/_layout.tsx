import React from "react";
import { Tabs } from "expo-router";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { theme } from "../utils";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import "react-native-reanimated";

function RouteProtection({ children }: { children: React.ReactNode }) {}

export default function RootLayout() {
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
        name="profile/index"
        options={{
          title: "Hồ sơ",
          tabBarIcon: ({ color, size }) => (
            <SimpleLineIcons name="user" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting/index"
        options={{
          title: "Cài Đặt",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="login/index"
        options={{
          title: "Đăng Nhập",
        }}
      />
    </Tabs>
  );
}
