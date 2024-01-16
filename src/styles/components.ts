import { createStyles, makeStyles, Theme } from '@mui/material/styles';

//  Text input
export const textInput = makeStyles(() =>
  createStyles({
    customTextField: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    field: {
      margin: 'auto',
    },
  })
);

//  Custom button style
export const buttonStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      textDecoration: 'none',
      margin: theme.spacing(1),
    },
    button: {
      borderWidth: '2px',
      width: 180,
      height: 40,
      margin: '5px 0',
      '&:hover': {
        borderWidth: '2px',
      },
    },
  })
);
