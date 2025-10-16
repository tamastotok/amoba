import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, TextField, Button, useTheme } from '@mui/material';
import type { Reducers } from '../../types';
import socket from '../../server';

interface ChatData {
  _id: string;
  playerName: string;
  message: string;
}

function Chat() {
  const theme = useTheme();
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
    const value = textRef.current?.value?.trim();
    if (!value) return;
    sendChatDataToServer(value);
    textRef.current!.value = '';
  };

  const sendMessageOnKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  useEffect(() => {
    let isMounted = true;
    const updateMessagesHandler = `update-messages-${roomId}`;

    socket.on(updateMessagesHandler, (data: ChatData[]) => {
      if (isMounted) {
        setChatData(data);
        chatWindowRef.current?.scrollTo(0, chatWindowRef.current.scrollHeight);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [roomId]);

  return (
    <Box
      sx={{
        //width: { xs: '100%', md: 280 },
        width: 280,
        height: 300,
        backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f9f9f9',
        borderTop: { xs: `1px solid ${theme.palette.divider}`, md: 'none' },
        border: { md: `1px solid ${theme.palette.divider}` },
        borderRadius: { xs: '10px 10px 0 0', md: 2 },
        boxShadow: theme.shadows[5],
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 1200,
        margin: '0 1rem',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 1,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          fontWeight: 600,
          textAlign: 'center',
        }}
      >
        <Typography variant="subtitle1">Chat</Typography>
      </Box>

      {/* Messages */}
      <Box
        ref={chatWindowRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 2,
          py: 1,
          fontSize: '0.9rem',
        }}
      >
        {chatData.map((item) => (
          <Typography key={item._id} sx={{ mb: 0.5, wordWrap: 'break-word' }}>
            <Box
              component="b"
              sx={{
                color:
                  item.playerName === bluePlayerName
                    ? theme.palette.info.main
                    : theme.palette.error.main,
              }}
            >
              {item.playerName}:
            </Box>{' '}
            {item.message}
          </Typography>
        ))}
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          p: 1,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor:
            theme.palette.mode === 'dark'
              ? '#222'
              : theme.palette.background.paper,
        }}
      >
        <TextField
          inputRef={textRef}
          variant="outlined"
          size="small"
          placeholder="Type a message..."
          fullWidth
          onKeyDown={sendMessageOnKey}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={sendMessage}
          sx={{ flexShrink: 0 }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}

export default Chat;
