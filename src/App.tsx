import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/features/auth/AuthContext';
import { AppThemeProvider } from '@/theme/AppThemeProvider';
import { RootLayout, ReaderLayout } from '@/layouts/RootLayout';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { BookListPage } from '@/pages/BookListPage';
import { BookDetailPage } from '@/pages/BookDetailPage';
import { ChapterReaderPage } from '@/pages/ChapterReaderPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<RootLayout />}>
                <Route index element={<HomePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="read" element={<BookListPage />} />
              </Route>

              <Route path="read/:bookSlug" element={<ReaderLayout />}>
                <Route index element={<BookDetailPage />} />
                <Route path=":chapterSlug" element={<ChapterReaderPage />} />
                <Route path=":chapterSlug/:sectionSlug" element={<ChapterReaderPage />} />
              </Route>

              <Route path="cms" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}
