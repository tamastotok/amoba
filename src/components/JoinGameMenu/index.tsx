import { ChangeEvent, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { buttonStyles, textInput } from '../../styles';
import { useHistory } from 'react-router-dom';
import socket from '../../server';

function JoinGameMenu() {
  const text = textInput();
  const buttonClasses = buttonStyles();
  const history = useHistory();
  const [gameId, setGameId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [textLabel, setTextLabel] = useState<string>('Enter game id');
  const [textFieldError, setTextFieldError] = useState<boolean>(false);

  const handleRoomIdChange = (e: ChangeEvent<{ value: unknown }>) => {
    setGameId(e.target.value as string);
  };

  const handlePlayerNameChange = (e: ChangeEvent<{ value: unknown }>) => {
    setName(e.target.value as string);
  };

  const errorMessage = () => {
    setTextLabel('Game id is empty!');
    setTextFieldError(true);
    setTimeout(() => {
      setTextLabel('Enter game id');
      setTextFieldError(false);
    }, 1500);
  };

  const handleJoinButtonClick = () => {
    if (gameId) {
      console.log(gameId);
      socket.emit('join-game', { gameId, name });
    } else {
      errorMessage();
    }
  };

  const handleBackButtonClick = () => {
    history.goBack();
  };

  return (
    <>
      <h1>Settings</h1>
      <form className={text.customTextField} noValidate autoComplete="off">
        <TextField
          className="textfield"
          id="outlined-basic"
          label="Enter your name (optional)"
          variant="outlined"
          margin="dense"
          color="primary"
          onChange={handlePlayerNameChange}
          error={textFieldError}
        />
        <TextField
          className="textfield"
          id="outlined-basic"
          label={`${textLabel}`}
          variant="outlined"
          margin="dense"
          color="primary"
          onChange={handleRoomIdChange}
          error={textFieldError}
        />
      </form>
      <div className="button-group-center">
        <Button
          className={buttonClasses.button}
          variant="outlined"
          onClick={handleJoinButtonClick}
        >
          Join
        </Button>

        <Button
          className={buttonClasses.button}
          variant="outlined"
          onClick={handleBackButtonClick}
        >
          Back
        </Button>
      </div>
    </>
  );
}

export default JoinGameMenu;
