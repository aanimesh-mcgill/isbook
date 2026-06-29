import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Grid, Typography } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PsychologyIcon from '@mui/icons-material/Psychology';
import DevicesIcon from '@mui/icons-material/Devices';
import { BookCatalog } from '@/features/reader/BookCatalog';

const features = [
  {
    icon: <AutoStoriesIcon fontSize="large" color="primary" />,
    title: 'Evidence-Based Learning',
    description:
      'Built on decades of MIS research, translated into clear managerial guidance for business students.',
  },
  {
    icon: <PsychologyIcon fontSize="large" color="primary" />,
    title: 'AI-First Pedagogy',
    description:
      'Every chapter explores how artificial intelligence transforms organizational decision-making.',
  },
  {
    icon: <DevicesIcon fontSize="large" color="primary" />,
    title: 'Read Anywhere',
    description:
      'Mobile-first PWA with offline support. Read any textbook without signing in.',
  },
];

export function HomePage() {
  return (
    <Box>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="md">
          <Typography variant="overline" sx={{ opacity: 0.9, letterSpacing: 2 }}>
            Digital Textbook Platform
          </Typography>
          <Typography variant="h2" component="h1" sx={{ mt: 1, mb: 2, fontWeight: 800 }}>
            Information Systems Textbooks
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400, lineHeight: 1.6 }}>
            A publishing platform for AI-first business textbooks. Each book has its own
            URL — browse the catalog below and start reading instantly. No login required.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 6 }}>
        <BookCatalog
          title="Available Textbooks"
          subtitle="Each book opens at its own URL, e.g. /read/managing-organizations-ai"
        />
      </Container>

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Grid container spacing={3}>
          {features.map((feature) => (
            <Grid key={feature.title} size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 2,
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
