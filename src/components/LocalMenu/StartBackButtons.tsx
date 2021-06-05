import { Link, useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { buttonStyles } from '../../styles';

function StartBackButtons() {
  const classes = buttonStyles();
  const history = useHistory();

  const handleClick = () => {
    history.goBack();
  };

  return (
    <div className="button-group-center">
      <Link className={classes.link} to="/local/game">
        <Button className={classes.button} variant="outlined">
          Start game
        </Button>
      </Link>

      <Button
        className={classes.button}
        variant="outlined"
        onClick={handleClick}
      >
        Back
      </Button>
    </div>
  );
}

export default StartBackButtons;
