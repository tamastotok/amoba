import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  selectStarterMark,
  selectPlayerMark,
} from '@/store/marks/marks.action';
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import type { Mark } from '@/types';

interface SelectMarkProps {
  mark: 'starterMark' | 'playerMark';
  label: string;
}

function SelectMark({ mark, label }: SelectMarkProps) {
  const dispatch = useDispatch();
  const [value, setValue] = useState<Mark>('X');

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newValue: Mark
  ) => {
    if (!newValue) return;
    setValue(newValue);

    if (mark === 'starterMark') {
      dispatch(selectStarterMark(newValue));
    } else {
      dispatch(selectPlayerMark(newValue));
    }
  };

  useEffect(() => {
    if (mark === 'playerMark') {
      sessionStorage.setItem('playerMark', value);
      sessionStorage.setItem('reloaded', 'false');
    }
  }, [value, mark]);

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
          {label}
        </Typography>

        <ToggleButtonGroup
          exclusive
          value={value}
          onChange={handleChange}
          sx={{
            display: 'flex',
            gap: 1,
            mr: 1,
          }}
        >
          <ToggleButton
            value="X"
            color="primary"
            sx={{
              minWidth: 60,
              fontWeight: 600,
            }}
          >
            X
          </ToggleButton>
          <ToggleButton
            value="O"
            color="secondary"
            sx={{
              minWidth: 60,
              fontWeight: 600,
            }}
          >
            O
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
}

export default SelectMark;
