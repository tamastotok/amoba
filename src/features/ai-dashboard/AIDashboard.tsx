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
import { io, Socket } from 'socket.io-client';
import {
  formatPopulations,
  formatGeneration,
} from '@/utils/helpers/aiDashboard/formatters';
import type {
  ChartRow,
  PopulationData,
  GenerationUpdatePayload,
  ServerToClientEvents,
} from '@/types';
import Button from '@/components/ui/Button';

const socket: Socket<ServerToClientEvents> = io();

function AIDashboard() {
  const [data, setData] = useState<ChartRow[]>([]);
  const [filteredData, setFilteredData] = useState<ChartRow[]>([]);
  const [range, setRange] = useState<number[]>([0, 0]);
  const [customStart, setCustomStart] = useState<number | ''>('');
  const [customEnd, setCustomEnd] = useState<number | ''>('');

  // Fetch data
  useEffect(() => {
    const fetchAIProgress = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/ai/progress`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const populations: PopulationData[] = await res.json();

        const formatted = formatPopulations(populations);
        setData(formatted);
        setFilteredData(formatted);
        setRange([1, formatted.length || 1]);
      } catch (err) {
        console.error('Failed to load AI progress:', err);
      }
    };

    fetchAIProgress();
  }, []);

  // Update sockets
  useEffect(() => {
    const onGenUpdate = (newGenData: GenerationUpdatePayload) => {
      try {
        const newEntry = formatGeneration(newGenData);
        setData((prev) => [...prev, newEntry]);
        setFilteredData((prev) => [...prev, newEntry]);
        setRange(([start, end]) => [start || 1, (end || 0) + 1]);
      } catch (err) {
        console.error('Failed to process AI generation update:', err);
      }
    };

    socket.on('ai-generation-update', onGenUpdate);
    return () => {
      socket.off('ai-generation-update', onGenUpdate);
    };
  }, []);

  // Slider / filter update
  const handleRangeChange = (_: unknown, newValue: number | number[]) => {
    const [start, end] = newValue as number[];
    setRange([start, end]);
    setFilteredData(data.slice(start - 1, end));
  };

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

      <ResponsiveContainer width="100%" height={500}>
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
            label={{ value: 'Value', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Legend />

          {/* Fitness Metrics */}
          <Line
            type="monotone"
            dataKey="avgFitness"
            stroke="#8884d8"
            name="Avg Fitness"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="bestFitness"
            stroke="#82ca9d"
            name="Best Fitness"
          />
          <Line
            type="monotone"
            dataKey="winRate"
            stroke="#f0a500"
            name="Win Rate (%)"
          />

          {/* New Strategy Weights - Attack (Blue Shades) */}
          <Line
            type="monotone"
            dataKey="avgMyLine4"
            stroke="#00008B"
            name="Avg My Line 4"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="avgMyLine3"
            stroke="#4169E1"
            name="Avg My Line 3"
            dot={false}
          />

          {/* New Strategy Weights - Defense (Red/Orange Shades) */}
          <Line
            type="monotone"
            dataKey="avgBlockLine4"
            stroke="#8B0000"
            name="Avg Block Line 4"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="avgBlockLine3"
            stroke="#FF4500"
            name="Avg Block Line 3"
            dot={false}
          />

          {/* Base Weights */}
          <Line
            type="monotone"
            dataKey="avgCenter"
            stroke="#2E8B57"
            name="Avg Center"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="avgRandomness"
            stroke="#808080"
            name="Avg Randomness"
            dot={false}
            strokeDasharray="3 3"
          />
        </LineChart>
      </ResponsiveContainer>

      <div style={{ marginTop: '30px' }}>
        <Button linkTo="/" text="Back" />
      </div>
    </main>
  );
}

export default AIDashboard;
