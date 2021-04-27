import { combineReducers } from "redux";
import playerReducer from "./player-reducer";
import squareReducer from "./square-reducer";

const reducers = combineReducers({
  player: playerReducer,
  square: squareReducer,
});

export default reducers;
