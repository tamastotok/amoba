import { useSelector } from 'react-redux';
import { Reducers } from '../types';

function MessageBoard({ onlineUserCount, statusMessage, roomId }: any) {
  const bluePlayer = useSelector((state: Reducers) => state.players.red);
  const redPlayer = useSelector((state: Reducers) => state.players.blue);

  const blue = bluePlayer.name && `${bluePlayer.mark}: ${bluePlayer.name}`;
  const red = redPlayer.name && `${redPlayer.mark}: ${redPlayer.name}`;

  const online =
    onlineUserCount < 2
      ? `${onlineUserCount} user online`
      : `${onlineUserCount} users online`;

  return (
    <div className="message-board">
      <h2 className="text-center">{statusMessage}</h2>

      <div className="players-center">
        <h4 className="align-top-center">Players</h4>
        <p className="custom-p blue">{blue}</p>
        <p className="custom-p red">{red}</p>
      </div>

      <div className="game-id-container">
        {roomId && (
          <h4 className="text-right">
            GAME ID: <u>{roomId}</u>
          </h4>
        )}
      </div>

      <p className="bottom-right">{online}</p>
    </div>
  );
}

export default MessageBoard;
