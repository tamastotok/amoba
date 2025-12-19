import type {
  ChartRow,
  GenerationUpdatePayload,
  PopulationData,
  StrategySummary,
} from '@/types';

const avgWeights = (population: StrategySummary[]) => {
  let n = 0;
  let attack = 0,
    defense = 0,
    center = 0,
    randomness = 0;

  for (const s of population) {
    if (!s.weights) continue;
    attack += s.weights.attack;
    defense += s.weights.defense;
    center += s.weights.center;
    randomness += s.weights.randomness;
    n++;
  }

  return {
    avgAttack: n ? attack / n : 0,
    avgDefense: n ? defense / n : 0,
    avgCenter: n ? center / n : 0,
    avgRandomness: n ? randomness / n : 0,
  };
};

export const formatPopulations = (populations: PopulationData[]): ChartRow[] =>
  populations.map((p) => {
    const fitnessValues = p.population.map((s) => s.fitness);

    const avgFitness =
      fitnessValues.reduce((a, b) => a + b, 0) /
      Math.max(fitnessValues.length, 1);

    const bestFitness = fitnessValues.length ? Math.max(...fitnessValues) : 0;
    const worstFitness = fitnessValues.length ? Math.min(...fitnessValues) : 0;

    const games = p.stats?.games ?? 0;
    const wins = p.stats?.wins ?? 0;
    const winRate = games > 0 ? (wins / games) * 100 : 0;

    return {
      generation: p.generation,
      avgFitness,
      bestFitness,
      worstFitness,
      winRate,
      ...avgWeights(p.population),
    };
  });

export const formatGeneration = (gen: GenerationUpdatePayload): ChartRow => {
  const fitnessValues = gen.population.map((s) => s.fitness);

  const avgFitness =
    fitnessValues.reduce((a, b) => a + b, 0) /
    Math.max(fitnessValues.length, 1);

  const bestFitness = fitnessValues.length ? Math.max(...fitnessValues) : 0;
  const worstFitness = fitnessValues.length ? Math.min(...fitnessValues) : 0;

  const games = gen.stats?.games ?? 0;
  const wins = gen.stats?.wins ?? 0;
  const winRate = games > 0 ? (wins / games) * 100 : 0;

  return {
    generation: gen.generation,
    avgFitness,
    bestFitness,
    worstFitness,
    winRate,
    ...avgWeights(gen.population),
  };
};
