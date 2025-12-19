import type {
  ChartRow,
  GenerationUpdatePayload,
  PopulationData,
  StrategySummary,
} from '@/types';

// Segédfüggvény az új súlyok átlagolásához
const avgWeights = (population: StrategySummary[]) => {
  let n = 0;

  // Inicializáljuk a gyűjtőváltozókat az ÚJ struktúra szerint
  let center = 0,
    randomness = 0;

  // Támadás (Saját sorok)
  let myLine2 = 0,
    myLine3 = 0,
    myLine4 = 0;

  // Védekezés (Blokkolás)
  let blockLine2 = 0,
    blockLine3 = 0,
    blockLine4 = 0;

  for (const s of population) {
    if (!s.weights) continue;

    // Összegezzük az értékeket (biztonságos hozzáféréssel)
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

  // Átlagok kiszámítása
  const div = n > 0 ? n : 1; // Osztás nullával védelem

  return {
    avgCenter: center / div,
    avgRandomness: randomness / div,

    // Új metrikák a grafikonhoz
    avgMyLine2: myLine2 / div,
    avgMyLine3: myLine3 / div,
    avgMyLine4: myLine4 / div,

    avgBlockLine2: blockLine2 / div,
    avgBlockLine3: blockLine3 / div,
    avgBlockLine4: blockLine4 / div,
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
      ...avgWeights(p.population), // Itt hívjuk meg az új logikát
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
