import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge } from "@app/components/Badge";
import { ScreenHeader } from "@app/components/ui";
import { colors, sharedStyles, spacing } from "@app/components/theme";
import { shouldShowSpecialWinHighlights, summarizeGame } from "@domain/GameSummary";
import { useGameContext } from "@features/gameplay/GameContext";

export function HistoryScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { completedGames, loadHistory } = useGameContext();

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  return (
    <SafeAreaView edges={["top"]} style={sharedStyles.screen}>
      <ScreenHeader title="History" />
      <FlatList
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.xl }]}
        data={completedGames}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>Completed games will appear here.</Text>}
        renderItem={({ item }) => {
          const summary = summarizeGame(item);
          const showSpecialWinHighlights = shouldShowSpecialWinHighlights(item.preset);
          return (
            <Pressable accessibilityRole="button" onPress={() => navigation.navigate("Summary", { gameId: item.id })} style={sharedStyles.panel}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.result}>{summary.winner === "US" ? "US WIN" : "THEM WIN"}</Text>
                  <Text style={styles.score}>
                    {summary.totals.US} - {summary.totals.THEM}
                  </Text>
                  <Text style={styles.meta}>{item.preset.name}</Text>
                </View>
                <Text style={styles.meta}>{new Date(item.completedAt ?? item.createdAt).toLocaleDateString()}</Text>
              </View>
              <View style={styles.badges}>
                {showSpecialWinHighlights && summary.capicuCount ? <Badge tone="purple">Capicu {summary.capicuCount}</Badge> : null}
                {showSpecialWinHighlights && summary.chuchazoCount ? <Badge tone="gold">Chuchazo {summary.chuchazoCount}</Badge> : null}
                {summary.chiva ? <Badge tone="green">Chiva</Badge> : null}
              </View>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md
  },
  empty: {
    color: colors.muted,
    marginTop: spacing.xl
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.lg
  },
  result: {
    color: colors.green,
    fontSize: 13,
    fontWeight: "900"
  },
  score: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    marginTop: spacing.xs
  },
  meta: {
    color: colors.muted,
    fontSize: 13
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md
  }
});
