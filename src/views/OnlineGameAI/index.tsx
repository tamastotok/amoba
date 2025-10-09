import { useEffect, useRef, useState } from 'react';
import type { ContinuePayload, Reducers, Mark } from '../../types';
import type { CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setWinner } from '../../store/winner/winner.action';
import { setBoardData, hydrateBoard } from '../../store/board/board.action';
import { checkAndDispatchWinner } from '../../utils/helpers/checkWinningPatterns';
import { setNextMark } from '../../store/marks/marks.action';
import { changeGridState } from '../../store/grid-disable/grid-disable.action';
import GameStatus from '../../components/online/GameStatus';
import SquareOnline from '../../components/online/SquareOnline';
import Button from '../../components/Button/Button';
import store from '../../store';
import socket from '../../server';

const blue = '2px solid #3f51b5';
const red = '2px solid #f50057';

interface OnlineGameProps {
  response: ContinuePayload | null;
  playerMark: 'X' | 'O';
  roomId: string;
  clientIsReloaded: boolean;
}

function OnlineGameAI({
  response,
  playerMark,
  roomId,
  clientIsReloaded,
}: OnlineGameProps) {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const sessionSize = sessionStorage.getItem('gridSize') as string;
  const gridSize = parseInt(sessionSize, 10);
  const marks = useSelector((state: Reducers) => state.marks);
  const winner = useSelector((state: Reducers) => state.winner);
  const gridIsDisabled = useSelector((state: Reducers) => state.gridIsDisabled);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const [gameIsDraw, setGameIsDraw] = useState(false);
  const [borderColor, setBorderColor] = useState(
    marks.starterMark === 'X' ? blue : red
  );

  // Update border color when turn/winner changes
  useEffect(() => {
    if (winner) {
      setBorderColor(winner === 'X' ? blue : red);
    } else {
      setBorderColor(marks.nextMark === 'X' ? blue : red);
    }
  }, [winner, marks.nextMark]);

  const gridBorderStyle: CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    width: `${gridSize * 40 + 8}px`,
    height: `${gridSize * 40 + 8}px`,
    margin: '20px auto',
    padding: '2px',
    border: borderColor,
  };

  const playerMarkStyle: CSSProperties = {
    color: playerMark === 'X' ? '#3f51b5' : '#f50057',
    margin: '10px auto',
    width: `${gridSize * 40 + 8}px`,
    textAlign: 'right',
    paddingRight: '20px',
  };

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
        setGameIsDraw(true);
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

      if (!boardAfter.flat().includes('')) setGameIsDraw(true);
    };

    socket.on(`square-btn-click-${roomId}`, onSquareClick);
    socket.on('ai-move', onAiMove);

    return () => {
      socket.off(`square-btn-click-${roomId}`, onSquareClick);
      socket.off('ai-move', onAiMove);
    };
  }, [roomId, dispatch, playerMark]);

  useEffect(() => {
    if (winner) {
      socket.emit('game-result', {
        roomId,
        result: winner === playerMark ? 'loss' : 'win',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner]);

  // Handle reconnect
  useEffect(() => {
    if (!clientIsReloaded || !response) return;
    dispatch(hydrateBoard(response.boardSize, response.positions));
  }, [clientIsReloaded, response, dispatch]);

  // Restart & Leave
  const resolveRoomId = () => {
    return (
      roomId ||
      localStorage.getItem('room') ||
      sessionStorage.getItem('room') ||
      window.location.pathname.split('/').pop() ||
      ''
    );
  };

  const handleRestartClick = () => {
    const id = resolveRoomId();
    if (!id) {
      console.warn('No roomId available for restart');
      return;
    }
    socket.emit('restart-game', { id, lastWinner: winner || null });
  };

  const handleLeaveGameClick = () => {
    dispatch(setWinner(''));
    socket.emit('leave-game', roomId);
    navigate('/');
    window.location.reload();
    sessionStorage.removeItem('room');
    localStorage.removeItem('room');
  };

  // AI’s mark is always opposite of player’s
  const aiMark = playerMark === 'X' ? 'O' : 'X';

  return (
    <div>
      <GameStatus gameIsDraw={gameIsDraw} />

      <div ref={buttonsRef} style={gridBorderStyle}>
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
              isAIGame={true} // AI mode
              aiMark={aiMark}
            />
          );
        })}
      </div>

      <h1 style={playerMarkStyle}> {playerMark} </h1>

      {winner || gameIsDraw ? (
        <Button
          linkTo={location.pathname}
          clickEvent={handleRestartClick}
          text="Restart"
        />
      ) : null}

      <Button linkTo="/" clickEvent={handleLeaveGameClick} text="Leave" />
    </div>
  );
}

export default OnlineGameAI;
