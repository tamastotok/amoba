import TextField from '@material-ui/core/TextField';
import SelectMark from '../SelectMark';
import GridSize from '../GridSize';
import { buttonStyles, textInput } from '../../styles';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { ChangeEvent, useState } from 'react';
import { useSelector } from 'react-redux';
import socket from '../../server';
import { Reducers } from '../../types';

function OnlineMenu() {
  const text = textInput();
  const history = useHistory();
  const buttonClasses = buttonStyles();

  const [playerName, setPlayerName] = useState('');
  const playerMark = useSelector((state: Reducers) => state.marks.playerMark);
  const starterMark = useSelector((state: Reducers) => state.marks.starterMark);
  const gridSize = useSelector((state: Reducers) => state.gridSize);

  const handleChange = (e: ChangeEvent<{ value: unknown }>) => {
    setPlayerName(e.target.value as string);
  };

  const handleClick = () => {
    history.goBack();
  };

  const handleCreateGameButtonClick = () => {
    //  Send data to server
    socket.emit('search-game', {
      playerName,
      playerMark,
      starterMark,
      gridSize,
    });
  };

  return (
    <main>
      <h1>Settings</h1>
      <form className={text.customTextField} noValidate autoComplete="off">
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
        <Button
          className={buttonClasses.button}
          variant="outlined"
          onClick={handleCreateGameButtonClick}
        >
          Create
        </Button>

        <Button
          className={buttonClasses.button}
          variant="outlined"
          onClick={handleClick}
        >
          Back
        </Button>
      </div>
    </main>
  );
}

export default OnlineMenu;
