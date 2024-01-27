import { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GridSize from '../../components/GridSize';
import SelectMark from '../../components/SelectMark';
import { setGridSize } from '../../store/grid-size/grid-size.action';
import socket from '../../server';
import { Reducers } from '../../types';
import EventButton from '../../components/Button/Button';
import { TextField } from '@mui/material';

function OnlineMenu() {
  const dispatch = useDispatch();

  const [playerName, setPlayerName] = useState('');
  const playerMark = useSelector((state: Reducers) => state.marks.playerMark);
  const starterMark = useSelector((state: Reducers) => state.marks.starterMark);
  const gridSize = useSelector((state: Reducers) => state.gridSize);

  const handleChange = (e: ChangeEvent<{ value: unknown }>) => {
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
  };

  return (
    <main>
      <h1>Settings</h1>
      <form className="textfield" noValidate autoComplete="off">
        <TextField
          style={{ width: '420px' }}
          id="outlined-basic"
          label="Enter your name (optional)"
          variant="outlined"
          margin="dense"
          color="primary"
          onChange={handleChange}
        />
      </form>

      <SelectMark label="Select your mark:" whatMark="playerMark" />
      <SelectMark label="Start game with:" whatMark="starterMark" />
      <GridSize />

      <div className="button-group-center">
        <EventButton
          linkTo=""
          clickEvent={handleCreateGameButtonClick}
          text="Create Game"
        />
        <EventButton linkTo="/" text="Back" />
      </div>
    </main>
  );
}

export default OnlineMenu;
