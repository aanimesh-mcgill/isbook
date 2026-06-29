import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@mui/material';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import { usePublishedBooks } from '@/hooks/useBooks';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorDisplay } from '@/components/ErrorDisplay';

interface BookCatalogProps {
  title?: string;
  subtitle?: string;
}

/** Displays all published textbooks — used on home page and /books route. */
export function BookCatalog({
  title = 'Textbooks',
  subtitle = 'Select a textbook to begin reading.',
}: BookCatalogProps) {
  const { data: books, isLoading, error, refetch } = usePublishedBooks();

  if (isLoading) return <LoadingScreen message="Loading textbooks…" />;

  if (error) {
    return (
      <ErrorDisplay
        title="Could not load textbooks"
        message={error instanceof Error ? error.message : 'Check your connection and try again.'}
        onRetry={() => refetch()}
      />
    );
  }

  if (!books || books.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          px: 2,
          bgcolor: 'action.hover',
          borderRadius: 2,
        }}
      >
        <MenuBookOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          No textbooks published yet
        </Typography>
        <Typography color="text.secondary">
          Books will appear here once they are published in Firestore.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h2" sx={{ mb: 1, fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {subtitle}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {books.map((book) => (
          <Card key={book.id} variant="outlined">
            <CardActionArea component={RouterLink} to={`/read/${book.slug}`}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {book.title}
                </Typography>
                {book.subtitle && (
                  <Typography variant="subtitle1" color="text.secondary">
                    {book.subtitle}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {book.description}
                </Typography>
                <Typography variant="caption" color="primary" sx={{ mt: 2, display: 'block' }}>
                  {book.chapterCount} chapters · {book.partCount} parts
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
