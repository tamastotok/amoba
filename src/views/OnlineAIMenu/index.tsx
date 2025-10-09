import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';

import type { Reducers } from '../../types';
import { setGridSize } from '../../store/grid-size/grid-size.action';
import Button from '../../components/Button/Button';
import GridSize from '../../components/GridSize';
import SelectMark from '../../components/SelectMark';
import socket from '../../server';

function OnlineAIMenu() {
  const dispatch = useDispatch();

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
    e: SelectChangeEvent<'easy' | 'medium' | 'hard'>
  ) => {
    setDifficulty(e.target.value as 'easy' | 'medium' | 'hard');
  };

  const handleStartAIGame = () => {
    const size = gridSize === 0 ? 8 : gridSize;
    dispatch(setGridSize(size));

    // Make a room for play
    socket.emit('create-ai-game', {
      playerName,
      playerMark,
      starterMark,
      gridSize: size,
      difficulty,
    });
  };

  return (
    <main>
      <h1>Play vs AI</h1>

      <form className="textfield" noValidate autoComplete="off">
        <TextField
          style={{ width: '420px' }}
          id="outlined-basic"
          label="Enter your name (optional)"
          variant="outlined"
          margin="dense"
          color="primary"
          onChange={handleNameChange}
        />
      </form>

      <SelectMark label="Select your mark:" whatMark="playerMark" />
      <SelectMark label="Start game with:" whatMark="starterMark" />
      <GridSize />

      <FormControl style={{ width: '420px', marginTop: '20px' }}>
        <InputLabel id="difficulty-label">Difficulty</InputLabel>
        <Select
          labelId="difficulty-label"
          id="difficulty-select"
          value={difficulty}
          label="Difficulty"
          onChange={handleDifficultyChange}
        >
          <MenuItem value="easy">Easy</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="hard">Hard</MenuItem>
        </Select>
      </FormControl>

      <div className="button-group-center">
        <Button linkTo="" clickEvent={handleStartAIGame} text="Start Game" />
        <Button linkTo="/" text="Back" />
      </div>
    </main>
  );
}

export default OnlineAIMenu;
