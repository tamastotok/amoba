import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import PlayerName from "./PlayerName";
import StarterSymbol from "./StarterSymbol";
import { selectStarterSymbol } from "../../actions/symbols_action";

export default function Home() {
  const dispatch = useDispatch();
  const players = useSelector((state) => state.players);
  const symbol = useSelector((state) => state.symbols);

  //  Set symbol to X if not selected
  const handleClick = () => {
    if (symbol.starterSymbol === "") {
      dispatch(selectStarterSymbol("X"));
    }
  };

  return (
    <>
      <div className="input-container">
        <PlayerName symbol="X" id="1" name={players.blue.name} />
        <PlayerName symbol="O" id="2" name={players.red.name} />
      </div>
      <div className="symbol-container">
        <StarterSymbol />
      </div>

      <div className="start-button">
        <Link to="/game">
          <button onClick={handleClick}>START</button>
        </Link>
      </div>
    </>
  );
}
