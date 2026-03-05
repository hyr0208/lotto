export interface Player {
  id: string;
  name: string;
  order: number;
}

export interface Cell {
  id: number;
  hasCoffee: boolean;
  revealed: boolean;
}

export interface RoomConfig {
  gridSize: number;
  coffeeCount: number;
}

export interface Room {
  hostId: string;
  phase: GamePhase;
  config: RoomConfig;
  players: Record<string, Player>;
  cells: Cell[];
  currentPlayerIndex: number;
  loserId: string | null;
  turnStartedAt: number | null;
  createdAt: number;
}

export type GamePhase = "lobby" | "playing" | "result";

// 이전 호환용 (deprecated)
export interface Participant {
  id: string;
  name: string;
}

export interface GameConfig {
  participants: Participant[];
  gridSize: number;
  coffeeCount: number;
}
