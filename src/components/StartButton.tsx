import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setGridSize } from '../store/grid-size/grid-size.action';
import { buttonStyles } from '../styles/components';
import { Reducers } from '../types';

interface Props {
  text: string;
  linkTo: string;
}

function StartButton({ text, linkTo }: Props) {
  const { button, link } = buttonStyles;
  const dispatch = useDispatch();
  const gridSize = useSelector((state: Reducers) => state.gridSize);

  const handleClick = () => {
    if (gridSize === 0) {
      dispatch(setGridSize(8));
    }
  };

  return (
    <Link className={link} to={linkTo}>
      <Button onClick={handleClick} className={button} variant="outlined">
        {text}
      </Button>
    </Link>
  );
}

export default StartButton;
