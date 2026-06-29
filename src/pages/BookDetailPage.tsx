import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Toolbar,
  Typography,
} from '@mui/material';
import { useBook, useChapters } from '@/hooks/useBooks';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorDisplay } from '@/components/ErrorDisplay';

export function BookDetailPage() {
  const { bookSlug } = useParams<{ bookSlug: string }>();
  const { data: book, isLoading: bookLoading, error } = useBook(bookSlug ?? '');
  const { data: chapters = [], isLoading: chaptersLoading } = useChapters(book?.id);

  if (bookLoading || chaptersLoading) {
    return <LoadingScreen message="Loading book…" />;
  }

  if (error || !book) {
    return (
      <ErrorDisplay
        title="Book not found"
        message="This textbook may not exist or has not been published yet."
      />
    );
  }

  return (
    <Box>
      <Toolbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 1, fontWeight: 800 }}>
          {book.title}
        </Typography>
        {book.subtitle && (
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            {book.subtitle}
          </Typography>
        )}
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          {book.description}
        </Typography>

        {chapters.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {chapters.map((chapter) => (
              <Card key={chapter.id} variant="outlined">
                <CardActionArea
                  component={RouterLink}
                  to={`/read/${bookSlug}/${chapter.slug}`}
                >
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="overline" color="primary">
                      Part {chapter.partNumber} · Chapter {chapter.chapterNumber}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {chapter.title}
                    </Typography>
                    {chapter.summary && (
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {chapter.summary}
                      </Typography>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              No chapters published yet.
            </Typography>
            <Button component={RouterLink} to="/read" variant="outlined">
              Back to textbooks
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}
