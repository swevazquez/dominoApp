import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing } from "../theme";
import { Button } from "./Button";

type DialogAction = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
};

export function AppDialog({
  actions,
  message,
  onRequestClose,
  title,
  visible
}: {
  actions: DialogAction[];
  message: string;
  onRequestClose: () => void;
  title: string;
  visible: boolean;
}) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.backdrop}>
        <Pressable accessibilityLabel="Dismiss dialog" accessibilityRole="button" onPress={onRequestClose} style={StyleSheet.absoluteFill} />
        <View accessibilityRole="alert" style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            {actions.map((action) => (
              <Button key={action.label} onPress={action.onPress} style={styles.action} variant={action.variant ?? "primary"}>
                {action.label}
              </Button>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.68)",
    padding: spacing.lg
  },
  dialog: {
    width: "100%",
    maxWidth: 360,
    borderRadius: radii.md,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: colors.panel,
    padding: spacing.lg,
    gap: spacing.md
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center"
  },
  message: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
    textAlign: "center"
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.xs
  },
  action: {
    width: "100%"
  }
});
