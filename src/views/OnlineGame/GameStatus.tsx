import { CSSProperties } from 'react';
import { useSelector } from 'react-redux';
import { Reducers } from '../../types';

function GameStatus() {
  const marks = useSelector((state: Reducers) => state.marks);
  const winner = useSelector((state: Reducers) => state.winner);
  const gridSize = useSelector((state: Reducers) => state.gridSize);
  const gridIsDisabled = useSelector((state: Reducers) => state.gridIsDisabled);

  const customH1Style = {
    textAlign: 'left',
    width: `${gridSize * 40 + 8}px`,
  } as CSSProperties;

  const customNextPlayerStyle = {
    color: `${marks.nextMark === 'X' ? `#3f51b5` : `#f50057`}`,
  } as CSSProperties;

  const customWinnerStyle = {
    color: `${winner === 'X' ? `#3f51b5` : `#f50057`}`,
  } as CSSProperties;

  return (
    <div className="margin-auto">
      {winner ? (
        <h1 style={customH1Style}>
          Winner:{' '}
          <span style={customWinnerStyle}>
            {winner === marks.playerMark ? 'You' : winner}
          </span>
        </h1>
      ) : (
        <h1 style={customH1Style}>
          Next:{' '}
          <span style={customNextPlayerStyle}>
            {!gridIsDisabled ? 'You' : marks.nextMark}
          </span>
        </h1>
      )}
    </div>
  );
}

export default GameStatus;
