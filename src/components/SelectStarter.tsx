import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { selectStarterMark } from '../store/marks/marks.action';

function SelectStarter() {
  const dispatch = useDispatch();
  const [starter, setStarter] = useState<'you' | 'opponent'>('you');

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newValue: 'you' | 'opponent'
  ) => {
    if (!newValue) return;
    setStarter(newValue);
    dispatch(selectStarterMark(newValue === 'you' ? 'player' : 'opponent'));
  };

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
