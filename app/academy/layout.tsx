import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { NOINDEX_FOLLOW_ROBOTS } from '@/lib/marketing/metadata';
import { blogTokenStyles } from '@/styles/tmbcBlogTokens';
import '../../styles/blog.css';

export const metadata: Metadata = {
  robots: NOINDEX_FOLLOW_ROBOTS,
};

export default function AcademyLayout({ children }: { children: ReactNode }) {
  return <div style={blogTokenStyles}>{children}</div>;
}
