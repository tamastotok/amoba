import { combineReducers } from "redux";
import playersReducer from "./players-reducer";
import squareReducer from "./square-reducer";
import symbolsReducer from "./symbols-reducer";
import winnerReducer from "./winner-reducer";

const reducers = combineReducers({
  players: playersReducer,
  square: squareReducer,
  symbols: symbolsReducer,
  winner: winnerReducer,
});

export default reducers;
