import { useEffect, useRef, useState } from 'react';
import type { ContinuePayload, Reducers, Mark } from '../../types';
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
import EndGameActions from '../../components/Button/EndGameActions';
import GameLayout from '../../components/Game/GameLayout';
import { Box } from '@mui/material';
import { BLUE, BLUE_BORDER, RED, RED_BORDER } from '../../utils/constants';
import { setDraw } from '../../store/draw/draw.action';

interface OnlineGameProps {
  response: ContinuePayload | null;
  playerMark: 'X' | 'O';
  roomId: string;
  clientIsReloaded: boolean;
}

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
  const isDraw = useSelector((state: Reducers) => state.winner);
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
  };

  // Leave game button
  const handleLeaveGameClick = () => {
    handleLeaveGame(dispatch, navigate, roomId, winner);
  };

  return (
    <>
      <GameLayout onLeave={handleLeaveGameClick} chat={<Chat />}>
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
      </GameLayout>
      {(winner || isDraw) && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 2000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <EndGameActions
            handleRestartClick={handleRestartClick}
            handleLeaveGameClick={handleLeaveGameClick}
          />
        </div>
      )}
    </>
  );
}

export default OnlineGameHuman;
