import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radii } from "../theme";

export function IconButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable accessibilityLabel={label} accessibilityRole="button" onPress={onPress} style={styles.button}>
      <Text adjustsFontSizeToFit numberOfLines={1} style={styles.text}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "900"
  }
});
