import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import { useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

const BugReport = ({ open, onClose }: Props) => {
  const [category, setCategory] = useState('gameplay');
  const [message, setMessage] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError('Message cannot be empty');
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bugreport/create`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            playerName,
            category,
            message,
          }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setMessage('');
        setPlayerName('');
        setError('');
        onClose();
      } else {
        setError('Failed to send bug report.');
      }
    } catch {
      setError('Server error');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Submit Bug Report</DialogTitle>

      <DialogContent>
        <TextField
          label="Your name (optional)"
          fullWidth
          variant="outlined"
          margin="normal"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />

        <TextField
          select
          label="Category"
          fullWidth
          variant="outlined"
          margin="normal"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <MenuItem value="gameplay">Gameplay</MenuItem>
          <MenuItem value="ui">UI</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </TextField>

        <TextField
          label="Describe the bug"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          margin="normal"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          error={!!error}
          helperText={error}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Send
        </Button>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BugReport;
