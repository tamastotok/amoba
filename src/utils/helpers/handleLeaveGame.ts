import type { NavigateFunction } from 'react-router-dom';
import type { AppDispatch } from '../../store';
import { resetGameState } from '../../store/game/game.action';
import socket from '../../server';

export const handleLeaveGame = (
  dispatch: AppDispatch,
  navigate: NavigateFunction,
  roomId?: string
) => {
  try {
    // Reset Redux state (board, marks, winner, etc.)
    dispatch(resetGameState());

    // Inform the server only if we're in an online match
    if (roomId) {
      socket.emit('leave-game', roomId);
    }

    // Clear stored data
    sessionStorage.removeItem('room');
    localStorage.removeItem('room');

    // Navigate back to main menu
    navigate('/');
  } catch (error) {
    console.error('Error while leaving game:', error);
  }
};
