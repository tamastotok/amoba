import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { Reducers } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { setGridSize } from '../../store/grid-size/grid-size.action';
import { Box, TextField } from '@mui/material';
import Button from '../../components/Button/Button';
import GridSize from '../../components/GridSize';
import SelectMark from '../../components/SelectMark';
import SearchOverlay from '../../components/SearchOverlay';
import socket from '../../server';
import SelectStarter from '../../components/SelectStarter';
import BoxWrapper from '../../components/BoxWrapper';

function OnlineHumanMenu() {
  const dispatch = useDispatch();
  const [playerName, setPlayerName] = useState('');
  const playerMark = useSelector((state: Reducers) => state.marks.playerMark);
  const starterMark = useSelector((state: Reducers) => state.marks.starterMark);
  const gridSize = useSelector((state: Reducers) => state.gridSize);
  const [isSearching, setIsSearching] = useState(false);

  const handleCancel = () => {
    setIsSearching(false);
    socket.emit('search-canceled');
  };

  const handleNameChange = (e: ChangeEvent<{ value: unknown }>) => {
    setPlayerName(e.target.value as string);
  };

  const handleCreateGameButtonClick = () => {
    if (gridSize === 0) {
      dispatch(setGridSize(8));
    }
    //  Send data to server
    socket.emit('search-game', {
      playerName,
      playerMark,
      starterMark,
      gridSize: gridSize === 0 ? 8 : gridSize,
    });
    setIsSearching(true);
  };

  return (
    <>
      {isSearching && (
        <SearchOverlay
          message="Searching for opponent..."
          type="search"
          onCancel={handleCancel}
        />
      )}
      <h1>Settings</h1>
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
          label="Your name (optional)"
          variant="outlined"
          margin="dense"
          color="primary"
          name="1"
          sx={{
            flex: 1,
            maxWidth: 420,
          }}
          onChange={handleNameChange}
        />
      </Box>

      <SelectMark label="Select your mark:" whatMark="playerMark" />
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
