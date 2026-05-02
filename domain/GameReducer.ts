import { Game, createGame } from "./Game";
import { HandInput } from "./Hand";
import { getCurrentTotals, getWinner, rescoreHands, scoreHand } from "./ScoringEngine";
import { RulePreset, getDefaultPreset } from "./Rules";

export type GameAction =
  | { type: "HYDRATE_GAME"; game: Game }
  | { type: "START_GAME"; preset?: RulePreset }
  | { type: "ADD_HAND"; input: HandInput }
  | { type: "UNDO_LAST_HAND" }
  | { type: "EDIT_HAND"; handNumber: number; input: HandInput }
  | { type: "DELETE_HAND"; handNumber: number }
  | { type: "REOPEN_GAME" };

function finalizeStatus(game: Game): Game {
  const totals = getCurrentTotals(game);
  const winner = getWinner(totals, game.preset.targetScore);

  if (!winner) {
    return { ...game, status: "ACTIVE", completedAt: undefined };
  }

  return {
    ...game,
    status: "COMPLETED",
    completedAt: game.completedAt ?? new Date().toISOString()
  };
}

function rebuildGame(game: Game, inputs: HandInput[]): Game {
  return finalizeStatus({
    ...game,
    hands: rescoreHands(game.preset, inputs, game.hands)
  });
}

export function gameReducer(game: Game, action: GameAction): Game {
  switch (action.type) {
    case "HYDRATE_GAME":
      return action.game;
    case "START_GAME":
      return createGame(action.preset ?? getDefaultPreset());
    case "ADD_HAND": {
      if (game.status === "COMPLETED") {
        return game;
      }

      const scored = scoreHand({
        input: action.input,
        preset: game.preset,
        priorTotals: getCurrentTotals(game),
        handNumber: game.hands.length + 1
      });

      return finalizeStatus({ ...game, hands: [...game.hands, scored] });
    }
    case "UNDO_LAST_HAND":
      return rebuildGame(game, game.hands.slice(0, -1));
    case "EDIT_HAND":
      return rebuildGame(
        game,
        game.hands.map((hand) => (hand.handNumber === action.handNumber ? action.input : hand))
      );
    case "DELETE_HAND":
      return rebuildGame(
        game,
        game.hands.filter((hand) => hand.handNumber !== action.handNumber)
      );
    case "REOPEN_GAME":
      return { ...game, status: "ACTIVE", completedAt: undefined };
    default:
      return game;
  }
}
