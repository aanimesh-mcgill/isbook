import { useState, useEffect } from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
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
import { useThemeMode } from '@/theme/AppThemeProvider';

const TOC_COLLAPSED_KEY = 'isbook-toc-collapsed';

export function RootLayout() {
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
            {isMobile ? 'IS Books' : 'IS Textbook Platform'}
          </Typography>
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
  const [tocCollapsed, setTocCollapsed] = useState(() => {
    return localStorage.getItem(TOC_COLLAPSED_KEY) === 'true';
  });
  const { mode, toggleMode } = useThemeMode();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    localStorage.setItem(TOC_COLLAPSED_KEY, String(tocCollapsed));
  }, [tocCollapsed]);

  const toggleTocCollapse = () => setTocCollapsed((c) => !c);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        color="default"
        sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}
      >
        <Toolbar>
          {(isMobile || tocCollapsed) && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => (isMobile ? setTocOpen(true) : toggleTocCollapse())}
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
            IS Textbook Platform
          </Typography>
          <IconButton onClick={toggleMode} color="inherit" aria-label="Toggle dark mode">
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Outlet
        context={{
          tocOpen,
          setTocOpen,
          tocCollapsed,
          setTocCollapsed,
          toggleTocCollapse,
        }}
      />
    </Box>
  );
}

export interface ReaderLayoutContext {
  tocOpen: boolean;
  setTocOpen: (open: boolean) => void;
  tocCollapsed: boolean;
  setTocCollapsed: (collapsed: boolean) => void;
  toggleTocCollapse: () => void;
}
