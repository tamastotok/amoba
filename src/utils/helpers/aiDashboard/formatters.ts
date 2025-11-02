import type {
  ChartRow,
  GenerationUpdatePayload,
  PopulationData,
} from '@/types';

export const formatPopulations = (populations: PopulationData[]): ChartRow[] =>
  populations.map((p) => {
    const fitnessValues = p.population.map((s) => s.fitness);
    const wins = p.population.filter((s) => s.result === 'win').length;
    const avgFitness =
      fitnessValues.reduce((a, b) => a + b, 0) /
      Math.max(fitnessValues.length, 1);
    const bestFitness = Math.max(...fitnessValues);
    const worstFitness = Math.min(...fitnessValues);
    const winRate = (wins / Math.max(p.population.length, 1)) * 100;

    return {
      generation: p.generation,
      avgFitness,
      bestFitness,
      worstFitness,
      winRate,
    };
  });

export const formatGeneration = (gen: GenerationUpdatePayload): ChartRow => {
  const fitnessValues = gen.population.map((s) => s.fitness);
  const avgFitness =
    fitnessValues.reduce((a, b) => a + b, 0) /
    Math.max(fitnessValues.length, 1);
  const bestFitness = Math.max(...fitnessValues);
  const worstFitness = Math.min(...fitnessValues);
  const wins = gen.population.filter((s) => s.result === 'win').length;
  const winRate = (wins / Math.max(gen.population.length, 1)) * 100;

  return {
    generation: gen.generation,
    avgFitness,
    bestFitness,
    worstFitness,
    winRate,
  };
};
