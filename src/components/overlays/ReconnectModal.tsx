import { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetGameState } from '@/store/game/game.action';
import socket from '@/server';

interface ReconnectModalProps {
  roomId: string;
  onClose?: () => void;
}

export default function ReconnectModal({
  roomId,
  onClose,
}: ReconnectModalProps) {
  const [secondsLeft, setSecondsLeft] = useState(60);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleReconnect = useCallback(() => {
    socket.emit('reconnect-room', { roomId });
  }, [roomId]);

  const handleExit = useCallback(() => {
    dispatch(resetGameState());
    socket.emit('leave-game');
    navigate('/');
    if (onClose) onClose();
  }, [dispatch, navigate, onClose]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          handleExit();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [handleExit]);

  // Listen for reconnect-success / failed
  useEffect(() => {
    const onSuccess = () => {
      console.log('Successfully reconnected');
      if (onClose) onClose();
    };
    const onFailed = () => {
      console.warn('Reconnect failed');
      handleExit();
    };

    socket.on('reconnect-success', onSuccess);
    socket.on('reconnect-failed', onFailed);

    return () => {
      socket.off('reconnect-success', onSuccess);
      socket.off('reconnect-failed', onFailed);
    };
  }, [handleExit, onClose]);

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: 'rgba(0,0,0,0.75)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontFamily: 'monospace',
        zIndex: 9999,
        p: 2,
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Opponent disconnected
      </Typography>
      <Typography sx={{ opacity: 0.8, mb: 3 }}>
        You can try reconnecting for <b>{secondsLeft}s</b>
      </Typography>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleReconnect}>
          Reconnect Now
        </Button>
        <Button variant="contained" color="error" onClick={handleExit}>
          Leave Game
        </Button>
      </Box>
    </Box>
  );
}
