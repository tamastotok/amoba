import type { CSSProperties } from 'react';
import type { Reducers } from '@/types';
import { useSelector } from 'react-redux';
import { BLUE, RED } from '@/utils/constants';

function GameStatusOnline() {
  const marks = useSelector((state: Reducers) => state.marks);
  const winner = useSelector((state: Reducers) => state.winner);
  const isDraw = useSelector((state: Reducers) => state.winner);
  const gridIsDisabled = useSelector((state: Reducers) => state.gridIsDisabled);

  const customH1Style = {
    textAlign: 'left',
  } as CSSProperties;

  const customNextPlayerStyle = {
    color: `${marks.nextMark === 'X' ? BLUE : RED}`,
  } as CSSProperties;

  const customWinnerStyle = {
    color: `${winner === 'X' ? BLUE : RED}`,
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

    if (isDraw) {
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

  return gameState();
}

export default GameStatusOnline;
