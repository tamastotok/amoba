import { CSSProperties, useEffect, useRef } from 'react';
import Button from '@material-ui/core/Button';
import SquareOnline from './SquareOnline';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setWinner } from '../../actions/winner_action';
import { Reducers } from '../../types';
import { buttonStyles } from '../../styles';
import { getWinner } from '../../gamelogic/checkWinningPatterns';
import { useCreateMatrix } from '../../gamelogic/useCreateMatrix';
import socket from '../../server';

function OnlineGame({ response, yourMark, link }: any) {
  const dispatch = useDispatch();
  const classes = buttonStyles();
  const gridSize = useSelector((state: Reducers) => state.gridSize);
  const marks = useSelector((state: Reducers) => state.marks);
  const winner = useSelector((state: Reducers) => state.winner);
  const gridIsDisabled = useSelector((state: Reducers) => state.gridIsDisabled);
  const buttonsRef = useRef<any>(null);
  const history = useHistory();

  const gridBorderStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    width: `${gridSize * 50 + 8}px`,
    height: `${gridSize * 50 + 8}px`,
    margin: '20px auto',
    padding: '2px',
    border: marks.nextMark === 'X' ? '2px solid #3f51b5' : '2px solid #f50057',
  } as CSSProperties;

  const yourMarkStyle = {
    color: `${yourMark === 'X' ? `#3f51b5` : `#f50057`}`,
    margin: '10px auto',
    width: `${gridSize * 50 + 8}px`,
    textAlign: 'right',
    paddingRight: '20px',
  } as CSSProperties;

  const customH1Style = {
    textAlign: 'left',
    width: `${gridSize * 50 + 8}px`,
  } as CSSProperties;

  const customSpanStyle = {
    color: `${marks.nextMark === 'X' ? `#3f51b5` : `#f50057`}`,
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

      socket.on(`square-btn-click-${link}`, (data: any) => {
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
    <>
      <div className="margin-auto">
        <h1 style={customH1Style}>
          Next:{' '}
          <span style={customSpanStyle}>
            {!gridIsDisabled ? 'You' : marks.nextMark}
          </span>
        </h1>
      </div>

      <div ref={buttonsRef} style={gridBorderStyle}>
        {useCreateMatrix().map((item: any, index: number) => {
          return (
            <SquareOnline
              link={link}
              key={index}
              id={`${item.row}/${item.col}`}
              rowindex={item.row}
              colindex={item.col}
            />
          );
        })}
      </div>

      <h1 style={yourMarkStyle}> {yourMark} </h1>

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
    </>
  );
}

export default OnlineGame;
