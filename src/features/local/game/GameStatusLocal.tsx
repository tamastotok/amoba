import { useSelector } from 'react-redux';
import type { CSSProperties } from 'react';
import { BLUE, RED } from '@/utils/constants';
import type { Reducers } from '@/types';

function GameStatusLocal() {
  const marks = useSelector((state: Reducers) => state.marks);
  const winner = useSelector((state: Reducers) => state.winner);
  const isDraw = useSelector((state: Reducers) => state.gameIsDraw);

  // Styles
  const h1Style: CSSProperties = { textAlign: 'left' };
  const nextStyle: CSSProperties = {
    color: marks.nextMark === 'X' ? BLUE : RED,
  };
  const winnerStyle: CSSProperties = {
    color: winner === 'X' ? BLUE : RED,
  };

  // Local-specific game status
  if (winner) {
    return (
      <h1 style={h1Style}>
        Winner: <span style={winnerStyle}>{winner}</span>
      </h1>
    );
  }

  if (isDraw) {
    return <h1 style={h1Style}>Draw</h1>;
  }

  return (
    <h1 style={h1Style}>
      Next: <span style={nextStyle}>{marks.nextMark}</span>
    </h1>
  );
}

export default GameStatusLocal;
