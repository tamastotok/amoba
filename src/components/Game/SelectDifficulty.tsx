import React from 'react';
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';

interface SelectDifficultyProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

function SelectDifficulty({ difficulty, onChange }: SelectDifficultyProps) {
  const handleChange = (
    _e: React.MouseEvent<HTMLElement>,
    newValue: 'easy' | 'medium' | 'hard' | null
  ) => {
    if (newValue) onChange(newValue);
  };

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
          Difficulty:
        </Typography>

        <ToggleButtonGroup
          color="primary"
          exclusive
          value={difficulty}
          onChange={handleChange}
          sx={{
            display: 'flex',
            gap: 1,
            mr: 1,
          }}
        >
          <ToggleButton value="easy" sx={{ minWidth: 90 }}>
            Easy
          </ToggleButton>
          <ToggleButton value="medium" sx={{ minWidth: 90 }}>
            Medium
          </ToggleButton>
          <ToggleButton value="hard" sx={{ minWidth: 90 }}>
            Hard
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
}

export default SelectDifficulty;
