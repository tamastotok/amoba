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

function HostGameMenu({ roomId }: any) {
  const text = textInput();
  const history = useHistory();
  const buttonClasses = buttonStyles();
  const [hostName, setHostName] = useState<string>('');
  const [hostMark, setHostMark] = useState<string>('X');
  const [starterMark, setStarterMark] = useState<string>('X');
  const gridSize = useSelector((state: Reducers) => state.gridSize);

  const handleChange = (e: ChangeEvent<{ value: unknown }>) => {
    setHostName(e.target.value as string);
  };

  const handleClick = () => {
    history.goBack();
  };

  const handleCreateGameButtonClick = () => {
    socket.emit('create-game', { hostName, hostMark, starterMark, gridSize });
  };

  //  Collect data from child components
  const getHostMark = (mark: string) => {
    setHostMark(mark);
  };

  const getStarterMark = (mark: string) => {
    setStarterMark(mark);
  };
  //  -----

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

      <SelectMark
        label="Select your mark:"
        whatMark="hostMark"
        getHostMark={getHostMark}
      />
      <SelectMark
        label="Start game with:"
        whatMark="starterMark"
        getStarterMark={getStarterMark}
      />
      <GridSize />

      <div className="button-group-center">
        <Button
          className={buttonClasses.button}
          variant="outlined"
          onClick={handleCreateGameButtonClick}
        >
          Create game
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

export default HostGameMenu;
