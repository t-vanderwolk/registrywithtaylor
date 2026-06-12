'use client';

import Link from 'next/link';
import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './RegisterPage.module.scss';

export default function RegisterForm() {
  const router = useRouter();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [error,    setError]    = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      // Auto-sign-in after successful registration
      const result = await signIn('credentials', {
        redirect: false,
        email:    email.trim(),
        password,
      });

      if (result?.error) {
        // Registration succeeded but auto-login failed — send to login
        router.push('/login?registered=1');
        return;
      }

      setDone(true);

      // Brief pause so the success state is visible, then redirect
      setTimeout(() => {
        router.push('/dashboard');
      }, 1800);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>🎉</div>
        <h2>You&apos;re in!</h2>
        <p>Your account is ready. Taking you to your dashboard&hellip;</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.fieldGroup}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">
            First name <span style={{ color: '#a3a3a3', fontWeight: 400 }}>(optional)</span>
          </label>
          <input
            id="name"
            type="text"
            autoComplete="given-name"
            className={styles.input}
            placeholder="Taylor"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            className={styles.input}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            className={styles.input}
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="confirm">
            Confirm password
          </label>
          <input
            id="confirm"
            type="password"
            autoComplete="new-password"
            required
            className={styles.input}
            placeholder="Repeat your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
      </div>

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? 'Creating account…' : 'Create account →'}
      </button>

      <p className={styles.loginLink}>
        Already have an account?{' '}
        <Link href="/login">Sign in</Link>
      </p>
    </form>
  );
}
