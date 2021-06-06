import store from '../store';
import { setWinner } from '../actions/winner_action';

//  Put pattern check functions into 1 function
export const getWinner = (row: number, col: number, array: any[]) => {
  rowPattern(row, col, array);
  colPattern(row, col, array);
  ascendDiagonalPattern(row, col, array);
  descendDiagonalPattern(row, col, array);
};

/*  
    Example:
    button position +-4 values = v (null in default)
    button = X or O

    1.  When a button is clicked on the grid, collect all values around it
        (button position +-4 every dimension in a 2d array),
        [
          [v,v,v,v,v,v,v,v,v]
          [v,v,v,v,v,v,v,v,v]
          [v,v,v,v,v,v,v,v,v]
          [v,v,v,v,v,v,v,v,v]
          [v,v,v,v,O,v,v,v,v]       'O' is the clicked button
          [v,v,v,v,v,v,v,v,v]
          [v,v,v,v,v,v,v,v,v]
          [v,v,v,v,v,v,v,v,v]
          [v,v,v,v,v,v,v,v,v]
        ]

    2.  Check winning patterns (row, col, diagonal),
        Example: diagonal
        [
          [v,v,v,v,v,v,v,v, "O" ]
          [v,v,v,v,v,v,v, "X", v]
          [v,v,v,v,v,v, "X", v,v]
          [v,v,v,v,v, "O", v,v,v]
          [v,v,v,v, "O", v,v,v,v]
          [v,v,v, "X", v,v,v,v,v]
          [v,v, "X", v,v,v,v,v,v]
          [v, "X", v,v,v,v,v,v,v]
          [ "X", v,v,v,v,v,v,v,v]
        ]

    3.  Put their values into an array
        [v,v,v,v,"O",v,v,v,v] 
        9 values in total
*/

//  Check row pattern
const rowPattern = (row: number, col: number, array: any[]) => {
  const values: string[] = [];
  for (let j = col - 4; j <= col + 4; ) {
    if (!array[row] || !array[row][j]) {
      values.push('null');
      j++;
    } else {
      values.push(array[row][j].attributes.value.value);
      j++;
    }
  }
  checkSameValues(values);
};

//  Check col pattern
const colPattern = (row: number, col: number, array: any[]) => {
  const values: string[] = [];
  for (let i = row - 4; i <= row + 4; ) {
    if (!array[i] || !array[i][col]) {
      values.push('null');
      i++;
    } else {
      values.push(array[i][col].attributes.value.value);
      i++;
    }
  }
  checkSameValues(values);
};

//  Check diagonal pattern
const ascendDiagonalPattern = (row: number, col: number, array: any[]) => {
  const values: string[] = [];
  for (let i = row - 4; i <= row + 4; ) {
    for (let j = col + 4; j >= col - 4; ) {
      if (!array[i] || !array[i][j]) {
        values.push('null');
        i++;
        j--;
      } else {
        values.push(array[i][j].attributes.value.value);
        i++;
        j--;
      }
    }
  }
  checkSameValues(values);
};

//  Check diagonal pattern
const descendDiagonalPattern = (row: number, col: number, array: any[]) => {
  const values: string[] = [];
  for (let i = row - 4; i <= row + 4; ) {
    for (let j = col - 4; j <= col + 4; ) {
      if (!array[i] || !array[i][j]) {
        values.push('null');
        i++;
        j++;
      } else {
        values.push(array[i][j].attributes.value.value);
        i++;
        j++;
      }
    }
  }
  checkSameValues(values);
};

/*  Check if array (created from patterns) has the same values (X or O)
    
    1.  Check if element from position 0 to 4 are the same (X or O)
        Example:
        [["O","O","X","X","X"],"X","X","O","O"]

    2.  If yes, we got the winner

    3.  If not, check again from position + 1
        Example:
        ["O",["O","X","X","X","X"],"X","O","O"]
*/

const checkSameValues = (array: string[]) => {
  let values = array;
  for (let i = 0; i <= 5; ) {
    if (values.slice(i, i + 5).every((v) => v === 'X')) {
      store.dispatch(setWinner('X'));
      values = [];
      break;
    }
    if (values.slice(i, i + 5).every((v) => v === 'O')) {
      store.dispatch(setWinner('O'));
      values = [];
      break;
    }
    i++;
  }
};
