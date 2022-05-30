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
  const chatWindowRef = useRef<any>(null);

  const sendChatDataToServer = (message: string) => {
    if (playerMark === 'X') {
      socket.emit('send-message', { roomId, playerName: bluePlayerName, message });
    } else {
      socket.emit('send-message', { roomId, playerName: redPlayerName, message });
    }
  };

  // Send message if 'Enter is pressed'
  const sendMessageOnKey = (e: any) => {
    if (!textRef.current.value) return;
    if (e.key === 'Enter' && textRef.current) {
      sendChatDataToServer(textRef.current.value);
      textRef.current.value = '';
    }
  };

  // Send message if 'Send' button is clicked
  const sendMessageOnClick = () => {
    if (!textRef.current.value) return;
    if (textRef.current) {
      sendChatDataToServer(textRef.current.value);
      textRef.current.value = '';
    }
  };

  useEffect(() => {
    socket.on(`update-messages-${roomId}`, (data: any) => {
      setChatData(data);

      window.scrollTo({
        behavior: 'smooth',
        top: chatWindowRef.current.scrollTo(0, chatWindowRef.current.scrollHeight),
      });
    });
  }, [roomId]);

  return (
    <div className="chat-window">
      <div className="chat-window-textarea" ref={chatWindowRef}>
        {chatData.map((item: any) => (
          <p key={item._id}>
            <b
              style={{
                color: item.playerName === bluePlayerName ? '#3f51b5' : '#f50057',
              }}
            >
              {item.playerName}:
            </b>{' '}
            {item.message}
          </p>
        ))}
      </div>

      <input onKeyDown={sendMessageOnKey} ref={textRef} type="text" name="" id="" />
      <button onClick={sendMessageOnClick}>Send</button>
    </div>
  );
}

export default ChatWindow;
