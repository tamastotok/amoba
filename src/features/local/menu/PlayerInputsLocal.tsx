import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField } from '@mui/material';
import {
  setPlayerBlueName,
  setPlayerRedName,
} from '@/store/players/players.action';
import type { Reducers } from '@/types';

function PlayerInputsLocal() {
  const dispatch = useDispatch();
  const players = useSelector((state: Reducers) => state.players);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === '1') {
      dispatch(setPlayerBlueName(value));
    } else if (name === '2') {
      dispatch(setPlayerRedName(value));
    }
  };

  return (
    <>
      <h1>Game Setup</h1>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          width: '100%',
          pl: 1,
          pr: 1,
        }}
      >
        <TextField
          label="Player X name (optional)"
          variant="outlined"
          margin="dense"
          color="primary"
          name="1"
          value={players.blue.name}
          onChange={handleChange}
        />
        <TextField
          label="Player O name (optional)"
          variant="outlined"
          margin="dense"
          color="secondary"
          name="2"
          value={players.red.name}
          onChange={handleChange}
        />
      </Box>
    </>
  );
}

export default PlayerInputsLocal;
