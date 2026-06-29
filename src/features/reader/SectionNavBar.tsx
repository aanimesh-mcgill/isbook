import { Link as RouterLink } from 'react-router-dom';
import { Box, Fab, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { ReactNode } from 'react';
import type { Section } from '@/types';

interface SectionNavProps {
  bookSlug: string;
  chapterSlug: string;
  prevSection: Section | null;
  nextSection: Section | null;
  onPrev: () => void;
  onNext: () => void;
}

function SideGutter({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        width: { xs: 0, sm: 44 },
        flexShrink: 0,
        display: { xs: 'none', sm: 'flex' },
        justifyContent: 'center',
        alignItems: 'flex-start',
        pt: '38vh',
        position: 'sticky',
        top: 0,
        alignSelf: 'flex-start',
        height: 0,
        overflow: 'visible',
        zIndex: 2,
      }}
    >
      {children}
    </Box>
  );
}

function SideNavButton({
  direction,
  section,
  onClick,
  to,
}: {
  direction: 'prev' | 'next';
  section: Section;
  onClick: () => void;
  to: string;
}) {
  const isPrev = direction === 'prev';
  const Icon = isPrev ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <Tooltip title={section.title} placement={isPrev ? 'right' : 'left'}>
      <Fab
        component={RouterLink}
        to={to}
        size="small"
        color={isPrev ? 'default' : 'primary'}
        onClick={onClick}
        aria-label={isPrev ? 'Previous section' : 'Next section'}
        sx={{ opacity: 0.92, boxShadow: 2 }}
      >
        <Icon />
      </Fab>
    </Tooltip>
  );
}

/** Content row with sticky side gutters — nav never overlaps text. */
export function SectionSideNavLayout({
  bookSlug,
  chapterSlug,
  prevSection,
  nextSection,
  onPrev,
  onNext,
  children,
}: SectionNavProps & { children: ReactNode }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        maxWidth: 860,
        mx: 'auto',
        px: { xs: 2, sm: 1, md: 0 },
      }}
    >
      <SideGutter>
        {prevSection && (
          <SideNavButton
            direction="prev"
            section={prevSection}
            onClick={onPrev}
            to={`/read/${bookSlug}/${chapterSlug}/${prevSection.slug}`}
          />
        )}
      </SideGutter>

      <Box sx={{ flex: 1, minWidth: 0, px: { sm: 1, md: 2 }, py: 2, maxWidth: 760 }}>{children}</Box>

      <SideGutter>
        {nextSection && (
          <SideNavButton
            direction="next"
            section={nextSection}
            onClick={onNext}
            to={`/read/${bookSlug}/${chapterSlug}/${nextSection.slug}`}
          />
        )}
      </SideGutter>
    </Box>
  );
}

/** Mobile-only fixed nav at bottom corners. */
export function MobileSectionNav({
  bookSlug,
  chapterSlug,
  prevSection,
  nextSection,
  onPrev,
  onNext,
}: SectionNavProps) {
  return (
    <>
      {prevSection && (
        <Tooltip title={prevSection.title} placement="right">
          <Fab
            component={RouterLink}
            to={`/read/${bookSlug}/${chapterSlug}/${prevSection.slug}`}
            size="small"
            color="default"
            onClick={onPrev}
            aria-label="Previous section"
            sx={{
              display: { xs: 'flex', sm: 'none' },
              position: 'fixed',
              left: 8,
              bottom: 24,
              zIndex: 10,
              opacity: 0.92,
            }}
          >
            <ChevronLeftIcon />
          </Fab>
        </Tooltip>
      )}
      {nextSection && (
        <Tooltip title={nextSection.title} placement="left">
          <Fab
            component={RouterLink}
            to={`/read/${bookSlug}/${chapterSlug}/${nextSection.slug}`}
            size="small"
            color="primary"
            onClick={onNext}
            aria-label="Next section"
            sx={{
              display: { xs: 'flex', sm: 'none' },
              position: 'fixed',
              right: 8,
              bottom: 24,
              zIndex: 10,
              opacity: 0.92,
            }}
          >
            <ChevronRightIcon />
          </Fab>
        </Tooltip>
      )}
    </>
  );
}

/** Inline prev/next cards at the bottom of a section. */
export function SectionNavBar({
  bookSlug,
  chapterSlug,
  prevSection,
  nextSection,
  onPrev,
  onNext,
}: SectionNavProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 5,
        pt: 3,
        borderTop: 1,
        borderColor: 'divider',
        gap: 2,
      }}
    >
      {prevSection ? (
        <Paper
          variant="outlined"
          sx={{ flex: 1, maxWidth: '48%', cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
        >
          <IconButton
            component={RouterLink}
            to={`/read/${bookSlug}/${chapterSlug}/${prevSection.slug}`}
            onClick={onPrev}
            sx={{ width: '100%', borderRadius: 1, justifyContent: 'flex-start', px: 2, py: 1.5 }}
          >
            <ChevronLeftIcon sx={{ mr: 1 }} />
            <Box sx={{ textAlign: 'left', minWidth: 0 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Previous
              </Typography>
              <Typography variant="body2" noWrap>
                {prevSection.title}
              </Typography>
            </Box>
          </IconButton>
        </Paper>
      ) : (
        <Box sx={{ flex: 1 }} />
      )}

      {nextSection ? (
        <Paper
          variant="outlined"
          sx={{ flex: 1, maxWidth: '48%', cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
        >
          <IconButton
            component={RouterLink}
            to={`/read/${bookSlug}/${chapterSlug}/${nextSection.slug}`}
            onClick={onNext}
            sx={{ width: '100%', borderRadius: 1, justifyContent: 'flex-end', px: 2, py: 1.5 }}
          >
            <Box sx={{ textAlign: 'right', minWidth: 0 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Next
              </Typography>
              <Typography variant="body2" noWrap>
                {nextSection.title}
              </Typography>
            </Box>
            <ChevronRightIcon sx={{ ml: 1 }} />
          </IconButton>
        </Paper>
      ) : (
        <Box sx={{ flex: 1 }} />
      )}
    </Box>
  );
}
