import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setBoardData } from '../../store/board/board.action';
import { setNextMark } from '../../store/marks/marks.action';
import { checkAndDispatchWinner } from '../../utils/helpers/checkWinningPatterns';
import type { Mark, Reducers } from '../../types';
import { useSelector } from 'react-redux';

interface BoardProps {
  id: string;
  rowindex: number;
  colindex: number;
}

function SquareLocal({ id, rowindex, colindex }: BoardProps) {
  const dispatch = useAppDispatch();
  const value = useAppSelector((s) => s.board[rowindex][colindex]); // '' | 'X' | 'O'
  const nextMark = useAppSelector((s) => s.marks.nextMark);
  const gridDisabled = useAppSelector((s) => s.gridIsDisabled);
  const board = useAppSelector((s) => s.board);
  const winner = useSelector((state: Reducers) => state.winner);
  const gameIsDraw = useSelector((state: Reducers) => state.gameIsDraw);

  const handleClick = () => {
    if (gridDisabled || value || gameIsDraw || winner) return;

    // clone board
    const nextBoard = board.map((r) => r.slice());
    nextBoard[rowindex][colindex] = nextMark as Mark;

    dispatch(setBoardData(rowindex, colindex, nextMark as Mark));
    dispatch(setNextMark());

    checkAndDispatchWinner(rowindex, colindex, nextBoard);
  };

  return (
    <button
      className="square-button"
      id={id}
      data-row={rowindex}
      data-col={colindex}
      value={value}
      onClick={handleClick}
      disabled={gridDisabled || !!value}
    >
      {value}
    </button>
  );
}

export default SquareLocal;
