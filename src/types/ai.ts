export type Result = 'win' | 'loss' | 'draw';

export interface StrategySummary {
  fitness: number;
  result?: Result;
}

export interface GenerationUpdatePayload {
  generation: number;
  population: StrategySummary[];
  timestamp: string;
}

export interface ServerToClientEvents {
  'ai-generation-update': (data: GenerationUpdatePayload) => void;
}

export interface PopulationData {
  generation: number;
  population: StrategySummary[];
}

export interface ChartRow {
  generation: number;
  avgFitness: number;
  bestFitness: number;
  worstFitness: number;
  winRate?: number;
}
