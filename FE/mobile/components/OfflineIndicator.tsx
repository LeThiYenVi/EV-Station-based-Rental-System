import React, { useEffect, useState } from "react";
import { StyleSheet, Animated } from "react-native";
import { Banner } from "react-native-paper";
import { useNetworkStatus } from "../hooks/useNetworkStatus";

export default function OfflineIndicator() {
  const { isConnected, isInternetReachable } = useNetworkStatus();
  const [visible, setVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    const shouldShow = !isConnected || isInternetReachable === false;

    if (shouldShow && !visible) {
      setVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (!shouldShow && visible) {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }
  }, [isConnected, isInternetReachable]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Banner visible={true} icon="wifi-off" style={styles.banner}>
        {!isConnected ? "Không có kết nối mạng" : "Không có kết nối Internet"}
      </Banner>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 1000,
  },
  banner: {
    backgroundColor: "#F44336",
  },
});
