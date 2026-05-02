import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge } from "@app/components/Badge";
import { AppDialog, Card, ScreenHeader } from "@app/components/ui";
import { colors, sharedStyles, spacing } from "@app/components/theme";
import { BUILT_IN_PRESETS } from "@domain/Rules";
import { useGameContext } from "@features/gameplay/GameContext";

export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { game, dispatch } = useGameContext();
  const [pendingPresetId, setPendingPresetId] = useState<string | null>(null);
  const hasOngoingGame = game.status === "ACTIVE" && game.hands.length > 0;
  const pendingPreset = BUILT_IN_PRESETS.find((item) => item.id === pendingPresetId);

  function startPreset(presetId: string) {
    const preset = BUILT_IN_PRESETS.find((item) => item.id === presetId);
    if (!preset) {
      return;
    }

    if (!hasOngoingGame) {
      dispatch({ type: "START_GAME", preset });
      return;
    }

    setPendingPresetId(preset.id);
  }

  return (
    <SafeAreaView edges={["top"]} style={sharedStyles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}>
        <ScreenHeader title="Settings" />

        <Card>
          <Text style={styles.sectionTitle}>Presets</Text>
          {BUILT_IN_PRESETS.map((preset) => (
            <Pressable accessibilityRole="button" key={preset.id} onPress={() => startPreset(preset.id)} style={styles.presetRow}>
              <View>
                <Text style={styles.rowTitle}>{preset.name}</Text>
                <Text style={sharedStyles.subtitle}>Target: {preset.targetScore}</Text>
                <Text style={sharedStyles.subtitle}>
                  {preset.prizeEnabled ? `Prizes: ${preset.prizeByHand.join(", ")}` : "No prizes"}
                </Text>
              </View>
              {game.preset.id === preset.id ? <Badge>Active</Badge> : null}
            </Pressable>
          ))}
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Scoring Rules</Text>
          <View style={styles.ruleRow}>
            <Text style={styles.rowTitle}>Tranque Mode</Text>
            <Text style={styles.rowValue}>Team</Text>
          </View>
          <View style={styles.ruleRow}>
            <Text style={styles.rowTitle}>Capicu</Text>
            <Text style={styles.rowValue}>{game.preset.capicuEnabled ? "On" : "Off"}</Text>
          </View>
          <View style={styles.ruleRow}>
            <Text style={styles.rowTitle}>Chuchazo</Text>
            <Text style={styles.rowValue}>{game.preset.chuchazoEnabled ? "On" : "Off"}</Text>
          </View>
          <View style={styles.ruleRow}>
            <Text style={styles.rowTitle}>Capicu Bonus</Text>
            <Text style={styles.rowValue}>{game.preset.capicuBonus}</Text>
          </View>
          <View style={styles.ruleRow}>
            <Text style={styles.rowTitle}>Chuchazo Bonus</Text>
            <Text style={styles.rowValue}>{game.preset.chuchazoBonus}</Text>
          </View>
        </Card>
      </ScrollView>
      <AppDialog
        actions={[
          { label: "Cancel", onPress: () => setPendingPresetId(null), variant: "secondary" },
          {
            label: "Start New Game",
            onPress: () => {
              if (pendingPreset) {
                dispatch({ type: "START_GAME", preset: pendingPreset });
              }
              setPendingPresetId(null);
            },
            variant: "danger"
          }
        ]}
        message="This will remove the ongoing game data and start a new game with the selected rules."
        onRequestClose={() => setPendingPresetId(null)}
        title="Start new game?"
        visible={pendingPresetId !== null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm
  },
  sectionTitle: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: spacing.sm
  },
  presetRow: {
    minHeight: 86,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  ruleRow: {
    minHeight: 44,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  rowTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700"
  },
  rowValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800"
  }
});
