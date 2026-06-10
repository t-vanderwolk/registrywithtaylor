'use client';

import { getSession, signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { getDashboardPathForRole } from '@/lib/auth/roleRouting';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const response = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setIsSubmitting(false);

    if (response?.error) {
      setErrorMessage('Invalid email or password.');
      return;
    }

    const session = await getSession();
    const rolePath = getDashboardPathForRole(session?.user?.role as string | undefined);

    const explicitCallback = searchParams.get('callbackUrl');
    // If the callback is a gated learn path, go to the dashboard first
    // (the new JWT with tier will let them through when they navigate from there).
    if (explicitCallback && !explicitCallback.startsWith('/learn/')) {
      router.push(explicitCallback);
      return;
    }

    router.push(rolePath);
  };

  return (
    <main className="site-main">
      <section className="container" style={{ padding: '5rem 0' }}>
        <div className="card">
          <p className="eyebrow">Sign In</p>
          <h1 style={{ marginBottom: '1rem' }}>Platform Access</h1>
          <p className="body-copy">
            Sign in with your approved Taylor-Made Baby Co. account. Reach out if you need a reset.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-field">
              <label className="form-field__label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="form-field__input"
              />
            </div>

            <div className="form-field">
              <label className="form-field__label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="form-field__input"
              />
            </div>

            {errorMessage && (
              <p className="form-status" style={{ color: '#aa5a4f' }}>
                {errorMessage}
              </p>
            )}

            <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Login'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
