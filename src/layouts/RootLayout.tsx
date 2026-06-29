import { useState } from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useAuth } from '@/features/auth/AuthContext';
import { useThemeMode } from '@/theme/AppThemeProvider';

export function RootLayout() {
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" color="default">
        <Toolbar>
          <MenuBookIcon color="primary" sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 700,
            }}
          >
            {isMobile ? 'IS Book' : 'Information Systems Textbook'}
          </Typography>
          <Button color="inherit" component={RouterLink} to="/read">
            Read
          </Button>
          {user ? (
            <Button color="inherit" onClick={() => logout()}>
              Sign out
            </Button>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login">
              Sign in
            </Button>
          )}
          <IconButton onClick={toggleMode} color="inherit" aria-label="Toggle dark mode">
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            AI-First Information Systems Textbook Platform
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export function ReaderLayout() {
  const [tocOpen, setTocOpen] = useState(false);
  const { mode, toggleMode } = useThemeMode();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        color="default"
        sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setTocOpen(true)}
              aria-label="Open table of contents"
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <MenuBookIcon color="primary" sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 700 }}
          >
            IS Textbook
          </Typography>
          <IconButton onClick={toggleMode} color="inherit" aria-label="Toggle dark mode">
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Outlet context={{ tocOpen, setTocOpen }} />
    </Box>
  );
}

export interface ReaderLayoutContext {
  tocOpen: boolean;
  setTocOpen: (open: boolean) => void;
}
