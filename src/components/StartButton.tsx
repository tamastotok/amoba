import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { buttonStyles } from '../styles/components';

interface Props {
  text: string;
  linkTo: string;
}

function StartButton({ text, linkTo }: Props) {
  const classes = buttonStyles();

  return (
    <Link className={classes.link} to={linkTo}>
      <Button className={classes.button} variant="outlined">
        {text}
      </Button>
    </Link>
  );
}

export default StartButton;
