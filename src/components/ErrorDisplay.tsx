import { Alert, Box, Button, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorDisplay({
  title = 'Something went wrong',
  message = 'Please try again.',
  onRetry,
}: ErrorDisplayProps) {
  return (
    <Box sx={{ py: 6, px: 2, textAlign: 'center' }}>
      <Alert severity="error" sx={{ maxWidth: 480, mx: 'auto', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="body2">{message}</Typography>
      </Alert>
      {onRetry && (
        <Button startIcon={<RefreshIcon />} onClick={onRetry} variant="outlined">
          Try again
        </Button>
      )}
    </Box>
  );
}
