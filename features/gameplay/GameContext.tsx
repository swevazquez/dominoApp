import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { Alert } from "react-native";
import { GameRepository } from "@data/GameRepository";
import { Game, createGame } from "@domain/Game";
import { gameReducer, GameAction } from "@domain/GameReducer";
import { getDefaultPreset } from "@domain/Rules";

type GameContextValue = {
  game: Game;
  completedGames: Game[];
  dispatch: (action: GameAction) => void;
  loadHistory: () => Promise<void>;
};

const GameContext = createContext<GameContextValue | undefined>(undefined);
const repository = new GameRepository();

export function GameProvider({ children }: { children: ReactNode }) {
  const [game, baseDispatch] = useReducer(gameReducer, createGame(getDefaultPreset()));
  const [completedGames, setCompletedGames] = useState<Game[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function hydrate() {
      try {
        const [storedGame, storedCompleted] = await Promise.all([
          repository.loadActiveGame(),
          repository.loadCompletedGames()
        ]);
        if (!mounted) {
          return;
        }
        if (storedGame) {
          baseDispatch({ type: "HYDRATE_GAME", game: storedGame });
        }
        setCompletedGames(storedCompleted);
      } catch {
        Alert.alert("Storage error", "Saved game data could not be loaded.");
      } finally {
        if (mounted) {
          setHydrated(true);
        }
      }
    }
    hydrate();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    async function persistGame() {
      try {
        await repository.saveActiveGame(game);
        if (game.status === "COMPLETED") {
          await repository.saveCompletedGame(game);
          setCompletedGames(await repository.loadCompletedGames());
        }
      } catch {
        Alert.alert("Save failed", "The app preserved the current screen. Try the action again.");
      }
    }

    persistGame();
  }, [game, hydrated]);

  const dispatch = useCallback((action: GameAction) => {
    baseDispatch(action);
  }, []);

  const loadHistory = useCallback(async () => {
    setCompletedGames(await repository.loadCompletedGames());
  }, []);

  const value = useMemo(
    () => ({ game, completedGames, dispatch, loadHistory }),
    [completedGames, dispatch, game, loadHistory]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameContext(): GameContextValue {
  const value = useContext(GameContext);
  if (!value) {
    throw new Error("useGameContext must be used inside GameProvider");
  }
  return value;
}
