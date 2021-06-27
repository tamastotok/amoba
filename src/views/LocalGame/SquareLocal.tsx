import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setNextMark } from '../../store/marks/marks.action';
import { setSquareData } from '../../store/square/square.action';
import { Reducers } from '../../types';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    row?: number;
    col?: number;
  }
}

interface SquareProps {
  id: string;
  rowindex: number;
  colindex: number;
}

function SquareLocal({ id, rowindex, colindex }: SquareProps) {
  const dispatch = useDispatch();
  const winner = useSelector((state: Reducers) => state.winner);
  const nextMark = useSelector((state: Reducers) => state.marks.nextMark);
  const [squareValue, setSquareValue] = useState('');
  const [squareIsDisabled, setSquareIsDisabled] = useState(false);

  const handleClick = (e: any) => {
    setSquareValue(nextMark);
    setSquareIsDisabled(true);
    dispatch(
      setSquareData(
        parseInt(e.target.attributes.row.value),
        parseInt(e.target.attributes.col.value),
        nextMark
      )
    );
    dispatch(setNextMark());
  };

  return (
    <button
      className="square-button"
      id={id}
      row={rowindex}
      col={colindex}
      value={squareValue}
      onClick={handleClick}
      disabled={winner ? true : squareIsDisabled}
    >
      {squareValue}
    </button>
  );
}

export default SquareLocal;
