import { Box } from '@mui/material';
import CloseButton from '../ui/CloseButton';
import PlayerMarks from './PlayerMarks';
import EndGameActions from '../overlays/EndGameActions';

interface GameLayoutProps {
  children: React.ReactNode;
  onLeave: () => void;
  onGameEndRestart: () => void;
  onGameEndLeave: () => void;
  chat?: React.ReactNode; // optional Chat component
  gameMode: 'local' | 'online';
  playerMark?: 'X' | 'O';
}

function GameLayout({
  children,
  onLeave,
  onGameEndRestart,
  onGameEndLeave,
  chat,
  gameMode,
  playerMark,
}: GameLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
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
      <PlayerMarks gameMode={gameMode} playerMark={playerMark} />
      <EndGameActions
        handleRestartClick={onGameEndRestart}
        handleLeaveGameClick={onGameEndLeave}
      />
    </Box>
  );
}

export default GameLayout;
