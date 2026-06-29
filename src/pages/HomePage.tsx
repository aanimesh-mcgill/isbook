import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PsychologyIcon from '@mui/icons-material/Psychology';
import DevicesIcon from '@mui/icons-material/Devices';

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
      'Mobile-first PWA with offline support, bookmarks, notes, and an AI tutor coming soon.',
  },
];

export function HomePage() {
  return (
    <Box>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="overline"
            sx={{ opacity: 0.9, letterSpacing: 2 }}
          >
            Undergraduate & MBA Information Systems
          </Typography>
          <Typography variant="h2" component="h1" sx={{ mt: 1, mb: 2, fontWeight: 800 }}>
            Managing Organizations in the Age of AI
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 400, lineHeight: 1.6 }}>
            A next-generation textbook that teaches managerial thinking—not just
            technologies—for the intelligent enterprise.
          </Typography>
          <Button
            component={RouterLink}
            to="/read"
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'background.paper',
              color: 'primary.main',
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            Start Reading
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3}>
          {features.map((feature) => (
            <Grid key={feature.title} size={{ xs: 12, md: 4 }}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
