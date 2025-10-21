import { useEffect, useState, type JSX } from 'react';
import { useAppSelector } from '../store/hooks';
import socket from '../server';

interface SystemStatusBarProps {
  statusMessage?: string; // external game status (e.g. "Waiting for another player...")
}

function SystemStatusBar({ statusMessage }: SystemStatusBarProps) {
  const [userOnline, setUserOnline] = useState(0);
  const [status, setStatus] = useState<
    'connecting' | 'connected' | 'disconnected'
  >('connecting');
  const [internalMessage, setInternalMessage] = useState('');
  const [dots, setDots] = useState('.');

  // Redux: get player names and marks
  const players = useAppSelector((state) => state.players);

  // Construct player display text
  const blueName =
    players.blue.name?.trim() || `Player ${players.blue.mark || 'X'}`;
  const redName =
    players.red.name?.trim() || `Player ${players.red.mark || 'O'}`;
  const playerDisplay = (
    <>
      <span style={{ color: '#3f51b5', fontWeight: 600 }}>{blueName}</span>{' '}
      <span style={{ color: '#ccc' }}>vs.</span>{' '}
      <span style={{ color: '#f50057', fontWeight: 600 }}>{redName}</span>
    </>
  );

  // Animate "..." for external waiting messages
  useEffect(() => {
    if (!statusMessage) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '.' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, [statusMessage]);

  // Handle socket events
  useEffect(() => {
    if (socket.connected) setStatus('connected');
    else setStatus('connecting');

    const onUserCount = (count: number) => setUserOnline(count);
    const onConnect = () => {
      setStatus('connected');
      setInternalMessage('');
    };
    const onDisconnect = () => {
      setStatus('disconnected');
      setInternalMessage('Server disconnected');
    };
    const onConnectError = () => {
      setStatus('disconnected');
      setInternalMessage('Connection error');
    };
    const onReconnectAttempt = () => {
      setStatus('connecting');
      setInternalMessage('Reconnecting...');
    };

    socket.on('user-count', onUserCount);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.io.on('reconnect_attempt', onReconnectAttempt);

    return () => {
      socket.off('user-count', onUserCount);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.io.off('reconnect_attempt', onReconnectAttempt);
    };
  }, []);

  const color =
    status === 'connected'
      ? '#4CAF50'
      : status === 'connecting'
      ? '#FFC107'
      : '#F44336';

  // Choose displayed message
  let displayMessage: string | JSX.Element = internalMessage;

  if (statusMessage) {
    displayMessage = `${statusMessage}${dots}`;
  } else if (status === 'connected') {
    displayMessage = playerDisplay;
  } else if (status === 'connecting') {
    displayMessage = 'Connecting...';
  } else if (status === 'disconnected') {
    displayMessage = 'Disconnected';
  }

  const isExternal = Boolean(statusMessage);

  return (
    <div
      style={{
        width: '100%',
        background: '#111',
        color: '#eee',
        padding: '6px 10px',
        fontFamily: 'monospace',
        fontSize: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
        marginTop: 'auto',
      }}
    >
      {/* Left: connection indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: color,
            boxShadow: `0 0 4px ${color}`,
          }}
        ></div>
        <span>
          {status === 'connected'
            ? 'Connected'
            : status === 'connecting'
            ? 'Connecting...'
            : 'Disconnected'}
        </span>
      </div>

      {/* Center: message or player display */}
      <div
        style={{
          flex: 1,
          textAlign: 'center',
          color: isExternal ? '#FFC107' : '#ccc',
          fontWeight: isExternal ? 'bold' : 'normal',
          letterSpacing: isExternal ? '0.05em' : undefined,
          animation: isExternal ? 'pulse 1.5s ease-in-out infinite' : undefined,
        }}
      >
        {displayMessage}
      </div>

      {/* Right: user count */}
      <div style={{ textAlign: 'right', color: '#ccc' }}>
        {userOnline} user{userOnline !== 1 ? 's' : ''} online
      </div>

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.6; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}

export default SystemStatusBar;
