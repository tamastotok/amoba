import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setBoardData } from '../../store/board/board.action';
import { setNextMark } from '../../store/marks/marks.action';
import { checkAndDispatchWinner } from '../../utils/helpers/checkWinningPatterns';
import type { Mark, Reducers } from '../../types';
import { useSelector } from 'react-redux';

interface SquareLocalProps {
  id: string;
  row: number;
  col: number;
}

function SquareLocal({ id, row, col }: SquareLocalProps) {
  const dispatch = useAppDispatch();
  const value = useAppSelector((s) => s.board[row][col]); // '' | 'X' | 'O'
  const nextMark = useAppSelector((s) => s.marks.nextMark);
  const gridDisabled = useAppSelector((s) => s.gridIsDisabled);
  const board = useAppSelector((s) => s.board);
  const winner = useSelector((state: Reducers) => state.winner);
  const gameIsDraw = useSelector((state: Reducers) => state.gameIsDraw);

  const handleClick = () => {
    if (gridDisabled || value || gameIsDraw || winner) return;

    // clone board
    const nextBoard = board.map((r) => r.slice());
    nextBoard[row][col] = nextMark as Mark;

    dispatch(setBoardData({ row, col, value: nextMark as Mark }));
    dispatch(setNextMark());

    checkAndDispatchWinner(row, col, nextBoard);
  };

  return (
    <button
      className="square-button"
      id={id}
      data-row={row}
      data-col={col}
      value={value}
      onClick={handleClick}
      disabled={gridDisabled || !!value}
    >
      {value}
    </button>
  );
}

export default SquareLocal;
