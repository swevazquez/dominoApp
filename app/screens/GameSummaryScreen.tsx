import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Badge } from "@app/components/Badge";
import { AppDialog } from "@app/components/ui";
import { RootStackParamList } from "@app/navigation/AppNavigator";
import { colors, sharedStyles, spacing } from "@app/components/theme";
import { Game } from "@domain/Game";
import { shouldShowSpecialWinHighlights, summarizeGame } from "@domain/GameSummary";
import { useGameContext } from "@features/gameplay/GameContext";

type Props = NativeStackScreenProps<RootStackParamList, "Summary">;

export function GameSummaryScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { game, completedGames, dispatch } = useGameContext();
  const [deleteHandNumber, setDeleteHandNumber] = useState<number | null>(null);
  const selectedGame: Game = useMemo(() => {
    if (!route.params?.gameId) {
      return game;
    }
    return completedGames.find((item) => item.id === route.params?.gameId) ?? game;
  }, [completedGames, game, route.params?.gameId]);
  const summary = summarizeGame(selectedGame);
  const canEditCurrentGame = selectedGame.id === game.id;
  const showSpecialWinHighlights = shouldShowSpecialWinHighlights(selectedGame.preset);

  function confirmDelete(handNumber: number) {
    if (!canEditCurrentGame) {
      return;
    }
    setDeleteHandNumber(handNumber);
  }

  return (
    <SafeAreaView edges={["top"]} style={sharedStyles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={() => navigation.goBack()}>
            <Text style={styles.link}>Back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Game Summary</Text>
          <View style={styles.headerSide} />
        </View>

        <View style={[sharedStyles.panel, styles.resultCard]}>
          <Text style={styles.gameOver}>GAME OVER</Text>
          <Text style={[styles.winner, { color: summary.winner === "THEM" ? colors.red : colors.blue }]}>
            {summary.winner === "THEM" ? "THEM WIN!" : "US WIN!"}
          </Text>
          <Text style={styles.finalScore}>
            {summary.totals.US} - {summary.totals.THEM}
          </Text>
          <Text style={sharedStyles.subtitle}>{selectedGame.preset.name}</Text>

          <View style={styles.summaryStats}>
            <View style={styles.summaryStat}>
              <Text style={styles.statLabel}>Hands Played</Text>
              <Text style={styles.statValue}>{summary.handsPlayed}</Text>
            </View>
            <View style={styles.summaryStat}>
              <Text style={styles.statLabel}>US Wins</Text>
              <Text style={styles.statValue}>{summary.winsByTeam.US}</Text>
            </View>
            <View style={styles.summaryStat}>
              <Text style={styles.statLabel}>THEM Wins</Text>
              <Text style={styles.statValue}>{summary.winsByTeam.THEM}</Text>
            </View>
          </View>

          <View style={styles.highlightList}>
            {showSpecialWinHighlights ? <Badge tone="purple">CAPICU {summary.capicuCount}</Badge> : null}
            {showSpecialWinHighlights ? <Badge tone="gold">CHUCHAZO {summary.chuchazoCount}</Badge> : null}
            {summary.chiva ? <Badge tone="green">CHIVA</Badge> : null}
          </View>
        </View>

        <View style={sharedStyles.panel}>
          <Text style={styles.sectionTitle}>Hand Breakdown</Text>
          {selectedGame.hands.map((hand) => (
            <View key={hand.id} style={styles.handRow}>
              <View style={styles.handNumber}>
                <Text style={styles.handNumberText}>{hand.handNumber}</Text>
              </View>
              <View style={styles.handMain}>
                <Text style={styles.handTitle}>{showSpecialWinHighlights ? `${hand.winner} · ${hand.winType}` : hand.winner}</Text>
                <Text style={sharedStyles.subtitle}>
                  {hand.basePoints}
                  {hand.appliedPrize ? ` + prize ${hand.appliedPrize}` : ""}
                  {hand.appliedBonus ? ` + bonus ${hand.appliedBonus}` : ""}
                </Text>
              </View>
              <Text style={styles.handTotal}>{hand.totalPoints}</Text>
              {canEditCurrentGame ? (
                <Pressable accessibilityRole="button" onPress={() => confirmDelete(hand.handNumber)} style={styles.deleteButton}>
                  <Text style={styles.deleteText}>Delete</Text>
                </Pressable>
              ) : null}
            </View>
          ))}
        </View>
      </ScrollView>
      <AppDialog
        actions={[
          { label: "Cancel", onPress: () => setDeleteHandNumber(null), variant: "secondary" },
          {
            label: "Delete",
            onPress: () => {
              if (deleteHandNumber !== null) {
                dispatch({ type: "DELETE_HAND", handNumber: deleteHandNumber });
              }
              setDeleteHandNumber(null);
            },
            variant: "danger"
          }
        ]}
        message="This will recalculate all later scores and the game outcome."
        onRequestClose={() => setDeleteHandNumber(null)}
        title="Delete hand?"
        visible={deleteHandNumber !== null}
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
  header: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerSide: {
    width: 52
  },
  link: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: "700"
  },
  headerTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900"
  },
  resultCard: {
    alignItems: "center",
    gap: spacing.sm
  },
  gameOver: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: "900"
  },
  winner: {
    fontSize: 34,
    fontWeight: "900"
  },
  finalScore: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "900"
  },
  summaryStats: {
    flexDirection: "row",
    width: "100%",
    gap: spacing.sm,
    marginTop: spacing.md
  },
  summaryStat: {
    flex: 1,
    minHeight: 66,
    borderRadius: 8,
    backgroundColor: colors.panelAlt,
    alignItems: "center",
    justifyContent: "center"
  },
  statLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800"
  },
  statValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900"
  },
  highlightList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: spacing.md
  },
  handRow: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.md
  },
  handNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.blueSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  handNumberText: {
    color: colors.blue,
    fontWeight: "900"
  },
  handMain: {
    flex: 1
  },
  handTitle: {
    color: colors.text,
    fontWeight: "800"
  },
  handTotal: {
    color: colors.text,
    fontWeight: "900",
    width: 42,
    textAlign: "right"
  },
  deleteButton: {
    minHeight: 36,
    justifyContent: "center"
  },
  deleteText: {
    color: colors.danger,
    fontWeight: "800"
  }
});
