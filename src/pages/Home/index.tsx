import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import socket from '@/server';

function Home() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  // Track socket connection state for change button states (disable if offline)
  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    const handleConnectError = () => setIsConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    // Cleanup
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
    };
  }, []);

  return (
    <>
      <h1>Gomoku</h1>

      <div className="button-group-center">
        <Button linkTo="/local" text="Local" />

        <Button
          linkTo={isConnected ? '/online' : '/'}
          text="Online vs Player"
          isDisabled={!isConnected}
        />

        <Button
          linkTo={isConnected ? '/ai' : '/'}
          text="Online vs AI"
          isDisabled={!isConnected}
        />

        <Button linkTo="/ai-dashboard" text="AI Dashboard" />
      </div>
    </>
  );
}

export default Home;
