import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import SentimentDissatisfiedIcon from '@mui/material/Icon';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        textAlign: 'center',
        background: 'linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 100%)',
        color: '#333',
        fontFamily: 'monospace',
      }}
    >
      <SentimentDissatisfiedIcon sx={{ fontSize: 80, color: '#888' }} />
      <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
        404
      </Typography>
      <Typography variant="h5">Page Not Found</Typography>
      <Typography variant="body1" sx={{ opacity: 0.8 }}>
        The page you are looking for doesn’t exist or has been moved.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/')}
        sx={{
          mt: 2,
          px: 3,
          py: 1,
          borderRadius: 2,
          fontWeight: 'bold',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          '&:hover': {
            backgroundColor: '#1565c0',
          },
        }}
      >
        Go Home
      </Button>
    </Box>
  );
}
