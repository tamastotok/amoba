import { Link } from 'react-router-dom';
import { Button as Btn } from '@mui/material';

interface ButtonProps {
  linkTo?: string; // optional now
  clickEvent?: () => void;
  text: string;
  isDisabled?: boolean;
}

function Button({ linkTo, clickEvent, text, isDisabled }: ButtonProps) {
  // If `linkTo` is provided, wrap with <Link>; otherwise render plain button
  if (linkTo) {
    return (
      <Link to={linkTo} style={{ textDecoration: 'none' }}>
        <Btn
          sx={{ width: '10rem', padding: '0.5rem 0', margin: '0.5rem 0' }}
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

  // No link? Just a plain button
  return (
    <Btn
      sx={{ width: '10rem', padding: '0.5rem 0', margin: '0.5rem 0' }}
      color="primary"
      variant="outlined"
      onClick={clickEvent}
      disabled={isDisabled}
    >
      {text}
    </Btn>
  );
}

export default Button;
