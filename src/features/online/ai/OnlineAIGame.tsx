import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import GameLayout from '@/components/game/GameLayout';
import { GameStatusOnline, SquareOnline } from '@/features/online/common';
import { setBoardData } from '@/store/board/board.action';
import { setNextMark } from '@/store/marks/marks.action';
import { changeGridState } from '@/store/grid-disable/grid-disable.action';
import { setDraw } from '@/store/draw/draw.action';
import { checkAndDispatchWinner } from '@/utils/helpers/checkWinningPatterns';
import {
  handleLeaveGame,
  handleRestartClick,
} from '@/utils/helpers/gameActions';
import { BLUE_BORDER, RED_BORDER } from '@/utils/constants';
import store from '@/store';
import socket from '@/server';
import type { OnlineGameProps, Reducers, Sqr } from '@/types';

function OnlineAIGame({ playerMark, roomId }: OnlineGameProps) {
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

    const onSquareClick = (data: { positions: Sqr[] }) => {
      const last = data.positions[data.positions.length - 1];

      dispatch(setBoardData(last));
      dispatch(setNextMark());
      dispatch(changeGridState());

      const currentBoard = store.getState().board;
      checkAndDispatchWinner(last.row, last.col, currentBoard);

      // Draw
      if (!currentBoard.flat().includes('')) {
        dispatch(setDraw(true));
        return;
      }

      // Winner -> AI stops
      const w = store.getState().winner;
      if (w) return;

      // Trigger AI
      socket.emit('request-ai-move', {
        roomId,
        playerMark,
      });
    };

    const onAiMove = (data: Sqr) => {
      if (!data) return;

      dispatch(setBoardData(data));
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

  // AI’s mark is always opposite of player’s
  const aiMark = playerMark === 'X' ? 'O' : 'X';

  return (
    <GameLayout
      onGameEndRestart={() => handleRestartClick(dispatch, navigate, '/ai')}
      onGameEndLeave={() => handleLeaveGame(dispatch, navigate, roomId, winner)}
      onLeave={() => handleLeaveGame(dispatch, navigate, roomId, winner)}
      gameMode="online"
      playerMark={playerMark}
    >
      <GameStatusOnline />

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
    </GameLayout>
  );
}

export default OnlineAIGame;
