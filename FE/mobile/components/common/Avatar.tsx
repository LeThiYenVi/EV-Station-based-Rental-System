import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";

interface AvatarProps {
  text: string;
  size?: number;
  backgroundColor?: string;
  online?: boolean;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  text,
  size = 48,
  backgroundColor = "#10b981",
  online = false,
  style,
}) => {
  const fontSize = size / 2.4;

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <View
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor,
          },
        ]}
      >
        <Text style={[styles.text, { fontSize }]}>{text}</Text>
      </View>
      {online && (
        <View
          style={[
            styles.onlineIndicator,
            {
              width: size * 0.25,
              height: size * 0.25,
              borderRadius: size * 0.125,
              borderWidth: size * 0.05,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#10b981",
    borderColor: "#ffffff",
  },
});
