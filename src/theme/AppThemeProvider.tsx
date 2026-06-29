import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery,
} from '@mui/material';

type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'isbook-theme-mode';

interface ThemeModeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

function getStoredMode(): ThemeMode | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return null;
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<ThemeMode>(
    () => getStoredMode() ?? (prefersDark ? 'dark' : 'light'),
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#1565c0' },
          secondary: { main: '#00838f' },
          background: {
            default: mode === 'light' ? '#f8fafc' : '#0f172a',
            paper: mode === 'light' ? '#ffffff' : '#1e293b',
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: { fontWeight: 700, letterSpacing: '-0.02em' },
          h2: { fontWeight: 700, letterSpacing: '-0.01em' },
          h3: { fontWeight: 600 },
          body1: { lineHeight: 1.75 },
          body2: { lineHeight: 1.7 },
        },
        shape: { borderRadius: 10 },
        components: {
          MuiButton: {
            styleOverrides: {
              root: { textTransform: 'none', fontWeight: 600 },
            },
          },
          MuiAppBar: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
              root: {
                borderBottom: 1,
                borderColor: 'divider',
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeModeContext.Provider value={{ mode, toggleMode }}>
        {children}
      </ThemeModeContext.Provider>
    </ThemeProvider>
  );
}

export function useThemeMode(): ThemeModeContextValue {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within AppThemeProvider');
  }
  return context;
}
