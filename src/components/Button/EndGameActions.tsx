import { useSelector } from 'react-redux';
import Button from './Button';
import { motion, AnimatePresence } from 'framer-motion';
import type { Reducers } from '../../types';

interface EndGameActionsProps {
  handleRestartClick: () => void;
  handleLeaveGameClick: () => void;
}

const EndGameActions = ({
  handleRestartClick,
  handleLeaveGameClick,
}: EndGameActionsProps) => {
  const winner = useSelector((state: Reducers) => state.winner);
  const isDraw = useSelector((state: Reducers) => state.winner);
  const isVisible = !!winner || isDraw;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Background */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 999,
            }}
          />

          {/* Popup */}
          <motion.div
            key="popup"
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
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
            <h2 style={{ marginBottom: '0.5rem', color: '#333' }}>
              {isDraw ? 'Draw!' : `Winner: ${winner}`}
            </h2>
            <Button
              linkTo=""
              clickEvent={handleRestartClick}
              text="Play again"
            />
            <Button linkTo="" clickEvent={handleLeaveGameClick} text="Leave" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EndGameActions;
