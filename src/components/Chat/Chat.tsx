import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import type { KeyboardEvent } from 'react';
import type { Reducers } from '../../types';
import socket from '../../server';

interface ChatData {
  _id: string;
  playerName: string;
  message: string;
}

function Chat() {
  const textRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const playerMark = useSelector((state: Reducers) => state.marks.playerMark);
  const bluePlayerName = useSelector(
    (state: Reducers) => state.players.blue.name
  );
  const redPlayerName = useSelector(
    (state: Reducers) => state.players.red.name
  );

  const roomId = localStorage.getItem('room');
  const [chatData, setChatData] = useState<ChatData[]>([]);

  const sendChatDataToServer = (message: string) => {
    const playerName = playerMark === 'X' ? bluePlayerName : redPlayerName;
    socket.emit('send-message', { roomId, playerName, message });
  };

  const sendMessage = () => {
    if (!textRef.current?.value) return;
    sendChatDataToServer(textRef.current.value);
    textRef.current.value = '';
  };

  const sendMessageOnKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  useEffect(() => {
    let isMounted = true;

    const updateMessagesHandler = `update-messages-${roomId}`;
    socket.on(updateMessagesHandler, (data: ChatData[]) => {
      if (isMounted) {
        setChatData(data);
        if (chatWindowRef.current) {
          chatWindowRef.current.scrollTo(0, chatWindowRef.current.scrollHeight);
        }
      }
    });

    return () => {
      // Set the flag to false on component unmount
      isMounted = false;
    };
  }, [roomId]);

  return (
    <div className="chat-window">
      <div className="chat-window-textarea" ref={chatWindowRef}>
        {chatData.map((item) => (
          <p key={item._id}>
            <b className={item.playerName === bluePlayerName ? 'blue' : 'red'}>
              {item.playerName}:
            </b>{' '}
            {item.message}
          </p>
        ))}
      </div>

      <input
        onKeyDown={sendMessageOnKey}
        ref={textRef}
        type="text"
        name=""
        id=""
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
