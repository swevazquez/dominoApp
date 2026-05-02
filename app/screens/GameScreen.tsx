import { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Badge } from "@app/components/Badge";
import { ScoreCard } from "@app/components/ScoreCard";
import { AppDialog, Button, Card, IconButton, ScreenHeader, StatTile } from "@app/components/ui";
import { colors, sharedStyles, spacing } from "@app/components/theme";
import { getCurrentTotals, getWinner, scoreHand } from "@domain/ScoringEngine";
import { shouldShowSpecialWinHighlights, summarizeGame } from "@domain/GameSummary";
import { HandInput } from "@domain/Hand";
import { HandEntryModal } from "@features/gameplay/HandEntryModal";
import { useGameContext } from "@features/gameplay/GameContext";

export function GameScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { game, dispatch } = useGameContext();
  const [entryOpen, setEntryOpen] = useState(false);
  const [completionNoticeVisible, setCompletionNoticeVisible] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<"newGame" | "undo" | null>(null);
  const totals = getCurrentTotals(game);
  const summary = summarizeGame(game);
  const showSpecialWinHighlights = shouldShowSpecialWinHighlights(game.preset);
  const visibleHands = [...game.hands].reverse();
  const hasOngoingGame = game.status === "ACTIVE" && game.hands.length > 0;
  const canEditActiveGame = game.status === "ACTIVE";

  function undoLastHand() {
    if (game.hands.length === 0) {
      return;
    }
    setConfirmDialog("undo");
  }

  function startNewGame() {
    if (!hasOngoingGame) {
      setCompletionNoticeVisible(false);
      dispatch({ type: "START_GAME", preset: game.preset });
      return;
    }

    setConfirmDialog("newGame");
  }

  function saveHand(input: HandInput) {
    const scoredHand = scoreHand({
      input,
      preset: game.preset,
      priorTotals: totals,
      handNumber: game.hands.length + 1
    });
    const winningTeam = getWinner(scoredHand.cumulativeScore, game.preset.targetScore);

    dispatch({ type: "ADD_HAND", input });
    setEntryOpen(false);
    setCompletionNoticeVisible(Boolean(winningTeam));
  }

  return (
    <SafeAreaView edges={["top"]} style={sharedStyles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + spacing.xl
          }
        ]}
      >
        <ScreenHeader right={<IconButton label="NEW" onPress={startNewGame} />} title="Dominoes" titleStyle={styles.brandTitle} />

        <View style={styles.scoreGroup}>
          <ScoreCard usScore={totals.US} themScore={totals.THEM} target={game.preset.targetScore} />

          <View style={styles.statsRow}>
            <StatTile label="Hands Played" value={game.hands.length} />
          </View>
        </View>

        {completionNoticeVisible && game.status === "COMPLETED" ? (
          <Card style={styles.completionBanner}>
            <Text style={styles.completionEyebrow}>GAME COMPLETE</Text>
            <Text style={styles.completionTitle}>{summary.winner === "US" ? "US win!" : "Them win!"}</Text>
            <Text style={styles.completionScore}>
              Final score {totals.US} - {totals.THEM}
            </Text>
            <View style={styles.completionActions}>
              <Button
                onPress={() => {
                  setCompletionNoticeVisible(false);
                  navigation.navigate("Summary");
                }}
                style={styles.completionAction}
              >
                View Summary
              </Button>
              <Button onPress={startNewGame} style={styles.completionAction}>
                New Game
              </Button>
            </View>
          </Card>
        ) : null}

        {game.status === "COMPLETED" && !completionNoticeVisible ? (
          <Card style={styles.completed}>
            <View style={styles.completedBadges}>
              <Badge tone={summary.winner === "US" ? "blue" : "red"}>{summary.winner === "US" ? "US WIN" : "THEM WIN"}</Badge>
              {summary.chiva ? <Badge tone="green">CHIVA</Badge> : null}
            </View>
            <Button onPress={() => navigation.navigate("Summary")}>View Game Summary</Button>
          </Card>
        ) : null}

        {canEditActiveGame ? (
          <Button onPress={() => setEntryOpen(true)}>+ Add Hand</Button>
        ) : null}

        {canEditActiveGame ? (
          <Button onPress={undoLastHand} variant="secondary">
            Undo Last Hand
          </Button>
        ) : null}

        <Card style={styles.handHistory}>
          <Text style={styles.sectionTitle}>Hands</Text>
          {visibleHands.length ? (
            <View style={styles.handList}>
              {visibleHands.map((hand) => (
                <View key={hand.id} style={styles.handRow}>
                  <View style={styles.handMain}>
                    <Text style={styles.handTitle}>
                      Hand {hand.handNumber} · {hand.winner === "US" ? "US" : "THEM"}
                      {showSpecialWinHighlights ? ` · ${hand.winType}` : ""}
                    </Text>
                    <Text style={styles.handMeta}>
                      {hand.basePoints}
                      {hand.appliedPrize ? ` + prize ${hand.appliedPrize}` : ""}
                      {hand.appliedBonus ? ` + bonus ${hand.appliedBonus}` : ""}
                    </Text>
                  </View>
                  <View style={styles.handBadges}>
                    <Badge tone={hand.winner === "US" ? "blue" : "red"}>+{hand.totalPoints}</Badge>
                    {showSpecialWinHighlights && hand.winType === "CAPICU" ? <Badge tone="purple">CAPICU</Badge> : null}
                    {showSpecialWinHighlights && hand.winType === "CHUCHAZO" ? <Badge tone="gold">CHUCHAZO</Badge> : null}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>Logged hands will appear here newest first.</Text>
          )}
        </Card>
      </ScrollView>

      <HandEntryModal
        handNumber={game.hands.length + 1}
        onClose={() => setEntryOpen(false)}
        onSave={saveHand}
        preset={game.preset}
        visible={entryOpen}
      />
      <AppDialog
        actions={[
          { label: "Cancel", onPress: () => setConfirmDialog(null), variant: "secondary" },
          {
            label: confirmDialog === "undo" ? "Undo" : "Start New Game",
            onPress: () => {
              if (confirmDialog === "undo") {
                setCompletionNoticeVisible(false);
                dispatch({ type: "UNDO_LAST_HAND" });
              }
              if (confirmDialog === "newGame") {
                setCompletionNoticeVisible(false);
                dispatch({ type: "START_GAME", preset: game.preset });
              }
              setConfirmDialog(null);
            },
            variant: "danger"
          }
        ]}
        message={
          confirmDialog === "undo"
            ? "This will remove the most recent hand and recalculate the score."
            : "This will remove the ongoing game data and start a new game with the current rules."
        }
        onRequestClose={() => setConfirmDialog(null)}
        title={confirmDialog === "undo" ? "Undo last hand?" : "Start new game?"}
        visible={confirmDialog !== null}
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
  brandTitle: {
    fontFamily: Platform.select({ ios: "Snell Roundhand", android: "casual" }),
    fontSize: 45,
    fontStyle: "italic",
    fontWeight: "900"
  },
  scoreGroup: {
    gap: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.md
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  sectionTitle: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900"
  },
  handHistory: {
    gap: spacing.md,
    maxHeight: 280
  },
  handList: {
    gap: spacing.sm
  },
  handRow: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.sm
  },
  handMain: {
    flex: 1
  },
  handTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  },
  handMeta: {
    color: colors.muted,
    fontSize: 12,
    marginTop: spacing.xs
  },
  handBadges: {
    alignItems: "flex-end",
    gap: spacing.xs
  },
  emptyText: {
    color: colors.muted
  },
  completed: {
    gap: spacing.md,
    alignItems: "stretch"
  },
  completedBadges: {
    alignItems: "center",
    gap: spacing.sm
  },
  completionBanner: {
    alignItems: "center",
    backgroundColor: colors.greenSoft,
    borderColor: colors.green,
    gap: spacing.sm
  },
  completionEyebrow: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "900"
  },
  completionTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center"
  },
  completionScore: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700"
  },
  completionActions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm
  },
  completionAction: {
    flex: 1
  }
});
