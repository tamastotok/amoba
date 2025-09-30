import { useEffect } from 'react';
import socket from '../server';

export function useSocketGame(
  handlers: Record<string, (...args: unknown[]) => void>
) {
  useEffect(() => {
    for (const [event, handler] of Object.entries(handlers)) {
      socket.on(event, handler);
    }
    return () => {
      for (const [event, handler] of Object.entries(handlers)) {
        socket.off(event, handler);
      }
    };
  }, [handlers]);
}
