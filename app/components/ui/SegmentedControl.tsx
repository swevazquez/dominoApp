import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing } from "../theme";

export function SegmentedControl<T extends string>({
  onChange,
  options,
  value
}: {
  onChange: (value: T) => void;
  options: { label: string; value: T }[];
  value: T;
}) {
  return (
    <View style={styles.segment}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            accessibilityRole="button"
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.button, selected && styles.selected]}
          >
            <Text style={styles.text}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  segment: {
    flexDirection: "row",
    gap: spacing.sm
  },
  button: {
    flex: 1,
    minHeight: 44,
    backgroundColor: colors.panel,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center"
  },
  selected: {
    backgroundColor: colors.blue
  },
  text: {
    color: colors.text,
    fontWeight: "900"
  }
});
