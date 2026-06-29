import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from '@/features/auth/AuthContext';

export function LoginPage() {
  const { signIn, signUp, signInAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp() {
    setError('');
    setLoading(true);
    try {
      await signUp(email, password);
    } catch {
      setError('Could not create account. Password must be at least 6 characters.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGuest() {
    setError('');
    setLoading(true);
    try {
      await signInAsGuest();
    } catch {
      setError('Could not sign in as guest.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 700 }}>
        Sign In
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Sign in to save bookmarks, notes, and track your reading progress.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />

      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button variant="contained" onClick={handleSignIn} disabled={loading}>
          Sign In
        </Button>
        <Button variant="outlined" onClick={handleSignUp} disabled={loading}>
          Create Account
        </Button>
      </Box>

      <Divider sx={{ my: 3 }}>or</Divider>

      <Button variant="text" onClick={handleGuest} disabled={loading} fullWidth>
        Continue as Guest
      </Button>

      <Box sx={{ mt: 3 }}>
        <Button component={RouterLink} to="/read" color="inherit">
          Browse without signing in →
        </Button>
      </Box>
    </Container>
  );
}
