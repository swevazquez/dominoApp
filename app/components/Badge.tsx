import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "./theme";

type BadgeTone = "blue" | "red" | "purple" | "gold" | "green";

const toneStyles: Record<BadgeTone, { backgroundColor: string; color: string }> = {
  blue: { backgroundColor: colors.blueSoft, color: colors.blue },
  red: { backgroundColor: colors.redSoft, color: colors.red },
  purple: { backgroundColor: colors.purpleSoft, color: colors.purple },
  gold: { backgroundColor: colors.goldSoft, color: colors.gold },
  green: { backgroundColor: colors.greenSoft, color: colors.green }
};

export function Badge({ children, tone = "blue" }: { children: ReactNode; tone?: BadgeTone }) {
  const selectedTone = toneStyles[tone];
  return (
    <View style={[styles.badge, { backgroundColor: selectedTone.backgroundColor }]}>
      <Text style={[styles.text, { color: selectedTone.color }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minHeight: 28,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md
  },
  text: {
    fontSize: 13,
    fontWeight: "800"
  }
});
