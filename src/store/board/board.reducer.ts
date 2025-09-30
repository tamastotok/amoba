import { makeBoard } from '../../utils/helpers/board';
import type { Action, Board, Mark } from '../../types';
import {
  SET_GRID_SIZE,
  SET_BOARD_DATA,
  HYDRATE_BOARD,
} from '../../utils/constants';

type SetBoardPayload = { row: number; col: number; value: Mark };
type HydratePayload = {
  positions: Array<{ row: number; col: number; value: Mark }>;
  size: number;
};
type SetGridSizeAction = Action<number> & { type: typeof SET_GRID_SIZE };
type SetBoardDataAction = Action<{ row: number; col: number; value: Mark }> & {
  type: typeof SET_BOARD_DATA;
};
type HydrateBoardAction = Action<{
  size: number;
  positions: Array<{ row: number; col: number; value: Mark }>;
}> & {
  type: typeof HYDRATE_BOARD;
};
type BoardAction = SetGridSizeAction | SetBoardDataAction | HydrateBoardAction;
// pick an initial size (e.g., from sessionStorage or 8)
const initialSize = Number(sessionStorage.getItem('gridSize') || 8);
const initialState: Board = makeBoard(initialSize);

const boardReducer = (state = initialState, action: BoardAction): Board => {
  switch (action.type) {
    case SET_GRID_SIZE: {
      const size = action.payload as number;
      return makeBoard(size);
    }
    case SET_BOARD_DATA: {
      const { row, col, value } = action.payload as SetBoardPayload;
      // immutable update
      if (state[row]?.[col] === undefined) return state;
      if (state[row][col] !== '') return state; // ignore overwrites
      const next = state.map((r) => r.slice());
      next[row][col] = value;
      return next;
    }
    case HYDRATE_BOARD: {
      const { positions, size } = action.payload as HydratePayload;
      const next = makeBoard(size);
      for (const p of positions) {
        next[p.row][p.col] = p.value;
      }
      return next;
    }
    default:
      return state;
  }
};

export default boardReducer;
