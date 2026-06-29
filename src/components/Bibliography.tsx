import { Box, Link, Paper, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import type { Citation } from '@/utils/citations';

interface BibliographyProps {
  title?: string;
  citations: Citation[];
  compact?: boolean;
}

export function Bibliography({
  title = 'References',
  citations,
  compact = false,
}: BibliographyProps) {
  if (citations.length === 0) return null;

  return (
    <Paper
      variant="outlined"
      sx={{
        mt: compact ? 3 : 4,
        p: 2.5,
        bgcolor: 'action.hover',
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
        {title}
      </Typography>
      <Box
        component="ol"
        sx={{ m: 0, pl: 2.5, listStyleType: 'decimal', listStylePosition: 'outside' }}
      >
        {citations.map((cite) => (
          <Box component="li" key={cite.id} sx={{ mb: 1, display: 'list-item' }}>
            <Typography variant="body2" component="span">
              {cite.label}{' '}
              <Link
                href={cite.scholarUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}
              >
                Google Scholar <OpenInNewIcon sx={{ fontSize: 12, verticalAlign: 'middle' }} />
              </Link>
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
