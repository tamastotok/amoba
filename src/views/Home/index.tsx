import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import Button from '../../components/Button/Button';
import socket from '../../server';

function Home() {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Track socket connection state
  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    const handleConnectError = () => setIsConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    // cleanup
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
    };
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setPassword('');
    setError('');
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/auth`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        }
      );
      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem('ai_dashboard_auth', 'true');
        navigate('/ai-dashboard');
      } else {
        setError('Invalid admin password');
      }
    } catch {
      setError('Server error');
    }
  };

  const handleClick = () => {
    if (isConnected) socket.emit('join-lobby');
  };

  return (
    <>
      <h1>Gomoku</h1>

      <div className="button-group-center">
        <Button linkTo="/local" text="Local" />

        <Button
          linkTo={isConnected ? '/online' : '/'}
          clickEvent={handleClick}
          text="Online vs Human"
          isDisabled={!isConnected}
        />

        <Button
          linkTo={isConnected ? '/ai' : '/'}
          clickEvent={handleClick}
          text="Online vs AI"
          isDisabled={!isConnected}
        />

        <Button linkTo="" text="AI Dashboard" clickEvent={handleOpen} />
      </div>

      {/* 🔐 Admin password popup */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Admin Access Required</DialogTitle>
        <DialogContent>
          <TextField
            label="Enter admin password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            error={!!error}
            helperText={error}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </DialogContent>
        <DialogActions>
          <Button linkTo="" text="Enter" clickEvent={handleSubmit} />
          <Button linkTo="" text="Cancel" clickEvent={handleClose} />
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Home;
