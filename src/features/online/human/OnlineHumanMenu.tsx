import { useState } from 'react';
import type { Reducers } from '@/types';
import { useSelector } from 'react-redux';
import Button from '@/components/ui/Button';
import GridSize from '@/components/game/GridSize';
import SelectMark from '@/components/game/SelectMark';
import SelectStarter from '@/components/game/SelectStarter';
import BoxWrapper from '@/components/ui/BoxWrapper';
import PlayerInputsOnline from '../common/PlayerInputsOnline';
import socket from '@/server';

function OnlineHumanMenu() {
  const [playerName, setPlayerName] = useState('');
  const playerMark = useSelector((state: Reducers) => state.marks.playerMark);
  const starterMark = useSelector((state: Reducers) => state.marks.starterMark);
  const gridSize = useSelector((state: Reducers) => state.gridSize);

  const handleNameChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setPlayerName(e.target.value as string);
  };

  const handleCreateGameButtonClick = () => {
    socket.emit('search-game', {
      playerName,
      playerMark,
      starterMark,
      gridSize,
    });
  };

  return (
    <>
      <PlayerInputsOnline clickEvent={handleNameChange} />
      <SelectMark label="Select your mark:" mark="playerMark" />
      <SelectStarter />
      <GridSize />

      <BoxWrapper>
        <Button
          linkTo=""
          clickEvent={handleCreateGameButtonClick}
          text="Search Game"
        />
        <Button linkTo="/" text="Back" />
      </BoxWrapper>
    </>
  );
}

export default OnlineHumanMenu;
