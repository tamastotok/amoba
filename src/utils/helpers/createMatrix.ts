export interface Sqr {
  row: number;
  col: number;
  value: string;
}

export const createMatrix = (size: number): Sqr[] => {
  const grid: Sqr[] = [];

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      grid.push({ row, col, value: '' });
    }
  }

  return grid;
};
