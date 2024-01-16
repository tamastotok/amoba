import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { selectStarterMark, selectPlayerMark } from '../store/marks/marks.action';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '420px',
      margin: '10px auto 10px auto',
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

function SelectMark({ whatMark, label }: any) {
  const dispatch = useDispatch();
  const classes = useStyles();
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
      <FormControl className={classes.root} component="fieldset">
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
            control={<Radio color="secondary" />}
            label="O"
            labelPlacement="end"
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
}

export default SelectMark;
