import { Box } from '@mui/system';

interface ButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

function CloseButton({ onClick }: ButtonProps) {
  return (
    <Box
      component="button"
      onClick={onClick}
      aria-label="close"
      sx={{
        position: 'absolute',
        top: 12,
        right: 12,
        width: 36,
        height: 36,
        borderRadius: '50%',
        border: '2px solid',
        borderColor: 'primary.main',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        '&:hover': {
          backgroundColor: 'secondary.main',
          borderColor: 'secondary.main',
          transform: 'scale(1.05)',
          '&::before, &::after': {
            backgroundColor: 'white',
          },
        },
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          width: '60%',
          height: '2px',
          backgroundColor: 'primary.main',
          transformOrigin: 'center',
          transition: 'background-color 0.25s ease',
        },
        '&::before': {
          transform: 'rotate(45deg)',
        },
        '&::after': {
          transform: 'rotate(-45deg)',
        },
      }}
    />
  );
}

export default CloseButton;
