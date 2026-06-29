import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Box,
  Divider,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import type { Chapter } from '@/types';

const DRAWER_WIDTH = 300;

interface TableOfContentsProps {
  open: boolean;
  onClose: () => void;
  bookSlug: string;
  chapters: Chapter[];
  currentChapterSlug?: string;
}

export function TableOfContents({
  open,
  onClose,
  bookSlug,
  chapters,
  currentChapterSlug,
}: TableOfContentsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const parts = chapters.reduce<Record<number, { title: string; chapters: Chapter[] }>>(
    (acc, chapter) => {
      if (!acc[chapter.partNumber]) {
        acc[chapter.partNumber] = { title: chapter.partTitle, chapters: [] };
      }
      acc[chapter.partNumber].chapters.push(chapter);
      return acc;
    },
    {},
  );

  const drawer = (
    <Box sx={{ overflow: 'auto', height: '100%' }}>
      <Toolbar />
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="overline" color="text.secondary">
          Table of Contents
        </Typography>
      </Box>
      {Object.entries(parts).map(([partNum, part]) => (
        <Box key={partNum} sx={{ mb: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{ px: 2, py: 1, fontWeight: 700, color: 'primary.main' }}
          >
            Part {partNum}: {part.title}
          </Typography>
          <List dense disablePadding>
            {part.chapters.map((chapter) => {
              const path = `/read/${bookSlug}/${chapter.slug}`;
              const selected =
                currentChapterSlug === chapter.slug || location.pathname === path;
              return (
                <ListItemButton
                  key={chapter.id}
                  component={Link}
                  to={path}
                  selected={selected}
                  onClick={isMobile ? onClose : undefined}
                  sx={{ pl: 3 }}
                >
                  <ListItemText
                    primary={`Ch. ${chapter.chapterNumber}: ${chapter.title}`}
                    slotProps={{
                      primary: {
                        variant: 'body2',
                        sx: { fontWeight: selected ? 600 : 400 },
                      },
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
          <Divider sx={{ my: 1 }} />
        </Box>
      ))}
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
        }}
      >
        {drawer}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawer}
    </Drawer>
  );
}

export { DRAWER_WIDTH };
