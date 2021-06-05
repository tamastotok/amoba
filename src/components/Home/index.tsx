import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { buttonStyles } from '../../styles';
import socket from '../../server';

function Home({ status }: any) {
  const classes = buttonStyles();

  const handleClick = () => {
    socket.emit('connect-to-server');
  };

  return (
    <main>
      <h1>Tic-tac-toe</h1>
      <div className="button-group-center">
        <Link className={classes.link} to="/local">
          <Button className={classes.button} variant="outlined">
            Start local
          </Button>
        </Link>
        <Link
          className={classes.link}
          to={{
            pathname: !status ? '/' : '/online',
          }}
        >
          <Button
            className={classes.button}
            variant="outlined"
            onClick={handleClick}
          >
            Start online
          </Button>
        </Link>
      </div>
      {!status ? <h1>Server is currently offline.</h1> : null}
    </main>
  );
}

export default Home;