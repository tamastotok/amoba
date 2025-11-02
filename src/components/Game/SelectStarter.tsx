import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectStarterMark } from '@/store/marks/marks.action';
import type { Reducers } from '@/types';

function SelectStarter() {
  const dispatch = useDispatch();
  const [starter, setStarter] = useState<'you' | 'opponent'>('you');
  const playerMark = useSelector((state: Reducers) => state.marks.playerMark);

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newValue: 'you' | 'opponent'
  ) => {
    if (!newValue) return;
    setStarter(newValue);

    const starterMark =
      newValue === 'you' ? playerMark : playerMark === 'X' ? 'O' : 'X';

    dispatch(selectStarterMark(starterMark));
  };

  // Refresh starterMark
  useEffect(() => {
    const starterMark =
      starter === 'you' ? playerMark : playerMark === 'X' ? 'O' : 'X';

    dispatch(selectStarterMark(starterMark));
  }, [playerMark, starter, dispatch]);

  useEffect(() => {
    sessionStorage.setItem('starter', starter);
  }, [starter]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mb: 1,
        px: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: 420,
          border: '1px solid',
          borderColor: 'text.primary',
          borderRadius: 2,
          p: 1,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 500,
            flex: 1,
            ml: 1,
          }}
        >
          Who starts first:
        </Typography>

        <ToggleButtonGroup
          exclusive
          value={starter}
          onChange={handleChange}
          sx={{
            display: 'flex',
            gap: 1,
            mr: 1,
          }}
        >
          <ToggleButton
            value="you"
            sx={{
              minWidth: 90,
              fontWeight: 600,
            }}
          >
            You
          </ToggleButton>
          <ToggleButton
            value="opponent"
            sx={{
              minWidth: 90,
              fontWeight: 600,
            }}
          >
            Opponent
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
}

export default SelectStarter;
