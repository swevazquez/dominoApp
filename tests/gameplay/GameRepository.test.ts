import { GameRepository } from "@data/GameRepository";
import { StorageAdapter } from "@data/LocalStorage";
import { createGame } from "@domain/Game";
import { getDefaultPreset } from "@domain/Rules";

class MemoryStorage implements StorageAdapter {
  private values = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    return this.values.get(key) ?? null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.values.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.values.delete(key);
  }
}

describe("GameRepository", () => {
  it("persists and reloads the active game", async () => {
    const repository = new GameRepository(new MemoryStorage());
    const game = createGame(getDefaultPreset(), new Date("2026-05-01T12:00:00Z"));

    await repository.saveActiveGame(game);

    await expect(repository.loadActiveGame()).resolves.toEqual(game);
  });

  it("saves completed games newest first without duplicates", async () => {
    const repository = new GameRepository(new MemoryStorage());
    const first = createGame(getDefaultPreset(), new Date("2026-05-01T12:00:00Z"));
    const second = createGame(getDefaultPreset(), new Date("2026-05-01T13:00:00Z"));

    await repository.saveCompletedGame(first);
    await repository.saveCompletedGame(second);
    await repository.saveCompletedGame(first);

    const games = await repository.loadCompletedGames();
    expect(games.map((game) => game.id)).toEqual([first.id, second.id]);
  });
});
