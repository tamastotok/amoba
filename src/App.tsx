import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { useSocketGame } from './hooks/useSocketGame';
import { setGridIsDisabled } from './store/grid-disable/grid-disable.action';
import { setGridSize } from './store/grid-size/grid-size.action';
import {
  resetNextMark,
  selectPlayerMark,
  selectStarterMark,
} from './store/marks/marks.action';
import {
  setPlayerBlueName,
  setPlayerRedName,
} from './store/players/players.action';
import { hydrateBoard } from './store/board/board.action';
import type { RootState } from './store';
import type {
  ContinuePayload,
  SearchingPayload,
  GameFoundPayload,
  OpponentLeftPayload,
  Reducers,
  Mark,
} from './types';
import LocalGame from './features/local/game/LocalGame';
import OnlineHumanGame from './features/online/human/OnlineHumanGame';
import OnlineAIGame from './features/online/ai/OnlineAIGame';
import OnlineHumanMenu from './features/online/human/OnlineHumanMenu';
import OnlineAIMenu from './features/online/ai/OnlineAIMenu';
import AIDashboard from './features/ai-dashboard/AIDashboard';
import socket from './server';
import GameOverlay from './components/overlays/GameOverlay';
import { resetGameState } from './store/game/game.action';
import { useBodyScrollLock } from './hooks/useBodyScrollLock';
import { useSelector } from 'react-redux';
import SystemStatusBar from './components/ui/SystemStatusBar';
import { LocalMenu } from './features/local/menu';
import Home from './pages/Home';
import { useOverlayActions, type OverlayType } from './hooks/useOverlayActions';

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const mark = sessionStorage.getItem('playerMark');
  const mode = sessionStorage.getItem('mode');

  const winner = useSelector((state: Reducers) => state.winner);
  const isDraw = useSelector((state: Reducers) => state.winner);
  const playerMark = useAppSelector(
    (state: RootState) => state.marks.playerMark
  );

  const [roomId, setRoomId] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [reconnectTime, setReconnectTime] = useState(0);
  const [overlayType, setOverlayType] = useState<OverlayType>(null);

  // Disable scroll
  useBodyScrollLock(!!(winner || isDraw));

  // GameOverlay button actions
  const { handleCancel, handleReconnect } = useOverlayActions({
    overlayType,
    setOverlayType,
  });

  // --- Reload (F5) handler ---
  useEffect(() => {
    const path = window.location.pathname;
    const isGameScreen =
      path.startsWith('/online/game/') || path.startsWith('/ai/game/');

    if (!isGameScreen) {
      console.log('🔁 Reload skipped: not on a game screen');
      return;
    }

    const roomId = sessionStorage.getItem('room');
    const gameMode = sessionStorage.getItem('mode');
    const isReconnect = Boolean(sessionStorage.getItem('isReconnect'));

    if (!isReconnect) {
      console.log('🔁 Reload skipped: reconnect is ', isReconnect);
      return;
    }

    if (!roomId || !gameMode) {
      console.log('🔁 Reload skipped: missing room or mode');
      return;
    }

    console.log(
      '🔁 Attempting reload reconnect for room:',
      roomId,
      'mode:',
      gameMode
    );

    if (gameMode === 'human') {
      socket.emit('reload-human', { roomId });
    } else if (gameMode === 'ai') {
      socket.emit('reload-ai', { roomId });
    }
  }, []);

  // --- General socket handlers ---
  useSocketGame({
    searching: (res: unknown) => {
      const payload = res as SearchingPayload;
      setOverlayType('search');
      setStatusMessage('Searching for opponent...');
      dispatch(setGridIsDisabled(payload.starterMark !== payload.playerMark));
    },

    'game-found': (res: unknown) => {
      const payload = res as GameFoundPayload;
      console.log('🎯 game-found fired for client', socket.id);

      sessionStorage.removeItem('reconnectRoomId');
      sessionStorage.removeItem('reconnectTime');

      if (!payload.roomId) return;
      sessionStorage.setItem('mode', 'human');

      navigate(`/online/game/${payload.roomId}`);
      sessionStorage.setItem('room', payload.roomId);

      setRoomId(payload.roomId);

      sessionStorage.setItem('isReconnect', 'false');

      dispatch(setPlayerBlueName(payload.playerData.bluePlayer.name));
      dispatch(setPlayerRedName(payload.playerData.redPlayer.name));
      dispatch(setGridSize(payload.boardSize));
      dispatch(selectStarterMark(payload.starterMark));
      dispatch(resetNextMark(payload.starterMark));

      dispatch(
        setGridIsDisabled(payload.starterMark !== playerMark ? true : false)
      );

      setStatusMessage('');
      setOverlayType(null);
    },

    'search-canceled': () => {
      setOverlayType(null);
      setStatusMessage('');
      dispatch(setGridIsDisabled(false));
    },

    'ai-game-created': (res: unknown) => {
      const payload = res as GameFoundPayload;

      if (!payload.roomId) return;

      sessionStorage.setItem('mode', 'ai');
      navigate(`/ai/game/${payload.roomId}`);
      sessionStorage.setItem('room', payload.roomId);
      localStorage.setItem('room', payload.roomId);
      setRoomId(payload.roomId);

      sessionStorage.setItem('isReconnect', 'false');
      dispatch(setPlayerBlueName(payload.playerData.bluePlayer.name || ''));
      dispatch(setPlayerRedName(payload.playerData.redPlayer.name || ''));
      dispatch(setGridSize(payload.boardSize));
      dispatch(setGridIsDisabled(payload.starterMark !== payload.playerMark));
      setStatusMessage('');
    },

    'game-ended': () => {
      dispatch(resetGameState());
      setRoomId('');

      setStatusMessage('');
      sessionStorage.removeItem('room');
      localStorage.removeItem('room');
      navigate('/');
    },

    'left-game-perma': (res?: unknown) => {
      const payload = res as OpponentLeftPayload;
      console.warn('Opponent has left the game permanently.');

      dispatch(resetGameState());

      setStatusMessage(payload.message || 'Your opponent has left the game');
      setOverlayType('left-game-perma');
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
      setReconnectTime(payload.reconnectWindow || 30);

      // Opponent left statust (UI)
      setOverlayType('opponent-left');
    },

    'you-left': (res?: unknown) => {
      const payload = res as OpponentLeftPayload;
      console.log('You left the game:', payload);

      // Save data for reconnect
      sessionStorage.setItem('reconnectRoomId', payload.roomId);

      // Reset state and redirect
      dispatch(resetGameState());
      setOverlayType('you-left');
      setStatusMessage(
        payload.message || 'You left the game. Want to reconnect?'
      );
      setReconnectTime(payload.reconnectWindow || 30);
    },

    // Opponent reconnected event
    'opponent-reconnected': (res?: unknown) => {
      console.log('Opponent reconnected:', res);
      setOverlayType(null);

      // Close any "waiting for opponent" UI
      setStatusMessage('Opponent reconnected.');
    },
  });

  // --- Handle reconnect success/fail (self reconnect only) ---
  useEffect(() => {
    const onReconnectSuccess = (payload: ContinuePayload) => {
      console.log(
        'Successfully reconnected to room:',
        payload.roomId,
        'isReconnect:',
        payload.isReconnect
      );

      if (!payload.isReconnect) return;

      dispatch(setGridSize(payload.boardSize));
      dispatch(hydrateBoard(payload.boardSize, payload.positions));
      dispatch(setPlayerBlueName(payload.playerData.bluePlayer.name));
      dispatch(setPlayerRedName(payload.playerData.redPlayer.name));

      // Restore player's own mark from sessionStorage
      const storedPlayerMark = sessionStorage.getItem(
        'playerMark'
      ) as Mark | null;

      dispatch(selectPlayerMark(storedPlayerMark === 'X' ? 'X' : 'O'));

      console.log(
        'restore: nextMark=',
        payload.nextMark,
        'playerMark=',
        storedPlayerMark
      );

      // Restore nextMark from server
      dispatch(resetNextMark(payload.nextMark));
      dispatch(selectStarterMark(payload.nextMark));

      // Enable / disable grid
      if (storedPlayerMark) {
        dispatch(setGridIsDisabled(payload.nextMark !== storedPlayerMark));
      }

      setRoomId(payload.roomId);
      setOverlayType(null);

      // Navigation based on game mode
      const mode = sessionStorage.getItem('mode') || 'human';

      if (mode === 'ai') {
        navigate(`/ai/game/${payload.roomId}`);
      } else {
        navigate(`/online/game/${payload.roomId}`);
      }

      console.log('Reconnect restored state:', {
        storedPlayerMark,
        nextMark: payload.nextMark,
      });
    };

    const onReconnectFailed = (payload: { message: string }) => {
      console.warn('Reconnect failed:', payload.message);
      sessionStorage.removeItem('reconnectRoomId');
      sessionStorage.removeItem('reconnectTime');
      setRoomId('');
      dispatch(resetGameState());

      setOverlayType('reconnect-failed');
      setStatusMessage('Your opponent has left the game.');

      if (mode === 'ai') {
        navigate('/ai');
      } else {
        navigate('/online');
      }
    };

    socket.on('reconnect-success', onReconnectSuccess);
    socket.on('reconnect-failed', onReconnectFailed);

    return () => {
      socket.off('reconnect-success', onReconnectSuccess);
      socket.off('reconnect-failed', onReconnectFailed);
    };
  }, [dispatch, navigate, mark, mode]);

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
            <OnlineHumanGame roomId={roomId} playerMark={playerMark as Mark} />
          }
        />

        <Route
          path="/ai/game/:id"
          element={
            <OnlineAIGame roomId={roomId} playerMark={playerMark as Mark} />
          }
        />

        <Route path="/ai-dashboard" element={<AIDashboard />} />
      </Routes>

      <SystemStatusBar />

      {overlayType && (
        <GameOverlay
          message={statusMessage}
          type={overlayType}
          onCancel={() => {
            if (overlayType === 'search') setStatusMessage('');
            handleCancel();
          }}
          onReconnect={handleReconnect}
          reconnectTime={reconnectTime}
        />
      )}
    </>
  );
}

export default App;
