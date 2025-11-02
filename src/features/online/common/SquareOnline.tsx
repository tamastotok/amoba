import { useAppSelector } from '@/store/hooks';
import socket from '@/server';
import type { Mark } from '@/types';

interface SquareOnlineProps {
  id: string;
  rowindex: number;
  colindex: number;
  roomId: string;
  isAIGame?: boolean;
  aiMark?: Mark; // optional
}

function SquareOnline({ id, rowindex, colindex, roomId }: SquareOnlineProps) {
  const board = useAppSelector((s) => s.board);
  const value = board?.[rowindex]?.[colindex] ?? '';
  const nextMark = useAppSelector((s) => s.marks.nextMark);
  const gridIsDisabled = useAppSelector((s) => s.gridIsDisabled);

  const handleClick = () => {
    if (!roomId) {
      console.warn('No roomId found — cannot emit move');
      return;
    }

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
