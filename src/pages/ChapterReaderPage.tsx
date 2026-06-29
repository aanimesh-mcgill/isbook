import { useEffect, useMemo } from 'react';
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
import { TableOfContents, getTocWidth } from '@/features/reader/TableOfContents';
import { SectionNavBar, MobileSectionNav, SectionSideNavLayout } from '@/features/reader/SectionNavBar';
import { Bibliography } from '@/components/Bibliography';
import {
  useBook,
  useChapter,
  useChapters,
  useContentBlocks,
  useSection,
  useSections,
} from '@/hooks/useBooks';
import { useSectionNavigation, useSectionNavGestures } from '@/hooks/useSectionNavigation';
import { useChapterCitations } from '@/hooks/useChapterCitations';
import { extractCitations } from '@/utils/citations';
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
  const { tocOpen, setTocOpen, tocCollapsed, toggleTocCollapse } =
    useOutletContext<ReaderLayoutContext>();

  const { data: book, isLoading: bookLoading } = useBook(bookSlug ?? '');
  const { data: chapters = [], isLoading: chaptersLoading } = useChapters(book?.id);
  const { data: chapter, isLoading: chapterLoading } = useChapter(book?.id, chapterSlug ?? '');
  const { data: sections = [], isLoading: sectionsLoading } = useSections(chapter?.id);

  const activeSectionSlug = sectionSlug ?? sections[0]?.slug;
  const { data: section } = useSection(chapter?.id, activeSectionSlug ?? '');
  const { data: blocks = [], isLoading: blocksLoading } = useContentBlocks(section?.id);

  const hasSectionNav = sections.length > 1;

  const { prevSection, nextSection, goPrev, goNext } = useSectionNavigation(
    bookSlug!,
    chapterSlug!,
    sections,
    activeSectionSlug,
  );

  useSectionNavGestures(goPrev, goNext, hasSectionNav);

  const { citations: chapterCitations } = useChapterCitations(sections);

  const sectionCitations = useMemo(
    () => extractCitations(...blocks.map((b) => b.content)),
    [blocks],
  );

  const isLastSection =
    sections.length > 0 && sections[sections.length - 1].slug === activeSectionSlug;

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

  const tocWidth = getTocWidth(tocCollapsed, isMobile);

  const chapterContent = (
    <>
      <Breadcrumbs sx={{ mb: 1.5 }}>
        <Link component={RouterLink} to="/read" underline="hover" color="inherit">
          Textbooks
        </Link>
        <Link component={RouterLink} to={`/read/${bookSlug}`} underline="hover" color="inherit">
          {book.title}
        </Link>
        <Typography color="text.primary" variant="body2">
          Ch. {chapter.chapterNumber}
        </Typography>
      </Breadcrumbs>

      <Chip
        label={`Part ${chapter.partNumber}: ${chapter.partTitle}`}
        size="small"
        color="primary"
        variant="outlined"
        sx={{ mb: 1.5 }}
      />

      <Typography variant="h4" component="h1" sx={{ mb: 0.5, fontWeight: 800 }}>
        Chapter {chapter.chapterNumber}: {chapter.title}
      </Typography>

      {chapter.summary && (
        <Typography color="text.secondary" sx={{ mb: 2, fontSize: '1rem' }}>
          {chapter.summary}
        </Typography>
      )}

      {section && (
        <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 700 }}>
          {section.title}
        </Typography>
      )}

      <ContentBlockRenderer blocks={blocks} sectionTitle={section?.title} />

      <Bibliography title="Section References" citations={sectionCitations} compact />

      {isLastSection && chapterCitations.length > 0 && (
        <Bibliography title="Chapter References" citations={chapterCitations} />
      )}

      {hasSectionNav && (
        <SectionNavBar
          bookSlug={bookSlug!}
          chapterSlug={chapterSlug!}
          prevSection={prevSection}
          nextSection={nextSection}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}

      {(prevChapter || nextChapter) && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 3,
            pt: 2,
            borderTop: 1,
            borderColor: 'divider',
            gap: 2,
          }}
        >
          {prevChapter ? (
            <Button
              component={RouterLink}
              to={`/read/${bookSlug}/${prevChapter.slug}`}
              startIcon={<NavigateBeforeIcon />}
              variant="outlined"
              size="small"
            >
              Ch. {prevChapter.chapterNumber}
            </Button>
          ) : (
            <Box />
          )}
          {nextChapter && (
            <Button
              component={RouterLink}
              to={`/read/${bookSlug}/${nextChapter.slug}`}
              endIcon={<NavigateNextIcon />}
              variant="outlined"
              size="small"
            >
              Ch. {nextChapter.chapterNumber}
            </Button>
          )}
        </Box>
      )}
    </>
  );

  return (
    <Box sx={{ display: 'flex', flex: 1, width: '100%' }}>
      <TableOfContents
        open={tocOpen}
        collapsed={tocCollapsed}
        onClose={() => setTocOpen(false)}
        onToggleCollapse={toggleTocCollapse}
        bookSlug={bookSlug!}
        chapters={chapters}
        currentChapterSlug={chapterSlug}
        currentSectionSlug={activeSectionSlug}
      />

      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          ml: { md: `${tocWidth}px` },
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar />

        {hasSectionNav && (
          <MobileSectionNav
            bookSlug={bookSlug!}
            chapterSlug={chapterSlug!}
            prevSection={prevSection}
            nextSection={nextSection}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}

        {hasSectionNav ? (
          <SectionSideNavLayout
            bookSlug={bookSlug!}
            chapterSlug={chapterSlug!}
            prevSection={prevSection}
            nextSection={nextSection}
            onPrev={goPrev}
            onNext={goNext}
          >
            {chapterContent}
          </SectionSideNavLayout>
        ) : (
          <Box sx={{ px: { xs: 2, sm: 2.5, md: 3 }, py: 2, maxWidth: 760, mx: 'auto' }}>
            {chapterContent}
          </Box>
        )}
      </Box>
    </Box>
  );
}
