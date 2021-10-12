import { ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import {
  setPlayerBlueName,
  setPlayerRedName,
} from '../../store/players/players.action';
import { textInput } from '../../styles/components';
import { Reducers } from '../../types';

function PlayerInputs() {
  const dispatch = useDispatch();
  const text = textInput();
  const players = useSelector((state: Reducers) => state.players);

  const handleChange = (e: ChangeEvent<{ value: unknown; name: unknown }>) => {
    if (e.target.name === '1') {
      dispatch(setPlayerBlueName(e.target.value as string));
    } else if (e.target.name === '2') {
      dispatch(setPlayerRedName(e.target.value as string));
    } else return;
  };

  return (
    <form className={text.customTextField} noValidate autoComplete="off">
      <TextField
        id="outlined-basic"
        label="Player X name (optional)"
        variant="outlined"
        margin="dense"
        color="primary"
        name="1"
        value={players.blue.name}
        onChange={handleChange}
      />
      <TextField
        id="outlined-basic"
        label="Player O name (optional)"
        variant="outlined"
        margin="dense"
        color="secondary"
        name="2"
        value={players.red.name}
        onChange={handleChange}
      />
    </form>
  );
}

export default PlayerInputs;
