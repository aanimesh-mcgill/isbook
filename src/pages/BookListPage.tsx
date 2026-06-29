import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Typography,
} from '@mui/material';
import { usePublishedBooks } from '@/hooks/useBooks';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorDisplay } from '@/components/ErrorDisplay';

export function BookListPage() {
  const { data: books, isLoading, error, refetch } = usePublishedBooks();

  if (isLoading) return <LoadingScreen message="Loading textbooks…" />;

  if (error) {
    return (
      <ErrorDisplay
        title="Could not load textbooks"
        message="Check your connection and try again."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 700 }}>
        Textbooks
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Select a textbook to begin reading.
      </Typography>

      {books && books.length > 0 ? (
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
      ) : (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 2,
            bgcolor: 'action.hover',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            No textbooks published yet
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Run the seed script to load sample content into Firestore.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
            npm run seed
          </Typography>
        </Box>
      )}
    </Container>
  );
}
