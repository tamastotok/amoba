import { useEffect, useState } from 'react';
import { TextField, Slider } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type {
  ChartRow,
  PopulationData,
  GenerationUpdatePayload,
  ServerToClientEvents,
} from '../../types';
import { io, Socket } from 'socket.io-client';
import Button from '../../components/Button/Button';

const socket: Socket<ServerToClientEvents> = io();

function AIDashboard() {
  const [data, setData] = useState<ChartRow[]>([]);
  const [filteredData, setFilteredData] = useState<ChartRow[]>([]);
  const [range, setRange] = useState<number[]>([0, 0]);
  const [customStart, setCustomStart] = useState<number | ''>('');
  const [customEnd, setCustomEnd] = useState<number | ''>('');

  useEffect(() => {
    // Initial fetch for full history
    fetch('/api/ai/progress')
      .then((res) => res.json())
      .then((populations: PopulationData[]) => {
        const formatted: ChartRow[] = populations.map((p) => {
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

        setData(formatted);
        setFilteredData(formatted);
        setRange([1, formatted.length || 1]);
      })
      .catch((err) => console.error('Failed to load AI progress:', err));

    // Realtime updates with strict typing
    const onGenUpdate = (newGenData: GenerationUpdatePayload) => {
      const fitnessValues = newGenData.population.map((s) => s.fitness);
      const avgFitness =
        fitnessValues.reduce((a, b) => a + b, 0) /
        Math.max(fitnessValues.length, 1);
      const bestFitness = Math.max(...fitnessValues);
      const worstFitness = Math.min(...fitnessValues);
      const wins = newGenData.population.filter(
        (s) => s.result === 'win'
      ).length;
      const winRate = (wins / Math.max(newGenData.population.length, 1)) * 100;

      const newEntry: ChartRow = {
        generation: newGenData.generation,
        avgFitness,
        bestFitness,
        worstFitness,
        winRate,
      };

      setData((prev) => [...prev, newEntry]);
      setFilteredData((prev) => [...prev, newEntry]);
      setRange(([start, end]) => [start || 1, (end || 0) + 1]);
    };

    socket.on('ai-generation-update', onGenUpdate);
    return () => {
      socket.off('ai-generation-update', onGenUpdate);
    };
  }, []);

  // Update filtered data when slider changes
  const handleRangeChange = (_: unknown, newValue: number | number[]) => {
    const [start, end] = newValue as number[];
    setRange([start, end]);
    setFilteredData(data.slice(start - 1, end));
  };

  // Manual filter input (custom start/end)
  const applyCustomFilter = () => {
    if (customStart && customEnd) {
      setFilteredData(data.slice(customStart - 1, customEnd));
      setRange([customStart, customEnd]);
    }
  };

  return (
    <main style={{ padding: '20px', textAlign: 'center' }}>
      <h1>AI Learning Progress</h1>
      <p>Generation-by-generation evolution of fitness values and win rates.</p>

      {/* Slider for filtering generations */}
      {data.length > 0 && (
        <div style={{ width: '80%', margin: '0 auto' }}>
          <Slider
            value={range}
            onChange={handleRangeChange}
            valueLabelDisplay="auto"
            step={1}
            min={1}
            max={data.length}
          />
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}
          >
            <TextField
              label="From generation"
              type="number"
              size="small"
              value={customStart}
              onChange={(e) => setCustomStart(Number(e.target.value))}
            />
            <TextField
              label="To generation"
              type="number"
              size="small"
              value={customEnd}
              onChange={(e) => setCustomEnd(Number(e.target.value))}
            />
            <Button
              linkTo=""
              text="Apply Filter"
              clickEvent={applyCustomFilter}
            />
          </div>
        </div>
      )}

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={filteredData}
          margin={{ top: 30, right: 30, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="generation"
            label={{
              value: 'Generation',
              position: 'insideBottomRight',
              offset: -5,
            }}
          />
          <YAxis
            label={{ value: 'Fitness', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="avgFitness"
            stroke="#8884d8"
            name="Average Fitness"
          />
          <Line
            type="monotone"
            dataKey="bestFitness"
            stroke="#82ca9d"
            name="Best Fitness"
          />
          <Line
            type="monotone"
            dataKey="worstFitness"
            stroke="#ff6961"
            name="Worst Fitness"
          />
          <Line
            type="monotone"
            dataKey="winRate"
            stroke="#f0a500"
            name="Average Win Rate (%)"
          />
        </LineChart>
      </ResponsiveContainer>

      <div style={{ marginTop: '30px' }}>
        <Button linkTo="/" text="Back to Main Menu" />
      </div>
    </main>
  );
}

export default AIDashboard;
