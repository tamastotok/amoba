import { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import HomePage from './components/Home';
import LocalMenu from './components/LocalMenu';
import socket from './server';
import { setNextMark } from './actions/marks_action';
import {
  changeGridState,
  setGridIsDisabled,
} from './actions/disable_grid_action';
import { useDispatch, useSelector } from 'react-redux';
import LocalGame from './components/LocalGame';
import OnlineMenu from './components/OnlineMenu';
import OnlineGame from './components/OnlineGame';
import MessageBoard from './components/MessageBoard';
import { setPlayerBlueName, setPlayerRedName } from './actions/players_action';
import { Reducers } from './types';

function App() {
  const dispatch = useDispatch();
  const [response, setResponse] = useState<any>([]);
  const [roomId, setRoomId] = useState<any>('');
  const [onlineUserCount, setOnlineUserCount] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [serverStatus, setServerStatus] = useState<boolean>(false);
  const playerMark = useSelector((state: Reducers) => state.marks.playerMark);

  useEffect(() => {
    socket.on('server-status', (data: boolean) => {
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
      console.log(res);
      setRoomId(res.roomId);

      dispatch(setPlayerBlueName(res.players.blueName));
      dispatch(setPlayerRedName(res.players.redName));
      setStatusMessage('');
    });

    socket.on('leave-game', () => {
      setRoomId('');
      setResponse([]);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (roomId) {
      socket.on(`square-btn-click-${roomId}`, (data: any) => {
        console.log(data);
        setResponse(data.squares);
        dispatch(setNextMark());
        dispatch(changeGridState());
        setStatusMessage('');
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact>
            <HomePage status={serverStatus} />
          </Route>
        </Switch>

        <Switch>
          <Route path="/local" exact component={LocalMenu} />
        </Switch>

        <Switch>
          <Route path="/local/game" exact component={LocalGame} />
        </Switch>

        <Switch>
          <Route path="/online" exact>
            <OnlineMenu />
            <MessageBoard
              onlineUserCount={onlineUserCount}
              statusMessage={statusMessage}
            />
          </Route>
        </Switch>

        {roomId && <Redirect from="/online" to={`/online/game/id=${roomId}`} />}

        <Switch>
          <Route path="/online/game/:id">
            <OnlineGame
              roomId={roomId}
              response={response}
              playerMark={playerMark}
            />
            <MessageBoard
              onlineUserCount={onlineUserCount}
              statusMessage={statusMessage}
            />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
