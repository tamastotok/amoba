import { Box } from '@mui/material';
import React from 'react';
import CloseButton from '../Button/CloseButton';

interface GameLayoutProps {
  children: React.ReactNode;
  onLeave?: () => void;
  chat?: React.ReactNode; // optional Chat component
}

function GameLayout({ children, onLeave, chat }: GameLayoutProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowX: 'hidden',
      }}
    >
      {/* Close (Leave) button */}
      {onLeave && <CloseButton onClick={onLeave} />}

      {/* Main content area */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 3,
          width: '100%',
          mt: 4,
        }}
      >
        {/* Game board, status, etc. */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'fit-content',
          }}
        >
          {children}
        </Box>

        {/* Optional Chat (right side on desktop, below on mobile) */}
        {chat && chat}
      </Box>
    </Box>
  );
}

export default GameLayout;
