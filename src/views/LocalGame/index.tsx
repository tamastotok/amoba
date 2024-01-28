import { CSSProperties, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setGridSize } from '../../store/grid-size/grid-size.action';
import { resetNextMark } from '../../store/marks/marks.action';
import { setWinner } from '../../store/winner/winner.action';
import { getWinner } from '../../utils/helpers/checkWinningPatterns';
import { createMatrix } from '../../utils/helpers/createMatrix';
import { Reducers } from '../../types';
import SquareLocal from './SquareLocal';
import Button from '../../components/Button/Button';

const blue = '2px solid #3f51b5';
const red = '2px solid #f50057';

function LocalGame() {
  const dispatch = useDispatch();
  const players = useSelector((state: Reducers) => state.players);
  const marks = useSelector((state: Reducers) => state.marks);
  const winner = useSelector((state: Reducers) => state.winner);
  const gridSize = useSelector((state: Reducers) => state.gridSize);
  const square = useSelector((state: Reducers) => state.square);
  const buttonsRef = useRef<any>(null);
  const [gameIsDraw, setGameIsDraw] = useState(false);
  const [borderColor, setBorderColor] = useState(
    marks.starterMark === 'X' ? blue : red
  );

  useEffect(() => {
    if (winner) {
      setBorderColor(winner === 'X' ? blue : red);
    } else {
      setBorderColor(marks.nextMark === 'X' ? blue : red);
    }
  }, [winner, marks.nextMark]);

  const gridBorderStyle: CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    width: `${gridSize * 40 + 8}px`,
    height: `${gridSize * 40 + 8}px`,
    margin: '20px auto',
    padding: '2px',
    border: borderColor,
  };

  const customH1Style: CSSProperties = {
    textAlign: 'left',
    width: `${gridSize * 40 + 8}px`,
  };

  const customNextPlayerStyle: CSSProperties = {
    color: `${marks.nextMark === 'X' ? 'blue' : 'red'}`,
  };

  const customWinnerStyle: CSSProperties = {
    color: `${winner === 'X' ? 'blue' : 'red'}`,
  };

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
    //  Check draw
    if (buttonsRef.current) {
      const buttonValues = [...buttonsRef.current.children].map(
        (item) => item.value
      );
      if (!buttonValues.includes('')) {
        setGameIsDraw(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [square]);

  //  Reset winner and mark if RESTART button clicked
  const handleRestartClick = () => {
    dispatch(setGridSize(8));
    dispatch(setWinner(''));
    dispatch(resetNextMark(marks.starterMark));
  };

  const gameStatus = () => {
    if (winner) {
      return (
        <h1 style={customH1Style}>
          Winner: <span style={customWinnerStyle}>{winner}</span>
        </h1>
      );
    }

    if (gameIsDraw) {
      return <h1 style={customH1Style}>Draw</h1>;
    }

    return (
      <h1 style={customH1Style}>
        Next: <span style={customNextPlayerStyle}>{marks.nextMark}</span>
      </h1>
    );
  };

  return (
    <>
      <div className="winner-container">{gameStatus()}</div>

      <div ref={buttonsRef} style={gridBorderStyle}>
        {createMatrix(gridSize).map((item: any, index: number) => {
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

      {winner || gameIsDraw ? (
        <Button linkTo="/" clickEvent={handleRestartClick} text="Restart" />
      ) : null}
    </>
  );
}

export default LocalGame;
