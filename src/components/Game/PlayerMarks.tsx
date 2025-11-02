import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { BLUE, RED } from '@/utils/constants';
import type { Reducers, Mark } from '@/types';

interface PlayerMarkProps {
  gameMode: 'local' | 'online';
  playerMark?: Mark;
}

function PlayerMarks({ gameMode, playerMark }: PlayerMarkProps) {
  const marks = useSelector((state: Reducers) => state.marks);
  return gameMode === 'local' ? (
    <Box sx={{ display: 'flex' }}>
      <h1
        style={{
          color: marks.nextMark === 'X' ? BLUE : 'black',
          marginTop: '1rem',
          marginRight: '4rem',
          textAlign: 'center',
          fontSize: 'clamp(1.5rem, 4vw, 3rem)',
        }}
      >
        X
      </h1>
      <h1
        style={{
          color: marks.nextMark === 'O' ? RED : 'black',
          marginTop: '1rem',
          marginLeft: '4rem',
          textAlign: 'center',
          fontSize: 'clamp(1.5rem, 4vw, 3rem)',
        }}
      >
        O
      </h1>
    </Box>
  ) : (
    <h1
      style={{
        color: playerMark === 'X' ? BLUE : RED,
        marginTop: '1rem',
        textAlign: 'center',
        fontSize: 'clamp(1.5rem, 4vw, 3rem)',
      }}
    >
      {playerMark}
    </h1>
  );
}

export default PlayerMarks;
