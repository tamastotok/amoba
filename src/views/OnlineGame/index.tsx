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
import { getSquareFromDOM } from '../../utils/helpers/accessToDOM';
import { setNextMark } from '../../store/marks/marks.action';
import { changeGridState } from '../../store/grid-disable/grid-disable.action';

const blue = '2px solid #3f51b5';
const red = '2px solid #f50057';

function OnlineGame({ response, playerMark, roomId, clientIsReloaded }: any) {
  const dispatch = useDispatch();
  const classes = buttonStyles();
  const gridSize = useSelector((state: Reducers) => state.gridSize);
  const marks = useSelector((state: Reducers) => state.marks);
  const winner = useSelector((state: Reducers) => state.winner);
  const gridIsDisabled = useSelector((state: Reducers) => state.gridIsDisabled);
  const buttonsRef = useRef<any>(null);
  const history = useHistory();
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

  //  Disable every button or the ones that has value depends on who is next
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
    if (roomId) {
      const allButtonMatrix = getSquareFromDOM(buttonsRef, gridSize);

      socket.on(`square-btn-click-${roomId}`, async (data: any) => {
        dispatch(setNextMark());
        dispatch(changeGridState());

        try {
          const lastRowPosition = await data.positions[
            data.positions.length - 1
          ].row;
          const lastColPosition = await data.positions[
            data.positions.length - 1
          ].col;

          data.positions.forEach((item: any) => {
            allButtonMatrix[item.row][item.col].value = item.value;
            allButtonMatrix[item.row][item.col].innerText = item.value;
            allButtonMatrix[item.row][item.col].disabled = true;
          });

          getWinner(lastRowPosition, lastColPosition, allButtonMatrix);
          //  Check draw
          if (buttonsRef.current) {
            const buttonValues = [...buttonsRef.current.children].map(
              (item) => item.value
            );
            if (!buttonValues.includes('')) {
              setGameIsDraw(true);
            }
          }
        } catch (error) {
          console.error(error);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  useEffect(() => {
    if (clientIsReloaded) {
      const allButtonMatrix = getSquareFromDOM(buttonsRef, gridSize);
      response.positions.forEach((item: any) => {
        allButtonMatrix[item.row][item.col].value = item.value;
        allButtonMatrix[item.row][item.col].innerText = item.value;
        allButtonMatrix[item.row][item.col].disabled = true;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientIsReloaded]);

  //  Reset winner and mark if RESTART button clicked
  const handleRestartClick = () => {
    dispatch(setWinner(''));
    socket.emit('leave-game', roomId);
    history.replace('/');
    window.location.reload();
  };

  return (
    <div>
      <GameStatus gameIsDraw={gameIsDraw} />

      <div ref={buttonsRef} style={gridBorderStyle}>
        {createMatrix(gridSize).map((item: any, index: number) => {
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

      {winner || gameIsDraw ? (
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
