import type { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';

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
