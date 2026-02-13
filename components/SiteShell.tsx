import type { ReactNode } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

type SiteShellProps = {
  currentPath: string;
  children: ReactNode;
};

export default function SiteShell({ children, currentPath }: SiteShellProps) {
  return (
    <div className="site">
      <Header currentPath={currentPath} />
      {children}
      <Footer />
    </div>
  );
}
