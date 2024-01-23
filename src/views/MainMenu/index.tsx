import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import StartButton from '../../components/StartButton';
import socket from '../../server';

function MainMenu({ status, serverStatusMessage }: any) {
  const handleClick = () => {
    socket.emit('join-lobby');
  };

  return (
    <main>
      <h1>Tic-tac-toe</h1>
      <div className="button-group-center">
        <StartButton text="Start local" linkTo="/local" />
        <Link className="custom-link" to={status ? '/online' : '/'}>
          <Button
            className="custom-button"
            variant="outlined"
            onClick={handleClick}
            disabled={!status}
          >
            Start online
          </Button>
        </Link>
      </div>
      <h2 className="server-status">{serverStatusMessage}</h2>
    </main>
  );
}

export default MainMenu;
