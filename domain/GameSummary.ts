import { Game } from "./Game";
import { getCurrentTotals, getWinner, isChiva } from "./ScoringEngine";
import { RulePreset, TeamId } from "./Rules";

export type GameSummary = {
  winner?: TeamId;
  totals: Record<TeamId, number>;
  handsPlayed: number;
  winsByTeam: Record<TeamId, number>;
  capicuCount: number;
  chuchazoCount: number;
  chiva: boolean;
};

export function summarizeGame(game: Game): GameSummary {
  const totals = getCurrentTotals(game);
  const winner = getWinner(totals, game.preset.targetScore);

  return {
    winner,
    totals,
    handsPlayed: game.hands.length,
    winsByTeam: {
      US: game.hands.filter((hand) => hand.winner === "US").length,
      THEM: game.hands.filter((hand) => hand.winner === "THEM").length
    },
    capicuCount: game.hands.filter((hand) => hand.winType === "CAPICU").length,
    chuchazoCount: game.hands.filter((hand) => hand.winType === "CHUCHAZO").length,
    chiva: isChiva(totals, winner)
  };
}

export function shouldShowSpecialWinHighlights(preset: RulePreset): boolean {
  return preset.targetScore === 500 && (preset.capicuEnabled || preset.chuchazoEnabled);
}

export function formatShareText(game: Game): string {
  const summary = summarizeGame(game);
  const winnerLabel = summary.winner === "US" ? "Us" : summary.winner === "THEM" ? "Them" : "No winner";
  const showSpecialWinHighlights = shouldShowSpecialWinHighlights(game.preset);
  const highlights = [
    showSpecialWinHighlights && summary.capicuCount > 0 ? `Capicu x${summary.capicuCount}` : undefined,
    showSpecialWinHighlights && summary.chuchazoCount > 0 ? `Chuchazo x${summary.chuchazoCount}` : undefined,
    summary.chiva ? "Chiva" : undefined
  ].filter(Boolean);

  return [
    `Dominoes result: ${winnerLabel}`,
    `Final score: Us ${summary.totals.US} - Them ${summary.totals.THEM}`,
    `Preset: ${game.preset.name}`,
    `Hands played: ${summary.handsPlayed}`,
    highlights.length ? `Highlights: ${highlights.join(", ")}` : undefined
  ]
    .filter(Boolean)
    .join("\n");
}
