import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setGridSize } from '../../store/grid-size/grid-size.action';
import { resetNextMark } from '../../store/marks/marks.action';
import { setWinner } from '../../store/winner/winner.action';
import { createMatrix } from '../../utils/helpers/createMatrix';
import { BLUE, RED } from '../../utils/constants';
import type { Reducers } from '../../types';
import SquareLocal from './SquareLocal';
import Button from '../../components/Button/Button';

function LocalGame() {
  const dispatch = useDispatch();
  const players = useSelector((state: Reducers) => state.players);
  const marks = useSelector((state: Reducers) => state.marks);
  const winner = useSelector((state: Reducers) => state.winner);
  const gridSize = useSelector((state: Reducers) => state.gridSize);
  const square = useSelector((state: Reducers) => state.square);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const [gameIsDraw, setGameIsDraw] = useState(false);
  const [borderColor, setBorderColor] = useState(
    marks.starterMark === 'X' ? BLUE : RED
  );

  useEffect(() => {
    if (winner) {
      setBorderColor(winner === 'X' ? BLUE : RED);
    } else {
      setBorderColor(marks.nextMark === 'X' ? BLUE : RED);
    }
  }, [winner, marks.nextMark]);

  //  Get square DOM elements and put them in a 2d array
  let allButton: HTMLButtonElement[] = [];
  const allButtonMatrix: HTMLButtonElement[][] = [];
  if (buttonsRef.current) {
    allButton = Array.from(buttonsRef.current.children).map(
      (el) => el as HTMLButtonElement
    );
  }
  while (allButton.length) allButtonMatrix.push(allButton.splice(0, gridSize));

  //  Check if game has a winner in every click
  useEffect(() => {
    //  Check draw
    if (buttonsRef.current) {
      const buttonValues = [...buttonsRef.current.children].map(
        (item) => (item as HTMLButtonElement).value
      );
      if (!buttonValues.includes('')) {
        setGameIsDraw(true);
      }
    }
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
        <h1 className="ta-left grid-width">
          Winner:{' '}
          <span className={winner === 'X' ? 'blue' : 'red'}>{winner}</span>
        </h1>
      );
    }

    if (gameIsDraw) {
      return <h1 className="ta-left grid-width">Draw</h1>;
    }

    return (
      <h1 className="ta-left grid-width">
        Next:{' '}
        <span className={marks.nextMark === 'X' ? 'blue' : 'red'}>
          {marks.nextMark}
        </span>
      </h1>
    );
  };

  return (
    <>
      <div className="winner-container">{gameStatus()}</div>

      <div
        ref={buttonsRef}
        className="grid-border"
        style={{
          borderColor,
          width: `${gridSize * 40 + 8}px`,
          height: `${gridSize * 40 + 8}px`,
        }}
      >
        {createMatrix(gridSize).map((item, index) => (
          <SquareLocal
            key={index}
            id={`${item.row}/${item.col}`}
            rowindex={item.row}
            colindex={item.col}
          />
        ))}
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
