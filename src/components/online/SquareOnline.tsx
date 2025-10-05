import { useAppSelector } from '../../store/hooks';
import socket from '../../server';

interface SquareProps {
  id: string;
  rowindex: number;
  colindex: number;
  roomId: string;
  isAIGame?: boolean;
  aiMark?: 'X' | 'O'; // Optional
}

function SquareOnline({ id, rowindex, colindex, roomId }: SquareProps) {
  const value = useAppSelector((s) => s.board[rowindex][colindex]);
  const nextMark = useAppSelector((s) => s.marks.nextMark);
  const gridIsDisabled = useAppSelector((s) => s.gridIsDisabled);

  const handleClick = () => {
    if (gridIsDisabled || value) return;

    // Human vs human
    socket.emit('square-btn-click', {
      squares: { row: rowindex, col: colindex, value: nextMark, roomId },
    });
  };

  return (
    <button
      className="square-button"
      id={id}
      data-row={rowindex}
      data-col={colindex}
      value={value}
      onClick={handleClick}
      disabled={gridIsDisabled || !!value}
    >
      {value}
    </button>
  );
}

export default SquareOnline;
