import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { theme } from "@/utils";
import { Promo } from "@/types/Promo";

export default function PromoCard({
  promo,
  index,
}: {
  promo: Promo;
  index: number;
}) {
  return (
    <TouchableOpacity
      key={index}
      activeOpacity={0.8}
      style={{
        borderRadius: theme.radius.xl,
        overflow: "hidden",
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}
    >
      <Image
        source={{ uri: promo.banner }}
        style={{ width: "100%", height: 140 }}
        resizeMode="cover"
      />
      <View style={{ padding: theme.spacing.sm }}>
        <Text
          style={{ fontWeight: "700", color: theme.colors.foreground }}
          numberOfLines={1}
        >
          {promo.title}
        </Text>
        <Text style={{ color: theme.colors.mutedForeground }} numberOfLines={2}>
          {promo.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
