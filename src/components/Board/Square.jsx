import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setNextSymbol } from "../../actions/symbols_action";
import { setWinner } from "../../actions/winner_action";

function Square({ row, rowindex, column }) {
  const [value, setValue] = useState(" ");
  const winner = useSelector((state) => state.winner);
  const [isDisabled, setIsDisabled] = useState(false);
  const nextSymbol = useSelector((state) => state.symbols.nextSymbol);
  const buttonRef = useRef(null);
  const dispatch = useDispatch();

  const [isClicked, setIsClicked] = useState(false);
  const [rowState, setRowState] = useState("");
  const [rowIndexState, setRowIndexState] = useState(null);
  const [colState, setColState] = useState(null);

  const allButton = document.querySelectorAll(".square-button");
  const columns = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  const winningFormation = () => {
    let fiveRow = {
      fromLeft: [],
      fromRight: [],
    };

    let fiveColumn = {
      fromTop: [],
      fromBottom: [],
    };

    let fiveDiagonal = {
      rightBottom: [],
      leftBottom: [],
      rightTop: [],
      leftTop: [],
    };

    //  Check Row
    //  (A1 => A5)
    for (let i = colState - 1; i < colState + 4; i++) {
      allButton.forEach((item) => {
        if (
          item.getAttribute("row") === rowState &&
          item.getAttribute("col") === columns[i]
        ) {
          fiveRow.fromLeft.push(item.getAttribute("value"));
        }
      });
    }
    //  (A5 => A1)
    for (let j = colState - 1; j > colState - 6; j--) {
      allButton.forEach((item) => {
        if (
          item.getAttribute("row") === rowState &&
          item.getAttribute("col") === columns[j]
        ) {
          fiveRow.fromRight.push(item.getAttribute("value"));
        }
      });
    }

    //-----

    //  Check Column
    // (A1 => E1)
    for (let i = rowIndexState; i <= rowIndexState + 4; i++) {
      allButton.forEach((item) => {
        if (
          parseInt(item.getAttribute("rowindex")) === i &&
          parseInt(item.getAttribute("col")) === colState
        ) {
          fiveColumn.fromTop.push(item.getAttribute("value"));
        }
      });
    }
    // (E1 => A1)
    for (let j = rowIndexState; j >= rowIndexState - 4; j--) {
      allButton.forEach((item) => {
        if (
          parseInt(item.getAttribute("rowindex")) === j &&
          parseInt(item.getAttribute("col")) === colState
        ) {
          fiveColumn.fromBottom.push(item.getAttribute("value"));
        }
      });
    }

    //-----

    // Check Diagonals
    // (A1 => E5)
    let rightBottomDOM = [];
    for (let i = colState; i <= colState + 4; i++) {
      for (let j = rowIndexState; j <= rowIndexState + 4; j++) {
        allButton.forEach((item) => {
          if (
            parseInt(item.getAttribute("rowindex")) === j &&
            parseInt(item.getAttribute("col")) === i
          ) {
            rightBottomDOM.push(item);
          }
        });
      }
    }

    for (let i = 0; i < rightBottomDOM.length; i++) {
      if (i % 6 === 0) {
        //console.log(rightBottomDOM[i]);
        fiveDiagonal.rightBottom.push(rightBottomDOM[i].getAttribute("value"));
      }
    }

    //  (E5 => A1)
    let leftTopDOM = [];
    for (let i = colState; i > colState - 5; i--) {
      for (let j = rowIndexState; j > rowIndexState - 5; j--) {
        allButton.forEach((item) => {
          if (
            parseInt(item.getAttribute("rowindex")) === j &&
            parseInt(item.getAttribute("col")) === i
          ) {
            //console.log(item);
            leftTopDOM.push(item);
            //fveColumn.fromBottom.push(item.getAttribute("value"));
          }
        });
      }
    }

    for (let i = 0; i < leftTopDOM.length; i++) {
      if (i % 6 === 0) {
        //console.log(leftTopDOM[i]);
        fiveDiagonal.leftTop.push(leftTopDOM[i].getAttribute("value"));
      }
    }

    //  (E1 => A5)
    let rightTopDOM = [];
    for (let i = colState; i <= colState + 4; i++) {
      for (let j = rowIndexState; j > rowIndexState - 5; j--) {
        allButton.forEach((item) => {
          if (
            parseInt(item.getAttribute("rowindex")) === j &&
            parseInt(item.getAttribute("col")) === i
          ) {
            console.log(item);
            rightTopDOM.push(item);
          }
        });
      }
    }

    for (let i = 0; i < rightTopDOM.length; i++) {
      if (i % 6 === 0) {
        //console.log(rightTopDOM[i]);
        fiveDiagonal.rightTop.push(rightTopDOM[i].getAttribute("value"));
      }
    }

    //  (A5 => E1)
    let leftBottomDOM = [];
    for (let i = colState; i > colState - 5; i--) {
      for (let j = rowIndexState; j <= rowIndexState + 4; j++) {
        allButton.forEach((item) => {
          if (
            parseInt(item.getAttribute("rowindex")) === j &&
            parseInt(item.getAttribute("col")) === i
          ) {
            //console.log(item);
            leftBottomDOM.push(item);
          }
        });
      }
    }

    for (let i = 0; i < leftBottomDOM.length; i++) {
      if (i % 6 === 0) {
        //console.log(leftBottomDOM[i].getAttribute("value"));
        fiveDiagonal.leftBottom.push(leftBottomDOM[i].getAttribute("value"));
      }
    }

    checkEveryValue(fiveRow.fromLeft, "X");
    checkEveryValue(fiveRow.fromLeft, "O");
    checkEveryValue(fiveRow.fromRight, "X");
    checkEveryValue(fiveRow.fromRight, "O");

    checkEveryValue(fiveColumn.fromTop, "X");
    checkEveryValue(fiveColumn.fromTop, "O");
    checkEveryValue(fiveColumn.fromBottom, "X");
    checkEveryValue(fiveColumn.fromBottom, "O");

    checkEveryValue(fiveDiagonal.rightBottom, "X");
    checkEveryValue(fiveDiagonal.rightBottom, "O");
    checkEveryValue(fiveDiagonal.leftBottom, "X");
    checkEveryValue(fiveDiagonal.leftBottom, "O");

    checkEveryValue(fiveDiagonal.rightTop, "X");
    checkEveryValue(fiveDiagonal.rightTop, "O");
    checkEveryValue(fiveDiagonal.leftTop, "X");
    checkEveryValue(fiveDiagonal.leftTop, "O");

    console.log("new row");
    console.log("column from top: ", fiveColumn.fromTop);
    console.log("column from bottom: ", fiveColumn.fromBottom);
    console.log("row from left: ", fiveRow.fromLeft);
    console.log("row from right: ", fiveRow.fromRight);
    console.log("diagonal left bottom: ", fiveDiagonal.leftBottom);
    console.log("diagonal left top: ", fiveDiagonal.leftTop);
    console.log("diagonal right bottom: ", fiveDiagonal.rightBottom);
    console.log("diagonal  right top: ", fiveDiagonal.rightTop);
  };

  // Check if arrays has 5 same item
  const checkEveryValue = (array, symbol) => {
    //console.log(array);
    if (array.every((item) => item && item === symbol)) {
      //console.log(`${symbol} Won!`);
      dispatch(setWinner(symbol));
    }
  };

  const handleClick = (e) => {
    setRowState(e.target.attributes.row.value);
    setRowIndexState(parseInt(e.target.attributes.rowindex.value));
    setColState(parseInt(e.target.attributes.col.value));

    setValue(nextSymbol);
    dispatch(setNextSymbol());
    setIsDisabled(true);

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
      ref={buttonRef}
      onClick={handleClick}
      disabled={winner ? true : isDisabled}
    >
      {value}
    </button>
  );
}

export default Square;
