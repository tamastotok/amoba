import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { Reducers } from '../../types';

interface MessageBoardProps {
  onlineUserCount: number;
  statusMessage: string;
}

function MessageBoard({ onlineUserCount, statusMessage }: MessageBoardProps) {
  const [userOnline, setUserOnline] = useState(0);
  const bluePlayer = useSelector((state: Reducers) => state.players.blue);
  const redPlayer = useSelector((state: Reducers) => state.players.red);

  const blue = bluePlayer.name && `${bluePlayer.mark}: ${bluePlayer.name}`;
  const red = redPlayer.name && `${redPlayer.mark}: ${redPlayer.name}`;

  useEffect(() => {
    if (onlineUserCount) setUserOnline(onlineUserCount);
  }, [onlineUserCount]);

  return (
    <div className="message-board">
      <h2 className="text-center">{statusMessage}</h2>

      <div className="players-center">
        <h4 className="align-top-center">Players</h4>
        <p className="fw-600 blue">{blue}</p>
        <p className="fw-600 red">{red}</p>
      </div>

      <p className="bottom-right">
        {userOnline}
        <span> user(s) online</span>
      </p>
    </div>
  );
}

export default MessageBoard;
