import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { buttonStyles } from '../styles/components';

function BackButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <Button className={buttonStyles} variant="outlined" onClick={handleClick}>
      Back
    </Button>
  );
}

export default BackButton;
