import { Suspense } from 'react';
import LoginForm from './LoginForm';
import SiteShell from '@/components/SiteShell';

function LoginFallback() {
  return (
    <main className="site-main">
      <section className="container" style={{ padding: '5rem 0' }}>
        <div className="card">
          <p className="eyebrow">Sign In</p>
          <h1 style={{ marginBottom: '1rem' }}>Admin access</h1>
          <p className="body-copy">Loading login form…</p>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <SiteShell currentPath="/login">
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </SiteShell>
  );
}
