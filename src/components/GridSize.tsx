import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setGridSize } from '../store/grid-size/grid-size.action';
import { Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';

const sessionStorage = window.sessionStorage;

function GridSize() {
  const dispatch = useDispatch();
  const [value, setValue] = useState('8x8');
  const [size, setSize] = useState('8');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSize(event.target.value);
    setValue((event.target as HTMLInputElement).value);
    dispatch(setGridSize(parseInt(event.target.value)));
  };

  useEffect(() => {
    sessionStorage.setItem('gridSize', size);
  }, [size]);

  return (
    <div className="center">
      <FormControl className={'form-theme'} component="fieldset">
        <p>Border size: </p>

        <RadioGroup
          row
          aria-label="mark"
          name="mark1"
          value={value}
          onChange={handleChange}
        >
          <FormControlLabel
            value="8x8"
            control={<Radio color="default" className={'color-teal'} />}
            label="8x8"
            labelPlacement="end"
          />
          <FormControlLabel
            value="10x10"
            control={<Radio color="default" className={'color-teal'} />}
            label="10x10"
            labelPlacement="end"
          />
          <FormControlLabel
            value="12x12"
            control={<Radio color="default" className={'color-teal'} />}
            label="12x12"
            labelPlacement="end"
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
}

export default GridSize;
