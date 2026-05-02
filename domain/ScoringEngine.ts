import { Game, GameTotals, getInitialTotals } from "./Game";
import { HandInput, ScoredHand } from "./Hand";
import { RulePreset, TeamId } from "./Rules";

export type ScoreHandParams = {
  input: HandInput;
  handNumber: number;
  preset: RulePreset;
  priorTotals?: GameTotals;
  now?: Date;
  id?: string;
};

export class ScoringError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScoringError";
  }
}

export function validateHandInput(input: Partial<HandInput>, preset: RulePreset): asserts input is HandInput {
  if (!input.winner) {
    throw new ScoringError("A winning team is required.");
  }

  if (!input.winType) {
    throw new ScoringError("A win type is required.");
  }

  if (input.basePoints === undefined || input.basePoints === null || Number.isNaN(input.basePoints)) {
    throw new ScoringError("Points are required.");
  }

  if (input.basePoints < 0) {
    throw new ScoringError("Negative points are not allowed by default.");
  }

  if (input.winType === "CAPICU" && !preset.capicuEnabled) {
    throw new ScoringError("Capicu is disabled for this preset.");
  }

  if (input.winType === "CHUCHAZO" && !preset.chuchazoEnabled) {
    throw new ScoringError("Chuchazo is disabled for this preset.");
  }
}

export function getPrizeForHand(preset: RulePreset, handNumber: number): number {
  if (!preset.prizeEnabled || handNumber < 1) {
    return 0;
  }

  return preset.prizeByHand[handNumber - 1] ?? 0;
}

export function getBonusForWinType(preset: RulePreset, winType: HandInput["winType"]): number {
  if (winType === "CAPICU") {
    return preset.capicuBonus;
  }

  if (winType === "CHUCHAZO") {
    return preset.chuchazoBonus;
  }

  return 0;
}

export function scoreHand({ input, handNumber, preset, priorTotals = getInitialTotals(), now = new Date(), id }: ScoreHandParams): ScoredHand {
  validateHandInput(input, preset);

  const appliedPrize = getPrizeForHand(preset, handNumber);
  const appliedBonus = getBonusForWinType(preset, input.winType);
  const totalPoints = input.basePoints + appliedPrize + appliedBonus;
  const cumulativeScore = {
    ...priorTotals,
    [input.winner]: priorTotals[input.winner] + totalPoints
  };

  return {
    id: id ?? `hand-${now.getTime()}-${handNumber}`,
    handNumber,
    winner: input.winner,
    winType: input.winType,
    basePoints: input.basePoints,
    appliedPrize,
    appliedBonus,
    totalPoints,
    cumulativeScore,
    createdAt: now.toISOString()
  };
}

export function rescoreHands(preset: RulePreset, inputs: HandInput[], existingHands: Pick<ScoredHand, "id" | "createdAt">[] = []): ScoredHand[] {
  let totals = getInitialTotals();

  return inputs.map((input, index) => {
    const previous = existingHands[index];
    const scored = scoreHand({
      input,
      preset,
      priorTotals: totals,
      handNumber: index + 1,
      id: previous?.id,
      now: previous?.createdAt ? new Date(previous.createdAt) : new Date()
    });
    totals = scored.cumulativeScore;
    return scored;
  });
}

export function getCurrentTotals(game: Game): GameTotals {
  return game.hands.at(-1)?.cumulativeScore ?? getInitialTotals();
}

export function getWinner(totals: GameTotals, targetScore: number): TeamId | undefined {
  if (totals.US >= targetScore && totals.US >= totals.THEM) {
    return "US";
  }

  if (totals.THEM >= targetScore && totals.THEM >= totals.US) {
    return "THEM";
  }

  return undefined;
}

export function isChiva(totals: GameTotals, winner?: TeamId): boolean {
  if (!winner) {
    return false;
  }

  const loser = winner === "US" ? "THEM" : "US";
  return totals[loser] === 0;
}
