import { Container } from '@mui/material';
import { BookCatalog } from '@/features/reader/BookCatalog';

export function BookListPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <BookCatalog />
    </Container>
  );
}
