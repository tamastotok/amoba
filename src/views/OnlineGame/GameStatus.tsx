import type { CSSProperties } from 'react';
import type { Reducers } from '../../types';
import { useSelector } from 'react-redux';

interface Draw {
  gameIsDraw: boolean;
}

function GameStatus({ gameIsDraw }: Draw) {
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

  const gameState = () => {
    if (winner) {
      return (
        <h1 style={customH1Style}>
          Winner:{' '}
          <span style={customWinnerStyle}>
            {winner === marks.playerMark ? 'You' : winner}
          </span>
        </h1>
      );
    }

    if (gameIsDraw) {
      return <h1 style={customH1Style}>Draw</h1>;
    }

    return (
      <h1 style={customH1Style}>
        Next:{' '}
        <span style={customNextPlayerStyle}>
          {!gridIsDisabled ? 'You' : marks.nextMark}
        </span>
      </h1>
    );
  };

  return <div className="margin-auto">{gameState()}</div>;
}

export default GameStatus;
