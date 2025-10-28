import { useEffect, useRef, useState } from 'react';
import type { Reducers, Mark, OnlineGameProps } from '../../types';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setBoardData, hydrateBoard } from '../../store/board/board.action';
import { checkAndDispatchWinner } from '../../utils/helpers/checkWinningPatterns';
import { setNextMark } from '../../store/marks/marks.action';
import { changeGridState } from '../../store/grid-disable/grid-disable.action';
import GameStatus from '../../components/online/GameStatus';
import SquareOnline from '../../components/online/SquareOnline';
import Chat from '../../components/Chat/Chat';
import store from '../../store';
import socket from '../../server';
import { handleLeaveGame } from '../../utils/helpers/gameActions';
import GameLayout from '../../components/Game/GameLayout';
import { Box } from '@mui/material';
import { BLUE_BORDER, RED_BORDER } from '../../utils/constants';
import { setDraw } from '../../store/draw/draw.action';
import { resetGameState } from '../../store/game/game.action';

function OnlineGameHuman({
  response,
  playerMark,
  roomId,
  clientIsReloaded,
}: OnlineGameProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionSize = sessionStorage.getItem('gridSize') as string;
  const gridSize = parseInt(sessionSize, 10);
  const marks = useSelector((state: Reducers) => state.marks);
  const winner = useSelector((state: Reducers) => state.winner);
  const gridIsDisabled = useSelector((state: Reducers) => state.gridIsDisabled);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const [borderColor, setBorderColor] = useState(
    marks.starterMark === 'X' ? BLUE_BORDER : RED_BORDER
  );

  // Update border color on winner/next mark
  useEffect(() => {
    if (winner) {
      setBorderColor(winner === 'X' ? BLUE_BORDER : RED_BORDER);
    } else {
      setBorderColor(marks.nextMark === 'X' ? BLUE_BORDER : RED_BORDER);
    }
  }, [winner, marks.nextMark]);

  // Disable buttons when gridIsDisabled
  useEffect(() => {
    if (!buttonsRef.current) return;
    const buttonsArray = [
      ...buttonsRef.current.children,
    ] as HTMLButtonElement[];

    if (gridIsDisabled) {
      buttonsArray.forEach((item) => (item.disabled = true));
    } else {
      buttonsArray.forEach((item) => (item.disabled = item.value !== ''));
    }
  }, [gridIsDisabled]);

  // Listen to socket moves
  useEffect(() => {
    if (!roomId) return;

    // Player move
    const onSquareClick = (data: {
      positions: Array<{ row: number; col: number; value: Mark }>;
    }) => {
      const last = data.positions[data.positions.length - 1];

      // Table refresh
      dispatch(setBoardData(last.row, last.col, last.value));
      dispatch(setNextMark());
      dispatch(changeGridState());

      // Winner checking
      const currentBoard = store.getState().board;
      checkAndDispatchWinner(last.row, last.col, currentBoard);

      // Draw checking
      if (!currentBoard.flat().includes('')) dispatch(setDraw(true));
    };

    socket.on(`square-btn-click-${roomId}`, onSquareClick);

    return () => {
      socket.off(`square-btn-click-${roomId}`, onSquareClick);
    };
  }, [roomId, dispatch]);

  // Reconnect handling
  useEffect(() => {
    if (!clientIsReloaded || !response) return;
    dispatch(hydrateBoard(response.boardSize, response.positions));
  }, [clientIsReloaded, response, dispatch]);

  // Restart game button
  const handleRestartClick = () => {
    navigate('/online');
    dispatch(resetGameState());
    sessionStorage.removeItem('room');
    localStorage.removeItem('room');
  };

  return (
    <GameLayout
      onGameEndRestart={handleRestartClick}
      onGameEndLeave={() => handleLeaveGame(dispatch, navigate, roomId, winner)}
      onLeave={() => handleLeaveGame(dispatch, navigate, roomId, winner)}
      chat={<Chat />}
      gameMode="online"
      playerMark={playerMark}
    >
      <GameStatus />

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
            <SquareOnline
              roomId={roomId}
              key={index}
              id={`${row}/${col}`}
              rowindex={row}
              colindex={col}
            />
          );
        })}
      </Box>

      {/*
      <h1
        style={{
          color: playerMark === 'X' ? BLUE : RED,
          marginTop: '1rem',
          textAlign: 'center',
          fontSize: 'clamp(1.5rem, 4vw, 3rem)',
        }}
      >
        {playerMark}
      </h1>
      */}
    </GameLayout>
  );
}

export default OnlineGameHuman;
