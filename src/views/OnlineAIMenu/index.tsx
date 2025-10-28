import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { TextField } from '@mui/material';
import type { Reducers } from '../../types';
import Button from '../../components/Button/Button';
import GridSize from '../../components/GridSize';
import SelectMark from '../../components/SelectMark';
import socket from '../../server';
import { Box } from '@mui/material';
import SelectStarter from '../../components/SelectStarter';
import SelectDifficulty from '../../components/SelectDifficulty';
import BoxWrapper from '../../components/BoxWrapper';

function OnlineAIMenu() {
  const [playerName, setPlayerName] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(
    'easy'
  );
  const playerMark = useSelector((state: Reducers) => state.marks.playerMark);
  const starterMark = useSelector((state: Reducers) => state.marks.starterMark);
  const gridSize = useSelector((state: Reducers) => state.gridSize);

  const handleNameChange = (e: ChangeEvent<{ value: unknown }>) => {
    setPlayerName(e.target.value as string);
  };

  const handleDifficultyChange = (
    newDifficulty: 'easy' | 'medium' | 'hard'
  ) => {
    setDifficulty(newDifficulty);
  };

  const handleStartAIGame = () => {
    // Make a room for play
    socket.emit('create-ai-game', {
      playerName,
      playerMark,
      starterMark,
      gridSize,
      difficulty,
    });
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
          width: '100%',
          mt: 3,
          pl: 1,
          pr: 1,
        }}
      >
        <TextField
          style={{ width: '420px' }}
          id="outlined-basic"
          label="Enter your name (optional)"
          variant="outlined"
          margin="dense"
          color="primary"
          onChange={handleNameChange}
        />
      </Box>

      <SelectMark label="Select your mark:" whatMark="playerMark" />
      <SelectStarter />
      <GridSize />
      <SelectDifficulty
        difficulty={difficulty}
        onChange={handleDifficultyChange}
      />

      <BoxWrapper>
        <Button linkTo="" clickEvent={handleStartAIGame} text="Start Game" />
        <Button linkTo="/" text="Back" />
      </BoxWrapper>
    </>
  );
}

export default OnlineAIMenu;
