import { useEffect, useRef, useState } from 'react';
import type { OnlineGameProps, Reducers, Mark } from '../../types';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setBoardData, hydrateBoard } from '../../store/board/board.action';
import { checkAndDispatchWinner } from '../../utils/helpers/checkWinningPatterns';
import { setNextMark } from '../../store/marks/marks.action';
import { changeGridState } from '../../store/grid-disable/grid-disable.action';
import GameStatus from '../../components/online/GameStatus';
import SquareOnline from '../../components/online/SquareOnline';
import store from '../../store';
import socket from '../../server';
import { handleLeaveGame } from '../../utils/helpers/gameActions';
import GameLayout from '../../components/Game/GameLayout';
import { Box } from '@mui/material';
import { BLUE_BORDER, RED_BORDER } from '../../utils/constants';
import { setDraw } from '../../store/draw/draw.action';
import { resetGameState } from '../../store/game/game.action';

function OnlineGameAI({
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

  // Update border color when turn/winner changes
  useEffect(() => {
    if (winner) {
      setBorderColor(winner === 'X' ? BLUE_BORDER : RED_BORDER);
    } else {
      setBorderColor(marks.nextMark === 'X' ? BLUE_BORDER : RED_BORDER);
    }
  }, [winner, marks.nextMark]);

  // Disable grid when needed
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

  // Listen to AI-specific socket events
  useEffect(() => {
    if (!roomId) return;

    // After human player step, the server broadcast square-btn... event
    const onSquareClick = (data: {
      positions: Array<{ row: number; col: number; value: Mark }>;
    }) => {
      const last = data.positions[data.positions.length - 1];

      // Refresh board
      dispatch(setBoardData(last.row, last.col, last.value));
      dispatch(setNextMark());
      dispatch(changeGridState());

      const currentBoard = store.getState().board;
      checkAndDispatchWinner(last.row, last.col, currentBoard);

      // Check draw
      if (!currentBoard.flat().includes('')) {
        dispatch(setDraw(true));
        return;
      }

      // If we have a winner, we don't trigger ai anymore
      const w = store.getState().winner;
      if (w) return;

      // After human player step, we trigger ai to move (by roomid)
      socket.emit('request-ai-move', { roomId, playerMark });
    };

    // Receive Ai step data from the server
    const onAiMove = (data: { row: number; col: number; value: Mark }) => {
      if (!data) return;
      // Refresh board
      dispatch(setBoardData(data.row, data.col, data.value));
      dispatch(setNextMark());
      dispatch(changeGridState());

      const boardAfter = store.getState().board;
      checkAndDispatchWinner(data.row, data.col, boardAfter);

      if (!boardAfter.flat().includes('')) dispatch(setDraw(true));
    };

    socket.on(`square-btn-click-${roomId}`, onSquareClick);
    socket.on('ai-move', onAiMove);

    return () => {
      socket.off(`square-btn-click-${roomId}`, onSquareClick);
      socket.off('ai-move', onAiMove);
    };
  }, [roomId, dispatch, playerMark]);

  // Handle reconnect
  useEffect(() => {
    if (!clientIsReloaded || !response) return;
    dispatch(hydrateBoard(response.boardSize, response.positions));
  }, [clientIsReloaded, response, dispatch]);

  const handleRestartClick = () => {
    navigate('/ai');
    dispatch(resetGameState());
    sessionStorage.removeItem('room');
    localStorage.removeItem('room');
  };

  // AI’s mark is always opposite of player’s
  const aiMark = playerMark === 'X' ? 'O' : 'X';

  return (
    <GameLayout
      onGameEndRestart={handleRestartClick}
      onGameEndLeave={() => handleLeaveGame(dispatch, navigate, roomId, winner)}
      onLeave={() => handleLeaveGame(dispatch, navigate, roomId, winner)}
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
              isAIGame
              aiMark={aiMark}
            />
          );
        })}
      </Box>

      {/*<h1
        style={{
          color: playerMark === 'X' ? BLUE : RED,
          marginTop: '1rem',
          textAlign: 'center',
          fontSize: 'clamp(1.5rem, 4vw, 3rem)',
        }}
      >
        {playerMark}
      </h1>*/}
    </GameLayout>
  );
}

export default OnlineGameAI;
