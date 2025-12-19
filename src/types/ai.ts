export type Result = 'win' | 'loss' | 'draw';

export interface Weights {
  attack: number;
  defense: number;
  center: number;
  randomness: number;
}

export interface StrategySummary {
  id: string;
  fitness: number;
  wins?: number;
  losses?: number;
  draws?: number;
  weights?: Weights;
}

export interface GenerationUpdatePayload {
  generation: number;
  population: StrategySummary[];
  timestamp: string;
  stats: {
    wins: number;
    losses: number;
    draw: number;
    games: number;
  };
}

export interface ServerToClientEvents {
  'ai-generation-update': (data: GenerationUpdatePayload) => void;
}

export interface PopulationData {
  generation: number;
  population: StrategySummary[];
  stats: {
    wins: number;
    losses: number;
    draw: number;
    games: number;
  };
}

export interface ChartRow {
  generation: number;
  avgFitness: number;
  bestFitness: number;
  worstFitness: number;
  winRate?: number;
  avgAttack?: number;
  avgDefense?: number;
  avgCenter?: number;
  avgRandomness?: number;
}
