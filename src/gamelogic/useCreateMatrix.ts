import { useSelector } from 'react-redux';
import { Reducers } from '../types';

interface Sqr {
  row: number;
  col: number;
  value: string;
}

const square: Sqr = {
  row: 0,
  col: 0,
  value: '',
};

export const useCreateMatrix = () => {
  const gridSize = useSelector((state: Reducers) => state.gridSize);
  let matrix = [];
  const grid = [];

  for (let i = 0; i < gridSize; i++) {
    const items = [...Array(gridSize).keys()].map(
      (item: any, index: number) => (item = { ...square, row: i, col: index })
    );
    matrix[i] = items;
  }

  for (let row of matrix) {
    for (let item of row) {
      grid.push(item);
    }
  }
  return grid;
};
