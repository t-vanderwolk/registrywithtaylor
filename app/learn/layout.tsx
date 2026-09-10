import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { NOINDEX_FOLLOW_ROBOTS } from '@/lib/marketing/metadata';

export const metadata: Metadata = {
  robots: NOINDEX_FOLLOW_ROBOTS,
};

export default function LearnLayout({ children }: { children: ReactNode }) {
  return children;
}
