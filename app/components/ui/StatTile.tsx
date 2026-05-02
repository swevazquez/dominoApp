import { StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing } from "../theme";

export function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.tile}>
      <Text adjustsFontSizeToFit numberOfLines={1} style={styles.label}>
        {label}
      </Text>
      <Text adjustsFontSizeToFit numberOfLines={1} style={styles.value}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minHeight: 70,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.panel,
    borderRadius: radii.md,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800"
  },
  value: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900"
  }
});
