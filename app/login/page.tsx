'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const response = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    setIsSubmitting(false);

    if (response?.error) {
      setErrorMessage('Invalid email or password.');
      return;
    }

    router.push(callbackUrl);
  };

  return (
    <div className="site">
      <main className="site-main">
        <section className="container" style={{ padding: '5rem 0' }}>
          <div className="card">
            <p className="eyebrow">Sign In</p>
            <h1 style={{ marginBottom: '1rem' }}>Admin access</h1>
            <p className="body-copy">
              Please use the email and password you created for admin access. Reach out if you need a reset.
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
    </div>
  );
}
