import type { NavigateFunction } from 'react-router-dom';
import type { AppDispatch } from '@/store';
import { resetGameState } from '@/store/game/game.action';
import socket from '@/server';

const getMode = (): 'human' | 'ai' | null => {
  const mode = sessionStorage.getItem('mode');
  if (mode === 'human' || mode === 'ai') return mode;
  return null;
};

// Leave game (for all modes)
export const handleLeaveGame = (
  dispatch: AppDispatch,
  navigate: NavigateFunction,
  roomId?: string,
  winner?: string
) => {
  try {
    if (roomId) {
      // If the game ends normally
      if (winner) {
        socket.emit('game-end', { roomId, winner });
        return;
      }

      // Leave mid game → different events based on game mode
      const mode = getMode();
      if (mode === 'ai') {
        socket.emit('midgame-left-ai', { roomId });
      } else {
        // Default: human
        socket.emit('midgame-left-human', { roomId });
      }
      return;
    }

    // Offline / local mode
    dispatch(resetGameState());
    sessionStorage.removeItem('room');
    localStorage.removeItem('room');
    navigate('/');
  } catch (e) {
    console.error('leave error', e);
  }
};

// Restart game button
export const handleRestartClick = (
  dispatch: AppDispatch,
  navigate: NavigateFunction,
  route: string
) => {
  sessionStorage.removeItem('room');
  dispatch(resetGameState());
  navigate(route);
};
