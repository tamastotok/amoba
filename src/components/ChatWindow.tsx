import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import socket from '../server';
import { Reducers } from '../types';

function ChatWindow() {
  const location = useLocation();
  const [chatData, setChatData] = useState<any>([]);
  const textRef = useRef<any>(null);
  const playerMark = useSelector((state: Reducers) => state.marks.playerMark);
  const bluePlayerName = useSelector((state: Reducers) => state.players.blue.name);
  const redPlayerName = useSelector((state: Reducers) => state.players.red.name);
  const roomId = location.pathname.slice(location.pathname.indexOf('=') + 1);

  const sendChatDataToServer = (message: string) => {
    if (playerMark === 'X') {
      socket.emit('send-message', { roomId, playerName: bluePlayerName, message });
    } else {
      socket.emit('send-message', { roomId, playerName: redPlayerName, message });
    }
  };

  const handleSendMessage = (e: any) => {
    if (e.key === 'Enter' && textRef.current) {
      sendChatDataToServer(textRef.current.value);
      textRef.current.value = '';
    }
  };

  useEffect(() => {
    socket.on(`update-messages-${roomId}`, (data: any) => {
      setChatData(data);
    });
  }, [roomId]);

  return (
    <div>
      {chatData.map((item: any) => (
        <div key={item._id} style={{ display: 'flex' }}>
          <p>
            {/* item.playerName-et törölni ha ugyanaz a player ír egymás után */}
            {item.playerName}: {item.message}
          </p>
        </div>
      ))}

      <input onKeyDown={handleSendMessage} ref={textRef} type="text" name="" id="" />
      <button>Send</button>
    </div>
  );
}

export default ChatWindow;
