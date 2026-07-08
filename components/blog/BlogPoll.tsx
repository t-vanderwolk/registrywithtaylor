'use client';

import { useEffect, useState } from 'react';

/**
 * Interactive in-post poll with a real, shared tally (via /api/blog/poll).
 * Reader taps an option → vote is recorded (one per browser), results reveal as
 * animated bars. Degrades gracefully if the API/table isn't available yet.
 */
function slugifyKey(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 80) || 'poll'
  );
}

function padCounts(counts: number[], size: number): number[] {
  const out = counts.slice(0, size);
  while (out.length < size) out.push(0);
  return out;
}

function getVoterId(): string {
  try {
    let id = localStorage.getItem('tmbc_voter_id');
    if (!id) {
      id = `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      localStorage.setItem('tmbc_voter_id', id);
    }
    return id;
  } catch {
    return 'anon';
  }
}

export default function BlogPoll({ question, options }: { question: string; options: string[] }) {
  const cleanOptions = options.filter(Boolean).slice(0, 12);
  const pollKey = slugifyKey(question);
  const [slug, setSlug] = useState('');
  const [counts, setCounts] = useState<number[]>(() => cleanOptions.map(() => 0));
  const [total, setTotal] = useState(0);
  const [voted, setVoted] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const s = (window.location.pathname.split('/blog/')[1] ?? '').split(/[/?#]/)[0] ?? '';
    setSlug(s);
    try {
      const stored = localStorage.getItem(`tmbc_poll_${s}_${pollKey}`);
      if (stored != null) setVoted(Number(stored));
    } catch {
      /* ignore */
    }
    fetch(`/api/blog/poll?slug=${encodeURIComponent(s)}&pollKey=${encodeURIComponent(pollKey)}&options=${cleanOptions.length}`)
      .then((r) => r.json())
      .then((d) => {
        if (d && Array.isArray(d.counts)) {
          setCounts(padCounts(d.counts, cleanOptions.length));
          setTotal(Number(d.total) || 0);
        }
      })
      .catch(() => {
        /* ignore */
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollKey]);

  const vote = async (index: number) => {
    if (busy) return;
    setBusy(true);
    setVoted(index);
    try {
      localStorage.setItem(`tmbc_poll_${slug}_${pollKey}`, String(index));
    } catch {
      /* ignore */
    }
    try {
      const res = await fetch('/api/blog/poll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, pollKey, optionIndex: index, voterId: getVoterId(), options: cleanOptions.length }),
      });
      const d = await res.json();
      if (d && Array.isArray(d.counts)) {
        setCounts(padCounts(d.counts, cleanOptions.length));
        setTotal(Number(d.total) || 0);
      }
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  };

  if (cleanOptions.length === 0) return null;
  const showResults = voted != null;

  return (
    <figure className="tmbc-poll not-prose">
      <figcaption className="tmbc-poll__eyebrow">reader poll</figcaption>
      <p className="tmbc-poll__question">{question}</p>

      <div className="tmbc-poll__options">
        {cleanOptions.map((option, i) => {
          const pct = total > 0 ? Math.round((counts[i] / total) * 100) : 0;
          if (showResults) {
            return (
              <div key={i} className={`tmbc-poll__result${voted === i ? ' is-pick' : ''}`} aria-label={`${option}: ${pct}%`}>
                <span className="tmbc-poll__result-fill" style={{ width: `${pct}%` }} aria-hidden="true" />
                <span className="tmbc-poll__result-label">{option}</span>
                <span className="tmbc-poll__result-pct">{pct}%</span>
              </div>
            );
          }
          return (
            <button key={i} type="button" className="tmbc-poll__option" onClick={() => vote(i)} disabled={busy}>
              {option}
            </button>
          );
        })}
      </div>

      <p className="tmbc-poll__footer">
        {showResults
          ? `${total} ${total === 1 ? 'vote' : 'votes'} — thanks for weighing in!`
          : 'tap to vote — then see what other parents picked'}
      </p>
    </figure>
  );
}
