import { useDispatch } from "react-redux";
import {
  setPlayerBlueName,
  setPlayerRedName,
} from "../../actions/players_action";

function PlayerName({ symbol, id, name }) {
  const dispatch = useDispatch();

  //  Store player names
  const handleChange = (e) => {
    if (id === "1") {
      console.log("blue");
      dispatch(setPlayerBlueName(e.target.value));
    } else if (id === "2") {
      console.log("red");
      dispatch(setPlayerRedName(e.target.value));
    } else return;
  };

  return (
    <div className="player-names-container">
      <h4>Player {symbol}:</h4>
      <input
        onChange={handleChange}
        type="text"
        id={id}
        name={id}
        placeholder="Enter your name"
        required
        value={name ? name : ""}
      />
    </div>
  );
}

export default PlayerName;
