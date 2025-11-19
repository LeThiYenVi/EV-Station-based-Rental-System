import { useEffect, useState, useRef } from "react";
import * as Notifications from "expo-notifications";
import { Platform, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PUSH_TOKEN_KEY = "@evstation_push_token";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationPermissions {
  granted: boolean;
  canAskAgain: boolean;
  status: "granted" | "denied" | "undetermined";
}

/**
 * Hook to manage push notifications
 */
export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [permissions, setPermissions] = useState<NotificationPermissions>({
    granted: false,
    canAskAgain: true,
    status: "undetermined",
  });

  const notificationListener = useRef<Notifications.Subscription | undefined>(
    undefined
  );
  const responseListener = useRef<Notifications.Subscription | undefined>(
    undefined
  );

  useEffect(() => {
    // Register for push notifications
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
      }
    });

    // Check current permission status
    checkPermissions();

    // Listener for notifications received while app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // Listener for user interaction with notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);
        // Handle notification tap here
        // Navigate to relevant screen based on notification data
      });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  const checkPermissions = async () => {
    const { status, canAskAgain } = await Notifications.getPermissionsAsync();
    setPermissions({
      granted: status === "granted",
      canAskAgain,
      status: status as "granted" | "denied" | "undetermined",
    });
  };

  const requestPermissions = async (): Promise<boolean> => {
    const { status } = await Notifications.requestPermissionsAsync();
    const granted = status === "granted";

    setPermissions((prev) => ({
      ...prev,
      granted,
      status: status as "granted" | "denied" | "undetermined",
    }));

    if (!granted) {
      Alert.alert(
        "Thông báo bị tắt",
        "Bạn cần bật thông báo trong Cài đặt để nhận cập nhật về đơn thuê.",
        [{ text: "OK" }]
      );
    }

    return granted;
  };

  const schedulePushNotification = async (
    title: string,
    body: string,
    data?: any,
    trigger?: Notifications.NotificationTriggerInput
  ) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: true,
      },
      trigger: trigger || null, // null = immediate
    });
  };

  return {
    expoPushToken,
    notification,
    permissions,
    requestPermissions,
    schedulePushNotification,
  };
}

/**
 * Register for push notifications and get token
 */
async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  try {
    // Check if running on physical device
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    // Check existing permissions
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permissions if not granted
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return undefined;
    }

    // Get the token
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: "your-project-id", // TODO: Replace with actual project ID
    });
    const token = tokenData.data;

    // Save token to AsyncStorage
    await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);

    return token;
  } catch (error) {
    console.error("Error registering for push notifications:", error);
    return undefined;
  }
}

/**
 * Get saved push token
 */
export async function getSavedPushToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(PUSH_TOKEN_KEY);
  } catch (error) {
    console.error("Error getting saved push token:", error);
    return null;
  }
}

/**
 * Clear saved push token
 */
export async function clearPushToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PUSH_TOKEN_KEY);
  } catch (error) {
    console.error("Error clearing push token:", error);
  }
}

/**
 * Send local notification (for testing or offline scenarios)
 */
export async function sendLocalNotification(
  title: string,
  body: string,
  data?: any
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
      sound: true,
    },
    trigger: null, // Immediate
  });
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Get badge count
 */
export async function getBadgeCount(): Promise<number> {
  return await Notifications.getBadgeCountAsync();
}

/**
 * Set badge count
 */
export async function setBadgeCount(count: number): Promise<void> {
  await Notifications.setBadgeCountAsync(count);
}

/**
 * Clear badge
 */
export async function clearBadge(): Promise<void> {
  await Notifications.setBadgeCountAsync(0);
}
