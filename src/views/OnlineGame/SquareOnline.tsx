import { useState } from 'react';
import { useSelector } from 'react-redux';
import socket from '../../server';
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
  roomId: string;
}

function SquareOnline({ id, rowindex, colindex, roomId }: SquareProps) {
  const nextMark = useSelector((state: Reducers) => state.marks.nextMark);
  const [buttonValue, setButtonValue] = useState<string>('');

  const handleClick = (e: any) => {
    let squares = {
      row: parseInt(e.target.attributes.row.value),
      col: parseInt(e.target.attributes.col.value),
      value: nextMark,
      roomId: roomId,
    };

    setButtonValue(nextMark);
    e.target.disabled = true;

    //  Send data to server
    socket.emit('square-btn-click', {
      squares,
    });
  };

  return (
    <button
      className="square-button"
      id={id}
      row={rowindex}
      col={colindex}
      value={buttonValue}
      onClick={handleClick}
    >
      {}
    </button>
  );
}

export default SquareOnline;
