import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { buttonStyles } from '../../styles';

function OnlineMenu() {
  const classes = buttonStyles();
  return (
    <>
      <h1>Online</h1>
      <div className="button-group-center">
        <Link className={classes.link} to="/online/host">
          <Button className={classes.button} variant="outlined">
            Create Game
          </Button>
        </Link>
        <Link className={classes.link} to="/online/join">
          <Button className={classes.button} variant="outlined">
            Join
          </Button>
        </Link>
      </div>
    </>
  );
}

export default OnlineMenu;
