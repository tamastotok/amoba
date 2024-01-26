import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

interface Props {
  linkTo: string;
  clickEvent?: () => void;
  text: string;
  isDisabled?: boolean;
}

export default function EventButton({
  linkTo,
  clickEvent,
  text,
  isDisabled,
}: Props) {
  return (
    <Link to={linkTo}>
      <Button
        sx={{ width: '10rem', padding: '0.5rem 0', margin: '0.5rem 0' }}
        color="primary"
        variant="outlined"
        onClick={clickEvent}
        disabled={isDisabled}
      >
        {text}
      </Button>
    </Link>
  );
}
