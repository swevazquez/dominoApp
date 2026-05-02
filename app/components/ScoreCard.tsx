import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "./theme";

export function ScoreCard({ usScore, themScore, target }: { usScore: number; themScore: number; target: number }) {
  return (
    <View style={styles.card}>
      <View style={[styles.side, styles.usSide]}>
        <Text style={[styles.label, { color: colors.blue }]}>US</Text>
        <Text adjustsFontSizeToFit numberOfLines={1} style={styles.score}>
          {usScore}
        </Text>
      </View>
      <View style={[styles.side, styles.themSide]}>
        <Text style={[styles.label, { color: colors.red }]}>THEM</Text>
        <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.score, { color: colors.red }]}>
          {themScore}
        </Text>
      </View>
      <View style={styles.targetPill}>
        <Text style={styles.targetText}>{target} to Win</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 156,
    borderRadius: 8,
    overflow: "hidden",
    flexDirection: "row",
    position: "relative",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border
  },
  side: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm
  },
  usSide: {
    backgroundColor: colors.blueSoft
  },
  themSide: {
    backgroundColor: colors.redSoft
  },
  label: {
    fontSize: 14,
    fontWeight: "900"
  },
  score: {
    color: colors.text,
    fontSize: 52,
    fontWeight: "900"
  },
  targetPill: {
    position: "absolute",
    left: "50%",
    bottom: 14,
    transform: [{ translateX: -58 }],
    minWidth: 116,
    minHeight: 30,
    borderRadius: 6,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm
  },
  targetText: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 13
  }
});
