'use client';

import { useEffect, useState } from 'react';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminInput from '@/components/admin/ui/AdminInput';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import StatusPill from '@/components/admin/ui/StatusPill';

type InternalLinkResult = {
  id: string;
  title: string;
  slug: string;
  focusKeyword: string | null;
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';
  href: string;
  markdown: string;
  updatedAt: string;
};

export default function InternalLinkInsertModal({
  isOpen,
  excludeId,
  onClose,
  onInsert,
}: {
  isOpen: boolean;
  excludeId?: string | null;
  onClose: () => void;
  onInsert: (markdown: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<InternalLinkResult[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setFeedback(null);
      return;
    }

    const controller = new AbortController();

    if (query.trim().length === 0) {
      setResults([]);
      setLoading(false);
      return () => controller.abort();
    }

    setLoading(true);

    fetch(
      `/api/blog/internal-links?q=${encodeURIComponent(query.trim())}${excludeId ? `&excludeId=${encodeURIComponent(excludeId)}` : ''}`,
      { signal: controller.signal },
    )
      .then((response) => response.json())
      .then((payload) => {
        setResults(Array.isArray(payload?.posts) ? payload.posts : []);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setResults([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [excludeId, isOpen, query]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-4 py-8 backdrop-blur-[2px]">
      <AdminSurface className="admin-stack max-h-[80vh] w-full max-w-3xl gap-4 overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="admin-stack gap-1.5">
            <p className="admin-eyebrow">Internal Link</p>
            <h2 className="admin-h2">Insert a link to another post</h2>
            <p className="admin-body">Search by title, slug, or focus keyword. Insert a markdown link at the current cursor position.</p>
          </div>
          <AdminButton size="sm" variant="ghost" onClick={onClose}>
            Close
          </AdminButton>
        </div>

        <AdminInput
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search title, slug, or focus keyword"
          aria-label="Search internal links"
          autoFocus
        />

        <div className="admin-divider" />

        <div className="admin-stack max-h-[52vh] gap-3 overflow-y-auto pr-1">
          {loading ? <p className="admin-micro">Searching posts…</p> : null}
          {!loading && query.trim().length === 0 ? <p className="admin-micro">Start typing to search the post library.</p> : null}
          {!loading && query.trim().length > 0 && results.length === 0 ? (
            <p className="admin-micro">No posts matched that search.</p>
          ) : null}

          {results.map((result) => (
            <div key={result.id} className="rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="admin-stack gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-admin">{result.title}</p>
                    <StatusPill status={result.status} />
                  </div>
                  <p className="admin-table-code">{result.href}</p>
                  <p className="admin-micro">
                    {result.focusKeyword ? `Keyword: ${result.focusKeyword}` : 'No focus keyword'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <AdminButton
                    size="sm"
                    variant="secondary"
                    onClick={async () => {
                      await navigator.clipboard.writeText(result.markdown);
                      setFeedback(`Copied markdown for ${result.title}.`);
                    }}
                  >
                    Copy markdown
                  </AdminButton>
                  <AdminButton
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      onInsert(result.markdown);
                      onClose();
                    }}
                  >
                    Insert link
                  </AdminButton>
                </div>
              </div>
            </div>
          ))}
        </div>

        {feedback ? <p className="admin-micro">{feedback}</p> : null}
      </AdminSurface>
    </div>
  );
}
