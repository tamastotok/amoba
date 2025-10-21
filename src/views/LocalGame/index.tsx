import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  resetNextMark,
  selectStarterMark,
} from '../../store/marks/marks.action';
import { setWinner } from '../../store/winner/winner.action';
import { setGridIsDisabled } from '../../store/grid-disable/grid-disable.action';
import { createMatrix } from '../../utils/helpers/createMatrix';
import { BLUE_BORDER, RED_BORDER } from '../../utils/constants';
import type { Reducers } from '../../types';
import SquareLocal from './SquareLocal';
import { handleLeaveGame } from '../../utils/helpers/gameActions';
import { hydrateBoard } from '../../store/board/board.action';
import EndGameActions from '../../components/Button/EndGameActions';
import GameLayout from '../../components/Game/GameLayout';
import { Box } from '@mui/material';
import { setDraw } from '../../store/draw/draw.action';

function LocalGame() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const players = useSelector((state: Reducers) => state.players);
  const marks = useSelector((state: Reducers) => state.marks);
  const winner = useSelector((state: Reducers) => state.winner);
  const gridSize = useSelector((state: Reducers) => state.gridSize);
  const square = useSelector((state: Reducers) => state.square);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const isDraw = useSelector((state: Reducers) => state.winner);
  const [borderColor, setBorderColor] = useState(
    marks.starterMark === 'X' ? BLUE_BORDER : RED_BORDER
  );

  useEffect(() => {
    if (winner) {
      setBorderColor(winner === 'X' ? BLUE_BORDER : RED_BORDER);
    } else {
      setBorderColor(marks.nextMark === 'X' ? BLUE_BORDER : RED_BORDER);
    }
  }, [winner, marks.nextMark]);

  //  Get square DOM elements and put them in a 2d array
  let allButton: HTMLButtonElement[] = [];
  const allButtonMatrix: HTMLButtonElement[][] = [];
  if (buttonsRef.current) {
    allButton = Array.from(buttonsRef.current.children).map(
      (el) => el as HTMLButtonElement
    );
  }
  while (allButton.length) allButtonMatrix.push(allButton.splice(0, gridSize));

  //  Check if game has a winner in every click
  useEffect(() => {
    //  Check draw
    if (buttonsRef.current) {
      const buttonValues = [...buttonsRef.current.children].map(
        (item) => (item as HTMLButtonElement).value
      );
      if (!buttonValues.includes('')) {
        dispatch(setDraw(true));
      }
    }
  }, [dispatch, square]);

  const handleRestartClick = () => {
    // Empty board (Redux version)
    const emptyPositions = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        emptyPositions.push({ row, col, value: '' });
      }
    }

    // Proper hydrateBoard call
    dispatch(hydrateBoard(gridSize, emptyPositions));

    // Alternate starting player
    const nextStarter = marks.starterMark === 'X' ? 'O' : 'X';
    dispatch(selectStarterMark(nextStarter));
    dispatch(resetNextMark(nextStarter));

    // Reset UI state
    dispatch(setWinner(''));
    dispatch(setGridIsDisabled(false));
    dispatch(setDraw(false));
    setBorderColor(nextStarter === 'X' ? BLUE_BORDER : RED_BORDER);
  };

  const handleLeaveGameClick = () => {
    handleLeaveGame(dispatch, navigate);
  };

  const gameStatus = () => {
    if (winner) {
      return (
        <h1 className="ta-left grid-width">
          Winner:{' '}
          <span className={winner === 'X' ? 'blue' : 'red'}>{winner}</span>
        </h1>
      );
    }

    if (isDraw) {
      return <h1 className="ta-left grid-width">Draw</h1>;
    }

    return (
      <h1 className="ta-left grid-width">
        Next:{' '}
        <span className={marks.nextMark === 'X' ? 'blue' : 'red'}>
          {marks.nextMark}
        </span>
      </h1>
    );
  };

  return (
    <GameLayout onLeave={handleLeaveGameClick}>
      <div className="winner-container">{gameStatus()}</div>

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
        {createMatrix(gridSize).map((item, index) => (
          <SquareLocal
            key={index}
            id={`${item.row}/${item.col}`}
            rowindex={item.row}
            colindex={item.col}
          />
        ))}
      </Box>

      <EndGameActions
        handleRestartClick={handleRestartClick}
        handleLeaveGameClick={handleLeaveGameClick}
      />

      <div className="players-container">
        <h3>{players.blue.name && `Player X: ${players.blue.name}`}</h3>
        <h3>{players.red.name && `Player O: ${players.red.name}`}</h3>
      </div>
    </GameLayout>
  );
}

export default LocalGame;
