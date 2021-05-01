import { useDispatch } from "react-redux";
import { selectStarterSymbol } from "../../actions/symbols_action";

function StarterSymbol() {
  const dispatch = useDispatch();

  return (
    <div className="starter-symbol-container">
      <h4>Start with:</h4>
      <input
        onClick={() => dispatch(selectStarterSymbol("X"))}
        type="radio"
        name="symbol"
        id="symbol-x"
      />
      <label htmlFor="symbol-x">X</label>
      <input
        onClick={() => dispatch(selectStarterSymbol("O"))}
        type="radio"
        name="symbol"
        id="symbol-o"
      />
      <label htmlFor="symbol-o">O</label>
    </div>
  );
}

export default StarterSymbol;
