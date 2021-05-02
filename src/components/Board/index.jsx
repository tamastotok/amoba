import Square from "./Square";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setWinner } from "../../actions/winner_action";
import { resetNextSymbol } from "../../actions/symbols_action";

function Board() {
  const dispatch = useDispatch();

  const players = useSelector((state) => state.players);
  const symbols = useSelector((state) => state.symbols);
  const winner = useSelector((state) => state.winner);

  const column = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const rows = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

  //  Create 2d array for render squares
  const combineArrays = () => {
    let board = [];
    for (let i = 0; i < column.length; i++) {
      board.push(column);
    }
    return board;
  };

  //  Reset winner and symbol
  const handleClick = () => {
    dispatch(setWinner(""));
    dispatch(resetNextSymbol(symbols.starterSymbol));
  };

  return (
    <div>
      <h1 style={{ margin: "20px auto", width: "fit-content" }}>
        {winner ? `Winner: ${winner}` : `Next: ${symbols.nextSymbol}`}
      </h1>
      <div className="board-container">
        {combineArrays().map((row, index) => {
          return (
            <div key={index} id={`${rows[index]}`} style={{ display: "flex" }}>
              {row.map((element) => {
                return (
                  <Square
                    key={element}
                    row={rows[index]}
                    rowindex={column[index]}
                    column={element}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="players-container">
        <h3>
          {players.blue.name === "" ? "" : `Player X: ${players.blue.name}`}
        </h3>
        <h3>
          {players.red.name === "" ? "" : `Player O: ${players.red.name}`}
        </h3>
      </div>

      {winner ? (
        <div className="restart-button">
          <Link to="/">
            <button onClick={handleClick}>RESTART</button>
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export default Board;
