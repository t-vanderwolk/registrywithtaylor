'use client';

import { useState, type FormEvent } from 'react';

type Delivery = 'now' | 'self';

const inputClass =
  'w-full rounded-[0.9rem] border border-[rgba(215,161,175,0.34)] bg-white px-4 py-3 text-[0.95rem] text-neutral-800 outline-none transition focus:border-[var(--color-cta-pink)] focus:ring-2 focus:ring-[rgba(216,137,160,0.25)]';
const labelClass = 'mb-1.5 block text-[0.8rem] font-semibold text-neutral-700';

export default function GiftForm() {
  const [delivery, setDelivery] = useState<Delivery>('now');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGiftSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = {
      purchaserName: String(form.get('purchaserName') || ''),
      purchaserEmail: String(form.get('purchaserEmail') || ''),
      recipientName: String(form.get('recipientName') || ''),
      recipientEmail: String(form.get('recipientEmail') || ''),
      giftMessage: String(form.get('giftMessage') || ''),
      deliveryMode: delivery,
    };
    setSubmitting(true);
    try {
      const res = await fetch('/api/gift/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.url) {
        setError(data?.error || 'Something went wrong starting checkout. Please try again.');
        setSubmitting(false);
        return;
      }
      window.location.href = data.url as string;
    } catch {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <div>
        <form className="space-y-5" onSubmit={handleGiftSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="recipientName">Recipient&rsquo;s name</label>
              <input id="recipientName" name="recipientName" required className={inputClass} placeholder="e.g. Jordan" />
            </div>
            <div>
              <label className={labelClass} htmlFor="recipientEmail">
                Recipient&rsquo;s email {delivery === 'now' ? '' : <span className="font-normal text-neutral-400">(optional)</span>}
              </label>
              <input id="recipientEmail" name="recipientEmail" type="email" required={delivery === 'now'} className={inputClass} placeholder="them@example.com" />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="giftMessage">Gift message <span className="font-normal text-neutral-400">(optional)</span></label>
            <textarea id="giftMessage" name="giftMessage" rows={3} maxLength={600} className={`${inputClass} resize-none`} placeholder="A little note to include on the certificate…" />
          </div>

          <div>
            <span className={labelClass}>Delivery</span>
            <div className="grid gap-3 sm:grid-cols-2">
              <ToggleCard small checked={delivery === 'now'} onClick={() => setDelivery('now')} title="Send immediately" hint="We email them a certificate." />
              <ToggleCard small checked={delivery === 'self'} onClick={() => setDelivery('self')} title="I'll send it myself" hint="You get the certificate to share." />
            </div>
          </div>

          <div className="h-px bg-[rgba(215,161,175,0.22)]" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="purchaserName">Your name</label>
              <input id="purchaserName" name="purchaserName" required className={inputClass} placeholder="Your name" />
            </div>
            <div>
              <label className={labelClass} htmlFor="purchaserEmail">Your email</label>
              <input id="purchaserEmail" name="purchaserEmail" type="email" required className={inputClass} placeholder="you@example.com" />
            </div>
          </div>

          {error ? <p className="rounded-[0.8rem] bg-[rgba(216,137,160,0.1)] px-4 py-3 text-[0.85rem] text-[var(--color-accent-dark)]">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-[var(--color-cta-pink)] px-6 py-3.5 text-[1rem] font-semibold text-white transition hover:bg-[var(--color-cta-pink-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Redirecting to secure checkout…' : 'Continue to payment — $75'}
          </button>
          <p className="text-center text-[0.78rem] leading-6 text-neutral-500">
            Secure checkout via Stripe. The recipient books their own time after redeeming.
          </p>
          <p className="text-center text-[0.72rem] leading-5 text-neutral-400">
            Gift certificates are valid for 12 months from purchase, non-refundable, and transferable. Locks in
            today’s price. See our <a href="/terms" className="underline underline-offset-2">Terms</a> for details.
          </p>
        </form>
    </div>
  );
}

function ToggleCard({
  checked,
  onClick,
  title,
  hint,
  small = false,
}: {
  checked: boolean;
  onClick: () => void;
  title: string;
  hint: string;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={checked}
      className={[
        'flex items-start gap-3 rounded-[1rem] border bg-white text-left transition',
        small ? 'p-3.5' : 'p-4',
        checked
          ? 'border-[var(--color-cta-pink)] ring-2 ring-[rgba(216,137,160,0.25)]'
          : 'border-[rgba(215,161,175,0.3)] hover:border-[rgba(216,137,160,0.55)]',
      ].join(' ')}
    >
      <span
        aria-hidden
        className={[
          'mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border',
          checked ? 'border-[var(--color-cta-pink)]' : 'border-neutral-300',
        ].join(' ')}
        style={{ width: '1.1rem', height: '1.1rem' }}
      >
        {checked ? <span className="block h-2 w-2 rounded-full bg-[var(--color-cta-pink)]" /> : null}
      </span>
      <span>
        <span className="block text-[0.9rem] font-semibold text-neutral-800">{title}</span>
        <span className="mt-0.5 block text-[0.78rem] leading-5 text-neutral-500">{hint}</span>
      </span>
    </button>
  );
}
