import { CSSProperties, useEffect, useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import SquareOnline from './SquareOnline';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setWinner } from '../../store/winner/winner.action';
import { Reducers } from '../../types';
import { buttonStyles } from '../../styles/components';
import { getWinner } from '../../utils/helpers/checkWinningPatterns';
import { createMatrix } from '../../utils/helpers/createMatrix';
import socket from '../../server';
import GameStatus from './GameStatus';

const blue = '2px solid #3f51b5';
const red = '2px solid #f50057';

function OnlineGame({ response, playerMark, roomId }: any) {
  const dispatch = useDispatch();
  const classes = buttonStyles();
  const gridSize = useSelector((state: Reducers) => state.gridSize);
  const marks = useSelector((state: Reducers) => state.marks);
  const winner = useSelector((state: Reducers) => state.winner);
  const gridIsDisabled = useSelector((state: Reducers) => state.gridIsDisabled);
  const buttonsRef = useRef<any>(null);
  const history = useHistory();
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

  const gridBorderStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    width: `${gridSize * 40 + 8}px`,
    height: `${gridSize * 40 + 8}px`,
    margin: '20px auto',
    padding: '2px',
    border: borderColor,
  } as CSSProperties;

  const playerMarkStyle = {
    color: `${playerMark === 'X' ? `#3f51b5` : `#f50057`}`,
    margin: '10px auto',
    width: `${gridSize * 40 + 8}px`,
    textAlign: 'right',
    paddingRight: '20px',
  } as CSSProperties;

  useEffect(() => {
    if (!buttonsRef.current) return;
    const buttonsArray = [...buttonsRef.current.children];

    if (gridIsDisabled) {
      buttonsArray.map((item) => (item.disabled = true));
    } else {
      buttonsArray.map(
        (item) => (item.disabled = item.value === '' ? false : true)
      );
    }
  }, [gridIsDisabled]);

  useEffect(() => {
    if (response) {
      //  Get square DOM elements and put them in a 2d array
      const allButton = [...buttonsRef.current.children];
      const allButtonMatrix: any = [];
      while (allButton.length)
        allButtonMatrix.push(allButton.splice(0, gridSize));

      socket.on(`square-btn-click-${roomId}`, (data: any) => {
        const { row, col, value } = data.squares;
        allButtonMatrix[row][col].value = value;
        allButtonMatrix[row][col].innerText = value;
        allButtonMatrix[row][col].disabled = true;
        getWinner(row, col, allButtonMatrix);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  //  Reset winner and mark if RESTART button clicked
  const handleRestartClick = () => {
    dispatch(setWinner(''));
    socket.emit('leave-session');
    history.replace('/');
    window.location.reload();
  };

  return (
    <div>
      <GameStatus />

      <div ref={buttonsRef} style={gridBorderStyle}>
        {createMatrix().map((item: any, index: number) => {
          return (
            <SquareOnline
              roomId={roomId}
              key={index}
              id={`${item.row}/${item.col}`}
              rowindex={item.row}
              colindex={item.col}
            />
          );
        })}
      </div>

      <h1 style={playerMarkStyle}> {playerMark} </h1>

      {winner ? (
        <div className="restart-button">
          <Button
            className={classes.button}
            variant="outlined"
            onClick={handleRestartClick}
          >
            Leave
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default OnlineGame;
