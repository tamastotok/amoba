import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { useSocketGame } from './hooks/useSocketGame';
import { setGridIsDisabled } from './store/grid-disable/grid-disable.action';
import { setGridSize } from './store/grid-size/grid-size.action';
import { resetNextMark, selectStarterMark } from './store/marks/marks.action';
import {
  setPlayerBlueName,
  setPlayerRedName,
} from './store/players/players.action';
import { hydrateBoard } from './store/board/board.action';
import { setWinner } from './store/winner/winner.action';
import type { RootState } from './store';
import type {
  ContinuePayload,
  SearchingPayload,
  GameFoundPayload,
  OpponentLeftPayload,
  Reducers,
  Sqr,
} from './types';
import LocalGame from './features/local/game/LocalGame';
import OnlineGameHuman from './features/online/human/OnlineHumanGame';
import OnlineGameAI from './features/online/ai/OnlineAIGame';
import OnlineHumanMenu from './features/online/human/OnlineHumanMenu';
import OnlineAIMenu from './features/online/ai/OnlineAIMenu';
import AIDashboard from './features/ai-dashboard/AIDashboard';
import socket from './server';
import SearchOverlay from './components/overlays/SearchOverlay';
import { resetGameState } from './store/game/game.action';
import { useBodyScrollLock } from './hooks/useBodyScrollLock';
import { useSelector } from 'react-redux';
import ReconnectModal from './components/overlays/ReconnectModal';
import SystemStatusBar from './components/ui/SystemStatusBar';
import { LocalMenu } from './features/local/menu';
import Home from './pages/Home';

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const playerMark = useAppSelector(
    (state: RootState) => state.marks.playerMark
  );

  const [roomId, setRoomId] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [response, setResponse] = useState<ContinuePayload | null>(null);
  const [clientIsReloaded, setClientIsReloaded] = useState(false);
  const [opponentLeft, setOpponentLeft] = useState(false);
  const [showReconnect, setShowReconnect] = useState(false);
  const [disconnectedRoom, setDisconnectedRoom] = useState<string | null>(null);
  const mark = sessionStorage.getItem('playerMark');
  const winner = useSelector((state: Reducers) => state.winner);
  const isDraw = useSelector((state: Reducers) => state.winner);

  useBodyScrollLock(!!(winner || isDraw));

  // --- General socket handlers ---
  useSocketGame({
    searching: (res: unknown) => {
      const payload = res as SearchingPayload;
      setStatusMessage('Waiting for another player...');
      dispatch(setGridIsDisabled(payload.starterMark !== payload.playerMark));
    },

    'game-found': (res: unknown) => {
      const payload = res as GameFoundPayload;

      if (payload.roomId) {
        navigate(`/online/game/${payload.roomId}`);
        sessionStorage.setItem('room', payload.roomId);
        localStorage.setItem('room', payload.roomId);
        setRoomId(payload.roomId);

        dispatch(setPlayerBlueName(payload.playerData.blueName));
        dispatch(setPlayerRedName(payload.playerData.redName));
        dispatch(setGridSize(payload.boardSize));
        dispatch(selectStarterMark(payload.starterMark));
        dispatch(resetNextMark(payload.starterMark));

        // Board initialization
        const emptyPositions: Sqr[] = [];
        for (let row = 0; row < payload.boardSize; row++) {
          for (let col = 0; col < payload.boardSize; col++) {
            emptyPositions.push({ row, col, value: '' });
          }
        }
        dispatch(hydrateBoard(payload.boardSize, emptyPositions));
        dispatch(setGridIsDisabled(payload.starterMark !== playerMark));

        setStatusMessage('');
      }
    },

    'search-canceled': () => {
      setStatusMessage('');
      dispatch(setGridIsDisabled(false));
    },

    'ai-game-created': (res: unknown) => {
      const payload = res as GameFoundPayload;

      if (!payload.roomId) return;

      navigate(`/ai/game/${payload.roomId}`);
      sessionStorage.setItem('room', payload.roomId);
      localStorage.setItem('room', payload.roomId);
      setRoomId(payload.roomId);

      dispatch(setPlayerBlueName(payload.playerData.blueName || ''));
      dispatch(setPlayerRedName(payload.playerData.redName || ''));

      dispatch(setGridSize(payload.boardSize));

      // Board initialization
      const emptyMatrix: Sqr[] = [];
      for (let row = 0; row < payload.boardSize; row++) {
        for (let col = 0; col < payload.boardSize; col++) {
          emptyMatrix.push({ row, col, value: '' });
        }
      }

      dispatch(hydrateBoard(payload.boardSize, emptyMatrix));
      dispatch(setGridIsDisabled(false));
      setStatusMessage('');
    },

    'game-ended': () => {
      // Reset Redux + navigate only now (confirmed end)
      dispatch(resetGameState());
      setRoomId('');
      setResponse(null);
      setOpponentLeft(false);
      setStatusMessage('');
      sessionStorage.removeItem('room');
      localStorage.removeItem('room');
      navigate('/');
    },

    'opponent-left': (res?: unknown) => {
      const payload = res as OpponentLeftPayload;
      console.warn('Opponent disconnected, waiting for possible reconnect…');

      // Store roomId so the player can reconnect
      if (payload.roomId) {
        sessionStorage.setItem('pendingRoom', payload.roomId);
      }

      // Disable board and send a status message
      setStatusMessage(payload.message || 'Your opponent has disconnected.');
      dispatch(setGridIsDisabled(true));

      // Opponent left statust (UI)
      setOpponentLeft(true);
      setDisconnectedRoom(payload.roomId);
      setShowReconnect(true);
    },
  });

  // --- Handle refresh or reconnect after disconnect ---
  useEffect(() => {
    // Check if we have pending room (open for 60sec)
    const roomId = sessionStorage.getItem('room');
    if (!roomId) return;

    console.log('Attempting to reconnect to saved room:', roomId);

    // Attempt reconnecting
    socket.emit('reconnect-room', roomId);

    // Reconnect successfulled
    const onReconnectSuccess = (data: ContinuePayload) => {
      console.log('Successfully reconnected to room:', data.roomId);

      // Redux state restore
      dispatch(setGridSize(data.boardSize));
      dispatch(hydrateBoard(data.boardSize, data.positions || []));
      dispatch(setPlayerBlueName(data.bluePlayer.name));
      dispatch(setPlayerRedName(data.redPlayer.name));
      dispatch(resetNextMark(data.whoIsNext));
      dispatch(selectStarterMark(data.whoIsNext));

      // UI reset
      dispatch(setWinner(''));
      dispatch(setGridIsDisabled(false));

      // Session restore
      setResponse(data);
      setRoomId(data.roomId);
      setClientIsReloaded(true);

      navigate(`/online/game/${data.roomId}`);

      // Disable board if the enemy comes next
      if (mark && mark !== data.whoIsNext) {
        dispatch(setGridIsDisabled(true));
      }
    };

    // Reconnect failed
    const onReconnectFailed = (payload: { message: string }) => {
      console.warn('Reconnect failed:', payload.message);
      sessionStorage.removeItem('room');
      dispatch(resetGameState());
      navigate('/online');
    };

    // Event listeners
    socket.on('reconnect-success', onReconnectSuccess);
    socket.on('reconnect-failed', onReconnectFailed);

    // Cleanup
    return () => {
      socket.off('reconnect-success', onReconnectSuccess);
      socket.off('reconnect-failed', onReconnectFailed);
    };
  }, [dispatch, navigate, mark]);

  const handleOnCancel = () => {
    setOpponentLeft(false);
    setStatusMessage('');
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/local" element={<LocalMenu />} />
        <Route path="/local/game" element={<LocalGame />} />
        <Route path="/online" element={<OnlineHumanMenu />} />
        <Route path="/ai" element={<OnlineAIMenu />} />

        <Route
          path="/online/game/:id"
          element={
            <OnlineGameHuman
              roomId={roomId}
              response={response}
              playerMark={playerMark as 'X' | 'O'}
              clientIsReloaded={clientIsReloaded}
            />
          }
        />

        <Route
          path="/ai/game/:id"
          element={
            <OnlineGameAI
              roomId={roomId}
              response={response}
              playerMark={playerMark as 'X' | 'O'}
              clientIsReloaded={clientIsReloaded}
            />
          }
        />

        <Route path="/ai-dashboard" element={<AIDashboard />} />
      </Routes>
      <SystemStatusBar statusMessage={statusMessage} />
      {opponentLeft && (
        <SearchOverlay
          message={statusMessage || 'Opponent disconnected.'}
          type="disconnected"
          onCancel={handleOnCancel}
        />
      )}
      {showReconnect && disconnectedRoom && (
        <ReconnectModal
          roomId={disconnectedRoom}
          onClose={() => setShowReconnect(false)}
        />
      )}
    </>
  );
}

export default App;
