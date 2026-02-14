import type { ReactNode } from 'react';

export const metadata = {
  title: 'Admin — Taylor-Made Baby Planning',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site" style={{ background: 'var(--color-ivory)' }}>
      <main className="container" style={{ padding: '4rem 0', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}
