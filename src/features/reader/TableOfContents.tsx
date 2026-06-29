import { useEffect, useState } from 'react';
import {
  Collapse,
  Drawer,
  IconButton,
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
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Link, useLocation } from 'react-router-dom';
import { useSections } from '@/hooks/useBooks';
import type { Chapter } from '@/types';

export const DRAWER_WIDTH = 260;
export const DRAWER_COLLAPSED_WIDTH = 0;

interface TableOfContentsProps {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
  bookSlug: string;
  chapters: Chapter[];
  currentChapterSlug?: string;
  currentSectionSlug?: string;
}

function ChapterSectionList({
  bookSlug,
  chapter,
  currentSectionSlug,
  onNavigate,
}: {
  bookSlug: string;
  chapter: Chapter;
  currentSectionSlug?: string;
  onNavigate?: () => void;
}) {
  const { data: sections = [] } = useSections(chapter.id);
  const chapterPath = `/read/${bookSlug}/${chapter.slug}`;

  if (sections.length === 0) return null;

  return (
    <List dense disablePadding sx={{ pb: 0.5 }}>
      {sections.map((section) => {
        const sectionPath = `${chapterPath}/${section.slug}`;
        const sectionSelected = currentSectionSlug === section.slug;
        return (
          <ListItemButton
            key={section.id}
            component={Link}
            to={sectionPath}
            selected={sectionSelected}
            onClick={onNavigate}
            sx={{ pl: 4.5, py: 0.4 }}
          >
            <ListItemText
              primary={section.title}
              slotProps={{
                primary: {
                  variant: 'body2',
                  sx: {
                    fontWeight: sectionSelected ? 600 : 400,
                    fontSize: '0.75rem',
                    color: sectionSelected ? 'primary.main' : 'text.secondary',
                  },
                },
              }}
            />
          </ListItemButton>
        );
      })}
    </List>
  );
}

export function TableOfContents({
  open,
  collapsed,
  onClose,
  onToggleCollapse,
  bookSlug,
  chapters,
  currentChapterSlug,
  currentSectionSlug,
}: TableOfContentsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (currentChapterSlug) initial.add(currentChapterSlug);
    return initial;
  });

  useEffect(() => {
    if (currentChapterSlug) {
      setExpandedChapters((prev) => new Set(prev).add(currentChapterSlug));
    }
  }, [currentChapterSlug]);

  const toggleChapter = (slug: string) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

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

  const drawerWidth = collapsed && !isMobile ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

  const drawer = (
    <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar />
      <Box
        sx={{
          px: 2,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="overline" color="text.secondary">
          Contents
        </Typography>
        {!isMobile && (
          <IconButton
            size="small"
            onClick={onToggleCollapse}
            aria-label="Collapse table of contents"
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      {Object.entries(parts).map(([partNum, part]) => (
        <Box key={partNum} sx={{ mb: 0.5 }}>
          <Typography
            variant="subtitle2"
            sx={{ px: 2, py: 0.75, fontWeight: 700, color: 'primary.main', fontSize: '0.75rem' }}
          >
            Part {partNum}
          </Typography>
          <Typography variant="caption" sx={{ px: 2, display: 'block', color: 'text.secondary', mb: 0.5 }}>
            {part.title}
          </Typography>
          <List dense disablePadding>
            {part.chapters.map((chapter) => {
              const chapterPath = `/read/${bookSlug}/${chapter.slug}`;
              const isExpanded = expandedChapters.has(chapter.slug);
              const isCurrentChapter = currentChapterSlug === chapter.slug;
              const chapterSelected =
                isCurrentChapter || location.pathname.startsWith(chapterPath);

              return (
                <Box key={chapter.id}>
                  <Box sx={{ display: 'flex', alignItems: 'stretch', pr: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => toggleChapter(chapter.slug)}
                      aria-label={isExpanded ? 'Collapse chapter' : 'Expand chapter'}
                      aria-expanded={isExpanded}
                      sx={{ ml: 0.5, my: 0.25, flexShrink: 0 }}
                    >
                      {isExpanded ? (
                        <ExpandLessIcon fontSize="small" />
                      ) : (
                        <ExpandMoreIcon fontSize="small" />
                      )}
                    </IconButton>
                    <ListItemButton
                      component={Link}
                      to={chapterPath}
                      selected={chapterSelected && !currentSectionSlug}
                      onClick={isMobile ? onClose : undefined}
                      sx={{ flex: 1, py: 0.75, pl: 0.5, minWidth: 0 }}
                    >
                      <ListItemText
                        primary={`Ch. ${chapter.chapterNumber}: ${chapter.title}`}
                        slotProps={{
                          primary: {
                            variant: 'body2',
                            sx: {
                              fontWeight: chapterSelected ? 600 : 400,
                              fontSize: '0.8rem',
                            },
                          },
                        }}
                      />
                    </ListItemButton>
                  </Box>

                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <ChapterSectionList
                      bookSlug={bookSlug}
                      chapter={chapter}
                      currentSectionSlug={isCurrentChapter ? currentSectionSlug : undefined}
                      onNavigate={isMobile ? onClose : undefined}
                    />
                  </Collapse>
                </Box>
              );
            })}
          </List>
          <Divider sx={{ my: 0.5 }} />
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
        sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
      >
        {drawer}
      </Drawer>
    );
  }

  return (
    <>
      {collapsed && (
        <IconButton
          onClick={onToggleCollapse}
          aria-label="Expand table of contents"
          size="small"
          sx={{
            position: 'fixed',
            left: 8,
            top: 72,
            zIndex: (t) => t.zIndex.drawer + 2,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            boxShadow: 1,
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <MenuOpenIcon fontSize="small" />
        </IconButton>
      )}

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            overflowX: 'hidden',
            borderRight: collapsed ? 0 : undefined,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        {!collapsed && drawer}
      </Drawer>
    </>
  );
}

export function getTocWidth(collapsed: boolean, isMobile: boolean): number {
  if (isMobile) return 0;
  return collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;
}
