import type { ProgressIndicatorItem } from '@/components/guides/ProgressIndicator';

const GUIDE_STICKY_GAP = 10;

export function isScrollableGuideContainer(container: HTMLElement) {
  const styles = window.getComputedStyle(container);
  return (
    (styles.overflowY !== 'visible' && container.scrollHeight > container.clientHeight + 4) ||
    (styles.overflowX !== 'visible' && container.scrollWidth > container.clientWidth + 4)
  );
}

function isHorizontalGuideContainer(container: HTMLElement) {
  return (
    container.dataset.guideCarousel === 'true' &&
    container.scrollWidth > container.clientWidth + 4 &&
    window.getComputedStyle(container).overflowX !== 'visible'
  );
}

export function getSiteHeaderHeight() {
  return document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0;
}

export function getVisibleSiteHeaderHeight() {
  const header = document.querySelector('.site-header');

  if (!(header instanceof HTMLElement)) {
    return 0;
  }

  const rect = header.getBoundingClientRect();
  const visibleTop = Math.max(rect.top, 0);
  const visibleBottom = Math.min(rect.bottom, window.innerHeight);

  return Math.max(visibleBottom - visibleTop, 0);
}

export function getGuideStickyTopOffset() {
  const visibleHeaderHeight = getVisibleSiteHeaderHeight();

  if (visibleHeaderHeight <= 0) {
    return 0;
  }

  return visibleHeaderHeight + GUIDE_STICKY_GAP;
}

function getGuideStickyNavHeight() {
  return document.querySelector('[data-guide-sticky-nav]')?.getBoundingClientRect().height ?? 0;
}

export function getGuideViewportOffset(containerId?: string) {
  const container = containerId ? document.getElementById(containerId) : null;

  if (container instanceof HTMLElement && isScrollableGuideContainer(container)) {
    if (isHorizontalGuideContainer(container)) {
      return 0;
    }

    return 72;
  }

  return getGuideStickyTopOffset() + getGuideStickyNavHeight() + 12;
}

export function scrollToGuideSection(id: string, containerId?: string) {
  const section = document.getElementById(id);
  if (!section) {
    return;
  }

  const container = containerId ? document.getElementById(containerId) : null;

  if (container instanceof HTMLElement && isScrollableGuideContainer(container)) {
    if (isHorizontalGuideContainer(container)) {
      const offsetLeft = Math.max(section.offsetLeft, 0);
      container.scrollTo({
        left: offsetLeft,
        behavior: 'smooth',
      });
      return;
    }

    const offsetTop = Math.max(section.offsetTop - 24, 0);
    container.scrollTo({
      top: offsetTop,
      behavior: 'smooth',
    });
    return;
  }

  const viewportOffset = getGuideViewportOffset(containerId);
  const targetTop = section.getBoundingClientRect().top + window.scrollY - viewportOffset;

  window.scrollTo({
    top: Math.max(targetTop, 0),
    behavior: 'smooth',
  });
}

export function getActiveGuideSectionFromScroll({
  items,
  containerId,
  viewportOffset,
}: {
  items: ProgressIndicatorItem[];
  containerId?: string;
  viewportOffset?: number;
}) {
  const sections = items
    .map((item) => document.getElementById(item.id))
    .filter((section): section is HTMLElement => Boolean(section));

  if (sections.length === 0) {
    return items[0]?.id ?? '';
  }

  const container = containerId ? document.getElementById(containerId) : null;
  const resolvedViewportOffset = viewportOffset ?? getGuideViewportOffset(containerId);

  if (container instanceof HTMLElement && isScrollableGuideContainer(container)) {
    if (isHorizontalGuideContainer(container)) {
      const anchor = container.scrollLeft + container.clientWidth / 2;
      const passedSections = sections
        .map((section) => ({
          id: section.id,
          left: section.offsetLeft + section.clientWidth / 2,
        }))
        .filter((section) => section.left <= anchor)
        .sort((left, right) => left.left - right.left);

      if (passedSections.length > 0) {
        return passedSections[passedSections.length - 1]?.id ?? items[0]?.id ?? '';
      }

      return sections[0]?.id ?? items[0]?.id ?? '';
    }

    const anchor = container.scrollTop + resolvedViewportOffset;
    const passedSections = sections
      .map((section) => ({
        id: section.id,
        top: section.offsetTop,
      }))
      .filter((section) => section.top <= anchor)
      .sort((left, right) => left.top - right.top);

    if (passedSections.length > 0) {
      return passedSections[passedSections.length - 1]?.id ?? items[0]?.id ?? '';
    }

    return sections[0]?.id ?? items[0]?.id ?? '';
  }

  const anchor = window.scrollY + resolvedViewportOffset;
  const passedSections = sections
    .map((section) => ({
      id: section.id,
      top: section.getBoundingClientRect().top + window.scrollY,
    }))
    .filter((section) => section.top <= anchor)
    .sort((left, right) => left.top - right.top);

  if (passedSections.length > 0) {
    return passedSections[passedSections.length - 1]?.id ?? items[0]?.id ?? '';
  }

  return sections[0]?.id ?? items[0]?.id ?? '';
}
