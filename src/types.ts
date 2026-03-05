export interface Participant {
  id: string;
  name: string;
}

export interface DrawConfig {
  title: string;
  description: string;
  participants: Participant[];
  winnerCount: number;
}

export type DrawPhase = 'setup' | 'drawing' | 'result';
