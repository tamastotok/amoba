import store from '../../store';
import { setWinner } from '../../store/winner/winner.action';
import { setGridIsDisabled } from '../../store/grid-disable/grid-disable.action';

//  Put pattern check functions into 1 function
export const getWinner = (row: number, col: number, array: any[]) => {
  rowPattern(row, col, array);
  colPattern(row, col, array);
  ascendDiagonalPattern(row, col, array);
  descendDiagonalPattern(row, col, array);
};

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

const checkSameValues = (array: string[]) => {
  for (let i = 0; i < 6; i++) {
    if (i > 4) return;

    if (array.slice(i, i + 5).every((v: string) => v === 'X')) {
      console.log('x true', array.slice(i, i + 5));
      store.dispatch(setGridIsDisabled(true));
      store.dispatch(setWinner('X'));
    }

    if (array.slice(i, i + 5).every((v: string) => v === 'O')) {
      console.log('o true');
      store.dispatch(setGridIsDisabled(true));
      store.dispatch(setWinner('O'));
    }
  }
};
