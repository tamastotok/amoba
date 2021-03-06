import { useEffect, useState } from 'react';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MessageBoard from './components/MessageBoard';
import { setGridIsDisabled } from './store/grid-disable/grid-disable.action';
import { setGridSize } from './store/grid-size/grid-size.action';
import { selectPlayerMark, resetNextMark } from './store/marks/marks.action';
import {
  setPlayerBlueName,
  setPlayerRedName,
} from './store/players/players.action';
import LocalGame from './views/LocalGame';
import LocalMenu from './views/LocalMenu';
import HomePage from './views/MainMenu';
import OnlineGame from './views/OnlineGame';
import OnlineMenu from './views/OnlineMenu';
import socket from './server';
import { Reducers } from './types';

function App() {
  const dispatch = useDispatch();
  const [response, setResponse] = useState<any>([]);
  const [roomId, setRoomId] = useState<any>('');
  const [onlineUserCount, setOnlineUserCount] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [serverStatus, setServerStatus] = useState<boolean>();
  const [serverStatusMessage, setServerStatusMessage] = useState(
    'Connecting to server...'
  );
  const playerMark = useSelector((state: Reducers) => state.marks.playerMark);

  const pageIsReloaded = sessionStorage.getItem('reloaded');
  const [clientIsReloaded, setClientIsReloaded] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const mark = sessionStorage.getItem('playerMark') as string;

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    socket.on('connect', () => {
      setServerStatus(socket.connected);
    });

    socket.on('user-count', (data: number) => {
      setOnlineUserCount(data);
    });

    socket.on('searching', (res: any) => {
      const { playerMark, starterMark } = res;
      setStatusMessage('Waiting for another player...');
      if (starterMark !== playerMark) dispatch(setGridIsDisabled(true));
      if (starterMark === playerMark) dispatch(setGridIsDisabled(false));
    });

    socket.on('game-found', (res: any) => {
      if (res.roomId) {
        history.push(`/online/game/id=${res.roomId}`);
        sessionStorage.setItem('room', res.roomId);
        setRoomId(res.roomId);
        dispatch(setPlayerBlueName(res.playerData.blueName));
        dispatch(setPlayerRedName(res.playerData.redName));
        setStatusMessage('');
      }
    });

    socket.on('leave-game', () => {
      setRoomId('');
      setResponse([]);
    });

    //  When page is refreshed
    if (pageIsReloaded === 'true' && location.pathname.includes('id=')) {
      const idFromUrl = location.pathname.slice(
        location.pathname.indexOf('=') + 1
      );

      socket.emit('join-lobby');
      socket.emit('reconnect', idFromUrl);

      socket.on(`continue-${idFromUrl}`, (data: any) => {
        dispatch(selectPlayerMark(mark));
        dispatch(setGridSize(data.boardSize));
        dispatch(setPlayerBlueName(data.bluePlayer.name));
        dispatch(setPlayerRedName(data.redPlayer.name));
        dispatch(resetNextMark(data.whoIsNext));
        setResponse(data);
        setRoomId(data.roomId);
        setClientIsReloaded(true);

        if (mark !== data.whoIsNext) dispatch(setGridIsDisabled(true));
      });
    }

    socket.on('connect_error', () => {
      setServerStatus(socket.connected);
    });

    socket.on('disconnect', () => {
      setServerStatus(socket.connected);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (serverStatus === false) setServerStatusMessage('Server is offline!');
    if (serverStatus) setServerStatusMessage('');
  }, [serverStatus]);

  //  Redirect if room is not exist
  useEffect(() => {
    if (!sessionStorage.getItem('room') && location.pathname.includes('id')) {
      history.push('/');
      setIsDisabled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  //  Send alert if room is not exist or 2 players are already in match in the same room
  useEffect(() => {
    if (isDisabled) alert('Invalid room.');
  }, [isDisabled]);

  return (
    <>
      <Switch>
        <Route path="/" exact>
          <HomePage
            status={serverStatus}
            serverStatusMessage={serverStatusMessage}
          />
        </Route>

        <Route path="/local" exact component={LocalMenu} />

        <Route path="/local/game" exact component={LocalGame} />

        <Route path="/online" exact>
          <OnlineMenu />
          <MessageBoard
            onlineUserCount={onlineUserCount}
            statusMessage={statusMessage}
          />
        </Route>

        <Route path="/online/game/:id">
          <OnlineGame
            roomId={roomId}
            response={response}
            playerMark={playerMark}
            clientIsReloaded={clientIsReloaded}
          />
          <MessageBoard
            onlineUserCount={onlineUserCount}
            statusMessage={statusMessage}
          />
        </Route>
      </Switch>
    </>
  );
}

export default App;
