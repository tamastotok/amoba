import { CSSProperties, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { changeGridState } from '../../store/grid-disable/grid-disable.action';
import { setNextMark } from '../../store/marks/marks.action';
import { setWinner } from '../../store/winner/winner.action';
import { getSquareFromDOM } from '../../utils/helpers/accessToDOM';
import { getWinner } from '../../utils/helpers/checkWinningPatterns';
import { createMatrix } from '../../utils/helpers/createMatrix';
import socket from '../../server';
import { Reducers } from '../../types';
import GameStatus from './GameStatus';
import SquareOnline from './SquareOnline';
import ChatWindow from '../../components/ChatWindow';
import EventButton from '../../components/EventButton';

const blue = '2px solid #3f51b5';
const red = '2px solid #f50057';

function OnlineGame({ response, playerMark, roomId, clientIsReloaded }: any) {
  const dispatch = useDispatch();
  const sessionSize = sessionStorage.getItem('gridSize') as string;
  const gridSize = parseInt(sessionSize);
  const marks = useSelector((state: Reducers) => state.marks);
  const winner = useSelector((state: Reducers) => state.winner);
  const gridIsDisabled = useSelector((state: Reducers) => state.gridIsDisabled);
  const buttonsRef = useRef<any>(null);
  const navigate = useNavigate();
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
      buttonsArray.map((item) => (item.disabled = item.value === '' ? false : true));
    }
  }, [gridIsDisabled]);

  useEffect(() => {
    if (roomId) {
      const allButtonMatrix = getSquareFromDOM(buttonsRef, gridSize);

      socket.on(`square-btn-click-${roomId}`, (data: any) => {
        dispatch(setNextMark());
        dispatch(changeGridState());
        const lastPos = data.positions[data.positions.length - 1];

        allButtonMatrix[lastPos.row][lastPos.col].value = lastPos.value;
        allButtonMatrix[lastPos.row][lastPos.col].innerText = lastPos.value;
        allButtonMatrix[lastPos.row][lastPos.col].disabled = true;

        //  Calculate winner
        getWinner(lastPos.row, lastPos.col, allButtonMatrix);

        //  Check draw
        if (buttonsRef.current) {
          const buttonValues = [...buttonsRef.current.children].map(
            (item) => item.value
          );
          if (!buttonValues.includes('')) {
            setGameIsDraw(true);
          }
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
    navigate('/');
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
        <EventButton linkTo="/" clickEvent={handleRestartClick} text="Restart" />
      ) : null}

      <ChatWindow />
    </div>
  );
}

export default OnlineGame;
