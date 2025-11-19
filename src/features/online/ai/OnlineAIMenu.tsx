import { useState } from 'react';
import { useSelector } from 'react-redux';
import Button from '@/components/ui/Button';
import GridSize from '@/components/game/GridSize';
import SelectMark from '@/components/game/SelectMark';
import SelectStarter from '@/components/game/SelectStarter';
import SelectDifficulty from '@/components/game/SelectDifficulty';
import BoxWrapper from '@/components/ui/BoxWrapper';
import PlayerInputsOnline from '../common/PlayerInputsOnline';
import socket from '@/server';
import type { Reducers } from '@/types';

function OnlineAIMenu() {
  const [playerName, setPlayerName] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(
    'easy'
  );
  const playerMark = useSelector((state: Reducers) => state.marks.playerMark);
  const starterMark = useSelector((state: Reducers) => state.marks.starterMark);
  const gridSize = useSelector((state: Reducers) => state.gridSize);

  const handleNameChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setPlayerName(e.target.value as string);
  };

  const handleDifficultyChange = (
    newDifficulty: 'easy' | 'medium' | 'hard'
  ) => {
    setDifficulty(newDifficulty);
  };

  const handleStartAIGame = () => {
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
      <PlayerInputsOnline clickEvent={handleNameChange} />
      <SelectMark label="Select your mark:" mark="playerMark" />
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
