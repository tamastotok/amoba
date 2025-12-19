import type {
  ChartRow,
  GenerationUpdatePayload,
  PopulationData,
  StrategySummary,
} from '@/types';

// Round a number to 2 decimal places
const round2 = (n: number) => Number(n.toFixed(2));

// Calculate average strategy weights for a generation
const avgWeights = (population: StrategySummary[]) => {
  let n = 0;

  // Base behavior weights
  let center = 0;
  let randomness = 0;

  // Offensive metrics (own lines)
  let myLine2 = 0;
  let myLine3 = 0;
  let myLine4 = 0;

  // Defensive metrics (blocking opponent)
  let blockLine2 = 0;
  let blockLine3 = 0;
  let blockLine4 = 0;

  for (const s of population) {
    if (!s.weights) continue;

    // Accumulate weights (safe access)
    center += s.weights.center ?? 0;
    randomness += s.weights.randomness ?? 0;

    myLine2 += s.weights.myLine2 ?? 0;
    myLine3 += s.weights.myLine3 ?? 0;
    myLine4 += s.weights.myLine4 ?? 0;

    blockLine2 += s.weights.blockLine2 ?? 0;
    blockLine3 += s.weights.blockLine3 ?? 0;
    blockLine4 += s.weights.blockLine4 ?? 0;

    n++;
  }

  // Prevent division by zero
  const div = n > 0 ? n : 1;

  return {
    avgCenter: round2(center / div),
    avgRandomness: round2(randomness / div),

    // Aggregated offensive behavior
    avgMyLine2: round2(myLine2 / div),
    avgMyLine3: round2(myLine3 / div),
    avgMyLine4: round2(myLine4 / div),

    // Aggregated defensive behavior
    avgBlockLine2: round2(blockLine2 / div),
    avgBlockLine3: round2(blockLine3 / div),
    avgBlockLine4: round2(blockLine4 / div),
  };
};

// Format historical population data (REST API)
export const formatPopulations = (populations: PopulationData[]): ChartRow[] =>
  populations.map((p) => {
    const fitnessValues = p.population.map((s) => s.fitness);

    const avgFitness = round2(
      fitnessValues.reduce((a, b) => a + b, 0) /
        Math.max(fitnessValues.length, 1)
    );

    const bestFitness = fitnessValues.length
      ? round2(Math.max(...fitnessValues))
      : 0;

    const worstFitness = fitnessValues.length
      ? round2(Math.min(...fitnessValues))
      : 0;

    const games = p.stats?.games ?? 0;
    const wins = p.stats?.wins ?? 0;
    const winRate = round2(games > 0 ? (wins / games) * 100 : 0);

    return {
      generation: p.generation,
      avgFitness,
      bestFitness,
      worstFitness,
      winRate,
      ...avgWeights(p.population), // Apply weight aggregation
    };
  });

// Format a single generation update (Socket.io event)
export const formatGeneration = (gen: GenerationUpdatePayload): ChartRow => {
  const fitnessValues = gen.population.map((s) => s.fitness);

  const avgFitness = round2(
    fitnessValues.reduce((a, b) => a + b, 0) / Math.max(fitnessValues.length, 1)
  );

  const bestFitness = fitnessValues.length
    ? round2(Math.max(...fitnessValues))
    : 0;

  const worstFitness = fitnessValues.length
    ? round2(Math.min(...fitnessValues))
    : 0;

  const games = gen.stats?.games ?? 0;
  const wins = gen.stats?.wins ?? 0;
  const winRate = round2(games > 0 ? (wins / games) * 100 : 0);

  return {
    generation: gen.generation,
    avgFitness,
    bestFitness,
    worstFitness,
    winRate,
    ...avgWeights(gen.population),
  };
};
