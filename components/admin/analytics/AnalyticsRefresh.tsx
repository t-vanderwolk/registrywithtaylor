'use client';
import { useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
export default function AnalyticsRefresh() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  useEffect(() => {
    const refresh = () => { if (document.visibilityState === 'visible') router.refresh(); };
    const timer = window.setInterval(refresh, 60_000);
    document.addEventListener('visibilitychange', refresh);
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', refresh); };
  }, [router]);
  return <button type="button" className="underline underline-offset-2" disabled={pending}
    onClick={() => startTransition(() => router.refresh())}>{pending ? 'Refreshing…' : 'Refresh now'}</button>;
}
