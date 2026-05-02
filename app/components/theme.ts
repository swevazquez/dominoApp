import { StyleSheet } from "react-native";

export const colors = {
  background: "#06111f",
  panel: "#101b2b",
  panelAlt: "#172439",
  border: "#26384f",
  text: "#f8fafc",
  muted: "#9ba8bb",
  blue: "#2584ff",
  blueSoft: "#163760",
  red: "#ff5b55",
  redSoft: "#43222a",
  purple: "#c77dff",
  purpleSoft: "#2f2148",
  gold: "#ffb020",
  goldSoft: "#3d2c10",
  green: "#54d66d",
  greenSoft: "#183d24",
  danger: "#ff6b6b"
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24
};

export const radii = {
  sm: 6,
  md: 8
};

export const typography = {
  header: {
    fontSize: 17,
    fontWeight: "900" as const
  },
  button: {
    fontSize: 17,
    fontWeight: "700" as const
  }
};

export const sharedStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background
  },
  panel: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.md,
    padding: spacing.lg
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800"
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14
  },
  primaryButton: {
    minHeight: 52,
    borderRadius: 8,
    backgroundColor: colors.blue,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg
  },
  primaryButtonText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700"
  },
  outlineButton: {
    minHeight: 48,
    borderRadius: 8,
    borderColor: colors.border,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg
  },
  outlineButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600"
  }
});
