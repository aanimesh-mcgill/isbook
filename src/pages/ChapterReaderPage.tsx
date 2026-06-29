import { useEffect } from 'react';
import { Link as RouterLink, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Link,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { ContentBlockRenderer } from '@/features/reader/ContentBlockRenderer';
import { TableOfContents, DRAWER_WIDTH } from '@/features/reader/TableOfContents';
import {
  useBook,
  useChapter,
  useChapters,
  useContentBlocks,
  useSection,
  useSections,
} from '@/hooks/useBooks';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import type { ReaderLayoutContext } from '@/layouts/RootLayout';

export function ChapterReaderPage() {
  const { bookSlug, chapterSlug, sectionSlug } = useParams<{
    bookSlug: string;
    chapterSlug: string;
    sectionSlug?: string;
  }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { tocOpen, setTocOpen } = useOutletContext<ReaderLayoutContext>();

  const { data: book, isLoading: bookLoading } = useBook(bookSlug ?? '');
  const { data: chapters = [], isLoading: chaptersLoading } = useChapters(book?.id);
  const { data: chapter, isLoading: chapterLoading } = useChapter(book?.id, chapterSlug ?? '');
  const { data: sections = [], isLoading: sectionsLoading } = useSections(chapter?.id);

  const activeSectionSlug = sectionSlug ?? sections[0]?.slug;
  const { data: section } = useSection(chapter?.id, activeSectionSlug ?? '');
  const { data: blocks = [], isLoading: blocksLoading } = useContentBlocks(section?.id);

  const currentChapterIndex = chapters.findIndex((c) => c.slug === chapterSlug);
  const prevChapter = currentChapterIndex > 0 ? chapters[currentChapterIndex - 1] : null;
  const nextChapter =
    currentChapterIndex >= 0 && currentChapterIndex < chapters.length - 1
      ? chapters[currentChapterIndex + 1]
      : null;

  useEffect(() => {
    if (!sectionSlug && sections.length > 0 && bookSlug && chapterSlug) {
      navigate(`/read/${bookSlug}/${chapterSlug}/${sections[0].slug}`, { replace: true });
    }
  }, [sectionSlug, sections, bookSlug, chapterSlug, navigate]);

  const isLoading =
    bookLoading || chaptersLoading || chapterLoading || sectionsLoading || blocksLoading;

  if (isLoading) return <LoadingScreen message="Loading chapter…" />;

  if (!book || !chapter) {
    return (
      <ErrorDisplay
        title="Chapter not found"
        message="This chapter may not exist or has not been published yet."
      />
    );
  }

  return (
    <>
      <TableOfContents
        open={tocOpen}
        onClose={() => setTocOpen(false)}
        bookSlug={bookSlug!}
        chapters={chapters}
        currentChapterSlug={chapterSlug}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar />

        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3, maxWidth: 900, mx: 'auto' }}>
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link component={RouterLink} to="/read" underline="hover" color="inherit">
              Textbooks
            </Link>
            <Link component={RouterLink} to={`/read/${bookSlug}`} underline="hover" color="inherit">
              {book.title}
            </Link>
            <Typography color="text.primary">Chapter {chapter.chapterNumber}</Typography>
          </Breadcrumbs>

          <Chip
            label={`Part ${chapter.partNumber}: ${chapter.partTitle}`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <Typography variant="h3" component="h1" sx={{ mb: 1, fontWeight: 800 }}>
            Chapter {chapter.chapterNumber}: {chapter.title}
          </Typography>

          {chapter.summary && (
            <Typography color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem' }}>
              {chapter.summary}
            </Typography>
          )}

          {sections.length > 1 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
              {sections.map((s) => (
                <Chip
                  key={s.id}
                  label={s.title}
                  component={RouterLink}
                  to={`/read/${bookSlug}/${chapterSlug}/${s.slug}`}
                  clickable
                  color={s.slug === activeSectionSlug ? 'primary' : 'default'}
                  variant={s.slug === activeSectionSlug ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          )}

          {section && sections.length > 1 && (
            <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 700 }}>
              {section.title}
            </Typography>
          )}

          <ContentBlockRenderer blocks={blocks} />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 6,
              pt: 3,
              borderTop: 1,
              borderColor: 'divider',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            {prevChapter ? (
              <Button
                component={RouterLink}
                to={`/read/${bookSlug}/${prevChapter.slug}`}
                startIcon={<NavigateBeforeIcon />}
                variant="outlined"
              >
                {isMobile ? 'Previous' : `Ch. ${prevChapter.chapterNumber}`}
              </Button>
            ) : (
              <Box />
            )}
            {nextChapter && (
              <Button
                component={RouterLink}
                to={`/read/${bookSlug}/${nextChapter.slug}`}
                endIcon={<NavigateNextIcon />}
                variant="contained"
              >
                {isMobile ? 'Next' : `Ch. ${nextChapter.chapterNumber}`}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}
