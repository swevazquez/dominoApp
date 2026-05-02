import { createGame } from "@domain/Game";
import { gameReducer } from "@domain/GameReducer";
import { formatShareText, shouldShowSpecialWinHighlights } from "@domain/GameSummary";
import { getCurrentTotals, getWinner, isChiva, scoreHand, ScoringError } from "@domain/ScoringEngine";
import { BUILT_IN_PRESETS, getDefaultPreset } from "@domain/Rules";

const defaultPreset = getDefaultPreset();
const conPremio = BUILT_IN_PRESETS.find((preset) => preset.id === "con-premio-500")!;
const bonusPreset = { ...defaultPreset, capicuEnabled: true, chuchazoEnabled: true };

describe("ScoringEngine", () => {
  it("scores a normal hand without prize or bonus", () => {
    const result = scoreHand({
      input: { winner: "US", winType: "NORMAL", basePoints: 25 },
      handNumber: 1,
      preset: defaultPreset
    });

    expect(result.totalPoints).toBe(25);
    expect(result.appliedBonus).toBe(0);
    expect(result.appliedPrize).toBe(0);
    expect(result.cumulativeScore.US).toBe(25);
  });

  it("applies Capicu bonus", () => {
    const result = scoreHand({
      input: { winner: "US", winType: "CAPICU", basePoints: 25 },
      handNumber: 1,
      preset: bonusPreset
    });

    expect(result.totalPoints).toBe(125);
    expect(result.appliedBonus).toBe(100);
  });

  it("applies Chuchazo bonus", () => {
    const result = scoreHand({
      input: { winner: "THEM", winType: "CHUCHAZO", basePoints: 30 },
      handNumber: 1,
      preset: bonusPreset
    });

    expect(result.totalPoints).toBe(130);
    expect(result.cumulativeScore.THEM).toBe(130);
  });

  it("applies Con Premio prizes only to the first four hands", () => {
    const expectedPrizes = [100, 75, 50, 25, 0];

    expectedPrizes.forEach((expectedPrize, index) => {
      const result = scoreHand({
        input: { winner: "US", winType: "NORMAL", basePoints: 10 },
        handNumber: index + 1,
        preset: conPremio
      });

      expect(result.appliedPrize).toBe(expectedPrize);
      expect(result.totalPoints).toBe(10 + expectedPrize);
    });
  });

  it("applies Capicu and prize correctly on hand 1", () => {
    const result = scoreHand({
      input: { winner: "US", winType: "CAPICU", basePoints: 25 },
      handNumber: 1,
      preset: conPremio
    });

    expect(result.totalPoints).toBe(25 + 100 + 100);
  });

  it("scores Tranque using selected winner and entered points", () => {
    const result = scoreHand({
      input: { winner: "THEM", winType: "TRANQUE", basePoints: 40 },
      handNumber: 2,
      preset: defaultPreset
    });

    expect(result.totalPoints).toBe(40);
    expect(result.cumulativeScore.THEM).toBe(40);
  });

  it("rejects invalid hand entries", () => {
    expect(() =>
      scoreHand({
        input: { winner: "US", winType: "NORMAL", basePoints: -1 },
        handNumber: 1,
        preset: defaultPreset
      })
    ).toThrow(ScoringError);
  });

  it("respects disabled Capicu and Chuchazo settings", () => {
    expect(() =>
      scoreHand({
        input: { winner: "US", winType: "CAPICU", basePoints: 25 },
        handNumber: 1,
        preset: defaultPreset
      })
    ).toThrow("Capicu is disabled");

    expect(() =>
      scoreHand({
        input: { winner: "US", winType: "CHUCHAZO", basePoints: 25 },
        handNumber: 1,
        preset: defaultPreset
      })
    ).toThrow("Chuchazo is disabled");
  });
});

