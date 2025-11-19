import type { Action, Board, Sqr } from '@/types';
import {
  HYDRATE_BOARD,
  SET_BOARD_DATA,
  SET_GRID_SIZE,
} from '@/utils/constants';
import { makeBoard } from '@/utils/helpers/board';

type HydratePayload = {
  size: number;
  positions: Sqr[];
};

type SetGridSizeAction = Action<number> & { type: typeof SET_GRID_SIZE };

type SetBoardDataAction = Action<Sqr> & {
  type: typeof SET_BOARD_DATA;
};

type HydrateBoardAction = Action<{
  size: number;
  positions: Sqr[];
}> & {
  type: typeof HYDRATE_BOARD;
};

type BoardAction = SetGridSizeAction | SetBoardDataAction | HydrateBoardAction;

const initialSize = Number(sessionStorage.getItem('gridSize') || 8);
const initialState: Board = makeBoard(initialSize);

const boardReducer = (state = initialState, action: BoardAction): Board => {
  switch (action.type) {
    case SET_GRID_SIZE: {
      const size = action.payload as number;
      return makeBoard(size);
    }
    case SET_BOARD_DATA: {
      const { row, col, value } = action.payload as Sqr;

      if (state[row]?.[col] === undefined) return state;
      if (state[row][col] !== '') return state;
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
