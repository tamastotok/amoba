import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '@/server';
import { useDispatch } from 'react-redux';
import { resetGameState } from '@/store/game/game.action';

export type OverlayType =
  | 'search'
  | 'opponent-left'
  | 'you-left'
  | 'reconnect-failed'
  | 'left-game-perma'
  | null;

interface UseOverlayActionsParams {
  overlayType: OverlayType;
  setOverlayType: (value: OverlayType) => void;
}

export function useOverlayActions({
  overlayType,
  setOverlayType,
}: UseOverlayActionsParams) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const roomId = sessionStorage.getItem('room');
  const mode = sessionStorage.getItem('mode') || 'human';

  // Leave emit
  const sendLeaveGame = useCallback(() => {
    if (!roomId) return;

    if (mode === 'human') socket.emit('leave-game-human', { roomId });
    else socket.emit('leave-game-ai', { roomId });
  }, [roomId, mode]);

  // Full cleanup
  const cleanup = useCallback(() => {
    dispatch(resetGameState());
    sessionStorage.clear();
    localStorage.clear();
    setOverlayType(null);
  }, [dispatch, setOverlayType]);

  // Cancel / Exit action
  const handleCancel = useCallback(() => {
    switch (overlayType) {
      // Cancel matchmaking
      case 'search':
        socket.emit('cancel-search');
        return navigate('/online');

      // Player left midgame
      case 'you-left':
        sendLeaveGame();
        cleanup();
        return navigate('/');
      case 'opponent-left':
        sendLeaveGame();
        cleanup();
        return navigate('/');

      // Reconnect expired or permanent leave
      case 'reconnect-failed':
        cleanup();
        return navigate('/');
      case 'left-game-perma':
        cleanup();
        return navigate('/');

      default:
        return;
    }
  }, [overlayType, sendLeaveGame, cleanup, navigate]);

  // Reconnect action based on game mode
  const handleReconnect = useCallback(() => {
    if (!roomId) return;

    if (mode === 'human') socket.emit('reconnect-room-human', { roomId });
    else socket.emit('reconnect-room-ai', { roomId });
  }, [roomId, mode]);

  return {
    handleCancel,
    handleReconnect,
  };
}
