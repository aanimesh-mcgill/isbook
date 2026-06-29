import { Box, CircularProgress } from '@mui/material';

export function LoadingScreen({ message = 'Loading…' }: { message?: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        gap: 2,
      }}
      role="status"
      aria-live="polite"
    >
      <CircularProgress size={40} />
      <Box component="span" sx={{ color: 'text.secondary', fontSize: 14 }}>
        {message}
      </Box>
    </Box>
  );
}
