import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Section } from '@/types';

export function useSectionNavigation(
  bookSlug: string,
  chapterSlug: string,
  sections: Section[],
  activeSectionSlug: string | undefined,
) {
  const navigate = useNavigate();

  const currentIndex = sections.findIndex((s) => s.slug === activeSectionSlug);
  const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
  const nextSection =
    currentIndex >= 0 && currentIndex < sections.length - 1
      ? sections[currentIndex + 1]
      : null;

  const goToSection = useCallback(
    (slug: string) => {
      navigate(`/read/${bookSlug}/${chapterSlug}/${slug}`);
    },
    [navigate, bookSlug, chapterSlug],
  );

  const goPrev = useCallback(() => {
    if (prevSection) goToSection(prevSection.slug);
  }, [prevSection, goToSection]);

  const goNext = useCallback(() => {
    if (nextSection) goToSection(nextSection.slug);
  }, [nextSection, goToSection]);

  return { prevSection, nextSection, goPrev, goNext, currentIndex };
}

/** Keyboard left/right and swipe navigation between sections. */
export function useSectionNavGestures(
  goPrev: () => void,
  goNext: () => void,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;

    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') {
        goPrev();
      } else if (e.key === 'ArrowRight') {
        goNext();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goPrev, goNext, enabled]);

  useEffect(() => {
    if (!enabled) return;

    let touchStartX = 0;
    let touchStartY = 0;

    function onTouchStart(e: TouchEvent) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }

    function onTouchEnd(e: TouchEvent) {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy)) return;
      if (dx > 0) goPrev();
      else goNext();
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [goPrev, goNext, enabled]);
}
