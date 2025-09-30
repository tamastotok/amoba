import store from '../../store';
import { setWinner } from '../../store/winner/winner.action';
import { setGridIsDisabled } from '../../store/grid-disable/grid-disable.action';

export type Mark = 'X' | 'O';
export type Board = (Mark | '')[][];

const isMark = (x: string): x is Mark => x === 'X' || x === 'O';

export const getWinner = (
  row: number,
  col: number,
  board: Board
): Mark | null => {
  const directions: Array<[number, number]> = [
    [0, 1], // →
    [1, 0], // ↓
    [1, 1], // ↘
    [-1, 1], // ↗
  ];

  const mark = board[row]?.[col];
  if (!mark || !isMark(mark)) return null;

  for (const [dRow, dCol] of directions) {
    if (checkDirection(row, col, dRow, dCol, board, mark)) {
      return mark; // return winner; let caller dispatch
    }
  }
  return null;
};

const checkDirection = (
  row: number,
  col: number,
  dRow: number,
  dCol: number,
  board: Board,
  mark: Mark
): boolean => {
  let count = 1;
  count += countMatches(row, col, dRow, dCol, board, mark);
  count += countMatches(row, col, -dRow, -dCol, board, mark);
  return count >= 5;
};

const countMatches = (
  row: number,
  col: number,
  dRow: number,
  dCol: number,
  board: Board,
  mark: Mark
): number => {
  let matches = 0;
  let r = row + dRow;
  let c = col + dCol;
  while (board[r]?.[c] === mark) {
    matches++;
    r += dRow;
    c += dCol;
  }
  return matches;
};

// Helper if you still want to keep old behavior here:
export const checkAndDispatchWinner = (
  row: number,
  col: number,
  board: Board
) => {
  const winner = getWinner(row, col, board);
  if (winner) {
    store.dispatch(setGridIsDisabled(true));
    store.dispatch(setWinner(winner));
  }
};
