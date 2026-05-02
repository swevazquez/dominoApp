export type TeamId = "US" | "THEM";
export type WinType = "NORMAL" | "CAPICU" | "CHUCHAZO" | "TRANQUE";
export type GameStatus = "ACTIVE" | "COMPLETED";
export type TranqueMode = "TEAM";

export type Team = {
  label: "Us" | "Them";
  playerNames?: string[];
};

export type RulePreset = {
  id: string;
  name: string;
  targetScore: number;
  prizeEnabled: boolean;
  prizeByHand: number[];
  capicuEnabled: boolean;
  chuchazoEnabled: boolean;
  capicuBonus: number;
  chuchazoBonus: number;
  tranqueMode: TranqueMode;
  isDefault?: boolean;
};

export const DEFAULT_TEAMS: Record<TeamId, Team> = {
  US: { label: "Us" },
  THEM: { label: "Them" }
};

export const BUILT_IN_PRESETS: RulePreset[] = [
  {
    id: "to-200-no-prize",
    name: "To 200 (No Prize)",
    targetScore: 200,
    prizeEnabled: false,
    prizeByHand: [],
    capicuEnabled: false,
    chuchazoEnabled: false,
    capicuBonus: 100,
    chuchazoBonus: 100,
    tranqueMode: "TEAM",
    isDefault: true
  },
  {
    id: "con-premio-500",
    name: "Con Premio (500)",
    targetScore: 500,
    prizeEnabled: true,
    prizeByHand: [100, 75, 50, 25],
    capicuEnabled: true,
    chuchazoEnabled: true,
    capicuBonus: 100,
    chuchazoBonus: 100,
    tranqueMode: "TEAM"
  }
];

export function getDefaultPreset(): RulePreset {
  return BUILT_IN_PRESETS[0];
}

export function getPresetById(id: string): RulePreset {
  return BUILT_IN_PRESETS.find((preset) => preset.id === id) ?? getDefaultPreset();
}
