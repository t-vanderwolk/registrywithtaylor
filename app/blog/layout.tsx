import type { ReactNode } from 'react';
import { blogTokenStyles } from '@/styles/tmbcBlogTokens';
import '../../styles/blog.css';

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <div style={blogTokenStyles}>{children}</div>;
}
