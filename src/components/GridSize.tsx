import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setGridSize } from '../store/grid-size/grid-size.action';
import { teal } from '@material-ui/core/colors';
import Radio, { RadioProps } from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import {
  createStyles,
  makeStyles,
  withStyles,
  Theme,
} from '@material-ui/core/styles';

const TealRadioButton = withStyles({
  root: {
    color: teal[400],
    '&$checked': {
      color: teal[600],
    },
  },
  checked: {},
})((props: RadioProps) => <Radio color="default" {...props} />);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '420px',
      margin: '10px auto 40px auto',
      border: '1px solid rgba(0, 0, 0, 0.23)',
      borderRadius: '4px',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',

      '& > *': {
        margin: theme.spacing(1),
      },

      '& > div': {
        width: '300px',
        justifyContent: 'flex-end',
      },

      '& label': {
        width: '80px',
        marginRight: '20px',
      },
    },
  })
);

const sessionStorage = window.sessionStorage;

function GridSize() {
  const dispatch = useDispatch();
  const [value, setValue] = useState('8x8');
  const [size, setSize] = useState('8');
  const classes = useStyles();

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
      <FormControl className={classes.root} component="fieldset">
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
            control={<TealRadioButton />}
            label="8x8"
            labelPlacement="end"
          />
          <FormControlLabel
            value="10x10"
            control={<TealRadioButton />}
            label="10x10"
            labelPlacement="end"
          />
          <FormControlLabel
            value="12x12"
            control={<TealRadioButton />}
            label="12x12"
            labelPlacement="end"
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
}

export default GridSize;
