export interface GameActivity {
  isPlaying: boolean;
  gameName: string;
  details?: string;
  state?: string;
  icon?: string;
  largeImage?: string;
  smallImage?: string;
  elapsedMs?: number;
  startTimestamp?: number;
}

export interface GamesConfig {
  enabled: boolean;
  lanyardUserId?: string;
}

interface DiscordActivity {
  type?: number;
  name?: string;
  details?: string;
  state?: string;
  timestamps?: { start?: number };
  assets?: { large_image?: string; small_image?: string };
  application_id?: string;
  icon?: string;
}

interface LanyardResponse {
  success?: boolean;
  data?: { activities?: DiscordActivity[] };
}

interface RawgResponse {
  results?: Array<{ background_image?: string | null }>;
}

export const GAMES_CONFIG: GamesConfig = {
  enabled: false,
  lanyardUserId: "your_discord_id",
};

const gameIconCache: Record<string, string> = {};

export async function fetchGameIconByName(gameName: string): Promise<string> {
  if (!gameName) return "";
  const key = gameName.toLowerCase().trim();
  if (gameIconCache[key]) return gameIconCache[key];

  try {
    const res = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(gameName)}&key=c5425b741b0b4317a7885b0d02ae7e74&page_size=1`);
    const data = (await res.json()) as RawgResponse;
    const image = data.results?.[0]?.background_image;
    if (image) {
      gameIconCache[key] = image;
      return image;
    }
  } catch {
    // Network errors are handled by returning an empty icon.
  }

  return "";
}

export function parseGameAsset(game: DiscordActivity | null | undefined): string {
  if (!game) return "";

  const asset = game.assets?.large_image || game.assets?.small_image;
  if (asset) {
    if (asset.startsWith("spotify:")) return `https://i.scdn.co/image/${asset.replace("spotify:", "")}`;
    if (asset.startsWith("mp:external/")) return `https://media.discordapp.net/external/${asset.replace("mp:external/", "")}`;
    if (asset.startsWith("external/")) {
      const match = asset.match(/https?\/.*/);
      if (match) return `https://${match[0].replace(/^https?\//, "")}`;
    }
    if (game.application_id) return `https://cdn.discordapp.com/app-assets/${game.application_id}/${asset}.png`;
  }

  if (game.icon && game.application_id) {
    return `https://cdn.discordapp.com/app-icons/${game.application_id}/${game.icon}.png`;
  }

  const knownGameIcons: Record<string, string> = {
    roblox: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmHAHSmS08T6uotljZiAy9SkzIqJG7DSxecb7BSMhJGw&s=10",
    minecraft: "https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover_art.png",
    valorant: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Valorant_logo_-_symbol_only.svg",
    "league of legends": "https://upload.wikimedia.org/wikipedia/commons/d/d8/League_of_Legends_2019_vector.svg",
    "grand theft auto": "https://upload.wikimedia.org/wikipedia/commons/5/53/Grand_Theft_Auto_V_Logo.svg",
    "gta v": "https://upload.wikimedia.org/wikipedia/commons/5/53/Grand_Theft_Auto_V_Logo.svg",
    fortnite: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Fortnite_F_lettermark_logo.svg",
    "counter-strike": "https://upload.wikimedia.org/wikipedia/commons/8/87/Counter-Strike_2_logo.svg",
    genshin: "https://upload.wikimedia.org/wikipedia/en/5/5d/Genshin_Impact_logo.svg",
    overwatch: "https://upload.wikimedia.org/wikipedia/commons/5/55/Overwatch_circle_logo.svg",
    rocket: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Rocket_League_cover_art.jpg",
  };

  const nameLower = (game.name || "").toLowerCase().trim();
  return Object.entries(knownGameIcons).find(([key]) => nameLower.includes(key))?.[1] || "";
}

export async function getLiveGameActivity(): Promise<GameActivity | null> {
  if (!GAMES_CONFIG.lanyardUserId) return null;

  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${GAMES_CONFIG.lanyardUserId}`);
    const data = (await res.json()) as LanyardResponse;
    const game = data.data?.activities?.find(
      (activity) => activity.type === 0 && activity.name?.toLowerCase() !== "spotify",
    );
    if (!data.success || !game?.name) return null;

    const now = Date.now();
    const start = game.timestamps?.start || now;
    const largeImage = await fetchGameIconByName(game.name).then((fallback) => parseGameAsset(game) || fallback);

    return {
      isPlaying: true,
      gameName: game.name,
      details: game.details || "In Game",
      state: game.state || "",
      largeImage,
      startTimestamp: start,
      elapsedMs: Math.max(0, now - start),
    };
  } catch {
    return null;
  }
}
