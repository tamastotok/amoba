import React from 'react';
import { Box } from '@mui/material';

interface BoxWrapperProps {
  children: React.ReactNode;
  width?: number | string; // allows overriding default width
  justify?: 'center' | 'space-between' | 'flex-start' | 'flex-end';
}

function BoxWrapper({
  children,
  width = 420,
  justify = 'space-between',
}: BoxWrapperProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: justify,
          width,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default BoxWrapper;
