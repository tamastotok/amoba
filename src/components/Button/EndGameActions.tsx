import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { Box } from '@mui/material';
import Button from '../Button/Button';
import type { Reducers } from '@/types';

interface EndGameActionsProps {
  handleRestartClick: () => void;
  handleLeaveGameClick: () => void;
}

const EndGameActions = ({
  handleRestartClick,
  handleLeaveGameClick,
}: EndGameActionsProps) => {
  const winner = useSelector((state: Reducers) => state.winner);
  const gameIsDraw = useSelector((state: Reducers) => state.gameIsDraw);
  const isVisible = !!winner || gameIsDraw;

  return (
    <AnimatePresence>
      {isVisible && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 2000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Popup */}
          <motion.div
            key="popup"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
              zIndex: 1000,
              minWidth: '250px',
            }}
          >
            <h2 style={{ color: '#333', marginBottom: '0.5rem' }}>
              {gameIsDraw ? 'Draw!' : `Winner: ${winner}`}
            </h2>
            <Button text="Play again" clickEvent={handleRestartClick} />
            <Button text="Leave" clickEvent={handleLeaveGameClick} />
          </motion.div>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default EndGameActions;
