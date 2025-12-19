export type Result = 'win' | 'loss' | 'draw';

// FRISSÍTVE: Az új génkészlet definíciója
export interface Weights {
  center: number;
  randomness: number;

  // Támadás (Saját sorok)
  myLine2: number;
  myLine3: number;
  myLine4: number;

  // Védekezés (Blokkolás)
  blockLine2: number;
  blockLine3: number;
  blockLine4: number;
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
    draw: number; // Figyelem: a backendben 'draws' van, itt 'draw'? Érdemes egységesíteni!
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

// FRISSÍTVE: A grafikon sorainak új mezői
export interface ChartRow {
  generation: number;
  avgFitness: number;
  bestFitness: number;
  worstFitness: number;
  winRate?: number;

  // Új átlagok
  avgCenter?: number;
  avgRandomness?: number;

  avgMyLine2?: number;
  avgMyLine3?: number;
  avgMyLine4?: number;

  avgBlockLine2?: number;
  avgBlockLine3?: number;
  avgBlockLine4?: number;
}
