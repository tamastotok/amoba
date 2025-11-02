import store from '@/store';
import { setWinner } from '@/store/winner/winner.action';
import { setGridIsDisabled } from '@/store/grid-disable/grid-disable.action';
import type { Mark, Board, Direction, MoveContext } from '@/types';

const isMark = (x: string): x is Mark => x === 'X' || x === 'O';

export const getWinner = (
  row: number,
  col: number,
  board: Board
): Mark | null => {
  const mark = board[row]?.[col];
  if (!mark || !isMark(mark)) return null;

  const directions: Direction[] = [
    { dRow: 1, dCol: 0 }, // ↓ south
    { dRow: 0, dCol: 1 }, // → east
    { dRow: 1, dCol: 1 }, // ↘ southeast
    { dRow: 1, dCol: -1 }, // ↙ southwest
  ];

  for (const dir of directions) {
    const ctx: MoveContext = { row, col, ...dir, mark, board };
    if (checkDirection(ctx)) return mark;
  }

  return null;
};

const checkDirection = (ctx: MoveContext): boolean => {
  let count = 1;
  count += countMatches(ctx);
  count += countMatches({ ...ctx, dRow: -ctx.dRow, dCol: -ctx.dCol });
  return count >= 5;
};

const countMatches = (ctx: MoveContext): number => {
  const { board, mark, row, col, dRow, dCol } = ctx;
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
