import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

function BackButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <Button className="custom-button" variant="outlined" onClick={handleClick}>
      Back
    </Button>
  );
}

export default BackButton;
