import { ReactNode } from "react";
import { StyleProp, StyleSheet, Text, TextStyle, View } from "react-native";
import { colors, spacing, typography } from "../theme";

export function ScreenHeader({
  left,
  right,
  title,
  titleStyle
}: {
  left?: ReactNode;
  right?: ReactNode;
  title: string;
  titleStyle?: StyleProp<TextStyle>;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.side}>{left}</View>
      <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.title, titleStyle]}>
        {title}
      </Text>
      <View style={styles.side}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  side: {
    width: 52,
    alignItems: "center"
  },
  title: {
    color: colors.text,
    flex: 1,
    fontSize: typography.header.fontSize,
    fontWeight: typography.header.fontWeight,
    textAlign: "center"
  }
});
