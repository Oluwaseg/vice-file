export type PlayerRole = "street-racer" | "nightclub-owner" | "fixer";

export type Player = {
  alias: string;
  role: PlayerRole;
  neighbourhood: string;
  portraitDataUrl: string;
  createdAt: string;
};

const PLAYER_KEY = "vice-files:v1:player";

export function savePlayer(player: Player) {
  window.localStorage.setItem(PLAYER_KEY, JSON.stringify(player));
}

export function readPlayer(): Player | null {
  try {
    const stored = window.localStorage.getItem(PLAYER_KEY);
    if (!stored) return null;
    const player = JSON.parse(stored) as Partial<Player>;
    if (!player.alias || !player.role || !player.neighbourhood || !player.portraitDataUrl) {
      return null;
    }
    return player as Player;
  } catch {
    return null;
  }
}
