import { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

interface GameOverlayProps {
  message: string;
  type:
    | 'search'
    | 'opponent-left'
    | 'you-left'
    | 'reconnect-failed'
    | 'left-game-perma';
  onReconnect?: () => void;
  onCancel?: () => void;
  reconnectTime?: number;
}

function GameOverlay({
  message,
  type,
  onReconnect,
  onCancel,
  reconnectTime,
}: GameOverlayProps) {
  const [secondsLeft, setSecondsLeft] = useState(reconnectTime || 0);

  // Reconnect timer
  useEffect(() => {
    if (
      type === 'search' ||
      type === 'reconnect-failed' ||
      type == 'left-game-perma'
    )
      return;
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [type, secondsLeft]);

  // ESC key listener
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onCancel) onCancel();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onCancel]);

  const displayMessage =
    type === 'search' ||
    type === 'reconnect-failed' ||
    type === 'left-game-perma'
      ? message
      : `${message} (${secondsLeft}s remaining)`;

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
        {displayMessage}
      </Typography>

      <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
        Press <b>ESC</b> to {type === 'search' ? 'cancel search' : 'exit'}
      </Typography>

      {/* Buttons */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {type === 'you-left' && (
          <Button
            variant="contained"
            color="primary"
            onClick={onReconnect}
            sx={{
              px: 3,
              py: 1,
              fontWeight: 'bold',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              '&:hover': {
                backgroundColor: '#2196F3',
              },
            }}
          >
            Reconnect
          </Button>
        )}
        <Button
          variant="contained"
          color="error"
          onClick={onCancel}
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
    </Box>
  );
}

export default GameOverlay;
