import { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Badge } from "@app/components/Badge";
import { AppDialog, Button, Card, SegmentedControl } from "@app/components/ui";
import { colors, spacing } from "@app/components/theme";
import { HandInput } from "@domain/Hand";
import { getBonusForWinType, getPrizeForHand } from "@domain/ScoringEngine";
import { RulePreset, TeamId, WinType } from "@domain/Rules";
import { applyPointsInput, PointsInputAction } from "./PointsInput";

const WIN_TYPES: WinType[] = ["NORMAL", "CAPICU", "CHUCHAZO", "TRANQUE"];
const POINT_KEYS: PointsInputAction[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "CLEAR", "0", "BACKSPACE"];

export function HandEntryModal({
  visible,
  preset,
  handNumber,
  onClose,
  onSave
}: {
  visible: boolean;
  preset: RulePreset;
  handNumber: number;
  onClose: () => void;
  onSave: (input: HandInput) => void;
}) {
  const [winner, setWinner] = useState<TeamId>("US");
  const [winType, setWinType] = useState<WinType>("NORMAL");
  const [points, setPoints] = useState("");
  const [highScoreDialogVisible, setHighScoreDialogVisible] = useState(false);
  const basePoints = Number(points || 0);
  const showWinTypeOptions = preset.targetScore === 500 && (preset.prizeEnabled || preset.capicuEnabled || preset.chuchazoEnabled);
  const activeWinType: WinType = showWinTypeOptions ? winType : "NORMAL";
  const prize = getPrizeForHand(preset, handNumber);
  const bonus = getBonusForWinType(preset, activeWinType);
  const canSave = points.trim().length > 0 && basePoints >= 0;

  const winTypeLabels = useMemo(
    () => ({
      NORMAL: "Normal",
      CAPICU: "Capicu\n+100",
      CHUCHAZO: "Chuchazo\n+100",
      TRANQUE: "Tranque"
    }),
    []
  );

  useEffect(() => {
    if (!showWinTypeOptions && winType !== "NORMAL") {
      setWinType("NORMAL");
    }
  }, [showWinTypeOptions, winType]);

  function commitSave() {
    onSave({ winner, winType: activeWinType, basePoints });
    setPoints("");
    setWinner("US");
    setWinType("NORMAL");
    setHighScoreDialogVisible(false);
  }

  function save() {
    if (!canSave) {
      return;
    }

    if (basePoints > 100) {
      setHighScoreDialogVisible(true);
      return;
    }

    commitSave();
  }

  function pressPointKey(action: PointsInputAction) {
    setPoints((current) => applyPointsInput(current, action));
  }

  return (
    <Modal animationType="slide" presentationStyle="pageSheet" visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Pressable accessibilityRole="button" onPress={onClose} style={styles.headerSide}>
              <Text style={styles.link}>Cancel</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Add Hand</Text>
            <View style={styles.headerSide} />
          </View>

          <SegmentedControl
            onChange={setWinner}
            options={[
              { label: "US", value: "US" },
              { label: "THEM", value: "THEM" }
            ]}
            value={winner}
          />

          {showWinTypeOptions ? (
            <View style={styles.winTypeGrid}>
              {WIN_TYPES.map((type) => {
                const disabled = (type === "CAPICU" && !preset.capicuEnabled) || (type === "CHUCHAZO" && !preset.chuchazoEnabled);
                return (
                  <Pressable
                    accessibilityRole="button"
                    disabled={disabled}
                    key={type}
                    onPress={() => setWinType(type)}
                    style={[styles.winType, winType === type && styles.winTypeSelected, disabled && styles.disabledTile]}
                  >
                    <Text adjustsFontSizeToFit minimumFontScale={0.78} numberOfLines={2} style={styles.winTypeText}>
                      {winTypeLabels[type]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}

          <View accessibilityLabel="Points earned" accessibilityRole="text" style={styles.pointsDisplay}>
            <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.pointsDisplayText, !points && styles.pointsDisplayPlaceholder]}>
              {points || "0"}
            </Text>
          </View>
          <View style={styles.keypad}>
            {POINT_KEYS.map((key) => (
              <Pressable accessibilityLabel={key === "BACKSPACE" ? "Delete digit" : key === "CLEAR" ? "Clear points" : `Point digit ${key}`} accessibilityRole="button" key={key} onPress={() => pressPointKey(key)} style={styles.key}>
                <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.keyText, (key === "CLEAR" || key === "BACKSPACE") && styles.keyTextMuted]}>
                  {key === "BACKSPACE" ? "Del" : key === "CLEAR" ? "Clear" : key}
                </Text>
              </Pressable>
            ))}
          </View>

          <Card style={styles.summary}>
            <Text style={styles.summaryTitle}>HAND SUMMARY</Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Base Points</Text>
              <Text style={styles.rowValue}>{basePoints}</Text>
            </View>
            {prize > 0 ? (
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Prize</Text>
                <Text style={styles.rowValue}>+{prize}</Text>
              </View>
            ) : null}
            {bonus > 0 ? (
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Bonus</Text>
                <Text style={styles.rowValue}>+{bonus}</Text>
              </View>
            ) : null}
            <Badge tone={activeWinType === "CHUCHAZO" ? "gold" : activeWinType === "CAPICU" ? "purple" : "blue"}>Total This Hand {basePoints + prize + bonus}</Badge>
          </Card>

          <Button disabled={!canSave} onPress={save}>
            Save Hand
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
      <AppDialog
        actions={[
          { label: "Cancel", onPress: () => setHighScoreDialogVisible(false), variant: "secondary" },
          { label: "Save Hand", onPress: commitSave }
        ]}
        message={`${basePoints} points in one hand is rare. Save this hand?`}
        onRequestClose={() => setHighScoreDialogVisible(false)}
        title="Confirm high score?"
        visible={highScoreDialogVisible}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    gap: spacing.lg,
    padding: spacing.lg
  },
  header: {
    minHeight: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerSide: {
    width: 70
  },
  headerTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800"
  },
  link: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: "700"
  },
  disabled: {
    color: colors.muted
  },
  winTypeGrid: {
    flexDirection: "row",
    gap: spacing.sm
  },
  winType: {
    flex: 1,
    minHeight: 94,
    backgroundColor: colors.panel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.sm
  },
  winTypeSelected: {
    borderColor: colors.blue,
    backgroundColor: colors.blueSoft
  },
  disabledTile: {
    opacity: 0.35
  },
  winTypeText: {
    color: colors.text,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 16
  },
  pointsDisplay: {
    minHeight: 72,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md
  },
  pointsDisplayText: {
    color: colors.text,
    fontSize: 42,
    fontWeight: "900",
    textAlign: "center"
  },
  pointsDisplayPlaceholder: {
    color: colors.muted,
    opacity: 0.45
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  key: {
    width: "31.5%",
    minHeight: 46,
    borderRadius: 8,
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center"
  },
  keyText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900"
  },
  keyTextMuted: {
    color: colors.muted,
    fontSize: 14
  },
  summary: {
    gap: spacing.md
  },
  summaryTitle: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  rowLabel: {
    color: colors.text
  },
  rowValue: {
    color: colors.text,
    fontWeight: "800"
  }
});
