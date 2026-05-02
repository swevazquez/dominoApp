import { Game } from "@domain/Game";
import { StorageAdapter, localStorage } from "./LocalStorage";

const ACTIVE_GAME_KEY = "domino.activeGame";
const COMPLETED_GAMES_KEY = "domino.completedGames";

export class GameRepository {
  constructor(private readonly storage: StorageAdapter = localStorage) {}

  async loadActiveGame(): Promise<Game | undefined> {
    const raw = await this.storage.getItem(ACTIVE_GAME_KEY);
    return raw ? (JSON.parse(raw) as Game) : undefined;
  }

  async saveActiveGame(game: Game): Promise<void> {
    await this.storage.setItem(ACTIVE_GAME_KEY, JSON.stringify(game));
  }

  async clearActiveGame(): Promise<void> {
    await this.storage.removeItem(ACTIVE_GAME_KEY);
  }

  async loadCompletedGames(): Promise<Game[]> {
    const raw = await this.storage.getItem(COMPLETED_GAMES_KEY);
    return raw ? (JSON.parse(raw) as Game[]) : [];
  }

  async saveCompletedGame(game: Game): Promise<void> {
    const games = await this.loadCompletedGames();
    const nextGames = [game, ...games.filter((existing) => existing.id !== game.id)];
    await this.storage.setItem(COMPLETED_GAMES_KEY, JSON.stringify(nextGames));
  }
}
