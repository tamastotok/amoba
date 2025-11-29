import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { resetNextMark, selectStarterMark } from '@/store/marks/marks.action';
import { setWinner } from '@/store/winner/winner.action';
import { setGridIsDisabled } from '@/store/grid-disable/grid-disable.action';
import { BLUE_BORDER, RED_BORDER } from '@/utils/constants';
import type { Mark, Reducers, Sqr } from '@/types';
import { handleLeaveGame } from '@/utils/helpers/gameActions';
import { hydrateBoard } from '@/store/board/board.action';
import GameLayout from '@/components/game/GameLayout';
import { Box } from '@mui/material';
import { setDraw } from '@/store/draw/draw.action';
import GameStatusLocal from './GameStatusLocal';
import SquareLocal from './SquareLocal';
import { setGridSize } from '@/store/grid-size/grid-size.action';

function LocalGame() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const marks = useSelector((state: Reducers) => state.marks);
  const winner = useSelector((state: Reducers) => state.winner);
  const gridSize = useSelector((state: Reducers) => state.gridSize);
  const board = useSelector((state: Reducers) => state.board);
  const [isHydrated, setIsHydrated] = useState(false);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Border color depends on next player or winner
  const [borderColor, setBorderColor] = useState(
    marks.starterMark === 'X' ? BLUE_BORDER : RED_BORDER
  );

  // Restore local game state on initial load (F5)
  useEffect(() => {
    const saved = sessionStorage.getItem('localGame');
    const localReload = sessionStorage.getItem('localReload') === 'true';

    // If not reload we wont restore
    if (!localReload || !saved) {
      setIsHydrated(true);
      return;
    }

    try {
      const data = JSON.parse(saved) as {
        gridSize: number;
        positions: Sqr[];
        marks: { starterMark: Mark; nextMark: Mark };
        winner: Mark | null;
      };

      // Restore states
      dispatch(setGridSize(data.gridSize));
      dispatch(hydrateBoard(data.gridSize, data.positions));
      dispatch(selectStarterMark(data.marks.starterMark));
      dispatch(resetNextMark(data.marks.nextMark));

      if (data.winner) {
        dispatch(setWinner(data.winner));
        dispatch(setGridIsDisabled(true));
      }
    } catch (err) {
      console.error('Local game restore error:', err);
    } finally {
      sessionStorage.removeItem('localReload');
      setIsHydrated(true);
    }
  }, [dispatch]);

  // Save local game state (only after restore finished)
  useEffect(() => {
    if (!isHydrated) return;

    const positions: Sqr[] = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        positions.push({
          row,
          col,
          value: board[row][col],
        });
      }
    }

    const saveState = {
      gridSize,
      positions,
      marks: {
        starterMark: marks.starterMark,
        nextMark: marks.nextMark,
      },
      winner,
    };

    sessionStorage.setItem('localGame', JSON.stringify(saveState));
  }, [isHydrated, board, gridSize, marks.starterMark, marks.nextMark, winner]);

  // Update border color
  useEffect(() => {
    if (winner) {
      setBorderColor(winner === 'X' ? BLUE_BORDER : RED_BORDER);
    } else {
      setBorderColor(marks.nextMark === 'X' ? BLUE_BORDER : RED_BORDER);
    }
  }, [winner, marks.nextMark]);

  // Draw check
  useEffect(() => {
    if (!buttonsRef.current) return;

    const values = [...buttonsRef.current.children].map(
      (btn) => (btn as HTMLButtonElement).value
    );

    if (!values.includes('')) {
      dispatch(setDraw(true));
      dispatch(setGridIsDisabled(true));
    }
  }, [board, dispatch]);

  // Restart button handler

  const handleRestartClick = () => {
    const empty: Sqr[] = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        empty.push({ row: r, col: c, value: '' });
      }
    }

    const nextStarter = marks.starterMark === 'X' ? 'O' : 'X';
    dispatch(hydrateBoard(gridSize, empty));
    dispatch(selectStarterMark(nextStarter));
    dispatch(resetNextMark(nextStarter));
    dispatch(setWinner(''));
    dispatch(setGridIsDisabled(false));
    dispatch(setDraw(false));
    setBorderColor(nextStarter === 'X' ? BLUE_BORDER : RED_BORDER);
  };

  return (
    <GameLayout
      onGameEndRestart={handleRestartClick}
      onGameEndLeave={() => handleLeaveGame(dispatch, navigate)}
      onLeave={() => handleLeaveGame(dispatch, navigate)}
      gameMode="local"
    >
      <GameStatusLocal />

      <Box
        ref={buttonsRef}
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          width: `min(90vw, ${gridSize * 40}px)`,
          aspectRatio: '1 / 1',
          gap: '1px',
          margin: '20px auto',
          border: borderColor,
          borderRadius: '6px',
          overflow: 'hidden',
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
          const row = Math.floor(index / gridSize);
          const col = index % gridSize;

          return (
            <SquareLocal key={index} id={`${row}/${col}`} row={row} col={col} />
          );
        })}
      </Box>
    </GameLayout>
  );
}

export default LocalGame;
