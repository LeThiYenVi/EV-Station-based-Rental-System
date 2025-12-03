import { Tabs } from "expo-router";
import { Platform } from "react-native";
import {
  MapPin,
  MessageSquare,
  Clipboard,
  HeadphonesIcon,
  User,
} from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#10b981",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          height: Platform.OS === "ios" ? 88 : 68,
          paddingBottom: Platform.OS === "ios" ? 30 : 12,
          paddingTop: 6,
          paddingHorizontal: 4,
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: -4,
          paddingHorizontal: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingHorizontal: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Khám Phá",
          tabBarIcon: ({ color }) => <MapPin size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Blog",
          tabBarIcon: ({ color }) => <MessageSquare size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: "Chuyến Đi",
          tabBarIcon: ({ color }) => <Clipboard size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: "Hỗ Trợ",
          tabBarIcon: ({ color }) => <HeadphonesIcon size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Hồ Sơ",
          tabBarIcon: ({ color }) => <User size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
