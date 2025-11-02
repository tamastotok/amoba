import { Box, TextField } from '@mui/material';

interface HandleNameChangeProps {
  clickEvent: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function PlayerInputsOnline({ clickEvent }: HandleNameChangeProps) {
  return (
    <>
      <h1>Game Setup</h1>

      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          mt: 3,
          pl: 1,
          pr: 1,
        }}
      >
        <TextField
          label="Your name (optional)"
          variant="outlined"
          margin="dense"
          color="primary"
          name="1"
          sx={{
            flex: 1,
            maxWidth: 420,
          }}
          onChange={clickEvent}
        />
      </Box>
    </>
  );
}

export default PlayerInputsOnline;
