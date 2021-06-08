import SquareLocal from './SquareLocal';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setWinner } from '../../actions/winner_action';
import { resetNextMark } from '../../actions/marks_action';
import { Reducers } from '../../types';
import { useCreateMatrix } from '../../gamelogic/useCreateMatrix';
import { CSSProperties, useEffect, useRef } from 'react';
import { getWinner } from '../../gamelogic/checkWinningPatterns';
import Button from '@material-ui/core/Button';
import { buttonStyles } from '../../styles';

function LocalGame() {
  const classes = buttonStyles();
  const dispatch = useDispatch();
  const players = useSelector((state: Reducers) => state.players);
  const marks = useSelector((state: Reducers) => state.marks);
  const winner = useSelector((state: Reducers) => state.winner);
  const gridSize = useSelector((state: Reducers) => state.gridSize);
  const square = useSelector((state: Reducers) => state.square);
  const buttonsRef = useRef<any>(null);

  const gridBorderStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    width: `${gridSize * 50 + 8}px`,
    height: `${gridSize * 50 + 8}px`,
    margin: '20px auto',
    padding: '2px',
    border: marks.nextMark === 'X' ? '2px solid #3f51b5' : '2px solid #f50057',
  } as CSSProperties;

  //  Get square DOM elements and put them in a 2d array
  let allButton: any[] = [];
  const allButtonMatrix: any = [];
  if (buttonsRef.current) {
    allButton = [...buttonsRef.current.children];
  }
  while (allButton.length) allButtonMatrix.push(allButton.splice(0, gridSize));

  //  Check if game has a winner in every click
  useEffect(() => {
    getWinner(square.row, square.col, allButtonMatrix);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [square]);

  //  Reset winner and mark if RESTART button clicked
  const handleRestartClick = () => {
    dispatch(setWinner(''));
    dispatch(resetNextMark(marks.starterMark));
  };

  return (
    <>
      <div className="winner-container">
        <h1>Next move: {marks.nextMark}</h1>
        {winner && <h1>Winner: {winner}</h1>}
      </div>

      <div ref={buttonsRef} style={gridBorderStyle}>
        {useCreateMatrix().map((item: any, index: number) => {
          return (
            <SquareLocal
              key={index}
              id={`${item.row}/${item.col}`}
              rowindex={item.row}
              colindex={item.col}
            />
          );
        })}
      </div>

      <div className="players-container">
        <h3>{players.blue.name && `Player X: ${players.blue.name}`}</h3>
        <h3>{players.red.name && `Player O: ${players.red.name}`}</h3>
      </div>

      {winner && (
        <div className="restart-button">
          <Link to="/">
            <Button
              className={classes.button}
              variant="outlined"
              onClick={handleRestartClick}
            >
              Restart
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}

export default LocalGame;
