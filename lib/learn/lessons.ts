import type { LessonNavLesson } from '@/components/learn/LessonNavStrip';

/**
 * Master list of all free preview lessons.
 * Used by LessonNavStrip on every lesson page and by the /learn landing page.
 */
export const FREE_PREVIEW_LESSONS: LessonNavLesson[] = [
  {
    number: 1,
    title: 'The Art of the Registry',
    href: '/learn/art-of-the-registry',
  },
  {
    number: 2,
    title: 'Nursery Foundations',
    href: '/learn/nursery-foundations',
  },
  {
    number: 3,
    title: 'Stroller Foundations',
    href: '/learn/stroller-foundations',
  },
];

export const FREE_PREVIEW_LESSON_COUNT = FREE_PREVIEW_LESSONS.length;
