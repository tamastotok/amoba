import { useEffect, useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import socket from './server';
import { Reducers } from './types';
import MessageBoard from './components/MessageBoard';
import { setGridIsDisabled } from './store/grid-disable/grid-disable.action';
import { setGridSize } from './store/grid-size/grid-size.action';
import { selectPlayerMark, resetNextMark } from './store/marks/marks.action';
import {
  setPlayerBlueName,
  setPlayerRedName,
} from './store/players/players.action';
import HomePage from './views/MainMenu';
import LocalMenu from './views/LocalMenu';
import LocalGame from './views/LocalGame';
import OnlineMenu from './views/OnlineMenu';
import OnlineGame from './views/OnlineGame';

function App() {
  const dispatch = useDispatch();
  const [response, setResponse] = useState<any>([]);
  const [roomId, setRoomId] = useState<any>('');
  const [onlineUserCount, setOnlineUserCount] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [serverStatus, setServerStatus] = useState<boolean>(false);
  const playerMark = useSelector((state: Reducers) => state.marks.playerMark);
  const location = window.location.pathname;
  const pageIsReloaded = sessionStorage.getItem('reloaded');
  const [clientIsReloaded, setClientIsReloaded] = useState(false);
  const mark = sessionStorage.getItem('playerMark') as string;
  const sessionRoom = sessionStorage.getItem('room');
  const history = useHistory();

  useEffect(() => {
    socket.on('server-status', (data: boolean) => {
      console.log(data);
      setServerStatus(data);
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
    if (pageIsReloaded === 'true' && location.includes('id=')) {
      const idFromUrl = location.slice(location.indexOf('=') + 1);

      socket.emit('join-lobby');
      socket.emit('reconnect', idFromUrl);

      socket.on(`continue-${idFromUrl}`, (data: any) => {
        setResponse(data);
        dispatch(selectPlayerMark(mark));
        setRoomId(data.roomId);
        dispatch(setGridSize(data.boardSize));
        dispatch(setPlayerBlueName(data.bluePlayerName));
        dispatch(setPlayerRedName(data.redPlayerName));
        dispatch(resetNextMark(data.whoIsNext));
        setClientIsReloaded(true);

        if (mark !== data.whoIsNext) dispatch(setGridIsDisabled(true));
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!sessionRoom) {
      history.push('/');
      alert('Invalid game!');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionRoom]);

  return (
    <>
      <Switch>
        <Route path="/" exact>
          <HomePage status={serverStatus} />
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

        {/*!sessionStorage.getItem('room') && (
          <Redirect from={`/online/game/id=${roomId}`} to="/" />
        )*/}

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

        {/*roomId && <Redirect from="/online" to={`/online/game/id=${roomId}`} />*/}
      </Switch>
    </>
  );
}

export default App;
