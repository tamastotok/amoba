import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { useSocketGame } from './hooks/useSocketGame';
import { setGridIsDisabled } from './store/grid-disable/grid-disable.action';
import { setGridSize } from './store/grid-size/grid-size.action';
import {
  selectPlayerMark,
  resetNextMark,
  selectStarterMark,
} from './store/marks/marks.action';
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
} from './types';
import LocalGame from './views/LocalGame';
import LocalMenu from './views/LocalMenu';
import HomePage from './views/MainMenu';
import OnlineGameHuman from './views/OnlineGameHuman';
import OnlineGameAI from './views/OnlineGameAI';
import OnlineHumanMenu from './views/OnlineHumanMenu';
import OnlineAIMenu from './views/OnlineAIMenu';
import AIDashboard from './views/AIDashboard';
import socket from './server';
import SystemStatusBar from './components/SystemStatusBar';
import SearchOverlay from './components/SearchOverlay';

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
  const pageIsReloaded = sessionStorage.getItem('reloaded');

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
        setStatusMessage('');
      }
    },

    'search-canceled': () => {
      setStatusMessage('');
      dispatch(setGridIsDisabled(false));
    },

    'ai-game-created': (res: unknown) => {
      const payload = res as GameFoundPayload;
      if (payload.roomId) {
        navigate(`/ai/game/${payload.roomId}`);
        sessionStorage.setItem('room', payload.roomId);
        localStorage.setItem('room', payload.roomId);
        setRoomId(payload.roomId);
        dispatch(setPlayerBlueName(payload.playerData.blueName || ''));
        dispatch(setPlayerRedName(payload.playerData.redName || ''));
        setStatusMessage('');
      }
    },

    'leave-game': () => {
      setRoomId('');
      setResponse(null);
    },
  });

  // --- Restart game ---
  type Mark = 'X' | 'O' | '';

  type GameRestartedPayload = {
    roomId: string;
    boardSize: number;
    positions: Array<{ row: number; col: number; value: Mark }>;
    whoIsNext: 'X' | 'O';
    bluePlayer: { name: string; mark: 'X' };
    redPlayer: { name: string; mark: 'O' };
  };

  useEffect(() => {
    const onRestarted = (data: GameRestartedPayload) => {
      dispatch(setGridSize(data.boardSize));
      dispatch(hydrateBoard(data.boardSize, data.positions));
      dispatch(resetNextMark(data.whoIsNext));
      dispatch(selectStarterMark(data.whoIsNext));
      dispatch(setPlayerBlueName(data.bluePlayer.name));
      dispatch(setPlayerRedName(data.redPlayer.name));
      dispatch(setWinner(''));
      setStatusMessage('Game restarted');

      if (mark) {
        dispatch(setGridIsDisabled(mark !== data.whoIsNext));
      }
    };

    socket.on('game-restarted', onRestarted);
    return () => {
      socket.off('game-restarted', onRestarted);
    };
  }, [dispatch, mark]);

  // --- Handle refresh reconnection ---
  useEffect(() => {
    if (
      pageIsReloaded === 'true' &&
      location.pathname.startsWith('/online/game/')
    ) {
      let idFromUrl = location.pathname.split('/').pop();
      if (!idFromUrl) return;

      if (!idFromUrl) {
        idFromUrl = localStorage.getItem('room') || '';
      }
      if (!idFromUrl) return;

      socket.emit('join-lobby');
      socket.emit('reconnect', idFromUrl);

      const onContinue = (data: ContinuePayload) => {
        if (mark) dispatch(selectPlayerMark(mark as 'X' | 'O'));
        dispatch(setGridSize(data.boardSize));
        dispatch(setPlayerBlueName(data.bluePlayer.name));
        dispatch(setPlayerRedName(data.redPlayer.name));
        dispatch(resetNextMark(data.whoIsNext));

        // Hydrate the board with all positions from server
        dispatch(hydrateBoard(data.boardSize, data.positions));

        setResponse(data);
        setRoomId(data.roomId);
        localStorage.setItem('room', data.roomId);
        setClientIsReloaded(true);

        if (mark !== data.whoIsNext) dispatch(setGridIsDisabled(true));
      };

      socket.on(`continue-${idFromUrl}`, onContinue);
      return () => {
        socket.off(`continue-${idFromUrl}`, onContinue);
      };
    }
  }, [dispatch, location.pathname, mark, pageIsReloaded]);

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

  useEffect(() => {
    const onOpponentLeft = (data: { message: string; roomId: string }) => {
      dispatch(setWinner(''));
      dispatch(setGridIsDisabled(true));
      setStatusMessage(data.message);
      setOpponentLeft(true);
    };

    socket.on('opponent-left', onOpponentLeft);
    return () => {
      socket.off('opponent-left', onOpponentLeft);
    };
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
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
          message="Opponent disconnected."
          type="disconnected"
          onCancel={() => setOpponentLeft(false)}
        />
      )}
    </>
  );
}

export default App;
