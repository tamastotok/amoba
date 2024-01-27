import { Button as Btn } from '@mui/material';
import { Link } from 'react-router-dom';

interface Props {
  linkTo: string;
  clickEvent?: () => void;
  text: string;
  isDisabled?: boolean;
}

export default function Button({ linkTo, clickEvent, text, isDisabled }: Props) {
  return (
    <Link to={linkTo}>
      <Btn
        sx={{ width: '10rem', padding: '0.5rem 0', margin: '0.5rem 0' }}
        className="button"
        color="primary"
        variant="outlined"
        onClick={clickEvent}
        disabled={isDisabled}
      >
        {text}
      </Btn>
    </Link>
  );
}
