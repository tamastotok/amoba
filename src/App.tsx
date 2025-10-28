import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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
  GameEndedPayload,
  Reducers,
} from './types';
import LocalGame from './views/LocalGame';
import LocalMenu from './views/LocalMenu';
import Home from './views/Home';
import OnlineGameHuman from './views/OnlineGameHuman';
import OnlineGameAI from './views/OnlineGameAI';
import OnlineHumanMenu from './views/OnlineHumanMenu';
import OnlineAIMenu from './views/OnlineAIMenu';
import AIDashboard from './views/AIDashboard';
import socket from './server';
import SystemStatusBar from './components/SystemStatusBar';
import SearchOverlay from './components/SearchOverlay';
import { resetGameState } from './store/game/game.action';
import { useBodyScrollLock } from './hooks/useBodyScrollLock';
import { useSelector } from 'react-redux';
import store from './store';

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const playerMark = useAppSelector(
    (state: RootState) => state.marks.playerMark
  );

  const [roomId, setRoomId] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [response, setResponse] = useState<ContinuePayload | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [clientIsReloaded, setClientIsReloaded] = useState(false);
  const [opponentLeft, setOpponentLeft] = useState(false);
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
      console.log('game-found');
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
        const emptyPositions = [];
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
      const emptyMatrix: { row: number; col: number; value: string }[] = [];
      for (let row = 0; row < payload.boardSize; row++) {
        for (let col = 0; col < payload.boardSize; col++) {
          emptyMatrix.push({ row, col, value: '' });
        }
      }
      dispatch(hydrateBoard(payload.boardSize, emptyMatrix));

      console.log('🧩 Hydrated empty board:', store.getState().board);
      dispatch(setGridIsDisabled(false));

      setStatusMessage('');
    },

    'game-ended': (res?: unknown) => {
      const payload = res as GameEndedPayload;
      const winner = payload.winner;
      console.log(`Game ended. Winner: ${winner}`);

      // Reset Redux + navigate only now (confirmed end)
      dispatch(resetGameState());
      setRoomId('');
      setResponse(null);
      setOpponentLeft(false);
      setStatusMessage('');
    },

    'opponent-left': (res?: unknown) => {
      const payload = res as OpponentLeftPayload;
      console.warn('Your opponent has left the game');

      // Show status message
      setStatusMessage(payload.message);

      // Disable board
      dispatch(setGridIsDisabled(true));

      // Handle overlay
      setOpponentLeft(true);
    },
  });

  // --- Handle refresh reconnection ---
  useEffect(() => {
    const idFromUrl = location.pathname.split('/').pop();
    if (!idFromUrl) return;
    if (!location.pathname.startsWith('/online/game/')) return;

    // Get data from localStorage-ból if needed
    const storedId = localStorage.getItem('room');
    const roomId = idFromUrl || storedId;
    if (!roomId) return;

    console.log('🔄 Reconnecting with roomId:', roomId);

    socket.emit('join-lobby');
    socket.emit('reconnect', roomId);

    const onContinue = (data: ContinuePayload) => {
      if (!data) return;

      console.log('✅ Reconnected data:', data);

      // Redux state reload
      dispatch(setGridSize(data.boardSize));
      dispatch(hydrateBoard(data.boardSize, data.positions || []));
      dispatch(setPlayerBlueName(data.bluePlayer.name));
      dispatch(setPlayerRedName(data.redPlayer.name));

      // Who is next
      dispatch(resetNextMark(data.whoIsNext));
      dispatch(selectStarterMark(data.whoIsNext));

      // Reset UI
      dispatch(setWinner(''));
      dispatch(setGridIsDisabled(false));

      // Session restore
      setResponse(data);
      setRoomId(data.roomId);
      localStorage.setItem('room', data.roomId);
      setClientIsReloaded(true);

      // Disable board if the other player is next
      if (mark && mark !== data.whoIsNext) {
        dispatch(setGridIsDisabled(true));
      }
    };

    socket.on(`continue-${roomId}`, onContinue);

    return () => {
      socket.off(`continue-${roomId}`, onContinue);
    };
  }, [dispatch, location.pathname, mark]);

  // --- Redirect if invalid room ---
  useEffect(() => {
    if (
      !sessionStorage.getItem('room') &&
      location.pathname.startsWith('/online/game/')
    ) {
      navigate('/');
      setIsDisabled(true);
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (isDisabled) alert('Invalid room.');
  }, [isDisabled]);

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
    </>
  );
}

export default App;
