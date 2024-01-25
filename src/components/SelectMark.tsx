import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { selectStarterMark, selectPlayerMark } from '../store/marks/marks.action';
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';

const sessionStorage = window.sessionStorage;

function SelectMark({ whatMark, label }: any) {
  const dispatch = useDispatch();
  const [value, setValue] = useState('X');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue((e.target as HTMLInputElement).value);
    if (whatMark === 'starterMark') {
      dispatch(selectStarterMark(e.target.value as string));
    }
    if (whatMark === 'playerMark') {
      dispatch(selectPlayerMark(e.target.value as string));
    }
  };

  useEffect(() => {
    sessionStorage.setItem('playerMark', value);
    sessionStorage.setItem('reloaded', 'false');
  }, [value]);

  return (
    <div className="center">
      <FormControl className="form-theme" component="fieldset">
        <p>{label}</p>

        <RadioGroup
          row
          aria-label="mark"
          name="mark1"
          value={value}
          onChange={handleChange}
        >
          <FormControlLabel
            value="X"
            control={<Radio color="primary" />}
            label="X"
            labelPlacement="end"
          />
          <FormControlLabel
            value="O"
            control={
              <Radio
                sx={{
                  '&.Mui-checked': {
                    color: '#f50057',
                  },
                }}
              />
            }
            label="O"
            labelPlacement="end"
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
}

export default SelectMark;
