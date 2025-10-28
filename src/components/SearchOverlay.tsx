import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../server';
import { Box, Typography, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { resetGameState } from '../store/game/game.action';

interface SearchOverlayProps {
  message: string;
  type: 'search' | 'disconnected';
  onCancel?: () => void;
}

export default function SearchOverlay({
  message,
  type,
  onCancel,
}: SearchOverlayProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCancel = useCallback(() => {
    if (type === 'search') {
      navigate('/online');
      socket.emit('cancel-search');
    }
    if (type === 'disconnected') {
      dispatch(resetGameState());
      navigate('/');
      socket.emit('leave-game');
    }
    if (onCancel) onCancel();
  }, [type, dispatch, navigate, onCancel]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCancel();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [handleCancel]);

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: 'rgba(0, 0, 0, 0.75)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: { xs: 'flex-end', sm: 'center' },
        alignItems: 'center',
        textAlign: 'center',
        fontFamily: 'monospace',
        zIndex: 9999,
        p: 2,
        pb: { xs: 4, sm: 0 },
      }}
    >
      <Typography variant="h5" sx={{ mb: 1 }}>
        {message}
      </Typography>

      <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
        Press <b>ESC</b> to {type === 'search' ? 'cancel search' : 'exit'}
      </Typography>

      <Button
        variant="contained"
        color="error"
        onClick={handleCancel}
        sx={{
          px: 3,
          py: 1,
          fontWeight: 'bold',
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          '&:hover': {
            backgroundColor: '#ff6666',
          },
        }}
      >
        {type === 'search' ? 'Cancel Search' : 'Exit'}
      </Button>
    </Box>
  );
}
