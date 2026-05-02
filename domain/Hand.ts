import { TeamId, WinType } from "./Rules";

export type HandInput = {
  winner: TeamId;
  winType: WinType;
  basePoints: number;
};

export type ScoredHand = HandInput & {
  id: string;
  handNumber: number;
  appliedPrize: number;
  appliedBonus: number;
  totalPoints: number;
  cumulativeScore: Record<TeamId, number>;
  createdAt: string;
};
