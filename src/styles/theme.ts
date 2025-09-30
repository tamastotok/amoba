// theme.ts
import { createTheme } from '@mui/material/styles';
import { RED } from '../utils/constants';

const theme = createTheme({
  palette: {
    secondary: {
      main: RED, // <-- overrides all "secondary" color usage
    },
  },
});

export default theme;
