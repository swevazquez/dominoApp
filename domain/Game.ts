import { ScoredHand } from "./Hand";
import { DEFAULT_TEAMS, GameStatus, RulePreset, Team, TeamId } from "./Rules";

export type Game = {
  id: string;
  preset: RulePreset;
  teams: Record<TeamId, Team>;
  hands: ScoredHand[];
  status: GameStatus;
  createdAt: string;
  completedAt?: string;
};

export type GameTotals = Record<TeamId, number>;

export function createGame(preset: RulePreset, now = new Date()): Game {
  return {
    id: `game-${now.getTime()}`,
    preset,
    teams: DEFAULT_TEAMS,
    hands: [],
    status: "ACTIVE",
    createdAt: now.toISOString()
  };
}

export function getInitialTotals(): GameTotals {
  return { US: 0, THEM: 0 };
}
