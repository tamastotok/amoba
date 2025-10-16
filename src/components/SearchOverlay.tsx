import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../server';

interface SearchOverlayProps {
  message: string;
  type: 'search' | 'disconnected'; // context type
  onCancel?: () => void; // optional callback
}

export default function SearchOverlay({
  message,
  type,
  onCancel,
}: SearchOverlayProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (type === 'search') socket.emit('cancel-search');
        if (type === 'disconnected') socket.emit('leave-game');
        if (onCancel) onCancel();
        navigate('/online');
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [type, navigate, onCancel]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.75)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'monospace',
        zIndex: 9999,
        animation: 'fadeIn 0.4s ease-in',
      }}
    >
      <h2 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>{message}</h2>
      <p style={{ fontSize: '1rem', opacity: 0.8 }}>
        Press <b>ESC</b> to {type === 'search' ? 'cancel search' : 'exit'}
      </p>
    </div>
  );
}
