import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { ContinuePayload, Reducers, Mark } from '../../types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setWinner } from '../../store/winner/winner.action';
import { setBoardData, hydrateBoard } from '../../store/board/board.action';
import { checkAndDispatchWinner } from '../../utils/helpers/checkWinningPatterns';
import { setNextMark } from '../../store/marks/marks.action';
import { changeGridState } from '../../store/grid-disable/grid-disable.action';
import GameStatus from './GameStatus';
import SquareOnline from './SquareOnline';
import Chat from '../../components/Chat/Chat';
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

function OnlineGame({
  response,
  playerMark,
  roomId,
  clientIsReloaded,
}: OnlineGameProps) {
  const dispatch = useDispatch();
  const location = useLocation();
  const sessionSize = sessionStorage.getItem('gridSize') as string;
  const gridSize = parseInt(sessionSize, 10);
  const marks = useSelector((state: Reducers) => state.marks);
  const winner = useSelector((state: Reducers) => state.winner);
  const gridIsDisabled = useSelector((state: Reducers) => state.gridIsDisabled);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [gameIsDraw, setGameIsDraw] = useState(false);
  const [borderColor, setBorderColor] = useState(
    marks.starterMark === 'X' ? blue : red
  );

  // Update border color on winner/next mark
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

    const onSquareClick = (data: {
      positions: Array<{ row: number; col: number; value: Mark }>;
    }) => {
      const last = data.positions[data.positions.length - 1];

      // Update Redux board state
      dispatch(setBoardData(last.row, last.col, last.value));
      dispatch(setNextMark());
      dispatch(changeGridState());

      // Check winner with updated board
      const currentBoard = store.getState().board;
      checkAndDispatchWinner(last.row, last.col, currentBoard);

      // Check draw
      const flat = currentBoard.flat();
      if (!flat.includes('')) {
        setGameIsDraw(true);
      }
    };

    socket.on(`square-btn-click-${roomId}`, onSquareClick);

    return () => {
      socket.off(`square-btn-click-${roomId}`, onSquareClick);
    };
  }, [roomId, dispatch]);

  // hHndle reload/reconnect: hydrate board from server response
  useEffect(() => {
    if (!clientIsReloaded || !response) return;
    dispatch(hydrateBoard(response.boardSize, response.positions));
  }, [clientIsReloaded, response, dispatch]);

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
    // Winner '', 'X', 'O' vagy 'draw'
    socket.emit('restart-game', { id, lastWinner: winner || null });
  };

  // Leave game button
  const handleLeaveGameClick = () => {
    dispatch(setWinner(''));
    socket.emit('leave-game', roomId);
    navigate('/');
    window.location.reload();
    sessionStorage.removeItem('room');
    localStorage.removeItem('room');
  };

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
      <Chat />
    </div>
  );
}

export default OnlineGame;
