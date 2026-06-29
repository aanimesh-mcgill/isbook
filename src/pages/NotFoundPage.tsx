import { Link as RouterLink } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';

export function NotFoundPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
      <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Page not found
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        The page you are looking for does not exist.
      </Typography>
      <Button component={RouterLink} to="/" variant="contained">
        Go home
      </Button>
    </Container>
  );
}
