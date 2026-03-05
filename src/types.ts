export interface Participant {
  id: string;
  name: string;
}

export interface Cell {
  id: number;
  hasCoffee: boolean;
  revealed: boolean;
}

export interface GameConfig {
  participants: Participant[];
  gridSize: number;
  coffeeCount: number;
}

export type GamePhase = 'setup' | 'playing' | 'result';
