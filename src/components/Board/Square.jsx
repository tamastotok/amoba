import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setNextSymbol } from "../../actions/symbols_action";
import { setWinner } from "../../actions/winner_action";

function Square({ row, rowindex, column }) {
  const dispatch = useDispatch();
  const winner = useSelector((state) => state.winner);
  const nextSymbol = useSelector((state) => state.symbols.nextSymbol);

  // Button settings
  const [value, setValue] = useState(" ");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [rowIndexState, setRowIndexState] = useState(null);
  const [colState, setColState] = useState(null);

  //  Put every button into an array
  const allButton = [...document.querySelectorAll(".square-button")];
  //  Make a 2d array from buttons array
  const allButtonMatrix = [];
  while (allButton.length) allButtonMatrix.push(allButton.splice(0, 10));

  // Create logic
  const winningFormation = () => {
    let fiveRow = [];
    let fiveColumn = [];
    let fiveDiagonal = {
      ascending: [],
      descending: [],
    };

    // Create empty array for selected buttons (+-4 from it't position)
    let allButtonValues = [];

    // Get every value around the selected button (+-4 from position)
    for (let i = rowIndexState - 5; i <= rowIndexState + 3; i++) {
      for (let j = colState - 5; j <= colState + 3; j++) {
        // error handling (array position doesn't exist)
        if (!allButtonMatrix[i] || !allButtonMatrix[i][j]) {
          allButtonValues.push("null");
        } else {
          allButtonValues.push(allButtonMatrix[i][j]);
        }
      }
    }

    //console.log(allButtonValues);

    // Select buttons from array in order:
    // Ascending (diagonal)
    for (let i = allButtonValues.length - 2; i > 0; i--) {
      //console.log(allButtonValues[i]);
      if (i % 8 === 0) {
        //console.log(allButtonValues[i]);
        fiveDiagonal.ascending.push(allButtonValues[i]);
      }
    }

    // Descending (diagonal)
    for (let i = 0; i < allButtonValues.length; i++) {
      //console.log(allButtonValues[i]);
      if (i % 10 === 0) {
        //console.log(allButtonValues[i]);
        fiveDiagonal.descending.push(allButtonValues[i]);
      }
    }

    // Row
    for (let i = 36; i < 45; i++) {
      //console.log(allButtonValues[i]);
      fiveRow.push(allButtonValues[i]);
    }

    // Column
    for (let i = 0; i < allButtonValues.length; i++) {
      if ((i + 5) % 9 === 0) {
        //console.log(allButtonValues[i]);
        fiveColumn.push(allButtonValues[i]);
      }
    }

    checkWin(fiveRow);
    checkWin(fiveColumn);
    checkWin(fiveDiagonal.ascending);
    checkWin(fiveDiagonal.descending);
  };

  // Check if arrays has 5 same value
  const checkWin = (array) => {
    //  Put selected buttons into an empty array
    let values = [];
    for (let i = 0; i < array.length; i++) {
      values.push(array[i].value);
      //console.log(array.slice(0, 5));
    }

    // Check if all values are the same
    for (let i = 0; i <= 4; i++) {
      if (values.slice(i, i + 5).every((v) => v === "X")) {
        dispatch(setWinner("X"));
        //console.log("X win");
      }
      if (values.slice(i, i + 5).every((v) => v === "O")) {
        dispatch(setWinner("O"));
        //console.log("O win");
      }
      //console.log(values.slice(i, i + 5));
    }
  };

  const handleClick = (e) => {
    // Get button position
    setRowIndexState(parseInt(e.target.attributes.rowindex.value));
    setColState(parseInt(e.target.attributes.col.value));

    // Change the symbol and disable the selected button
    setValue(nextSymbol);
    dispatch(setNextSymbol());
    setIsDisabled(true);

    // Trigger function
    setIsClicked(true);
  };

  useEffect(() => {
    if (isClicked) {
      winningFormation();
    }

    setIsClicked(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClicked]);

  return (
    <button
      className="square-button"
      id={`${row}/${column}`}
      row={row}
      rowindex={rowindex}
      col={column}
      value={value}
      onClick={handleClick}
      disabled={winner ? true : isDisabled}
    >
      {value}
    </button>
  );
}

export default Square;
