import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { buttonStyles } from '../styles/components';

function BackButton() {
  const classes = buttonStyles();
  const history = useHistory();

  const handleClick = () => {
    history.replace('/');
  };

  return (
    <Button className={classes.button} variant="outlined" onClick={handleClick}>
      Back
    </Button>
  );
}

export default BackButton;
