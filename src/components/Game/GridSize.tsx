import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { setGridSize } from '@/store/grid-size/grid-size.action';

const sessionStorage = window.sessionStorage;

function GridSize() {
  const dispatch = useDispatch();
  const [size, setSize] = useState('8'); // store just the number

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newValue: string | null
  ) => {
    if (!newValue) return; // prevent deselection
    setSize(newValue);
    dispatch(setGridSize(parseInt(newValue)));
  };

  useEffect(() => {
    sessionStorage.setItem('gridSize', size);
  }, [size]);

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
          Board size:
        </Typography>

        <ToggleButtonGroup
          exclusive
          value={size}
          onChange={handleChange}
          sx={{
            display: 'flex',
            gap: 1,
            mr: 1,
          }}
        >
          <ToggleButton value="8" sx={{ minWidth: 80 }}>
            8×8
          </ToggleButton>
          <ToggleButton value="10" sx={{ minWidth: 80 }}>
            10×10
          </ToggleButton>
          <ToggleButton value="12" sx={{ minWidth: 80 }}>
            12×12
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
}

export default GridSize;
