import Box from '@mui/material/Box';
import Button from './Button';

interface EndGameActionsProps {
  winner: string;
  gameIsDraw: boolean;
  handleRestartClick: () => void;
  handleLeaveGameClick: () => void;
}

const EndGameActions = ({
  winner,
  gameIsDraw,
  handleRestartClick,
  handleLeaveGameClick,
}: EndGameActionsProps) => {
  if (!winner && !gameIsDraw) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -80%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // optional background
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
        zIndex: 1000,
      }}
    >
      <Button linkTo="" clickEvent={handleRestartClick} text="Restart" />
      <Button linkTo="" clickEvent={handleLeaveGameClick} text="Leave" />
    </Box>
  );
};

export default EndGameActions;
