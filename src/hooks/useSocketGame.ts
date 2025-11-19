import { useEffect } from 'react';
import socket from '../server';

export function useSocketGame(
  handlers: Record<string, (...args: unknown[]) => void>
) {
  useEffect(() => {
    // Prevent "Connecting..." state stuck after refresh
    if (socket.connected && handlers.connect) {
      handlers.connect();
    }

    // Subscribe to all handler
    for (const [event, handler] of Object.entries(handlers)) {
      socket.on(event, handler);
    }

    // Handle connect/disconnect events
    const onConnect = () => handlers.connect?.();
    const onDisconnect = () => handlers.disconnect?.();
    const onError = () => handlers.connect_error?.();

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onError);

    // Cleanup
    return () => {
      for (const [event, handler] of Object.entries(handlers)) {
        socket.off(event, handler);
      }
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onError);
    };
  }, [handlers]);
}