describe("game lifecycle", () => {
  it("defaults to a 200-point no-prize game", () => {
    const game = createGame(defaultPreset);

    expect(game.preset.targetScore).toBe(200);
    expect(game.preset.prizeEnabled).toBe(false);
    expect(game.preset.capicuEnabled).toBe(false);
    expect(game.preset.chuchazoEnabled).toBe(false);
  });

  it("ends the game when target score is reached", () => {
    let game = createGame(bonusPreset);
    game = gameReducer(game, { type: "ADD_HAND", input: { winner: "US", winType: "NORMAL", basePoints: 200 } });

    expect(game.status).toBe("COMPLETED");
    expect(getWinner(getCurrentTotals(game), game.preset.targetScore)).toBe("US");
  });

  it("blocks adding hands to completed games", () => {
    let game = createGame(defaultPreset);
    game = gameReducer(game, { type: "ADD_HAND", input: { winner: "US", winType: "NORMAL", basePoints: 200 } });
    game = gameReducer(game, { type: "ADD_HAND", input: { winner: "THEM", winType: "NORMAL", basePoints: 50 } });

    expect(game.hands).toHaveLength(1);
    expect(getCurrentTotals(game)).toEqual({ US: 200, THEM: 0 });
  });

  it("detects Chiva automatically", () => {
    const totals = { US: 200, THEM: 0 };

    expect(isChiva(totals, "US")).toBe(true);
  });

  it("undoes the last hand and recalculates totals", () => {
    let game = createGame(defaultPreset);
    game = gameReducer(game, { type: "ADD_HAND", input: { winner: "US", winType: "NORMAL", basePoints: 40 } });
    game = gameReducer(game, { type: "ADD_HAND", input: { winner: "THEM", winType: "NORMAL", basePoints: 20 } });
    game = gameReducer(game, { type: "UNDO_LAST_HAND" });

    expect(game.hands).toHaveLength(1);
    expect(getCurrentTotals(game)).toEqual({ US: 40, THEM: 0 });
  });

  it("edits a prior hand and recalculates subsequent totals", () => {
    let game = createGame(bonusPreset);
    game = gameReducer(game, { type: "ADD_HAND", input: { winner: "US", winType: "NORMAL", basePoints: 40 } });
    game = gameReducer(game, { type: "ADD_HAND", input: { winner: "THEM", winType: "NORMAL", basePoints: 20 } });
    game = gameReducer(game, { type: "EDIT_HAND", handNumber: 1, input: { winner: "US", winType: "CAPICU", basePoints: 40 } });

    expect(game.hands[0].totalPoints).toBe(140);
    expect(game.hands[1].cumulativeScore).toEqual({ US: 140, THEM: 20 });
  });

  it("deletes a prior hand and renumbers remaining hands", () => {
    let game = createGame(defaultPreset);
    game = gameReducer(game, { type: "ADD_HAND", input: { winner: "US", winType: "NORMAL", basePoints: 40 } });
    game = gameReducer(game, { type: "ADD_HAND", input: { winner: "THEM", winType: "NORMAL", basePoints: 20 } });
    game = gameReducer(game, { type: "DELETE_HAND", handNumber: 1 });

    expect(game.hands).toHaveLength(1);
    expect(game.hands[0].handNumber).toBe(1);
    expect(getCurrentTotals(game)).toEqual({ US: 0, THEM: 20 });
  });

  it("omits special-win highlights from 200-point share summaries", () => {
    const game = {
      ...createGame({ ...defaultPreset, capicuEnabled: true, chuchazoEnabled: true }),
      status: "COMPLETED" as const,
      hands: [
        {
          id: "hand-1",
          handNumber: 1,
          winner: "US" as const,
          winType: "CAPICU" as const,
          basePoints: 200,
          appliedBonus: 0,
          appliedPrize: 0,
          totalPoints: 200,
          cumulativeScore: { US: 200, THEM: 0 },
          createdAt: "2026-05-02T00:00:00.000Z"
        }
      ]
    };

    const text = formatShareText(game);

    expect(shouldShowSpecialWinHighlights(game.preset)).toBe(false);
    expect(text).not.toContain("Capicu");
    expect(text).not.toContain("Chuchazo");
    expect(text).toContain("Chiva");
  });
});
