//  Get square DOM elements and put them in a 2d array
export const getSquareFromDOM = (ref: any, size: number) => {
  const allButton = [...ref.current.children];
  const allButtonMatrix: any = [];

  while (allButton.length) allButtonMatrix.push(allButton.splice(0, size));

  return allButtonMatrix;
};
