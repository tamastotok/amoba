export type DefaultMark = 'X' | 'O';
export type Mark = 'X' | 'O';
export type Cell = Mark | '';
export type Board = Cell[][];

interface SinglePlayer {
  name: string;
  mark: DefaultMark;
}

export interface Players {
  blue: SinglePlayer;
  red: SinglePlayer;
}

export interface Marks {
  starterMark: DefaultMark;
  nextMark: DefaultMark;
  playerMark: DefaultMark;
}

//  Default Redux Action
export interface Action<T = unknown> {
  type: string;
  payload: T;
}

export interface Reducers {
  players: Players;
  marks: Marks;
  square: Board;
  gridSize: number;
  winner: string;
  gridIsDisabled: boolean;
}

export interface SearchingPayload {
  playerMark: string;
  starterMark: string;
}

export interface GameFoundPayload {
  roomId: string;
  playerData: {
    blueName: string;
    redName: string;
  };
}

export interface ContinuePayload {
  boardSize: number;
  bluePlayer: { name: string };
  redPlayer: { name: string };
  whoIsNext: string;
  roomId: string;
  positions: Array<{ row: number; col: number; value: string }>;
}

export interface GameEndedPayload {
  winner: string;
}

export interface OpponentLeftPayload {
  message: string;
  roomId: string;
}

// --- AI-related shared types ---

// Possible result outcomes for a strategy
export type Result = 'win' | 'loss' | 'draw';

// A single AI strategy (from evolution population)
export interface StrategySummary {
  fitness: number;
  result?: Result;
}

// Payload received from backend when a new generation evolves
export interface GenerationUpdatePayload {
  generation: number;
  population: StrategySummary[];
  timestamp: string;
}

// Socket.IO server → client events
export interface ServerToClientEvents {
  'ai-generation-update': (data: GenerationUpdatePayload) => void;
}

// A population structure fetched from the REST API
export interface PopulationData {
  generation: number;
  population: StrategySummary[];
}

// Chart row structure (for Recharts)
export interface ChartRow {
  generation: number;
  avgFitness: number;
  bestFitness: number;
  worstFitness: number;
  winRate?: number;
}
