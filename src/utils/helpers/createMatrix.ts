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

export const createMatrix = (size: number) => {
  let matrix = [];
  const grid = [];

  for (let i = 0; i < size; i++) {
    const items = [...Array(size).keys()].map(
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
