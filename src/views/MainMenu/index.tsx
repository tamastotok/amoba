import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { buttonStyles } from '../../styles/components';
import socket from '../../server';
import StartButton from '../../components/StartButton';

function MainMenu({ status, serverStatusMessage }: any) {
  const classes = buttonStyles();

  const handleClick = () => {
    socket.emit('join-lobby');
  };

  return (
    <main>
      <h1>Tic-tac-toe</h1>
      <div className="button-group-center">
        <StartButton text="Start local" linkTo="/local" />
        <Link className={classes.link} to={status ? '/online' : '/'}>
          <Button
            className={classes.button}
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
