import { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import HomePage from './components/Home';
import LocalMenu from './components/LocalMenu';
import socket from './server';
import { selectStarterMark, setNextMark } from './actions/marks_action';
import {
  changeGridState,
  setGridIsDisabled,
} from './actions/disable_grid_action';
import { useDispatch, useSelector } from 'react-redux';
import LocalGame from './components/LocalGame';
import OnlineGame from './components/OnlineGame';
import HostGameMenu from './components/HostGameMenu';
import OnlineMenu from './components/OnlineMenu';
import JoinGameMenu from './components/JoinGameMenu';
import { setPlayerBlueName, setPlayerRedName } from './actions/players_action';
import { Reducers } from './types';
import { setGridSize } from './actions/grid_size_action';
import MessageBoard from './components/MessageBoard';

function App() {
  const dispatch = useDispatch();
  const players = useSelector((state: Reducers) => state.players);
  const [response, setResponse] = useState<any>([]);
  const [yourMark, setYourMark] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [roomIdFromServer, setRoomIdFromServer] = useState<string>('');
  const [onlineUserCount, setOnlineUserCount] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [serverStatus, setServerStatus] = useState<boolean>(false);
  const winner = useSelector((state: Reducers) => state.winner);

  useEffect(() => {
    socket.on('server-online', (data: boolean) => {
      setServerStatus(data);
    });

    socket.on('user-connected', (data: number) => {
      setOnlineUserCount(data);
    });

    socket.on('create-game-response', (res: any) => {
      setStatusMessage('Waiting for another player...');
      if (res.hostMark === 'X') {
        setYourMark(players.blue.mark);
      } else {
        setYourMark(players.red.mark);
      }
      dispatch(selectStarterMark(res.starterMark));
      dispatch(setGridSize(res.gridSize));

      if (res.starterMark !== res.hostMark) {
        dispatch(setGridIsDisabled(true));
      }
      setRoomIdFromServer(res.roomId);
    });

    socket.on('join-game-settings', (res: any) => {
      if (res.joinMark === 'X') {
        setYourMark(players.blue.mark);
      } else {
        setYourMark(players.red.mark);
      }

      if (res.starterMark !== res.joinMark) {
        dispatch(setGridIsDisabled(true));
      }
    });

    socket.on('game-found', (res: any) => {
      setStatusMessage('');
      dispatch(selectStarterMark(res.starterMark));
      dispatch(setGridSize(res.gridSize));
      setLink(res.roomId);
      if (res.hostMark === 'X') {
        dispatch(setPlayerBlueName(res.hostName));
        dispatch(setPlayerRedName(res.joinName));
      } else {
        dispatch(setPlayerBlueName(res.joinName));
        dispatch(setPlayerRedName(res.hostName));
      }
    });

    socket.on('invalid-id', (message: string) => {
      setStatusMessage(message);
    });

    socket.on('leave-session', () => {
      setLink('');
      setResponse([]);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (winner) {
      setStatusMessage(`Winner: ${winner}`);
    }
  }, [winner]);

  useEffect(() => {
    if (link) {
      socket.on(`square-btn-click-${link}`, (data: any) => {
        setResponse(data.squares);
        dispatch(setNextMark());
        dispatch(changeGridState());
        setStatusMessage('');
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [link]);

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
          <Route path="/online" exact>
            <OnlineMenu />
            <MessageBoard
              onlineUserCount={onlineUserCount}
              statusMessage={statusMessage}
            />
          </Route>
        </Switch>

        <Switch>
          <Route path="/online/host" exact>
            <HostGameMenu roomId={roomIdFromServer} />
            <MessageBoard
              onlineUserCount={onlineUserCount}
              statusMessage={statusMessage}
              roomId={roomIdFromServer}
            />
          </Route>
        </Switch>

        <Switch>
          <Route path="/online/join" exact>
            <JoinGameMenu />
            <MessageBoard
              onlineUserCount={onlineUserCount}
              statusMessage={statusMessage}
            />
          </Route>
        </Switch>

        <Switch>
          <Route path="/local/game" exact component={LocalGame} />
        </Switch>

        <Switch>
          {link ? (
            <Redirect from={'/online/host'} to={`/online/game/id#${link}`} />
          ) : null}
          {link ? (
            <Redirect from={'/online/join'} to={`/online/game/id#${link}`} />
          ) : null}
          <Route path="/online/game/:game">
            <OnlineGame link={link} response={response} yourMark={yourMark} />
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
