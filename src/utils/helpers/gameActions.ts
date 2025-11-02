import type { NavigateFunction } from 'react-router-dom';
import type { AppDispatch } from '../../store';
import { resetGameState } from '../../store/game/game.action';
import socket from '../../server';

// Leave game (for all modes)
export const handleLeaveGame = (
  dispatch: AppDispatch,
  navigate: NavigateFunction,
  roomId?: string,
  winner?: string
) => {
  try {
    if (roomId) {
      // Online modes
      if (winner) {
        socket.emit('game-end', { roomId, winner });
      } else {
        socket.emit('player-left', { roomId });
      }
      return;
    }

    // Offline mode cleanup
    dispatch(resetGameState());
    sessionStorage.removeItem('room');
    localStorage.removeItem('room');
    navigate('/');
  } catch (e) {
    console.error('leave error', e);
  }
};
