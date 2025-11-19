import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: any;
}

export function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = 4,
  style,
}: SkeletonProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <Skeleton width={80} height={80} borderRadius={8} style={styles.image} />
      <View style={styles.content}>
        <Skeleton width="70%" height={20} style={styles.title} />
        <Skeleton width="50%" height={16} style={styles.subtitle} />
        <Skeleton width="40%" height={16} style={styles.price} />
      </View>
    </View>
  );
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <View style={styles.textContainer}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? "60%" : "100%"}
          height={16}
          style={styles.textLine}
        />
      ))}
    </View>
  );
}

export function SkeletonCircle({ size = 50 }: { size?: number }) {
  return <Skeleton width={size} height={size} borderRadius={size / 2} />;
}

export function SkeletonButton() {
  return <Skeleton width="100%" height={48} borderRadius={8} />;
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#E0E0E0",
  },
  card: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 12,
    borderRadius: 8,
  },
  image: {
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 8,
  },
  price: {},
  textContainer: {
    padding: 16,
  },
  textLine: {
    marginBottom: 8,
  },
});
